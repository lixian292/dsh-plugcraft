/**
 * Creator handoff: turn a workbench task into either a ready-to-run install
 * instruction or an isolated Creator sub-agent task.
 *
 * Host rules:
 * - Installation is never silent. The `install` route only returns the exact
 *   spec; the agent applies it through the approval-gated `plugin_manager`
 *   tool after the user confirms.
 * - Generation runs in a sub-agent with the `cordis` preset so the parent
 *   conversation only receives a completion notice.
 */

export class HandoffError extends Error {
  constructor(code, message, hint) {
    super(message)
    this.name = 'HandoffError'
    this.code = code
    this.hint = hint
  }
}

function candidateOf(task) {
  const candidates = Array.isArray(task.candidates) ? task.candidates : []
  const decidedId = task.decision && typeof task.decision === 'object' ? task.decision.candidateId : undefined
  return candidates.find((candidate) => candidate.id === decidedId) ?? candidates[0]
}

function slugify(text) {
  const ascii = String(text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32)
  return ascii !== '' ? ascii : 'plugin'
}

/** Build the install instruction returned for `route: "install"`. */
export function buildInstallPlan(task) {
  const candidate = candidateOf(task)
  if (candidate === undefined) {
    throw new HandoffError('NO_CANDIDATE', 'this task has no candidate to install', 'Run action=search and let the user pick a candidate first.')
  }
  if (candidate.source === 'installed') {
    return {
      mode: 'already_installed',
      packageSpec: '',
      candidate: {
        id: candidate.id,
        name: candidate.name,
        url: candidate.url ?? '',
        description: candidate.description ?? ''
      },
      steps: [
        'The selected plugin is already installed in this profile.',
        'Use it directly (open its page/entry) or ask the user whether to enable or update it.',
        'Only fall back to a new install if the user explicitly wants a different plugin.'
      ],
      cautions: []
    }
  }
  const spec = typeof candidate.installSpec === 'string' && candidate.installSpec !== ''
    ? candidate.installSpec
    : typeof candidate.repo === 'string' && candidate.repo !== ''
      ? `github:${candidate.repo}`
      : ''
  if (spec === '') {
    throw new HandoffError('NO_INSTALL_SPEC', `candidate "${candidate.name}" has no install spec`, 'Ask the user to confirm the plugin is installable, or fall back to route=fork/create.')
  }
  return {
    mode: 'install',
    packageSpec: spec,
    candidate: {
      id: candidate.id,
      name: candidate.name,
      url: candidate.url ?? '',
      description: candidate.description ?? ''
    },
    steps: [
      'Ask the user to confirm installing this third-party plugin.',
      'Call the plugin_manager tool with action=install_bundle and target set to the package spec below.',
      'Verify the reported application value (applied / restart-required / failed) and tell the user which one happened.',
      'Never claim the plugin is installed before plugin_manager reports success.'
    ],
    cautions: [
      'Third-party code: installing grants it the same host privileges as other plugins.',
      'Check the license in the candidate repository when redistribution matters.'
    ]
  }
}

function formatSpec(task) {
  const spec = task.spec
  if (spec === null || typeof spec !== 'object') return '(none)'
  const lines = []
  if (spec.goal) lines.push(`- goal: ${spec.goal}`)
  if (spec.surface) lines.push(`- surface: ${spec.surface}`)
  for (const key of ['mustCapabilities', 'acceptance', 'constraints']) {
    const list = Array.isArray(spec[key]) ? spec[key].filter((item) => typeof item === 'string') : []
    if (list.length > 0) lines.push(`- ${key}: ${list.join(' | ')}`)
  }
  return lines.length > 0 ? lines.join('\n') : '(none)'
}

function formatReuse(task) {
  const units = Array.isArray(task.units) ? task.units : []
  const reuse = units.filter((unit) => unit.reuse !== null && unit.reuse !== undefined)
  if (reuse.length === 0) return '(no reused parts recorded)'
  return reuse
    .map((unit) => `- ${unit.name}: ${typeof unit.reuse === 'string' ? unit.reuse : JSON.stringify(unit.reuse)}`)
    .join('\n')
}

function formatGaps(task) {
  const units = Array.isArray(task.units) ? task.units : []
  const gaps = units.filter((unit) => typeof unit.gap === 'string' && unit.gap !== '')
  if (gaps.length === 0) return '(no gaps recorded — confirm the plugin really needs new code before generating)'
  return gaps.map((unit) => `- ${unit.name}: ${unit.gap}`).join('\n')
}

function formatCandidate(task) {
  const candidate = candidateOf(task)
  if (candidate === undefined) return '(none)'
  const parts = [`name: ${candidate.name}`]
  if (candidate.url) parts.push(`url: ${candidate.url}`)
  if (candidate.installSpec) parts.push(`installSpec: ${candidate.installSpec}`)
  return parts.join('\n')
}

