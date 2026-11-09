const ROUTE_PATH = '/workbench/api'
const MAX_BODY_BYTES = 64 * 1024

function errorText(error) {
  return error && typeof error.message === 'string' ? error.message : String(error)
}

function send(res, statusCode, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'content-length': String(Buffer.byteLength(body))
  })
  res.end(body)
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    let size = 0
    req.setEncoding('utf8')
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        reject(new Error('request body is too large'))
        req.destroy()
        return
      }
      body += chunk
    })
    req.on('end', () => {
      if (body === '') {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(body))
      } catch {
        reject(new Error('request body is not valid JSON'))
      }
    })
    req.on('error', reject)
  })
}

function sameOrigin(req) {
  const host = req.headers.host
  if (typeof host !== 'string') return false
  const origin = req.headers.origin
  if (typeof origin === 'string' && origin !== '' && origin !== 'null') {
    try {
      if (new URL(origin).host !== host) return false
    } catch {
      return false
    }
  }
  const site = req.headers['sec-fetch-site']
  if (typeof site === 'string' && site !== 'same-origin' && site !== 'none') return false
  return true
}

function compactTask(task) {
  const handoff = task.handoff && typeof task.handoff === 'object' ? task.handoff : null
  return {
    id: task.id,
    goal: task.goal,
    stage: task.stage,
    candidates: Array.isArray(task.candidates) ? task.candidates.length : 0,
    decision: task.decision === undefined ? null : task.decision.decision,
    gaps: Array.isArray(task.units) ? task.units.filter((unit) => unit !== null && typeof unit === 'object' && unit.gap !== null && unit.gap !== undefined).length : 0,
    handoffStatus: handoff === null ? null : (handoff.status ?? null),
    installStatus: task.install && typeof task.install === 'object' ? (task.install.application ?? null) : null,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  }
}

function fullTask(task) {
  return {
    id: task.id,
    goal: task.goal,
    stage: task.stage,
    spec: task.spec ?? null,
    candidates: Array.isArray(task.candidates) ? task.candidates : [],
    matchReport: task.matchReport ?? null,
    decision: task.decision ?? null,
    units: Array.isArray(task.units) ? task.units : [],
    plan: task.plan ?? null,
    handoff: task.handoff ?? null,
    install: task.install ?? null,
    notes: Array.isArray(task.notes) ? task.notes : [],
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  }
}

/**
 * HTTP surface for the workbench page. The page is same-origin and the data is
 * read-only except for cancel/remove; the route rejects cross-origin calls.
 */
export function registerWorkbenchRoute(ctx, store) {
  const webServer = ctx.get('webServer')
  if (webServer === undefined || typeof webServer.register !== 'function') {
    ctx.logger?.warn?.('[plugin-workbench] no web server service; the workbench page will not receive data')
    return undefined
  }

  async function dispatch(method, args) {
    switch (method) {
      case 'snapshot':
        return {
          version: '0.10.0',
          tasks: store.listTasks().slice(0, 30).map(compactTask),
          dataDir: store.dir
        }
      case 'task': {
        if (typeof args?.taskId !== 'string' || args.taskId === '') throw new Error('taskId is required')
        const task = store.getTask(args.taskId)
        if (task === undefined) throw new Error(`no workbench task "${args.taskId}"`)
        return fullTask(task)
      }
      case 'cancel': {
        if (typeof args?.taskId !== 'string' || args.taskId === '') throw new Error('taskId is required')
        const task = store.updateTask(args.taskId, { stage: 'cancelled' })
        if (task === undefined) throw new Error(`no workbench task "${args.taskId}"`)
        return compactTask(task)
      }
      case 'remove': {
        if (typeof args?.taskId !== 'string' || args.taskId === '') throw new Error('taskId is required')
        const removed = store.removeTask(args.taskId)
        if (removed === false) throw new Error(`no workbench task "${args.taskId}"`)
        return { removed: args.taskId }
      }
      default:
        throw new Error(`unknown workbench method "${String(method)}"`)
    }
  }

  return ctx.effect(() => webServer.register({
    kind: 'prefix',
    path: ROUTE_PATH,
    handler: async (req, res) => {
      if (!sameOrigin(req)) {
        send(res, 403, { ok: false, error: 'cross-origin request rejected' })
        return
      }
      if (req.method !== 'POST') {
        send(res, 405, { ok: false, error: 'method not allowed' })
        return
      }
      try {
        const payload = await readJsonBody(req)
        const result = await dispatch(payload?.method, payload?.args)
        send(res, 200, { ok: true, result })
      } catch (error) {
        ctx.logger?.warn?.(`[plugin-workbench] api ${String(req.url)}: ${errorText(error)}`)
        send(res, 200, { ok: false, error: errorText(error) })
      }
    }
  }), 'plugin-workbench: /workbench/api route')
}
