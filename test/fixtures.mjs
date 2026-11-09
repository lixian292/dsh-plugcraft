import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function writeJson(file, value) {
  writeFileSync(file, JSON.stringify(value, null, 2), 'utf8')
}

/** A minimal but valid DSH plugin bundle for verification tests. */
export function createGoodPackage(root) {
  mkdirSync(join(root, 'locale'), { recursive: true })
  writeJson(join(root, 'package.json'), {
    name: 'dsh-fixture-plugin',
    version: '0.1.0',
    description: 'fixture',
    type: 'module',
    main: 'index.js',
    exports: {
      '.': './index.js',
      './client': './client.js',
      './locale/*.json': './locale/*.json',
      './icon': './icon.svg'
    },
    files: ['index.js', 'client.js', 'cordis.patch.yml', 'locale/*.json', 'icon.svg'],
    dsh: {
      bundle: { patch: './cordis.patch.yml' },
      client: { platform: 'web', inject: [] },
      compatibility: { dshReleases: { '0.2.2-rc.1+': 'compatible' } }
    }
  })
  writeFileSync(join(root, 'cordis.patch.yml'), '- insert:\n    - id: fixture-plugin\n      name: dsh-fixture-plugin\n', 'utf8')
  writeFileSync(join(root, 'index.js'), 'export function apply() {}\n', 'utf8')
  writeFileSync(
    join(root, 'client.js'),
    "window.__ModuleLoader__.load({ id: 'dsh-fixture-plugin', factory(require) { const React = require('react'); return { inject: ['slots'], apply() {} } } })\n",
    'utf8'
  )
  writeJson(join(root, 'locale', 'zh.json'), { meta: { title: '测试插件', description: 'fixture' } })
  writeJson(join(root, 'locale', 'en.json'), { meta: { title: 'Fixture Plugin', description: 'fixture' } })
  writeFileSync(
    join(root, 'icon.svg'),
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#2F6FED"/></svg>\n',
    'utf8'
  )
  return root
}

/** A broken bundle: missing client export/locale/icon and a JS syntax error. */
export function createBadPackage(root) {
  mkdirSync(root, { recursive: true })
  writeJson(join(root, 'package.json'), {
    name: 'dsh-bad-plugin',
    version: '0.1.0',
    type: 'module',
    exports: { '.': './index.js' },
    dsh: {
      bundle: { patch: './cordis.patch.yml' },
      client: { platform: 'web' }
    }
  })
  writeFileSync(join(root, 'cordis.patch.yml'), '- insert:\n    - id: bad\n      name: dsh-bad-plugin\n', 'utf8')
  writeFileSync(join(root, 'index.js'), 'export function apply() { this is broken syntax\n', 'utf8')
  return root
}
