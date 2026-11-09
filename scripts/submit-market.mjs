#!/usr/bin/env node
/**
 * Submit this plugin to the awesome-dsh-plugin registry.
 *
 * The registry requires a public GitHub repository that is at least one day
 * old. This script refuses to open a PR before then unless `--force` is used.
 *
 * Usage:
 *   node scripts/submit-market.mjs --token-file <path> --prepare   # fork + branch + entry commit
 *   node scripts/submit-market.mjs --token-file <path> --pr        # open the pull request
 *   node scripts/submit-market.mjs --token-file <path>             # dry run (prints the plan)
 *
 * The token needs `repo` (and, to create a fork, public repository access).
 * It is never printed.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const OWNER = 'lixian292'
const REPO = 'dsh-plugin-workbench'
const REGISTRY_OWNER = 'awesome-dsh-plugin'
const REGISTRY_REPO = 'awesome-dsh-plugin'
const REGISTRY_BRANCH = 'main'
const WORK_BRANCH = 'add-dsh-plugin-workbench'
const ENTRY_PATH = `data/plugins/${OWNER}__${REPO}.yml`
const PLUGIN_URL = `https://github.com/${OWNER}/${REPO}`
const MIN_AGE_MS = 24 * 60 * 60 * 1000

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(here, '..')

function arg(name) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : undefined
}

function hasFlag(name) {
  return process.argv.includes(name)
}

const tokenFile = arg('--token-file')
const token = tokenFile !== undefined ? readFileSync(tokenFile, 'utf8').trim() : (process.env.GITHUB_TOKEN ?? '').trim()
if (token === '') {
  console.error('no token: pass --token-file <path> or set GITHUB_TOKEN')
  process.exit(2)
}

const headers = {
  authorization: `Bearer ${token}`,
  accept: 'application/vnd.github+json',
  'user-agent': 'dsh-plugin-workbench-submit',
  'x-github-api-version': '2022-11-28'
}

async function api(method, path, body) {
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: { ...headers, ...(body === undefined ? {} : { 'content-type': 'application/json' }) },
    body: body === undefined ? undefined : JSON.stringify(body)
  })
  const text = await response.text()
  let data
  try {
    data = text === '' ? undefined : JSON.parse(text)
  } catch {
    data = text
  }
  if (response.status >= 400) {
    const message = data && typeof data === 'object' && typeof data.message === 'string' ? data.message : String(data)
    const error = new Error(`${method} ${path} -> HTTP ${response.status}: ${message}`)
    error.status = response.status
    throw error
  }
  return data
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForRepo(path, timeoutMs) {
  const started = Date.now()
  while (Date.now() - started < timeoutMs) {
    try {
      const repo = await api('GET', path)
      if (repo !== undefined && repo.default_branch !== undefined) return repo
    } catch (error) {
      if (error.status !== 404) throw error
    }
    await sleep(4000)
  }
  throw new Error(`timed out waiting for ${path}`)
}

async function ensureFork() {
  const forkPath = `/repos/${OWNER}/${REGISTRY_REPO}`
  try {
    const existing = await api('GET', forkPath)
    return existing
  } catch (error) {
    if (error.status !== 404) throw error
  }
  console.log(`forking ${REGISTRY_OWNER}/${REGISTRY_REPO} ...`)
  const required = new Error('fork creation failed')
  try {
    await api('POST', `/repos/${REGISTRY_OWNER}/${REGISTRY_REPO}/forks`, { default_branch_only: true })
  } catch (error) {
    // A recently created fork can answer with an error while it is being set up.
    if (error.status !== 403 && error.status !== 422) throw error
  }
  return waitForRepo(forkPath, 120000)
}

async function ensureBranch(fork) {
  const refPath = `/repos/${OWNER}/${REGISTRY_REPO}/git/ref/heads/${WORK_BRANCH}`
  try {
    return await api('GET', refPath)
  } catch (error) {
    if (error.status !== 404) throw error
  }
  const base = await api('GET', `/repos/${OWNER}/${REGISTRY_REPO}/git/ref/heads/${fork.default_branch}`)
  const created = await api('POST', `/repos/${OWNER}/${REGISTRY_REPO}/git/refs`, {
    ref: `refs/heads/${WORK_BRANCH}`,
    sha: base.object.sha
  })
  return created
}

async function upsertEntry() {
  const raw = readFileSync(join(repoRoot, 'market-entry.yml'), 'utf8')
  // The registry entry should contain data only; drop our explanatory header.
  const start = raw.indexOf('url:')
  const content = start >= 0 ? raw.slice(start) : raw
  const encoded = Buffer.from(content, 'utf8').toString('base64')
  const path = `/repos/${OWNER}/${REGISTRY_REPO}/contents/${ENTRY_PATH}`
  let sha
  try {
    const existing = await api('GET', `${path}?ref=${WORK_BRANCH}`)
    sha = existing.sha
  } catch (error) {
    if (error.status !== 404) throw error
  }
  const result = await api('PUT', path, {
    message: `Add ${OWNER}/${REPO}`,
    content: encoded,
    branch: WORK_BRANCH,
    ...(sha === undefined ? {} : { sha })
  })
  return result.commit.sha
}

function prBody() {
  return [
    'Adds **dsh-plugin-workbench** to the list.',
    '',
    `- Repository: ${PLUGIN_URL}`,
    '- `dsh.bundle` manifest: `package.json` declares `dsh.bundle.patch` -> `cordis.patch.yml` (host half) and `dsh.client` (browser half).',
    '- Category: `dev` (plugin authoring tooling).',
    '- What it does: a reuse-first plugin authoring workbench. It clarifies a plugin need, searches installed plugins, the curated market catalog and GitHub for reusable implementations, records the user decision (use as-is / DIY / reference only / from scratch), decomposes the remaining capability gaps, and runs structural verification before any installation. Long-running model work happens in the Host or a Creator sub-agent, not the parent conversation.',
    '- No build step: plain JavaScript (`index.js`, `client.js`, `host/*.js`). Zero runtime dependencies.',
    '- Tests: `npm test` (node:test) and `npm run check`; CI ready in `docs/ci.yml` (workflow file not yet committed because the publishing token lacked the `workflow` scope).',
    '',
    'The repository was created less than 24 hours before this PR was opened, so the submission gate may report the age check until it is at least one day old.',
    ''
  ].join('\n')
}

async function main() {
  const me = await api('GET', '/user')
  if (me.login !== OWNER) throw new Error(`token belongs to ${me.login}, expected ${OWNER}`)

  const pluginRepo = await api('GET', `/repos/${OWNER}/${REPO}`)
  const age = Date.now() - new Date(pluginRepo.created_at).getTime()
  if (age < MIN_AGE_MS && !hasFlag('--force')) {
    const wait = MIN_AGE_MS - age
    console.log(`plugin repo is ${Math.floor(age / 3600000)}h old; registry requires >= 24h.`)
    console.log(`retry after ${new Date(Date.now() + wait).toISOString()} (or pass --force to prepare anyway).`)
    process.exit(1)
  }

  if (hasFlag('--prepare') || hasFlag('--pr') || hasFlag('--force')) {
    const fork = await ensureFork()
    console.log('fork ready:', fork.full_name)
    await ensureBranch(fork)
    const sha = await upsertEntry()
    console.log('entry committed on', WORK_BRANCH, '->', sha)
  }

  if (hasFlag('--pr')) {
    try {
      const pr = await api('POST', `/repos/${REGISTRY_OWNER}/${REGISTRY_REPO}/pulls`, {
        title: 'Add dsh-plugin-workbench',
        head: `${OWNER}:${WORK_BRANCH}`,
        base: REGISTRY_BRANCH,
        body: prBody(),
        maintainer_can_modify: true
      })
      console.log('pull request:', pr.html_url)
    } catch (error) {
      if (error.status === 422) {
        console.log('a pull request for this branch already exists (or nothing changed)')
        return
      }
      throw error
    }
    return
  }

  if (!hasFlag('--prepare') && !hasFlag('--force')) {
    console.log('dry run: would fork, push the entry file and open a PR. Pass --prepare or --pr.')
  }
}

main().catch((error) => {
  console.error(String(error.message ?? error))
  process.exit(1)
})
