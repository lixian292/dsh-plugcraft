import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join, relative, resolve } from 'node:path'

const MAX_FILE_BYTES = 2 * 1024 * 1024
const MAX_JS_FILES = 40
const JS_EXTENSIONS = ['.js', '.mjs', '.cjs']

function errorText(error) {
  return error && typeof error.message === 'string' ? error.message : String(error)
}

function readText(file) {
  try {
    const stat = statSync(file)
    if (!stat.isFile() || stat.size > MAX_FILE_BYTES) return undefined
    // Generated files may be written by editors or PowerShell with a UTF-8 BOM.
    return readFileSync(file, 'utf8').replace(/^\uFEFF/, '')
  } catch {
    return undefined
  }
}

function walkFiles(dir, predicate, collected, limit) {
  if (collected.length >= limit) return
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    if (collected.length >= limit) return
    if (entry.name === 'node_modules' || entry.name === '.git') continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      walkFiles(full, predicate, collected, limit)
    } else if (predicate(entry.name)) {
      collected.push(full)
    }
  }
}

function check(id, label, fn) {
  try {
    const detail = fn()
    return detail === undefined || detail === true
      ? { id, label, ok: true, detail: '' }
      : { id, label, ok: true, detail: String(detail) }
  } catch (error) {
    return { id, label, ok: false, detail: errorText(error) }
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

/**
 * Validate a generated plugin bundle without executing it.
 * Structural checks plus `node --check` parsing only; no plugin code is run.
 */
export function verifyPackage(packageDir) {
  const target = typeof packageDir === 'string' ? packageDir.trim() : ''
  if (target === '') throw new Error('packageDir is required')
  const dir = resolve(target)
  const checks = []
  const warnings = []

  const stat = (() => {
    try {
      return statSync(dir)
    } catch {
      return undefined
    }
  })()
  if (stat === undefined || !stat.isDirectory()) {
    return {
      ok: false,
      packageDir: dir,
      checks: [{ id: 'directory', label: 'package directory exists', ok: false, detail: `${dir} is not a directory` }],
      warnings
    }
  }

  let manifest
  checks.push(check('package-json', 'package.json is valid JSON', () => {
    const text = readText(join(dir, 'package.json'))
    assert(text !== undefined, 'package.json is missing or too large')
    manifest = JSON.parse(text)
    assert(manifest !== null && typeof manifest === 'object', 'package.json must be an object')
    return `${manifest.name ?? '(no name)'}@${manifest.version ?? '(no version)'}`
  }))

  if (manifest === undefined) {
    return { ok: false, packageDir: dir, checks, warnings }
  }

  checks.push(check('name', 'package name is present', () => {
    assert(typeof manifest.name === 'string' && manifest.name !== '', 'package.json.name is missing')
    return manifest.name
  }))
  checks.push(check('version', 'version is present', () => {
    assert(typeof manifest.version === 'string' && /^\d+\.\d+\.\d+/.test(manifest.version), 'package.json.version is not semver-like')
    return manifest.version
  }))
  checks.push(check('type', 'type is "module"', () => {
    assert(manifest.type === 'module', 'package.json.type should be "module" for a DSH bundle')
    return 'module'
  }))
  checks.push(check('exports', 'package.json declares exports', () => {
    assert(manifest.exports !== undefined && typeof manifest.exports === 'object', 'package.json.exports is missing')
    return Object.keys(manifest.exports).join(', ')
  }))

  const patchPath = manifest.dsh?.bundle?.patch
  checks.push(check('bundle-patch', 'dsh.bundle.patch points to a file', () => {
    assert(typeof patchPath === 'string' && patchPath !== '', 'dsh.bundle.patch is missing')
    const full = resolve(dir, patchPath)
    assert(full.startsWith(dir), 'dsh.bundle.patch escapes the package directory')
    assert(existsSync(full), `${patchPath} does not exist`)
    return patchPath
  }))

  const packageName = typeof manifest.name === 'string' ? manifest.name : ''
  checks.push(check('patch-row', 'patch inserts this package by name', () => {
    if (typeof patchPath !== 'string') throw new Error('no patch path to read')
    const text = readText(resolve(dir, patchPath))
    assert(text !== undefined, 'patch file cannot be read')
    assert(/insert\s*:/.test(text), 'patch has no insert list')
    if (packageName !== '') assert(text.includes(packageName), `patch does not mention ${packageName}`)
    return 'insert row present'
  }))

  const client = manifest.dsh?.client
  if (client !== undefined && client !== null) {
    checks.push(check('client-platform', 'dsh.client.platform is "web"', () => {
      assert(client.platform === 'web', 'dsh.client.platform should be "web"')
      return 'web'
    }))
    checks.push(check('client-export', 'exports includes ./client', () => {
      const exportsField = manifest.exports
      assert(exportsField !== null && typeof exportsField === 'object', 'exports is not an object')
      assert(Object.prototype.hasOwnProperty.call(exportsField, './client'), 'exports is missing "./client"')
      return String(exportsField['./client'])
    }))
    checks.push(check('client-entry', 'client entry file exists', () => {
      const entry = resolve(dir, 'client.js')
      assert(existsSync(entry), 'client.js is missing')
      const text = readText(entry)
      assert(text !== undefined, 'client.js cannot be read')
      assert(text.includes('__ModuleLoader__'), 'client.js does not use window.__ModuleLoader__')
      assert(text.includes('factory'), 'client.js has no factory')
      return 'client.js'
    }))
  }

  checks.push(check('locale', 'locale metadata exists for zh and en', () => {
    const zh = readText(join(dir, 'locale', 'zh.json'))
    const en = readText(join(dir, 'locale', 'en.json'))
    assert(zh !== undefined && en !== undefined, 'locale/zh.json or locale/en.json is missing')
    const zhTitle = JSON.parse(zh)?.meta?.title
    const enTitle = JSON.parse(en)?.meta?.title
    assert(typeof zhTitle === 'string' && zhTitle !== '', 'locale/zh.json meta.title is missing')
    assert(typeof enTitle === 'string' && enTitle !== '', 'locale/en.json meta.title is missing')
    return `${zhTitle} / ${enTitle}`
  }))

  checks.push(check('icon', 'icon file exists', () => {
    const icon = resolve(dir, manifest.icon ?? 'icon.svg')
    assert(existsSync(icon), `${relative(dir, icon)} is missing`)
    return relative(dir, icon)
  }))

  // Parse-only JavaScript syntax check; no generated code is executed.
  checks.push(check('js-syntax', 'JavaScript files parse', () => {
    const files = []
    walkFiles(dir, (name) => JS_EXTENSIONS.some((ext) => name.endsWith(ext)), files, MAX_JS_FILES)
    assert(files.length > 0, 'no JavaScript files found')
    const failures = []
    let checked = 0
    for (const file of files.slice(0, MAX_JS_FILES)) {
      const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8', timeout: 15000 })
      checked += 1
      if (result.status !== 0) {
        const detail = String(result.stderr || result.stdout || '').trim().split('\n').slice(0, 2).join(' ')
        failures.push(`${relative(dir, file)}: ${detail}`)
        if (failures.length >= 3) break
      }
    }
    assert(failures.length === 0, failures.join(' ; '))
    return `${checked} file(s) parsed`
  }))

  // Advisory checks: useful for review but not release blockers.
  if (client !== undefined && client !== null) {
    const inject = Array.isArray(client.inject) ? client.inject : []
    if (inject.length === 0) warnings.push('dsh.client.inject is empty; activation order may matter for slot registrations')
  }
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
    warnings.push('package.json.files is empty; a published package may omit runtime files')
  }
  if (manifest.dsh?.compatibility === undefined) {
    warnings.push('dsh.compatibility is not declared; the market cannot show host compatibility')
  }

  return {
    ok: checks.every((item) => item.ok),
    packageDir: dir,
    name: manifest.name ?? '',
    version: manifest.version ?? '',
    checks,
    warnings
  }
}
