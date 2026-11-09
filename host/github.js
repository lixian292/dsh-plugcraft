import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { workbenchDataDir } from './store.js'

const TOKEN_ENV_NAMES = ['DSH_GITHUB_TOKEN', 'DSH_PLUGIN_WORKBENCH_GITHUB_TOKEN', 'GITHUB_TOKEN']
const TOKEN_FILE_NAMES = ['github-token.txt', 'github_token.txt']
const TOKEN_TTL_MS = 60 * 1000
const USER_AGENT = 'dsh-plugin-workbench'

let cachedToken = { value: '', at: 0 }

function readTokenFile(file) {
  try {
    const stat = statSync(file)
    if (!stat.isFile() || stat.size >= 8192) return ''
    return readFileSync(file, 'utf8').trim().split(/\r?\n/)[0].trim()
  } catch {
    return ''
  }
}

function tokenFileCandidates() {
  const candidates = []
  const dataDir = workbenchDataDir()
  for (const name of TOKEN_FILE_NAMES) candidates.push(join(dataDir, name))
  // Workspace fallbacks: the token may live next to the project (gitignored)
  // instead of inside $DSH_HOME. Both spellings are accepted.
  const bases = []
  if (typeof process.env.DSH_WORKSPACE === 'string' && process.env.DSH_WORKSPACE.trim() !== '') {
    bases.push(process.env.DSH_WORKSPACE.trim())
  }
  bases.push(process.cwd())
  for (const base of bases) {
    for (const name of TOKEN_FILE_NAMES) {
      const candidate = join(base, name)
      if (!candidates.includes(candidate)) candidates.push(candidate)
    }
  }
  return candidates
}

/**
 * Optional GitHub token. Resolution order:
 *   1. environment: DSH_GITHUB_TOKEN, DSH_PLUGIN_WORKBENCH_GITHUB_TOKEN, GITHUB_TOKEN
 *   2. $DSH_HOME/plugin-workbench/github-token.txt or github_token.txt
 *   3. <workspace>/github-token.txt or <workspace>/github_token.txt
 *
 * The token never leaves the Host process: it is only attached to GitHub API
 * requests, never stored in task state, logs, or the page API.
 */
export function resolveGithubToken() {
  const now = Date.now()
  if (now - cachedToken.at < TOKEN_TTL_MS) return cachedToken.value
  let value = ''
  for (const name of TOKEN_ENV_NAMES) {
    const candidate = process.env[name]
    if (typeof candidate === 'string' && candidate.trim() !== '') {
      value = candidate.trim()
      break
    }
  }
  if (value === '') {
    for (const file of tokenFileCandidates()) {
      const candidate = readTokenFile(file)
      if (candidate !== '') {
        value = candidate
        break
      }
    }
  }
  cachedToken = { value, at: now }
  return value
}

export function hasGithubToken() {
  return resolveGithubToken() !== ''
}

/** Drop the cached token so a freshly written file/env value is picked up. */
export function forgetGithubToken() {
  cachedToken = { value: '', at: 0 }
}

function errorText(error) {
  return error && typeof error.message === 'string' ? error.message : String(error)
}

function rateLimitText(response) {
  const remaining = response.headers.get('x-ratelimit-remaining')
  const reset = response.headers.get('x-ratelimit-reset')
  const parts = []
  if (remaining !== null) parts.push(`remaining ${remaining}`)
  if (reset !== null && /^\d+$/.test(reset)) {
    const date = new Date(Number(reset) * 1000)
    if (!Number.isNaN(date.getTime())) parts.push(`resets ${date.toISOString()}`)
  }
  return parts.length > 0 ? ` (${parts.join(', ')})` : ''
}

async function fetchAuthenticated(url, signal) {
  const token = resolveGithubToken()
  const response = await fetch(url, {
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'user-agent': USER_AGENT,
      'x-github-api-version': '2022-11-28'
    },
    signal
  })
  if (!response.ok) {
    if (response.status === 401) throw new Error('GitHub token was rejected (401); check the token')
    if (response.status === 403 || response.status === 429) {
      throw new Error(`GitHub rate limit or permission error (HTTP ${response.status})${rateLimitText(response)}`)
    }
    throw new Error(`GitHub API returned HTTP ${response.status}`)
  }
  return response.json()
}

async function fetchAnonymous(ctx, url, signal) {
  const web = ctx.get('web')
  if (web === undefined || typeof web.fetch !== 'function') {
    throw new Error('no GitHub token and the web fetch capability is not available')
  }
  const result = await web.fetch({ url }, signal)
  const statusCode = typeof result?.statusCode === 'number' ? result.statusCode : 0
  const content = result?.body && typeof result.body.content === 'string' ? result.body.content : ''
  if (statusCode < 200 || statusCode >= 300) {
    const hint = statusCode === 403 || statusCode === 429 ? '; anonymous rate limit may be exhausted (add a GitHub token for a higher quota)' : ''
    throw new Error(`GitHub API returned HTTP ${statusCode || 'unknown'}${hint}`)
  }
  if (result?.truncated === true) throw new Error('GitHub response was truncated by the web fetch limits')
  return JSON.parse(content)
}

/**
 * Fetch JSON from the GitHub REST API.
 * Uses the optional token through Node fetch when present, otherwise the
 * Harness web fetch seam (anonymous quota).
 */
export async function fetchGithubJson(ctx, url, signal) {
  const token = resolveGithubToken()
  if (token !== '') return fetchAuthenticated(url, signal)
  return fetchAnonymous(ctx, url, signal)
}

export function describeGithubAuth() {
  return hasGithubToken() ? 'token' : 'anonymous'
}
