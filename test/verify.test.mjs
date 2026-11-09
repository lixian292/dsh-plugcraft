import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

import { verifyPackage } from '../host/verify.js'
import { createBadPackage, createGoodPackage } from './fixtures.mjs'

function tempRoot() {
  return mkdtempSync(join(tmpdir(), 'dsh-workbench-verify-'))
}

test('a valid bundle passes every structural check', () => {
  const root = tempRoot()
  try {
    createGoodPackage(root)
    const report = verifyPackage(root)
    assert.equal(report.ok, true)
    assert.ok(report.checks.length >= 10)
    assert.equal(report.checks.filter((check) => !check.ok).length, 0, JSON.stringify(report.checks.filter((c) => !c.ok)))
    assert.equal(report.name, 'dsh-fixture-plugin')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('a broken bundle reports the specific failures', () => {
  const root = tempRoot()
  try {
    createBadPackage(root)
    const report = verifyPackage(root)
    assert.equal(report.ok, false)
    const failed = new Set(report.checks.filter((check) => !check.ok).map((check) => check.id))
    for (const id of ['client-export', 'client-entry', 'locale', 'icon', 'js-syntax']) {
      assert.ok(failed.has(id), `expected ${id} to fail, got ${[...failed].join(', ')}`)
    }
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('a UTF-8 BOM in package.json is tolerated', () => {
  const root = tempRoot()
  try {
    createGoodPackage(root)
    const manifestPath = join(root, 'package.json')
    const raw = readFileSync(manifestPath, 'utf8')
    writeFileSync(manifestPath, `\uFEFF${raw}`, 'utf8')
    const report = verifyPackage(root)
    assert.equal(report.ok, true)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('a missing directory fails with one clear check', () => {
  const root = tempRoot()
  try {
    const report = verifyPackage(join(root, 'does-not-exist'))
    assert.equal(report.ok, false)
    assert.equal(report.checks[0].id, 'directory')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
