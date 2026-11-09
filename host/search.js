/**
 * Reuse-first search adapters.
 *
 * Everything here runs on the Host: large payloads never enter the model
 * context. Each adapter returns normalized candidate objects, and the caller
 * ranks and truncates them before returning anything to the agent.
 */

import { describeGithubAuth, fetchGithubJson } from './github.js'

const GITHUB_SEARCH_URL = 'https://api.github.com/search/repositories'
const CACHE_TTL_MS = 10 * 60 * 1000
const MAX_DESCRIPTION = 280

const cache = new Map()

function errorText(error) {
  return error && typeof error.message === 'string' ? error.message : String(error)
}

function truncate(text, max) {
  const value = typeof text === 'string' ? text : ''
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function firstString(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim() !== '') return value.trim()
  }
  return ''
}

/** Split a free-text goal into lowercase search tokens. */
const CJK_STOP_CHARS = new Set('的了在是个有能把被这那我你他她它和与及或里中上下前后会要可以为对到用时说看做加新每日并且而但很都又还就也之其于以为所'.split(''))
const EN_STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'use', 'using', 'make', 'need', 'want',
  'can', 'will', 'should', 'add', 'new', '一个', '可以', '需要', '希望', '支持'
])

export function extractKeywords(text, limit = 10) {
  const source = typeof text === 'string' ? text : ''
  const seen = new Set()
  const tokens = []
  const push = (token) => {
    const value = token.toLowerCase()
    if (value.length < 2 || seen.has(value)) return
    if (EN_STOP_WORDS.has(value)) return
    seen.add(value)
    tokens.push(value)
  }
  for (const match of source.matchAll(/[a-z][a-z0-9-]{1,30}/g)) push(match[0])
  // CJK bigrams are useful without a dictionary; drop function-word pairs so
  // that "一个/可以/有了" do not match every Chinese plugin description.
  const cjk = source.replace(/[^\u4e00-\u9fff]/g, '')
  let cjkCount = 0
  for (let i = 0; i < cjk.length - 1; i += 1) {
    const pair = cjk.slice(i, i + 2)
    if (CJK_STOP_CHARS.has(pair[0]) || CJK_STOP_CHARS.has(pair[1])) continue
    push(pair)
    cjkCount += 1
    if (cjkCount >= 6) break
  }
  return tokens.slice(0, limit)
}

/** Build the small set of remote queries used for one workbench search. */
export function buildQueries(goal, explicitQuery) {
  const queries = []
  if (typeof explicitQuery === 'string' && explicitQuery.trim() !== '') {
    queries.push(explicitQuery.trim())
  }
  // GitHub search does not tokenize CJK well, so remote queries use Latin
  // tokens only; CJK keywords still participate in local ranking.
  const latin = (typeof goal === 'string' ? goal.match(/[a-zA-Z][a-zA-Z0-9-]{1,30}/g) : null) ?? []
  const joined = latin.slice(0, 4).join(' ').toLowerCase()
  if (joined !== '') {
    queries.push(`topic:dsh-plugin ${joined}`)
    queries.push(`"dsh plugin" ${joined}`)
  } else {
    queries.push('topic:dsh-plugin')
    queries.push('"dsh-plugin" in:name,description')
  }
  return [...new Set(queries)].slice(0, 3)
}

function cached(key, loader) {
  const hit = cache.get(key)
  const now = Date.now()
  if (hit !== undefined && now - hit.at < CACHE_TTL_MS) return hit.promise
  const promise = Promise.resolve()
    .then(loader)
    .then((value) => {
      cache.set(key, { at: Date.now(), promise: Promise.resolve(value) })
      return value
    })
    .catch((error) => {
      cache.delete(key)
      throw error
    })
  cache.set(key, { at: now, promise })
  return promise
}

function githubCandidate(item, index) {
  const repo = firstString(item.full_name, item.html_url)
  const description = truncate(firstString(item.description), MAX_DESCRIPTION)
  return {
    source: 'github',
    name: firstString(item.name, item.full_name, `github-${index + 1}`),
    repo,
    url: firstString(item.html_url, repo),
    description,
    stars: typeof item.stargazers_count === 'number' ? item.stargazers_count : 0,
    updatedAt: firstString(item.pushed_at, item.updated_at),
    license: firstString(item.license && item.license.spdx_id),
    topics: asArray(item.topics).filter((value) => typeof value === 'string').slice(0, 8),
    installSpec: repo === '' ? '' : `github:${repo}`,
    isDshPlugin: asArray(item.topics).some((value) => value === 'dsh-plugin') || /\bdsh\b/i.test(description)
  }
}

