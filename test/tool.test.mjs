import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

import { createGoodPackage } from './fixtures.mjs'

/**
 * End-to-end tool test with fake Host services: no DSH host and no network.
 * Builds a temporary DSH_HOME (with a cached market catalog) before importing
 * the host half, because the store resolves its data directory at apply time.
 */

const home = mkdtempSync(join(tmpdir(), 'dsh-workbench-tool-'))
process.env.DSH_HOME = home
const cacheDir = join(home, 'plugin-workbench', 'cache')
mkdirSync(cacheDir, { recursive: true })
writeFileSync(
  join(cacheDir, 'market.json'),
  JSON.stringify({
    fetchedAt: Date.now(),
    total: 1,
    plugins: [
      {
        source: 'market',
        name: 'dsh-todo-market',
        repo: 'market/dsh-todo-market',
        url: 'https://github.com/market/dsh-todo-market',
        description: 'Todo list plugin with local storage',
        stars: 42,
        topics: ['todo'],
        installSpec: 'github:market/dsh-todo-market',
        isDshPlugin: true
      }
    ]
  }),
  'utf8'
)

const captured = { tools: [], skills: [], commands: [], routes: [] }

function makeCtx() {
  const services = {
    tools: { register(definition) { captured.tools.push(definition); return () => {} } },
    skills: { register(skill) { captured.skills.push(skill); return () => {} } },
    commands: { register(command) { captured.commands.push(command); return () => {} } },
    webServer: { register(route) { captured.routes.push(route); return () => {} } },
    pluginManager: { async listBundles() { return [] } },
    web: {
      async fetch({ url }) {
        if (String(url).includes('api.github.com')) {
          return {
            statusCode: 200,
            truncated: false,
            body: {
              kind: 'text',
              content: JSON.stringify({
                items: [
                  {
                    full_name: 'someone/dsh-todo',
                    name: 'dsh-todo',
                    html_url: 'https://github.com/someone/dsh-todo',
                    description: 'todo plugin for DeepSeek Harness',
                    stargazers_count: 120,
                    pushed_at: '2026-10-01T00:00:00Z',
                    license: { spdx_id: 'MIT' },
                    topics: ['dsh-plugin', 'todo']
                  }
                ]
              })
            }
          }
        }
        throw new Error(`unexpected fetch ${url}`)
      },
      async search() {
        return { sources: [] }
      }
    }
  }
  const ctx = {
    logger: { info() {}, warn() {}, error() {} },
    get(name) {
      return services[name]
    },
    effect(fn, label) {
      const disposer = fn()
      assert.equal(typeof disposer, 'function', `effect ${label} must return a disposer`)
      return disposer
    },
    inject(deps, callback) {
      const scoped = { logger: ctx.logger, effect: ctx.effect, get: ctx.get }
      for (const name of deps) scoped[name] = services[name]
      return callback(scoped)
    }
  }
  return ctx
}

const { apply } = await import('../host/index.js')
apply(makeCtx())

test('apply registers the tool, skill, command and page route', () => {
  assert.equal(captured.tools.length, 1)
  assert.equal(captured.tools[0].name, 'plugin_workbench')
  assert.equal(captured.skills.length, 1)
  assert.equal(captured.skills[0].name, 'plugin-workbench')
  assert.equal(captured.commands.length, 1)
  assert.equal(captured.commands[0].name, 'workbench')
  assert.equal(captured.routes.length, 1)
  assert.equal(captured.routes[0].path, '/workbench/api')
})

test('the skill registration carries the runtime source field', () => {
  assert.equal(typeof captured.skills[0].source, 'string')
  assert.ok(captured.skills[0].source.length > 0)
})

test('a task walks start → spec → search → decision → decomposition', async () => {
  const tool = captured.tools[0]
  const started = await tool.execute({ action: 'start', goal: 'todo plugin for DSH' }, {})
  assert.equal(started.ok, true)
  const taskId = started.taskId

  const spec = await tool.execute(
    { action: 'update_spec', taskId, spec: { surface: 'client view', mustCapabilities: ['todo'], acceptance: ['list renders'] } },
    {}
  )
  assert.equal(spec.stage, 'spec_ready')

  const search = await tool.execute({ action: 'search', taskId }, {})
  assert.equal(search.ok, true)
  assert.equal(search.stage, 'shortlist')
  assert.equal(search.githubAuth, 'anonymous')
  assert.ok(search.candidates.length > 0)
  const candidateId = search.candidates[0].id

  const decision = await tool.execute({ action: 'record_decision', taskId, decision: 'use_as_is', candidateId }, {})
  assert.equal(decision.stage, 'decided')

  const plan = await tool.execute({ action: 'handoff', taskId, route: 'install' }, {})
  assert.equal(plan.ok, true)
  assert.equal(plan.stage, 'build_ready')
  assert.ok(typeof plan.plan.packageSpec === 'string' && plan.plan.packageSpec.length > 0)
})

test('verify + record_install close the task', async () => {
  const tool = captured.tools[0]
  const started = await tool.execute({ action: 'start', goal: 'another todo plugin' }, {})
  const taskId = started.taskId
  const root = mkdtempSync(join(tmpdir(), 'dsh-workbench-pkg-'))
  try {
    createGoodPackage(root)
    const verified = await tool.execute({ action: 'verify', taskId, packageDir: root }, {})
    assert.equal(verified.ok, true)
    assert.equal(verified.stage, 'verifying')
    assert.equal(verified.failed.length, 0)

    const installed = await tool.execute({ action: 'record_install', taskId, application: 'applied', packageName: 'dsh-fixture-plugin' }, {})
    assert.equal(installed.stage, 'done')

    const status = await tool.execute({ action: 'status', taskId }, {})
    assert.equal(status.stage, 'done')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('invalid actions and arguments are rejected without throwing', async () => {
  const tool = captured.tools[0]
  const unknown = await tool.execute({ action: 'nope' }, {})
  assert.equal(unknown.ok, false)
  const badDecision = await tool.execute({ action: 'start', goal: 'x' }, {})
  const record = await tool.execute({ action: 'record_decision', taskId: badDecision.taskId, decision: 'nope' }, {})
  assert.equal(record.ok, false)
  const badInstall = await tool.execute({ action: 'record_install', taskId: badDecision.taskId, application: 'nope' }, {})
  assert.equal(badInstall.ok, false)
})

test.after(() => {
  rmSync(home, { recursive: true, force: true })
})
