import { registerWorkbenchRoute } from './api.js'
import { createMarketCatalog } from './market.js'
import { SKILL_CONTENT, SKILL_DESCRIPTION } from './skill.js'
import { createWorkbenchStore } from './store.js'
import { createWorkbenchTool } from './tool.js'

const SKILL_NAME = 'plugin-workbench'

function errorText(error) {
  return error && typeof error.message === 'string' ? error.message : String(error)
}

/**
 * Host half of the workbench: persistent task store, the `plugin_workbench`
 * tool, the on-demand skill, a small `/workbench` command and the page API.
 *
 * Every registration below waits for its service with `ctx.inject(...)`
 * instead of reading it once during `apply`: on a fresh boot the web server
 * (and, on other deployments, the tool/skill registries) can come up after
 * this plugin, and a one-shot `ctx.get()` would silently skip the route.
 */
export function apply(ctx) {
  const store = createWorkbenchStore(ctx.logger)
  const marketCatalog = createMarketCatalog(ctx.logger)

  ctx.inject(['skills'], (scoped) => {
    scoped.effect(
      () =>
        scoped.get('skills').register({
          name: SKILL_NAME,
          description: SKILL_DESCRIPTION,
          // `source` is required when the registry materializes a loaded skill;
          // omitting it makes `skill(plugin-workbench)` fail validation.
          source: 'plugin-workbench',
          content: SKILL_CONTENT
        }),
      'plugin-workbench: skill'
    )
  })

  ctx.inject(['tools'], (scoped) => {
    scoped.effect(
      () => scoped.get('tools').register(createWorkbenchTool({ ctx: scoped, store, marketCatalog })),
      'plugin-workbench: tool'
    )
  })

  ctx.inject(['commands'], (scoped) => {
    scoped.effect(
      () =>
        scoped.get('commands').register({
          name: 'workbench',
          description: 'Show plugin-workbench tasks and their current stage',
          input: { hint: '[list] · leave empty for the latest task' },
          handler: ({ rawInput }) => {
            const input = typeof rawInput === 'string' ? rawInput.trim() : ''
            try {
              if (input === 'list') {
                const tasks = store.listTasks().slice(0, 8)
                if (tasks.length === 0) return { kind: 'success', text: 'No plugin-workbench tasks yet.' }
                return {
                  kind: 'success',
                  text: tasks.map((task) => `${task.id} · ${task.stage} · ${task.goal.slice(0, 60)}`).join('\n')
                }
              }
              const task = store.latestTask()
              if (task === undefined) return { kind: 'success', text: 'No plugin-workbench tasks yet. Describe the plugin you want in chat to start one.' }
              return {
                kind: 'success',
                text: [
                  `Task: ${task.id}`,
                  `Stage: ${task.stage}`,
                  `Goal: ${task.goal}`,
                  `Candidates: ${(task.candidates ?? []).length}`,
                  `Decision: ${task.decision ? task.decision.decision : 'not decided'}`,
                  `Gaps: ${Array.isArray(task.units) ? task.units.filter((unit) => unit.gap !== null).length : 0}`
                ].join('\n')
              }
            } catch (error) {
              return { kind: 'error', text: `plugin-workbench: ${errorText(error)}` }
            }
          }
        }),
      'plugin-workbench: /workbench command'
    )
  })

  ctx.inject(['webServer'], (scoped) => {
    registerWorkbenchRoute(scoped, store)
  })

  ctx.logger?.info?.(`[plugin-workbench] host ready (data: ${store.file})`)
}