/** Build the Creator sub-agent prompt from the confirmed workbench task. */
export function buildCreatorPrompt(task, { route, packageName }) {
  return [
    `You are the Creator sub-agent for a DeepSeek Harness (DSH) plugin task. Route: ${route}.`,
    '',
    '## Accepted requirement',
    formatSpec(task),
    '',
    '## Reuse source (do not rewrite what already works)',
    formatCandidate(task),
    '',
    '## Reuse map',
    formatReuse(task),
    '',
    '## Gaps to implement (the only work you are allowed to add)',
    formatGaps(task),
    '',
    '## Deliverable',
    `Create a DSH plugin bundle at .dsh-created-plugins/${packageName}/ in the current workspace:`,
    '- package.json: name, version 0.1.0, description, type module, exports (must include ./client when dsh.client is declared), files, dsh.bundle.patch, dsh.client if the plugin has a browser half, engines.dsh range.',
    '- cordis.patch.yml: insert one row { id, name }.',
    '- index.js (host half) and client.js (browser half, window.__ModuleLoader__.load({ id, factory }) with React from the module table) when needed.',
    '- locale/en.json and locale/zh.json with meta.title/meta.description; icon.svg (original artwork).',
    '- README.md with install and usage notes.',
    'Follow the official cordis-plugin-development skill (load it with the skill tool) instead of guessing Harness APIs. Do not import Harness client packages from client.js.',
    '',
    '## Verification (must run and report)',
    '- node --check every JavaScript file.',
    '- JSON.parse every JSON file and the YAML patch must be valid YAML.',
    '- The bundle must not require any @deepseek-ai/* import from the host half if avoidable.',
    '- Do NOT install the plugin yourself and do NOT modify the profile. The host installs it after validation.',
    '',
    '## Reply format (final message only)',
    'packageName, files created, verification results, and ready:true or ready:false with the reason.'
  ].join('\n')
}

function defaultPackageName(task) {
  const id = typeof task.id === 'string' ? task.id.slice(-6) : ''
  return `dsh-plugin-${slugify(task.goal)}-${id}`.replace(/-+$/, '')
}

function normalizePackageName(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return undefined
  const value = raw.trim()
  if (!/^(@[a-z0-9-]+\/)?[a-z0-9][a-z0-9._-]{1,60}$/.test(value)) {
    throw new HandoffError('INVALID_PACKAGE_NAME', `"${value}" is not a valid npm package name`, 'Use a lowercase npm-style name such as dsh-plugin-my-thing.')
  }
  return value
}

/**
 * Start a Creator sub-agent. Returns { childId, packageName }.
 * Completion is delivered to the parent agent as a notification; the task's
 * handoff record is updated when the activation settles.
 */
export async function startCreator({ ctx, store, task, exec, route, packageName }) {
  const subagents = ctx.get('subagents')
  if (subagents === undefined || typeof subagents.startActivation !== 'function') {
    throw new HandoffError('NO_SUBAGENTS', 'the sub-agent capability is not available in this profile', 'Report the implementation brief to the user and implement it in the main session instead.')
  }
  const agent = exec && exec.agent !== undefined ? exec.agent : undefined
  if (agent === undefined || agent === null) {
    throw new HandoffError('NO_AGENT', 'the tool call is not attached to an agent', 'Run the handoff from a normal conversation turn.')
  }
  let providers = []
  try {
    providers = subagents.list()
  } catch {
    providers = []
  }
  const provider = Array.isArray(providers) && providers.includes('spawn') ? 'spawn' : Array.isArray(providers) ? providers[0] : undefined
  if (typeof provider !== 'string' || provider === '') {
    throw new HandoffError('NO_PROVIDER', 'no sub-agent provider is available', 'Implement in the main session instead.')
  }
  const finalName = normalizePackageName(packageName) ?? defaultPackageName(task)
  const prompt = buildCreatorPrompt(task, { route, packageName: finalName })
  let activation
  try {
    activation = await subagents.startActivation({
      provider,
      label: `Plugin workbench: ${finalName}`,
      request: {
        prompt: [{ type: 'text', text: prompt }],
        parent: agent,
        ...(provider === 'spawn' ? { agentPreset: 'cordis' } : {})
      },
      delivery: 'parent'
    })
  } catch (error) {
    const message = error && typeof error.message === 'string' ? error.message : String(error)
    throw new HandoffError('ACTIVATION_FAILED', message, 'Check the sub-agent limits (maxActiveSubagents) and the cordis preset availability.')
  }

  const handoff = {
    route,
    packageName: finalName,
    childId: typeof activation.childId === 'string' ? activation.childId : null,
    provider,
    status: 'running',
    startedAt: new Date().toISOString()
  }
  store.updateTask(task.id, { stage: 'building', handoff })

  const settle = (status, detail) => {
    const current = store.getTask(task.id)
    if (current === undefined) return
    const previous = current.handoff && typeof current.handoff === 'object' ? current.handoff : handoff
    store.updateTask(task.id, {
      handoff: { ...previous, status, finishedAt: new Date().toISOString(), ...(detail === undefined ? {} : { detail }) }
    })
  }
  try {
    const result = activation.result
    if (result !== null && typeof result === 'object' && typeof result.then === 'function') {
      result.then(() => settle('done')).catch((error) => settle('failed', error && typeof error.message === 'string' ? error.message : String(error)))
    }
  } catch {
    // A settle callback is best-effort bookkeeping; the parent notification is owned by the sub-agent layer.
  }

  return { childId: handoff.childId, packageName: finalName, provider }
}
