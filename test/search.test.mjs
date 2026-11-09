import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

/**
 * Isolate the token lookup before importing the host modules: they resolve the
 * DSH home at import time, and a real user token on this machine must never
 * leak into the anonymous-path tests.
 */
const tempHome = mkdtempSync(join(tmpdir(), 'dsh-workbench-search-'))
process.env.DSH_HOME = tempHome

const { fetchGithubJson, forgetGithubToken, resolveGithubToken } = await import('../host/github.js')
const { buildQueries, extractKeywords, rankCandidates } = await import('../host/search.js')

test.after(() => {
  rmSync(tempHome, { recursive: true, force: true })
})

const TOKEN_ENV_NAMES = ['DSH_GITHUB_TOKEN', 'DSH_PLUGIN_WORKBENCH_GITHUB_TOKEN', 'GITHUB_TOKEN']

function withEnv(entries, fn) {
  const saved = {}
  for (const name of TOKEN_ENV_NAMES) {
    saved[name] = process.env[name]
    delete process.env[name]
  }
  for (const [name, value] of Object.entries(entries)) process.env[name] = value
  forgetGithubToken()
  try {
    return fn()
  } finally {
    for (const name of TOKEN_ENV_NAMES) {
      if (saved[name] === undefined) delete process.env[name]
      else process.env[name] = saved[name]
    }
    forgetGithubToken()
  }
}

test('extractKeywords keeps useful CJK bigrams and drops function-word pairs', () => {
  const tokens = extractKeywords('做一个在 DSH 里显示每日待办、并把数据保存在本地的插件')
  assert.ok(tokens.includes('todo') === false)
  assert.ok(tokens.includes('待办'), `expected 待办 in ${tokens.join(',')}`)
  assert.ok(tokens.includes('做一') === false)
  assert.ok(tokens.includes('一个') === false)
})

test('buildQueries uses dsh-plugin topic queries and avoids raw CJK text', () => {
  const queries = buildQueries('todo plugin for DeepSeek Harness', '')
  assert.ok(queries[0].startsWith('topic:dsh-plugin '), queries[0])
  assert.ok(queries.every((query) => !/[\u4e00-\u9fff]/.test(query)))
  const chineseOnly = buildQueries('做一个每日待办插件', '')
  assert.equal(chineseOnly[0], 'topic:dsh-plugin')
})

test('rankCandidates drops zero-match noise, keeps keyword hits and dedupes', () => {
  const ranked = rankCandidates(
    [
      { source: 'market', name: 'dsh-todo-list', description: 'todo list plugin', topics: ['todo'], stars: 0, isDshPlugin: true },
      { source: 'market', name: 'dsh-client-locale-ru', description: 'Russian locale pack', topics: [], stars: 5, isDshPlugin: true },
      { source: 'github', name: 'someone/dsh-todo', description: 'another todo plugin', topics: [], stars: 100, isDshPlugin: false },
      { source: 'market', name: 'dsh-todo-list', description: 'duplicate', topics: ['todo'], stars: 0, isDshPlugin: true }
    ],
    ['todo', '待办'],
    8
  )
  assert.equal(ranked.length, 2)
  assert.ok(ranked.every((candidate) => candidate.name !== 'dsh-client-locale-ru'))
  assert.ok(ranked[0].score >= ranked[1].score)
})

test('fetchGithubJson uses the token through Node fetch when configured', async () => {
  await withEnv({ GITHUB_TOKEN: 'test-token' }, async () => {
    assert.equal(resolveGithubToken(), 'test-token')
    const calls = []
    const originalFetch = globalThis.fetch
    globalThis.fetch = async (url, options) => {
      calls.push({ url: String(url), options })
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => ({ items: [] })
      }
    }
    try {
      const data = await fetchGithubJson({ get: () => undefined }, 'https://api.github.com/search/repositories?q=x')
      assert.deepEqual(data, { items: [] })
      assert.equal(calls.length, 1)
      assert.equal(calls[0].options.headers.authorization, 'Bearer test-token')
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})

test('fetchGithubJson falls back to the Harness web fetch without a token', async () => {
  await withEnv({}, async () => {
    let usedGlobalFetch = false
    const originalFetch = globalThis.fetch
    globalThis.fetch = async () => {
      usedGlobalFetch = true
      throw new Error('global fetch must not be used for anonymous calls')
    }
    try {
      const web = {
        async fetch({ url }) {
          assert.ok(String(url).includes('api.github.com'))
          return { statusCode: 200, truncated: false, body: { kind: 'text', content: '{"total_count":0,"items":[]}' } }
        }
      }
      const data = await fetchGithubJson({ get: (name) => (name === 'web' ? web : undefined) }, 'https://api.github.com/x')
      assert.deepEqual(data, { total_count: 0, items: [] })
      assert.equal(usedGlobalFetch, false)
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})

test('a rejected token is reported without leaking its value', async () => {
  await withEnv({ GITHUB_TOKEN: 'secret-token-value' }, async () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = async () => ({ ok: false, status: 401, headers: { get: () => null } })
    try {
      await assert.rejects(
        fetchGithubJson({ get: () => undefined }, 'https://api.github.com/x'),
        (error) => error instanceof Error && !error.message.includes('secret-token-value')
      )
    } finally {
      globalThis.fetch = originalFetch
    }
  })
})
