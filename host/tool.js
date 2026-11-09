import { hasGithubToken } from './github.js'
import { buildInstallPlan, HandoffError, startCreator } from './handoff.js'
import { buildQueries, extractKeywords, rankCandidates, searchGithub, searchInstalled, searchMarket, searchWeb } from './search.js'
import { verifyPackage } from './verify.js'

const ACTIONS = [
  'start',
  'update_spec',
  'search',
  'get_report',
  'record_decision',
  'set_decomposition',
  'verify',
  'record_install',
  'status',
  'cancel',
  'handoff'
]

const DECISIONS = ['use_as_is', 'diy', 'reference_only', 'from_scratch', 'rerun_search']

const TOP_K = 8

function errorText(error) {
  return error && typeof error.message === 'string' ? error.message : String(error)
}

function ok(value) {
  return { ok: true, ...value }
}

function fail(code, message, hint) {
  return { ok: false, code, message, ...(hint === undefined ? {} : { hint }) }
}

/** Tool results must be lossless JSON: drop undefined and non-finite values. */
function toLossless(value) {
  try {
    const text = JSON.stringify(value)
    return text === undefined ? null : JSON.parse(text)
  } catch {
    return fail('INTERNAL_ERROR', 'tool result was not serializable')
  }
}

function requireTask(store, taskId) {
  if (typeof taskId !== 'string' || taskId === '') {
    return { error: fail('MISSING_TASK', 'taskId is required for this action') }
  }
  const task = store.getTask(taskId)
  if (task === undefined) {
    return { error: fail('UNKNOWN_TASK', `no workbench task "${taskId}"`) }
  }
  return { task }
}

function compactCandidate(candidate) {
  return {
    id: candidate.id,
    source: candidate.source,
    name: candidate.name,
    url: candidate.url || candidate.repo || '',
    stars: candidate.stars,
    score: candidate.score,
    isDshPlugin: candidate.isDshPlugin === true
  }
}

function detailedCandidate(candidate) {
  return {
    ...compactCandidate(candidate),
    description: candidate.description,
    topics: candidate.topics,
    license: candidate.license,
    updatedAt: candidate.updatedAt,
    installSpec: candidate.installSpec
  }
}

async function runSearch(ctx, store, task, explicitQuery, marketCatalog) {
  const keywords = extractKeywords(`${task.goal} ${task.spec ? JSON.stringify(task.spec) : ''} ${explicitQuery ?? ''}`)
  const queries = buildQueries(task.goal, explicitQuery)
  const errors = []
  const collected = []
  const counts = { installed: 0, market: 0, github: 0, web: 0 }
  let auth = 'anonymous'

  try {
    const installed = await searchInstalled(ctx.get('pluginManager'))
    collected.push(...installed.candidates)
    counts.installed = installed.candidates.length
  } catch (error) {
    errors.push(`installed: ${errorText(error)}`)
  }

  try {
    const market = await searchMarket(marketCatalog, keywords)
    collected.push(...market.candidates)
    counts.market = market.total
  } catch (error) {
    errors.push(`market: ${errorText(error)}`)
  }

  try {
    const github = await searchGithub(ctx, queries)
    collected.push(...github.candidates)
    counts.github = github.candidates.length
    errors.push(...github.errors)
    auth = github.auth
  } catch (error) {
    errors.push(`github: ${errorText(error)}`)
  }

  // If the repository search produced nothing usable, fall back to the
  // configured web search so a transient GitHub failure still yields leads.
  if (collected.length === 0) {
    try {
      const web = await searchWeb(ctx.get('web'), `${task.goal} dsh plugin`)
      collected.push(...web.candidates)
      counts.web = web.total
    } catch (error) {
      errors.push(`web: ${errorText(error)}`)
    }
  }

  const ranked = rankCandidates(collected, keywords, TOP_K).map((candidate, index) => ({
    ...candidate,
    id: `c${index + 1}`
  }))
  return { keywords, queries, counts, errors, candidates: ranked, auth, sourcesTried: ['installed', 'market', 'github', 'web'] }
}

function summarizeReport(task) {
  const report = task.matchReport ?? {}
  return {
    taskId: task.id,
    goal: task.goal,
    stage: task.stage,
    counts: report.counts ?? {},
    errors: report.errors ?? [],
    candidates: (task.candidates ?? []).map(detailedCandidate),
    ...(task.decision === undefined ? {} : { decision: task.decision }),
    ...(task.units === undefined ? {} : { units: task.units }),
    ...(task.plan === undefined ? {} : { plan: task.plan }),
    ...(task.handoff === undefined ? {} : { handoff: task.handoff })
  }
}