/** Search public GitHub repositories. Throws on network/quota failures. */
export async function searchGithub(ctx, queries, signal) {
  const collected = []
  const errors = []
  for (const query of queries) {
    try {
      const data = await cached(`github:${query}`, () =>
        fetchGithubJson(ctx, `${GITHUB_SEARCH_URL}?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=8`, signal)
      )
      for (const item of asArray(data.items)) collected.push(githubCandidate(item, collected.length))
    } catch (error) {
      errors.push(`${query}: ${errorText(error)}`)
    }
  }
  return { candidates: collected, errors, auth: describeGithubAuth() }
}

/**
 * Search the curated market catalog (already normalized and cached by
 * host/market.js). Kept as an adapter so the tool sees one candidate shape.
 */
export async function searchMarket(marketCatalog, keywords, limit = 60) {
  if (marketCatalog === undefined || typeof marketCatalog.search !== 'function') {
    throw new Error('the market catalog adapter is not available')
  }
  return marketCatalog.search(keywords, limit)
}

/** Fallback: use the configured web search provider and treat hits as candidates. */
export async function searchWeb(web, query, signal) {
  if (web === undefined || typeof web.search !== 'function') {
    throw new Error('the web search capability is not available in this profile')
  }
  const result = await web.search({ query, maxResults: 8 }, signal)
  const sources = asArray(result?.sources)
  return {
    candidates: sources.map((source, index) => ({
      source: 'web',
      name: firstString(source.title, `web-${index + 1}`),
      repo: '',
      url: firstString(source.url),
      description: truncate(firstString(source.snippet), MAX_DESCRIPTION),
      stars: 0,
      updatedAt: '',
      license: '',
      topics: [],
      installSpec: '',
      isDshPlugin: /dsh|deepseek[- ]?harness/i.test(`${firstString(source.title)} ${firstString(source.url)} ${firstString(source.snippet)}`)
    })),
    total: sources.length
  }
}

/** Normalize plugin-manager bundles into candidates. */
export async function searchInstalled(pluginManager) {
  if (pluginManager === undefined || typeof pluginManager.listBundles !== 'function') {
    throw new Error('the plugin manager is not available in this profile')
  }
  const bundles = await pluginManager.listBundles()
  const list = asArray(bundles)
  const candidates = list
    .filter((bundle) => bundle !== null && typeof bundle === 'object')
    .filter((bundle) => bundle.installed === true || bundle.availability === 'installed' || bundle.enabled === true)
    .map((bundle) => ({
      source: 'installed',
      name: firstString(bundle.name, bundle.id),
      // Installed bundles are already present; a pnpm/git spec is not an
      // install target for them, so keep repo/url empty instead of guessing.
      repo: '',
      url: '',
      description: truncate(firstString(bundle.meta && bundle.meta.description, bundle.description), MAX_DESCRIPTION),
      stars: 0,
      updatedAt: '',
      license: '',
      topics: [],
      installSpec: '',
      isDshPlugin: true
    }))
    .filter((candidate) => candidate.name !== '')
    // Base/shipped bundles are infrastructure, not reusable feature plugins.
    .filter((candidate) => !candidate.name.startsWith('@deepseek-ai/'))
    .filter((candidate) => candidate.name !== 'dsh-plugcraft')
  return { candidates, total: candidates.length }
}

/** Rank candidates with deterministic keyword scoring; returns a new array. */
export function rankCandidates(candidates, keywords, limit = 8) {
  const tokens = asArray(keywords).filter((token) => typeof token === 'string' && token.length >= 2)
  const scored = []
  candidates.forEach((candidate, index) => {
    const name = String(candidate.name ?? '').toLowerCase()
    const description = String(candidate.description ?? '').toLowerCase()
    const topics = asArray(candidate.topics).join(' ').toLowerCase()
    let hits = 0
    for (const token of tokens) {
      if (name.includes(token)) hits += 6
      else if (topics.includes(token)) hits += 4
      else if (description.includes(token)) hits += 2
    }
    // Only candidates that actually match the need are worth ranking.
    if (hits === 0) return
    let score = hits
    if (candidate.source === 'installed') score += 8
    if (candidate.source === 'market') score += 4
    if (candidate.isDshPlugin) score += 3
    const stars = typeof candidate.stars === 'number' ? candidate.stars : 0
    if (stars > 0) score += Math.min(6, Math.log10(stars + 1) * 2)
    scored.push({ candidate, score, index })
  })
  scored.sort((a, b) => b.score - a.score || a.index - b.index)
  const seen = new Set()
  const result = []
  for (const entry of scored) {
    const dedupeKey = `${entry.candidate.source}:${entry.candidate.repo || entry.candidate.url || entry.candidate.name}`.toLowerCase()
    if (seen.has(dedupeKey)) continue
    seen.add(dedupeKey)
    result.push({
      ...entry.candidate,
      score: Math.round(Math.max(0, Math.min(100, entry.score))),
      stars: typeof entry.candidate.stars === 'number' ? entry.candidate.stars : 0,
      isDshPlugin: entry.candidate.isDshPlugin === true
    })
    if (result.length >= limit) break
  }
  return result
}
