import { spawnSync } from 'node:child_process'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const SKIP_DIRS = new Set(['node_modules', '.git', '.idea', 'tmp', 'dist', 'coverage'])
const JS_EXTENSIONS = ['.js', '.mjs', '.cjs']

const jsFiles = []
const jsonFiles = []
const failures = []

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(full)
    } else if (entry.isFile()) {
      if (JS_EXTENSIONS.some((extension) => entry.name.endsWith(extension))) jsFiles.push(full)
      else if (entry.name.endsWith('.json')) jsonFiles.push(full)
    }
  }
}

walk(ROOT)

for (const file of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' })
  if (result.status !== 0) {
    failures.push(`${relative(ROOT, file)}: ${String(result.stderr || result.stdout).trim().split('\n').slice(0, 2).join(' ')}`)
  }
}

for (const file of jsonFiles) {
  try {
    JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
  } catch (error) {
    failures.push(`${relative(ROOT, file)}: ${error.message}`)
  }
}

const manifests = ['package.json', 'locale/zh.json', 'locale/en.json']
for (const manifest of manifests) {
  const file = join(ROOT, manifest)
  try {
    if (statSync(file).isFile()) continue
  } catch {
    failures.push(`${manifest}: missing`)
  }
}

if (failures.length > 0) {
  console.error(`check failed with ${failures.length} problem(s):`)
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}

console.log(`check ok: ${jsFiles.length} JavaScript file(s) parsed, ${jsonFiles.length} JSON file(s) valid`)