/** Build the registry-ready tool definition (plain object; no Harness imports). */
export function createWorkbenchTool({ ctx, store, marketCatalog }) {
  async function dispatch(args, exec) {
    const action = args && typeof args.action === 'string' ? args.action : ''
    if (!ACTIONS.includes(action)) {
      return fail('UNKNOWN_ACTION', `action must be one of: ${ACTIONS.join(', ')}`)
    }

    if (action === 'start') {
      const goal = typeof args.goal === 'string' ? args.goal.trim() : ''
      if (goal === '') return fail('MISSING_GOAL', 'start requires a goal string describing the plugin need')
      const task = store.createTask(goal)
      return ok({
        taskId: task.id,
        stage: task.stage,
        next: 'Fill the structured spec with action=update_spec (goal, surface, mustCapabilities, acceptance), then call action=search.'
      })
    }

    if (action === 'status') {
      const task = typeof args.taskId === 'string' && args.taskId !== '' ? store.getTask(args.taskId) : store.latestTask()
      if (task === undefined) return fail('NO_TASK', 'there is no workbench task yet; call action=start first')
      return ok({
        taskId: task.id,
        goal: task.goal,
        stage: task.stage,
        candidates: (task.candidates ?? []).length,
        decision: task.decision,
        units: Array.isArray(task.units) ? task.units.length : 0,
        githubAuth: hasGithubToken() ? 'token' : 'anonymous',
        updatedAt: task.updatedAt
      })
    }

    const required = requireTask(store, args.taskId)
    if (required.error !== undefined) return required.error
    const task = required.task

    if (action === 'update_spec') {
      const spec = args.spec
      if (spec === null || typeof spec !== 'object' || Array.isArray(spec)) {
        return fail('INVALID_SPEC', 'update_spec requires a spec object')
      }
      store.updateTask(task.id, { spec, stage: 'spec_ready' })
      return ok({ taskId: task.id, stage: 'spec_ready', next: 'Call action=search to run the reuse search.' })
    }

    if (action === 'search') {
      const result = await runSearch(ctx, store, task, args.query, marketCatalog)
      store.updateTask(task.id, {
        stage: 'shortlist',
        candidates: result.candidates,
        matchReport: {
          keywords: result.keywords,
          queries: result.queries,
          counts: result.counts,
          errors: result.errors,
          auth: result.auth,
          sourcesTried: result.sourcesTried,
          at: new Date().toISOString()
        }
      })
      return ok({
        taskId: task.id,
        stage: 'shortlist',
        counts: result.counts,
        githubAuth: result.auth,
        errors: result.errors.slice(0, 4),
        candidates: result.candidates.map(compactCandidate),
        next: 'Review the candidates, then ask the user with ask_user_question: use_as_is / diy / reference_only / from_scratch. Use action=get_report for full candidate details and action=record_decision with the answer.'
      })
    }

    if (action === 'get_report') {
      return ok({ taskId: task.id, report: summarizeReport(task) })
    }

    if (action === 'record_decision') {
      const decision = args.decision
      if (!DECISIONS.includes(decision)) {
        return fail('INVALID_DECISION', `decision must be one of: ${DECISIONS.join(', ')}`)
      }
      const candidateId = typeof args.candidateId === 'string' ? args.candidateId : undefined
      if (candidateId !== undefined && !(task.candidates ?? []).some((candidate) => candidate.id === candidateId)) {
        return fail('UNKNOWN_CANDIDATE', `no candidate "${candidateId}" in task ${task.id}`)
      }
      const decisionRecord = {
        decision,
        candidateId,
        note: typeof args.note === 'string' ? args.note.slice(0, 500) : undefined,
        at: new Date().toISOString()
      }
      store.updateTask(task.id, { decision: decisionRecord, stage: 'decided' })
      const next = decision === 'rerun_search'
        ? 'Call action=search again with a new query.'
        : 'For reuse/diy/from_scratch, record capability units with action=set_decomposition (each unit: name, must, acceptance, reuse or gap).'
      return ok({ taskId: task.id, stage: 'decided', decision: decisionRecord, next })
    }

    if (action === 'set_decomposition') {
      const units = Array.isArray(args.units) ? args.units : []
      if (units.length === 0) {
        return fail('INVALID_UNITS', 'set_decomposition requires a non-empty units array')
      }
      const normalized = units.slice(0, 20).map((unit, index) => ({
        id: typeof unit?.id === 'string' && unit.id !== '' ? unit.id : `U${index + 1}`,
        name: typeof unit?.name === 'string' ? unit.name.slice(0, 160) : `Unit ${index + 1}`,
        must: unit?.must !== false,
        acceptance: typeof unit?.acceptance === 'string' ? unit.acceptance.slice(0, 300) : '',
        reuse: unit?.reuse === undefined ? null : unit.reuse,
        gap: typeof unit?.gap === 'string' && unit.gap !== '' ? unit.gap.slice(0, 300) : null
      }))
      const gaps = normalized.filter((unit) => unit.gap !== null).length
      store.updateTask(task.id, {
        units: normalized,
        stage: 'planned',
        plan: {
          route: task.decision?.decision === 'use_as_is' ? 'install'
            : task.decision?.decision === 'from_scratch' ? 'create'
              : 'fork',
          gaps,
          at: new Date().toISOString()
        }
      })
      return ok({
        taskId: task.id,
        stage: 'planned',
        units: normalized.length,
        gaps,
        next: 'Report the reuse map and gap list to the user, then call action=handoff when they confirm the plan. Installation always needs explicit user confirmation.'
      })
    }

    if (action === 'cancel') {
      store.updateTask(task.id, { stage: 'cancelled' })
      return ok({ taskId: task.id, stage: 'cancelled' })
    }

    if (action === 'verify') {
      const packageDir = typeof args.packageDir === 'string' ? args.packageDir.trim() : ''
      if (packageDir === '') {
        return fail('MISSING_PACKAGE_DIR', 'verify requires packageDir (the generated plugin directory)', 'Pass the directory the Creator wrote, e.g. .dsh-created-plugins/<packageName>.')
      }
      try {
        const report = verifyPackage(packageDir)
        const validation = {
          ok: report.ok,
          name: report.name,
          version: report.version,
          checks: report.checks,
          warnings: report.warnings,
          at: new Date().toISOString()
        }
        const handoff = task.handoff !== null && task.handoff !== undefined && typeof task.handoff === 'object'
          ? { ...task.handoff, packageDir: report.packageDir, validation }
          : { route: 'create', packageDir: report.packageDir, validation, status: 'done' }
        store.updateTask(task.id, {
          stage: report.ok ? 'verifying' : 'verification_failed',
          handoff
        })
        return ok({
          taskId: task.id,
          stage: report.ok ? 'verifying' : 'verification_failed',
          packageDir: report.packageDir,
          name: report.name,
          version: report.version,
          failed: report.checks.filter((check) => !check.ok).map((check) => ({ id: check.id, label: check.label, detail: check.detail })),
          warnings: report.warnings,
          checks: report.checks.length,
          next: report.ok
            ? 'The generated package passed structural verification. Report the result and ask the user whether to install it through the plugin_manager tool.'
            : 'Verification failed. Report the failed checks, fix the package (or send the failed checks back to the Creator), then run verify again before any installation.'
        })
      } catch (error) {
        return fail('VERIFY_FAILED', errorText(error))
      }
    }

    if (action === 'record_install') {
      const application = typeof args.application === 'string' ? args.application : ''
      const allowed = ['applied', 'restart-required', 'failed', 'overridden', 'cancelled']
      if (!allowed.includes(application)) {
        return fail('INVALID_APPLICATION', `application must be one of: ${allowed.join(', ')}`, 'Pass the `application` value returned by the plugin_manager tool.')
      }
      const install = {
        application,
        packageName: typeof args.packageName === 'string' ? args.packageName.slice(0, 160) : undefined,
        version: typeof args.version === 'string' ? args.version.slice(0, 60) : undefined,
        note: typeof args.note === 'string' ? args.note.slice(0, 500) : undefined,
        at: new Date().toISOString()
      }
      const stage = application === 'failed' ? 'install_failed' : 'done'
      store.updateTask(task.id, { stage, install })
      return ok({
        taskId: task.id,
        stage,
        application,
        next: application === 'failed'
          ? 'Installation failed. Report the failure to the user and keep the task open for a retry.'
          : 'Task complete. Report the final result: reused plugin, installed package, and which application state the host returned.'
      })
    }

    if (action === 'handoff') {
      const route = typeof args.route === 'string' ? args.route : ''
      if (!['install', 'fork', 'create'].includes(route)) {
        return fail('INVALID_ROUTE', 'handoff requires route: install | fork | create')
      }
      try {
        if (route === 'install') {
          const plan = buildInstallPlan(task)
          store.updateTask(task.id, {
            stage: 'build_ready',
            plan: { ...(task.plan ?? {}), route: 'install', install: plan, at: new Date().toISOString() }
          })
          return ok({
            taskId: task.id,
            stage: 'build_ready',
            route,
            plan,
            next: 'The user must confirm installing this third-party plugin. Then call the plugin_manager tool with action=install_bundle and target=packageSpec, and report its application value; never claim success before that.'
          })
        }
        if (!Array.isArray(task.units) || task.units.length === 0) {
          return fail('NOT_PLANNED', 'handoff for fork/create requires a recorded decomposition first', 'Call action=set_decomposition before handing off.')
        }
        const started = await startCreator({
          ctx,
          store,
          task,
          exec,
          route,
          packageName: typeof args.packageName === 'string' ? args.packageName : undefined
        })
        return ok({
          taskId: task.id,
          stage: 'building',
          route,
          ...started,
          next: 'The Creator sub-agent is running in its own context. Do not poll it; wait for its completion notice, then verify the produced package before any installation. Installation always needs explicit user confirmation.'
        })
      } catch (error) {
        if (error instanceof HandoffError) return fail(error.code, error.message, error.hint)
        return fail('HANDOFF_FAILED', errorText(error))
      }
    }

    return fail('UNKNOWN_ACTION', `action "${action}" is not implemented`)
  }

  return {
    name: 'plugin_workbench',
    description:
      'Reuse-first plugin authoring pipeline for DeepSeek Harness. Use this instead of ad-hoc web research whenever the user wants to build a DSH plugin or asks whether an existing plugin already covers a need. ' +
      'Flow: start → update_spec → search → (ask the user with ask_user_question) → record_decision → set_decomposition → handoff → verify. ' +
      'Handoff is gated on explicit user confirmation: route=install returns the exact package spec to apply through the plugin_manager tool; route=fork/create starts a Creator sub-agent in its own context. ' +
      'After a Creator run, call verify with the generated packageDir: the Host checks the bundle structure and parses its JavaScript without executing it. ' +
      'The Host does the retrieval and returns compact summaries; keep full reports out of chat (use get_report only when needed) and never claim a plugin is installed without user confirmation.',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ACTIONS,
          description: 'Pipeline operation to run.'
        },
        taskId: {
          type: 'string',
          description: 'Workbench task id returned by action=start. Required except for start/status.'
        },
        goal: {
          type: 'string',
          description: 'For start: the user plugin need in one or two sentences.'
        },
        query: {
          type: 'string',
          description: 'For search: optional extra search query; defaults to keywords from the goal/spec.'
        },
        spec: {
          type: 'object',
          additionalProperties: true,
          description: 'For update_spec: structured requirement { goal, surface, mustCapabilities, acceptance, constraints, clarifications }.'
        },
        decision: {
          type: 'string',
          enum: DECISIONS,
          description: 'For record_decision: the user choice after reviewing candidates.'
        },
        candidateId: {
          type: 'string',
          description: 'For record_decision: candidate id chosen for reuse (c1, c2, ...).'
        },
        units: {
          type: 'array',
          description: 'For set_decomposition: capability units, each { id?, name, must?, acceptance?, reuse?, gap? }.',
          items: { type: 'object', additionalProperties: true }
        },
        route: {
          type: 'string',
          enum: ['install', 'fork', 'create'],
          description: 'For handoff: install borrows an existing plugin (returns the install spec); fork adapts a candidate; create builds from scratch.'
        },
        packageName: {
          type: 'string',
          description: 'Optional npm-style package name: for handoff route=fork/create it names the generated plugin; for record_install it reports the installed package.'
        },
        packageDir: {
          type: 'string',
          description: 'For verify: directory of the generated plugin bundle to validate (e.g. .dsh-created-plugins/<packageName>).'
        },
        application: {
          type: 'string',
          enum: ['applied', 'restart-required', 'failed', 'overridden', 'cancelled'],
          description: 'For record_install: the application value returned by the plugin_manager tool.'
        },
        version: {
          type: 'string',
          description: 'Optional installed version.'
        },
        note: {
          type: 'string',
          description: 'Optional short note stored with the task.'
        }
      },
      required: ['action'],
      additionalProperties: false
    },
    output: {
      schema: { type: 'object' },
      render(_args, value) {
        let text
        try {
          text = JSON.stringify(value)
        } catch {
          text = String(value)
        }
        if (typeof text !== 'string') text = String(value)
        return [{ type: 'text', text: text.length > 12000 ? `${text.slice(0, 12000)}…(truncated)` : text }]
      }
    },
    async execute(args, exec) {
      try {
        return toLossless(await dispatch(args ?? {}, exec))
      } catch (error) {
        ctx.logger?.warn?.(`[plugin-workbench] tool execution failed: ${errorText(error)}`)
        return fail('INTERNAL_ERROR', errorText(error))
      }
    }
  }
}
