import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { workbenchDataDir } from './store.js'

const MARKET_URL = 'https://awesome-dsh-plugin.com/plugins.json'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000
const FETCH_TIMEOUT_MS = 90 * 1000
const MAX_DESCRIPTION = 200
const DEFAULT_LIMIT = 60

function errorText(error) {
  return error && typeof error.message === 'string' ? error.message : String(error)
}

function truncate(text, max) {
  const value = typeof text === 'string' ? text : ''
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`
}

function pickDescription(description) {
  if (typeof description === 'string') return truncate(description, MAX_DESCRIPTION)
  if (description !== null && typeof description === 'object') {
    return truncate(description.zh ?? description.en ?? '', MAX_DESCRIPTION)
  }
  return ''
}

function githubRepoFromUrl(url) {
  if (typeof url !== 'string') return ''
  const match = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/i)
  if (match === null) return ''
  return `${match[1]}/${match[2].replace(/\.git$/, '')}`
}

function normalizeEntry(entry) {
  if (entry === null || typeof entry !== 'object') return undefined
  const name = typeof entry.name === 'string' && entry.name !== '' ? entry.name : ''
  if (name === '') return undefined
  const url = typeof entry.url === 'string' ? entry.url : ''
  const repo = githubRepoFromUrl(url)
  return {
    source: 'market',
    name,
    owner: typeof entry.owner === 'string' ? entry.owner : '',
    repo,
    url,
    page: typeof entry.page === 'string' ? entry.page : '',
    category: typeof entry.category === 'string' ? entry.category : '',
    description: pickDescription(entry.description),
    stars: typeof entry.stars === 'number' ? entry.stars : 0,
    updatedAt: '',
    license: '',
    topics: typeof entry.category === 'string' && entry.category !== '' ? [entry.category] : [],
    installSpec: repo !== '' ? `github:${repo}` : '',
    isDshPlugin: true
  }
}

function loadCache(file) {
  try {
    const parsed = JSON.parse(readFileSync(file, 'utf8'))
    if (parsed !== null && typeof parsed === 'object' && Array.isArray(parsed.plugins) && parsed.plugins.length > 0) {
      return parsed
    }
  } catch {
    // Missing or stale-format cache: refresh from the network.
  }
  return undefined
}

/**
 * Curated DSH plugin catalog with an on-disk cache.
 *
 * The catalog is large (about 13 MB), so it cannot go through the Host web
 * fetch seam (which caps the response body). A plain Node fetch downloads it
 * once per day; searches then run locally over the compact cached records.
 */
export function createMarketCatalog(logger) {
  const dir = join(workbenchDataDir(), 'cache')
  const file = join(dir, 'market.json')
  let cache = loadCache(file)
  let pending

  function save(next) {
    try {
      mkdirSync(dir, { recursive: true })
      const tmp = join(dir, `.market-${process.pid}-${Date.now()}.tmp`)
      writeFileSync(tmp, JSON.stringify(next), 'utf8')
      renameSync(tmp, file)
    } catch (error) {
      logger?.warn?.(`[plugin-workbench] could not persist the market cache: ${errorText(error)}`)
    }
  }

  async function refresh() {
    const signal = typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(FETCH_TIMEOUT_MS) : undefined
    const response = await fetch(MARKET_URL, {
      headers: { 'user-agent': 'dsh-plugin-workbench', accept: 'application/json' },
      signal
    })
    if (!response.ok) throw new Error(`market catalog returned HTTP ${response.status}`)
    const data = await response.json()
    const rawPlugins = Array.isArray(data?.plugins) ? data.plugins : []
    const plugins = rawPlugins.map(normalizeEntry).filter((entry) => entry !== undefined)
    if (plugins.length === 0) throw new Error('market catalog has an unknown shape')
    const next = {
      fetchedAt: Date.now(),
      catalogUpdated: typeof data?.updated === 'string' ? data.updated : '',
      source: typeof data?.source === 'string' ? data.source : '',
      total: rawPlugins.length,
      plugins
    }
    cache = next
    save(next)
    logger?.info?.(`[plugin-workbench] market catalog refreshed: ${plugins.length} plugins`)
    return next
  }

  async function ensure() {
    if (cache !== undefined && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache
    if (pending !== undefined) return pending
    pending = refresh()
      .catch((error) => {
        if (cache !== undefined) {
          logger?.warn?.(`[plugin-workbench] market refresh failed, using the cached catalog: ${errorText(error)}`)
          return cache
        }
        throw error
      })
      .finally(() => {
        pending = undefined
      })
    return pending
  }

  return {
    file,
    async search(keywords, limit = DEFAULT_LIMIT) {
      const catalog = await ensure()
      const tokens = Array.isArray(keywords) ? keywords.filter((token) => typeof token === 'string' && token.length >= 2) : []
      if (tokens.length === 0) return { candidates: catalog.plugins.slice(0, limit), total: catalog.total }
      const scored = []
      for (const entry of catalog.plugins) {
        const haystack = `${entry.name} ${entry.description} ${entry.category}`.toLowerCase()
        let score = 0
        for (const token of tokens) {
          if (entry.name.toLowerCase().includes(token)) score += 5
          else if (haystack.includes(token)) score += 2
        }
        if (score > 0) scored.push({ entry, score })
      }
      scored.sort((a, b) => b.score - a.score)
      return {
        candidates: scored.slice(0, limit).map((item) => item.entry),
        total: scored.length
      }
    }
  }
}
