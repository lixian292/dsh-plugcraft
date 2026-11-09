import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const STATE_VERSION = 1
const TASK_ID_PREFIX = 'wb-'

/** Directory owned by this plugin under the Harness home directory. */
export function workbenchDataDir() {
  const home = process.env.DSH_HOME && process.env.DSH_HOME.trim() !== ''
    ? process.env.DSH_HOME
    : join(homedir(), '.dsh')
  return join(home, 'plugin-workbench')
}

function emptyState() {
  return { version: STATE_VERSION, tasks: {} }
}

function errorText(error) {
  return error && typeof error.message === 'string' ? error.message : String(error)
}

/**
 * Small JSON-backed task store. State is plugin-owned data (not a session
 * event): it survives restarts, but never enters the conversation log.
 */
export function createWorkbenchStore(logger) {
  const dir = workbenchDataDir()
  const file = join(dir, 'state.json')
  let state = load()

  function load() {
    let raw
    try {
      raw = readFileSync(file, 'utf8')
    } catch (error) {
      if (error && error.code !== 'ENOENT') {
        logger?.warn?.(`[plugin-workbench] could not read state: ${errorText(error)}`)
      }
      return emptyState()
    }
    try {
      const parsed = JSON.parse(raw)
      if (
        parsed !== null && typeof parsed === 'object' &&
        parsed.tasks !== null && typeof parsed.tasks === 'object' &&
        !Array.isArray(parsed.tasks) &&
        parsed.version === STATE_VERSION
      ) {
        return parsed
      }
      logger?.warn?.('[plugin-workbench] state file has an unknown shape; starting from an empty state')
    } catch (error) {
      logger?.warn?.(`[plugin-workbench] state file is not valid JSON: ${errorText(error)}`)
    }
    return emptyState()
  }

  function save() {
    try {
      mkdirSync(dir, { recursive: true })
      const tmp = join(dir, `.state-${process.pid}-${Date.now()}.tmp`)
      writeFileSync(tmp, JSON.stringify(state), 'utf8')
      renameSync(tmp, file)
    } catch (error) {
      logger?.warn?.(`[plugin-workbench] could not persist state: ${errorText(error)}`)
    }
  }

  function newTaskId() {
    const rand = Math.random().toString(36).slice(2, 8)
    return `${TASK_ID_PREFIX}${Date.now().toString(36)}-${rand}`
  }

  function listTasks() {
    return Object.values(state.tasks)
      .slice()
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
  }

  function getTask(taskId) {
    if (typeof taskId !== 'string' || taskId === '') return undefined
    return state.tasks[taskId]
  }

  function latestTask() {
    return listTasks()[0]
  }

  function createTask(goal) {
    const now = new Date().toISOString()
    const task = {
      id: newTaskId(),
      goal,
      stage: 'intake',
      spec: undefined,
      candidates: [],
      matchReport: undefined,
      decision: undefined,
      units: undefined,
      plan: undefined,
      errors: [],
      notes: [],
      createdAt: now,
      updatedAt: now
    }
    state.tasks[task.id] = task
    save()
    return task
  }

  function updateTask(taskId, patch) {
    const task = getTask(taskId)
    if (task === undefined) return undefined
    Object.assign(task, patch)
    task.updatedAt = new Date().toISOString()
    save()
    return task
  }

  function appendNote(taskId, note) {
    const task = getTask(taskId)
    if (task === undefined) return undefined
    if (!Array.isArray(task.notes)) task.notes = []
    task.notes.push({ at: new Date().toISOString(), note })
    if (task.notes.length > 50) task.notes = task.notes.slice(-50)
    task.updatedAt = new Date().toISOString()
    save()
    return task
  }

  function removeTask(taskId) {
    if (typeof taskId !== 'string' || taskId === '') return false
    if (state.tasks[taskId] === undefined) return false
    delete state.tasks[taskId]
    save()
    return true
  }

  return { dir, file, listTasks, getTask, latestTask, createTask, updateTask, appendNote, removeTask }
}
