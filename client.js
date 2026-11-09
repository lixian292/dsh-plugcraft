window.__ModuleLoader__.load({
  id: '@lixian292/dsh-plugin-workbench',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'dsh-plugin-workbench'
    const PANEL_ID = 'plugin-workbench'
    const VERSION = '0.9.1'
    const BUILD = '2026-11-09'
    const API_PATH = '/workbench/api'
    const POLL_MS = 4000

    const DICT = {
      zh: {
        'entry.title': '插件工作台',
        'page.title': '插件工作台',
        'page.subtitle': '先复用，再补缺，最后才从零。',
        'page.back': '回到对话',
        'page.preview': 'M4 · v' + VERSION,
        'page.refresh': '刷新',
        'page.reload': '重载界面',
        'page.loading': '正在读取工作台…',
        'page.error': '读取失败',
        'page.retry': '重试',
        'page.autoRefresh': '每 4 秒自动刷新',
        'page.lastSync': '更新于',
        'page.empty.title': '还没有进行中的插件任务',
        'page.empty.desc': '插件工作台会先帮你找现成实现，再决定复用方式，最后才让你从零写。',
        'page.empty.example': '帮我做一个能在 DSH 里管理每日待办、并把数据存在本地的插件。',
        'page.empty.step1': '在任意对话里描述你的插件需求（一句话即可）。',
        'page.empty.step2': 'Agent 会加载工作台技能，依次完成澄清、检索与四选一决策。',
        'page.empty.step3': '回到这个页面，查看候选实现、匹配报告和最终复用计划。',
        'page.tasks': '任务',
        'page.noTasks': '暂无任务',
        'page.selectTask': '选择左侧任务查看详情',
        'page.detailLoading': '正在读取任务…',
        'label.goal': '需求',
        'label.created': '创建',
        'label.updated': '更新',
        'label.stage': '阶段',
        'label.spec': '需求规格',
        'label.surface': '落点',
        'label.must': '必须能力',
        'label.acceptance': '验收标准',
        'label.constraints': '约束',
        'label.candidates': '候选实现',
        'label.matchReport': '检索报告',
        'label.decision': '用户决策',
        'label.units': '能力单元',
        'label.plan': '实现计划',
        'label.handoff': '实现交接',
        'label.packageName': '包名',
        'label.childId': '子代理',
        'label.steps': '步骤',
        'label.errors': '错误',
        'label.installSpec': '安装方式',
        'label.stars': '星标',
        'label.score': '评分',
        'label.reuse': '复用',
        'label.gap': '缺口',
        'label.route': '路线',
        'label.validation': '结构校验',
        'validation.passed': '通过',
        'validation.failed': '失败',
        'validation.warnings': '提醒',
        'validation.checks': '检查项',
        'label.installResult': '安装结果',
        'install.applied': '已安装',
        'install.restart-required': '待重启生效',
        'install.failed': '安装失败',
        'install.overridden': '被更高优先级覆盖',
        'install.cancelled': '已取消安装',
        'label.taskId': '任务 ID',
        'label.dataDir': '数据目录',
        'label.build': '构建',
        'label.sources': '来源',
        'label.none': '—',
        'value.cancelled': '已取消',
        'value.noDecision': '尚未决策',
        'value.noCandidates': '没有候选实现',
        'value.noUnits': '尚未解构',
        'value.noSpec': '尚未填写',
        'value.noGaps': '无缺口',
        'value.optional': '可选',
        'action.cancel': '取消任务',
        'action.remove': '删除任务',
        'action.confirmRemove': '确定从工作台删除这个任务吗？只删除工作台记录，不影响任何已安装插件。',
        'action.confirmCancel': '确定取消这个任务吗？',
        'decision.use_as_is': '直接使用',
        'decision.diy': '基于它 DIY',
        'decision.reference_only': '仅参考',
        'decision.from_scratch': '从零开始',
        'decision.rerun_search': '换一批检索',
        'stage.intake': '需求澄清',
        'stage.spec_ready': '需求已明确',
        'stage.shortlist': '候选已就绪',
        'stage.decided': '已决策',
        'stage.planned': '计划就绪',
        'stage.build_ready': '安装就绪',
        'stage.building': '实现中',
        'stage.verifying': '验证中',
        'stage.verification_failed': '验证失败',
        'stage.install_failed': '安装失败',
        'stage.done': '已完成',
        'stage.cancelled': '已取消',
        'steps.clarify.title': '需求澄清',
        'steps.clarify.desc': '目标与验收',
        'steps.search.title': '检索复用',
        'steps.search.desc': '已装 / 市场 / GitHub',
        'steps.decide.title': '匹配决策',
        'steps.decide.desc': '直接用 / DIY / 参考',
        'steps.decompose.title': '解构补缺',
        'steps.decompose.desc': '能力单元与缺口',
        'steps.build.title': '实现验证',
        'steps.build.desc': '子代理实现与安装',
        'steps.state.waiting': '等待',
        'steps.state.active': '进行中',
        'steps.state.done': '完成',
        'steps.state.cancelled': '已取消',
        'handoff.running': '子代理实现中',
        'handoff.done': '子代理已完成',
        'handoff.failed': '子代理失败',
        'handoff.install': '安装现成插件',
        'handoff.fork': '基于现有插件改造',
        'handoff.create': '从零创建',
        'time.justNow': '刚刚',
        'time.minutesAgo': '{n} 分钟前',
        'time.hoursAgo': '{n} 小时前',
        'time.daysAgo': '{n} 天前',
        'status.line': 'M4 · 真实任务数据与交接状态已接入。装好的插件会出现在左侧栏；在对话里描述需求即可开始一条新的工作台任务。'
      },
      en: {
        'entry.title': 'Plugin Workbench',
        'page.title': 'Plugin Workbench',
        'page.subtitle': 'Reuse first, fill the gaps second, build last.',
        'page.back': 'Back to chat',
        'page.preview': 'M4 · v' + VERSION,
        'page.refresh': 'Refresh',
        'page.reload': 'Reload UI',
        'page.loading': 'Reading the workbench…',
        'page.error': 'Failed to load',
        'page.retry': 'Retry',
        'page.autoRefresh': 'Auto-refresh every 4s',
        'page.lastSync': 'Updated',
        'page.empty.title': 'No plugin task in progress',
        'page.empty.desc': 'The workbench finds an existing implementation first, then decides how to reuse it, and only then writes the missing parts.',
        'page.empty.example': 'Build a plugin that manages a daily todo list inside DSH and stores the data locally.',
        'page.empty.step1': 'Describe the plugin need in any conversation (one sentence is enough).',
        'page.empty.step2': 'The agent loads the workbench skill and walks clarification, search and the four-way decision.',
        'page.empty.step3': 'Come back here to inspect candidates, the match report and the final reuse plan.',
        'page.tasks': 'Tasks',
        'page.noTasks': 'No tasks',
        'page.selectTask': 'Select a task on the left to see its details',
        'page.detailLoading': 'Reading the task…',
        'label.goal': 'Need',
        'label.created': 'Created',
        'label.updated': 'Updated',
        'label.stage': 'Stage',
        'label.spec': 'Spec',
        'label.surface': 'Surface',
        'label.must': 'Must capabilities',
        'label.acceptance': 'Acceptance',
        'label.constraints': 'Constraints',
        'label.candidates': 'Candidates',
        'label.matchReport': 'Search report',
        'label.decision': 'Decision',
        'label.units': 'Capability units',
        'label.plan': 'Plan',
        'label.handoff': 'Handoff',
        'label.packageName': 'Package',
        'label.childId': 'Sub-agent',
        'label.steps': 'Steps',
        'label.errors': 'Errors',
        'label.installSpec': 'Install',
        'label.stars': 'Stars',
        'label.score': 'Score',
        'label.reuse': 'Reuse',
        'label.gap': 'Gap',
        'label.route': 'Route',
        'label.validation': 'Verification',
        'validation.passed': 'passed',
        'validation.failed': 'failed',
        'validation.warnings': 'Warnings',
        'validation.checks': 'Checks',
        'label.installResult': 'Install result',
        'install.applied': 'Installed',
        'install.restart-required': 'Restart required',
        'install.failed': 'Install failed',
        'install.overridden': 'Overridden by a higher layer',
        'install.cancelled': 'Install cancelled',
        'label.taskId': 'Task id',
        'label.dataDir': 'Data dir',
        'label.build': 'Build',
        'label.sources': 'Sources',
        'label.none': '—',
        'value.cancelled': 'Cancelled',
        'value.noDecision': 'Not decided yet',
        'value.noCandidates': 'No candidates',
        'value.noUnits': 'Not decomposed yet',
        'value.noSpec': 'Not filled in yet',
        'value.noGaps': 'No gaps',
        'value.optional': 'optional',
        'action.cancel': 'Cancel task',
        'action.remove': 'Delete task',
        'action.confirmRemove': 'Remove this task from the workbench? Only the workbench record is deleted; installed plugins are untouched.',
        'action.confirmCancel': 'Cancel this task?',
        'decision.use_as_is': 'Use as-is',
        'decision.diy': 'DIY on top',
        'decision.reference_only': 'Reference only',
        'decision.from_scratch': 'From scratch',
        'decision.rerun_search': 'Search again',
        'stage.intake': 'Clarifying',
        'stage.spec_ready': 'Spec ready',
        'stage.shortlist': 'Candidates ready',
        'stage.decided': 'Decided',
        'stage.planned': 'Plan ready',
        'stage.build_ready': 'Ready to install',
        'stage.building': 'Building',
        'stage.verifying': 'Verifying',
        'stage.verification_failed': 'Verification failed',
        'stage.install_failed': 'Install failed',
        'stage.done': 'Done',
        'stage.cancelled': 'Cancelled',
        'steps.clarify.title': 'Clarify',
        'steps.clarify.desc': 'Goal and acceptance',
        'steps.search.title': 'Search & reuse',
        'steps.search.desc': 'Installed / market / GitHub',
        'steps.decide.title': 'Decide',
        'steps.decide.desc': 'Use as-is / DIY / reference',
        'steps.decompose.title': 'Decompose',
        'steps.decompose.desc': 'Capability units and gaps',
        'steps.build.title': 'Build & verify',
        'steps.build.desc': 'Sub-agent and install',
        'steps.state.waiting': 'Waiting',
        'steps.state.active': 'Active',
        'steps.state.done': 'Done',
        'steps.state.cancelled': 'Cancelled',
        'handoff.running': 'Creator running',
        'handoff.done': 'Creator done',
        'handoff.failed': 'Creator failed',
        'handoff.install': 'Install existing plugin',
        'handoff.fork': 'Adapt existing plugin',
        'handoff.create': 'Build from scratch',
        'time.justNow': 'just now',
        'time.minutesAgo': '{n}m ago',
        'time.hoursAgo': '{n}h ago',
        'time.daysAgo': '{n}d ago',
        'status.line': 'M4 · Real task data and handoff status are wired. The installed plugin appears in the left sidebar; describe a need in chat to start a new workbench task.'
      }
    }

    function dictT(key) {
      const dict = DICT.zh
      return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : key
    }

    function tf(t, key, vars) {
      let value = t(key)
      if (value === key) return key
      if (vars !== undefined) {
        for (const name of Object.keys(vars)) value = value.split('{' + name + '}').join(String(vars[name]))
      }
      return value
    }

    const STEPS = ['clarify', 'search', 'decide', 'decompose', 'build']

    const STAGE_INDEX = {
      intake: 0,
      spec_ready: 0,
      shortlist: 1,
      decided: 2,
      planned: 3,
      build_ready: 4,
      building: 4,
      verifying: 4,
      done: 4
    }

    const STAGE_TONE = {
      intake: 'muted',
      spec_ready: 'muted',
      shortlist: 'info',
      decided: 'brand',
      planned: 'brand',
      build_ready: 'warn',
      building: 'warn',
      verifying: 'warn',
      install_failed: 'warn',
      done: 'ok',
      cancelled: 'muted'
    }

    function stageLabel(t, stage) {
      const key = 'stage.' + stage
      const value = t(key)
      return value === key ? String(stage) : value
    }

    function decisionLabel(t, decision) {
      if (!decision) return t('value.noDecision')
      const key = 'decision.' + decision
      const value = t(key)
      return value === key ? String(decision) : value
    }

    function timeAgo(t, value) {
      if (typeof value !== 'string' || value === '') return t('label.none')
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value
      const diff = Date.now() - date.getTime()
      const minutes = Math.floor(diff / 60000)
      if (minutes < 1) return t('time.justNow')
      if (minutes < 60) return tf(t, 'time.minutesAgo', { n: minutes })
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return tf(t, 'time.hoursAgo', { n: hours })
      return tf(t, 'time.daysAgo', { n: Math.floor(hours / 24) })
    }

    function stringList(value) {
      if (!Array.isArray(value)) return []
      return value.filter((item) => typeof item === 'string' && item !== '')
    }

    async function api(method, args) {
      const response = await fetch(API_PATH, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ method, args })
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload && typeof payload.error === 'string' ? payload.error : `HTTP ${response.status}`)
      }
      if (payload === null || payload.ok !== true) {
        throw new Error(payload && typeof payload.error === 'string' ? payload.error : 'workbench request failed')
      }
      return payload.result
    }

    const CSS = `
      .pw-page { height: 100%; overflow-y: auto; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); font-family: inherit; }
      .pw-inner { max-width: 1180px; margin: 0 auto; padding: 22px 26px 48px; box-sizing: border-box; }
      [data-platform='darwin'] .pw-inner { padding-top: calc(22px + var(--dsh-frame-top-clearance, 0px)); }

      .pw-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 18px; }
      .pw-head-left { display: flex; align-items: flex-start; gap: 12px; min-width: 0; }
      .pw-logo { flex: none; width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-brand-primary); border: 1px solid var(--dsw-alias-border-l2); }
      .pw-title-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
      .pw-title { margin: 0; font-size: 20px; font-weight: 600; line-height: 28px; letter-spacing: .2px; }
      .pw-badge { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 999px; background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-secondary); font-size: 11px; line-height: 18px; white-space: nowrap; }
      .pw-subtitle { margin: 3px 0 0; font-size: 13px; line-height: 20px; color: var(--dsw-alias-label-secondary); }
      .pw-head-actions { display: flex; align-items: center; gap: 8px; flex: none; }
      .pw-sync { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; line-height: 18px; color: var(--dsw-alias-label-tertiary); white-space: nowrap; }
      .pw-dot { width: 6px; height: 6px; border-radius: 999px; background: var(--dsw-alias-state-success-primary); box-shadow: 0 0 0 3px var(--dsw-alias-bg-layer-3); }
      .pw-dot.off { background: var(--dsw-alias-label-dimmed); }
      .pw-btn { display: inline-flex; align-items: center; gap: 6px; font: inherit; font-size: 13px; line-height: 20px; padding: 6px 12px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l3); background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); cursor: pointer; transition: background .12s ease, border-color .12s ease; }
      .pw-btn:hover { background: var(--dsw-alias-interactive-bg-hover); border-color: var(--dsw-alias-border-l4); }
      .pw-btn:active { background: var(--dsw-alias-interactive-bg-active); }
      .pw-btn[disabled] { opacity: .5; cursor: default; }
      .pw-btn.primary { background: var(--dsw-alias-button-primary-fill, var(--dsw-alias-brand-primary)); border-color: transparent; color: var(--dsw-alias-label-primary-foreground, #fff); }
      .pw-btn.danger { color: var(--dsw-alias-state-error-primary, #d33); }
      .pw-btn.ghost { background: transparent; }

      .pw-rail { display: flex; gap: 0; margin: 4px 0 18px; padding: 14px 12px 12px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; background: var(--dsw-alias-bg-layer-2); }
      .pw-rail-step { position: relative; flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 4px; }
      .pw-rail-step:not(:first-child)::before { content: ''; position: absolute; top: 11px; right: 50%; width: 100%; height: 2px; background: var(--dsw-alias-border-l2); }
      .pw-rail-step.done:not(:first-child)::before, .pw-rail-step.active:not(:first-child)::before { background: var(--dsw-alias-brand-primary); opacity: .55; }
      .pw-rail-dot { position: relative; z-index: 1; width: 24px; height: 24px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; font-size: 11.5px; font-weight: 600; background: var(--dsw-alias-bg-base); border: 1.5px solid var(--dsw-alias-border-l3); color: var(--dsw-alias-label-tertiary); }
      .pw-rail-step.done .pw-rail-dot { background: var(--dsw-alias-brand-primary); border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-label-primary-foreground, #fff); }
      .pw-rail-step.active .pw-rail-dot { background: var(--dsw-alias-brand-primary); border-color: var(--dsw-alias-brand-primary); color: var(--dsw-alias-label-primary-foreground, #fff); box-shadow: 0 0 0 4px var(--dsw-alias-bg-layer-3); }
      .pw-rail-label { margin-top: 7px; font-size: 12.5px; line-height: 17px; font-weight: 500; color: var(--dsw-alias-label-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
      .pw-rail-step.active .pw-rail-label { color: var(--dsw-alias-label-primary); }
      .pw-rail-state { margin-top: 1px; font-size: 10.5px; line-height: 15px; color: var(--dsw-alias-label-dimmed); }
      .pw-rail-step.active .pw-rail-state { color: var(--dsw-alias-brand-primary); }
      .pw-rail-step.done .pw-rail-state { color: var(--dsw-alias-label-tertiary); }

      .pw-layout { display: grid; grid-template-columns: 308px minmax(0, 1fr); gap: 16px; align-items: start; }
      @media (max-width: 940px) { .pw-layout { grid-template-columns: minmax(0, 1fr); } .pw-rail-label { display: none; } }
      .pw-side { position: sticky; top: 8px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; background: var(--dsw-alias-bg-layer-2); overflow: hidden; max-height: calc(100vh - 210px); display: flex; flex-direction: column; }
      .pw-side-head { flex: none; padding: 11px 13px; display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 12.5px; font-weight: 500; color: var(--dsw-alias-label-secondary); border-bottom: 1px solid var(--dsw-alias-border-l1); }
      .pw-side-list { overflow-y: auto; flex: 1 1 auto; }
      .pw-task { display: block; width: 100%; text-align: left; font: inherit; color: inherit; background: transparent; border: 0; border-bottom: 1px solid var(--dsw-alias-border-l1); padding: 10px 13px; cursor: pointer; transition: background .12s ease; }
      .pw-task:last-child { border-bottom: 0; }
      .pw-task:hover { background: var(--dsw-alias-interactive-bg-hover); }
      .pw-task.active { background: var(--dsw-alias-bg-layer-3); box-shadow: inset 3px 0 0 var(--dsw-alias-brand-primary); }
      .pw-task-goal { font-size: 12.8px; line-height: 19px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .pw-task-meta { margin-top: 5px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; font-size: 10.5px; line-height: 16px; color: var(--dsw-alias-label-tertiary); }

      .pw-detail { min-width: 0; display: flex; flex-direction: column; gap: 14px; }
      .pw-card { border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; background: var(--dsw-alias-bg-layer-2); padding: 14px 16px; }
      .pw-card-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
      .pw-card-title { margin: 0; font-size: 13px; font-weight: 600; line-height: 20px; display: flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-primary); }
      .pw-card-hint { font-size: 11.5px; line-height: 17px; color: var(--dsw-alias-label-tertiary); }
      .pw-hero { border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; background: var(--dsw-alias-bg-layer-2); padding: 16px; display: flex; flex-direction: column; gap: 10px; }
      .pw-goal { margin: 0; font-size: 16px; line-height: 24px; font-weight: 600; letter-spacing: .1px; overflow-wrap: anywhere; }
      .pw-chips { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
      .pw-chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 999px; background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-secondary); font-size: 11px; line-height: 18px; white-space: nowrap; }
      .pw-chip.mono { font-family: var(--dsw-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: 10.5px; }
      .pw-chip.tone-brand { background: transparent; color: var(--dsw-alias-brand-primary); border: 1px solid var(--dsw-alias-brand-primary); }
      .pw-chip.tone-ok { color: var(--dsw-alias-state-success-primary); border: 1px solid var(--dsw-alias-state-success-primary); background: transparent; }
      .pw-chip.tone-warn { color: var(--dsw-alias-state-warn-primary); border: 1px solid var(--dsw-alias-state-warn-primary); background: transparent; }
      .pw-chip.tone-muted { color: var(--dsw-alias-label-tertiary); }
      .pw-meta { display: flex; flex-wrap: wrap; gap: 4px 16px; font-size: 11.5px; line-height: 18px; color: var(--dsw-alias-label-tertiary); }
      .pw-meta b { font-weight: 500; color: var(--dsw-alias-label-secondary); }
      .pw-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }

      .pw-kv { display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 7px 12px; font-size: 12.5px; line-height: 19px; }
      .pw-kv-key { color: var(--dsw-alias-label-tertiary); }
      .pw-kv-val { overflow-wrap: anywhere; color: var(--dsw-alias-label-primary); }
      .pw-note { margin: 0; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-tertiary); }
      .pw-grid2 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; align-items: start; }
      @media (max-width: 760px) { .pw-grid2 { grid-template-columns: minmax(0, 1fr); } }

      .pw-cand { position: relative; border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; padding: 11px 12px 10px 14px; margin-bottom: 8px; background: var(--dsw-alias-bg-base); }
      .pw-cand:last-child { margin-bottom: 0; }
      .pw-cand::before { content: ''; position: absolute; left: 0; top: 10px; bottom: 10px; width: 3px; border-radius: 999px; background: var(--dsw-alias-border-l3); }
      .pw-cand.src-installed::before { background: var(--dsw-alias-state-success-primary); }
      .pw-cand.src-market::before { background: var(--dsw-alias-brand-primary); }
      .pw-cand.src-github::before { background: var(--dsw-alias-state-business-primary); }
      .pw-cand.src-web::before { background: var(--dsw-alias-label-tertiary); }
      .pw-cand-top { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
      .pw-cand-name { font-size: 13px; line-height: 19px; font-weight: 600; overflow-wrap: anywhere; }
      .pw-src { font-size: 10px; line-height: 16px; padding: 0 6px; border-radius: 999px; background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-tertiary); text-transform: lowercase; }
      .pw-cand-desc { margin: 6px 0 0; font-size: 12.3px; line-height: 19px; color: var(--dsw-alias-label-secondary); overflow-wrap: anywhere; }
      .pw-cand-foot { margin-top: 8px; display: flex; flex-wrap: wrap; align-items: center; gap: 6px 12px; font-size: 11px; line-height: 17px; color: var(--dsw-alias-label-tertiary); }
      .pw-cand-foot a { color: var(--dsw-alias-brand-primary); text-decoration: none; overflow-wrap: anywhere; }
      .pw-cand-foot a:hover { text-decoration: underline; }
      .pw-score { display: inline-flex; align-items: center; gap: 6px; margin-left: auto; font-size: 10.5px; color: var(--dsw-alias-label-tertiary); }
      .pw-score-bar { width: 48px; height: 4px; border-radius: 999px; background: var(--dsw-alias-bg-layer-3); overflow: hidden; }
      .pw-score-fill { height: 100%; border-radius: 999px; background: var(--dsw-alias-brand-primary); }

      .pw-decision { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; background: var(--dsw-alias-bg-layer-3); }
      .pw-decision-icon { flex: none; width: 26px; height: 26px; border-radius: 999px; display: flex; align-items: center; justify-content: center; background: var(--dsw-alias-brand-primary); color: var(--dsw-alias-label-primary-foreground, #fff); font-size: 13px; }
      .pw-decision-main { min-width: 0; }
      .pw-decision-title { font-size: 13px; line-height: 19px; font-weight: 600; }
      .pw-decision-sub { font-size: 11.5px; line-height: 17px; color: var(--dsw-alias-label-tertiary); overflow-wrap: anywhere; }

      .pw-unit { border: 1px solid var(--dsw-alias-border-l1); border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; background: var(--dsw-alias-bg-base); }
      .pw-unit:last-child { margin-bottom: 0; }
      .pw-unit-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .pw-unit-index { font-family: var(--dsw-font-family-mono, ui-monospace, Menlo, monospace); font-size: 10.5px; color: var(--dsw-alias-label-tertiary); }
      .pw-unit-name { font-size: 12.8px; line-height: 19px; font-weight: 600; }
      .pw-unit-body { margin-top: 7px; display: grid; gap: 5px; font-size: 12px; line-height: 18px; }
      .pw-unit-row { display: grid; grid-template-columns: 68px minmax(0, 1fr); gap: 8px; }
      .pw-unit-key { color: var(--dsw-alias-label-tertiary); }
      .pw-unit-val { color: var(--dsw-alias-label-secondary); overflow-wrap: anywhere; }

      .pw-steps-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 8px; }
      .pw-steps-list li { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 9px; align-items: start; font-size: 12.3px; line-height: 19px; color: var(--dsw-alias-label-secondary); }
      .pw-validate-list { display: grid; gap: 3px; border-top: 1px dashed var(--dsw-alias-border-l1); padding-top: 8px; }
      .pw-validate-row { display: grid; grid-template-columns: 16px minmax(0, 1fr) auto; gap: 8px; align-items: baseline; font-size: 11.8px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
      .pw-validate-mark { color: var(--dsw-alias-state-success-primary); font-weight: 600; text-align: center; }
      .pw-validate-row.fail .pw-validate-mark { color: var(--dsw-alias-state-error-primary, #d33); }
      .pw-validate-detail { color: var(--dsw-alias-label-tertiary); font-size: 10.5px; overflow-wrap: anywhere; text-align: right; }
      .pw-step-num { width: 22px; height: 22px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; font-size: 10.5px; background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-secondary); }
      .pw-mono { font-family: var(--dsw-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: 11.5px; line-height: 18px; padding: 6px 9px; border-radius: 8px; background: var(--dsw-alias-bg-layer-3); overflow-wrap: anywhere; color: var(--dsw-alias-label-primary); }
      .pw-status-line { display: inline-flex; align-items: center; gap: 7px; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
      .pw-pulse { width: 7px; height: 7px; border-radius: 999px; background: var(--dsw-alias-state-warn-primary); animation: pw-pulse 1.4s ease-in-out infinite; }
      @keyframes pw-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .45; transform: scale(.8); } }

      .pw-errors { margin: 0; padding-left: 18px; font-size: 12px; line-height: 18px; color: var(--dsw-alias-state-warn-primary, #b8860b); overflow-wrap: anywhere; }
      .pw-error-banner { display: flex; justify-content: space-between; align-items: center; gap: 12px; border: 1px solid var(--dsw-alias-state-error-primary, #d33); border-radius: 10px; padding: 10px 12px; font-size: 12.5px; line-height: 19px; color: var(--dsw-alias-state-error-primary, #d33); background: var(--dsw-alias-bg-layer-2); }
      .pw-empty-detail { border: 1px dashed var(--dsw-alias-border-l3); border-radius: 12px; padding: 30px; text-align: center; color: var(--dsw-alias-label-tertiary); font-size: 13px; background: var(--dsw-alias-bg-layer-2); }
      .pw-empty { border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; background: var(--dsw-alias-bg-layer-2); padding: 30px 26px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; }
      .pw-empty-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-brand-primary); margin-bottom: 4px; }
      .pw-empty-title { margin: 0; font-size: 15px; line-height: 22px; font-weight: 600; }
      .pw-empty-desc { margin: 0; max-width: 560px; font-size: 12.8px; line-height: 20px; color: var(--dsw-alias-label-secondary); }
      .pw-empty-steps { margin: 12px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; text-align: left; max-width: 560px; width: 100%; }
      .pw-empty-steps li { display: grid; grid-template-columns: 22px minmax(0, 1fr); gap: 9px; font-size: 12.3px; line-height: 19px; color: var(--dsw-alias-label-secondary); }
      .pw-skeleton { position: relative; overflow: hidden; border-radius: 8px; background: var(--dsw-alias-bg-layer-3); height: 12px; }
      .pw-skeleton::after { content: ''; position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, var(--dsw-alias-bg-layer-2), transparent); animation: pw-shimmer 1.4s infinite; }
      @keyframes pw-shimmer { 100% { transform: translateX(100%); } }
      .pw-skel-card { border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; background: var(--dsw-alias-bg-layer-2); padding: 16px; display: flex; flex-direction: column; gap: 10px; }

      .pw-foot { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--dsw-alias-border-l1); display: flex; flex-wrap: wrap; gap: 6px 16px; font-size: 11.5px; line-height: 18px; color: var(--dsw-alias-label-tertiary); }
      .pw-foot b { font-weight: 500; color: var(--dsw-alias-label-secondary); }
      .pw-foot .mono { font-family: var(--dsw-font-family-mono, ui-monospace, Menlo, monospace); font-size: 10.5px; overflow-wrap: anywhere; }
      .pw-foot .spacer { flex: 1 1 auto; }
    `

    function WorkbenchIcon(props) {
      const size = typeof props?.size === 'number' ? props.size : 18
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.6,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': true
        },
        h('rect', { x: 3, y: 7.5, width: 18, height: 3.5, rx: 1 }),
        h('path', { d: 'M6 11v7.5M18 11v7.5' }),
        h('path', { d: 'M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5' }),
        h('path', { d: 'M12 14.2v2.2M10.9 15.3h2.2' })
      )
    }

    function RefreshIcon() {
      return h(
        'svg',
        { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        h('path', { d: 'M21 12a9 9 0 1 1-2.64-6.36' }),
        h('path', { d: 'M21 3v6h-6' })
      )
    }

    function CheckIcon({ size = 13 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        h('path', { d: 'M20 6 9 17l-5-5' })
      )
    }

    function StageRail({ t, stage }) {
      if (stage === undefined || stage === null) return null
      const active = STAGE_INDEX[stage] === undefined ? -1 : STAGE_INDEX[stage]
      const cancelled = stage === 'cancelled'
      return h(
        'section',
        { className: 'pw-rail', 'aria-label': t('label.stage') },
        STEPS.map((step, index) => {
          const done = !cancelled && active >= 0 && index < active
          const isActive = !cancelled && active >= 0 && index === active
          const state = cancelled
            ? t('steps.state.cancelled')
            : isActive
              ? t('steps.state.active')
              : done
                ? t('steps.state.done')
                : t('steps.state.waiting')
          return h(
            'div',
            { key: step, className: 'pw-rail-step' + (done ? ' done' : '') + (isActive ? ' active' : '') },
            h('span', { className: 'pw-rail-dot' }, done ? h(CheckIcon) : String(index + 1)),
            h('div', { className: 'pw-rail-label', title: t('steps.' + step + '.title') }, t('steps.' + step + '.title')),
            h('div', { className: 'pw-rail-state' }, state)
          )
        })
      )
    }

    function Card({ title, hint, children, actions }) {
      return h(
        'section',
        { className: 'pw-card' },
        title === undefined
          ? null
          : h(
              'div',
              { className: 'pw-card-head' },
              h('h3', { className: 'pw-card-title' }, title),
              actions !== undefined ? actions : hint !== undefined ? h('span', { className: 'pw-card-hint' }, hint) : null
            ),
        children
      )
    }

    function SpecCard({ t, task }) {
      const spec = task.spec
      const rows = []
      if (spec !== null && typeof spec === 'object') {
        if (spec.surface) rows.push([t('label.surface'), String(spec.surface)])
        const must = stringList(spec.mustCapabilities)
        if (must.length > 0) rows.push([t('label.must'), must.join(' · ')])
        const acceptance = stringList(spec.acceptance)
        if (acceptance.length > 0) rows.push([t('label.acceptance'), acceptance.join(' · ')])
        const constraints = stringList(spec.constraints)
        if (constraints.length > 0) rows.push([t('label.constraints'), constraints.join(' · ')])
      }
      return h(
        Card,
        { title: t('label.spec') },
        rows.length === 0
          ? h('p', { className: 'pw-note' }, t('value.noSpec'))
          : h(
              'div',
              { className: 'pw-kv' },
              rows.flatMap(([key, value], index) => [
                h('div', { className: 'pw-kv-key', key: 'k' + index }, key),
                h('div', { className: 'pw-kv-val', key: 'v' + index }, value)
              ])
            )
      )
    }

    function ReportCard({ t, task }) {
      const report = task.matchReport
      if (report === null || typeof report !== 'object') {
        return h(Card, { title: t('label.matchReport') }, h('p', { className: 'pw-note' }, t('value.noCandidates')))
      }
      const counts = report.counts !== null && typeof report.counts === 'object' ? report.counts : {}
      const errors = stringList(report.errors)
      return h(
        Card,
        { title: t('label.matchReport'), hint: t('label.sources') },
        h(
          'div',
          { className: 'pw-chips', style: { marginBottom: errors.length > 0 ? '8px' : '0' } },
          Object.entries(counts).map(([source, count]) =>
            h('span', { className: 'pw-chip', key: source }, String(source) + ' · ' + String(count))
          ),
          report.auth ? h('span', { className: 'pw-chip tone-muted', key: 'auth' }, 'auth · ' + String(report.auth)) : null
        ),
        errors.length > 0
          ? h(
              'div',
              {},
              h('p', { className: 'pw-note', style: { margin: '0 0 4px' } }, t('label.errors')),
              h('ul', { className: 'pw-errors' }, errors.slice(0, 6).map((line, index) => h('li', { key: index }, line)))
            )
          : null
      )
    }

    function CandidateCard({ t, candidate, index }) {
      const score = typeof candidate.score === 'number' ? Math.max(0, Math.min(100, candidate.score)) : 0
      const source = String(candidate.source || 'github')
      return h(
        'div',
        { className: 'pw-cand src-' + source },
        h(
          'div',
          { className: 'pw-cand-top' },
          h('span', { className: 'pw-cand-name' }, String(candidate.name || '')),
          h('span', { className: 'pw-src' }, source),
          typeof candidate.stars === 'number' && candidate.stars > 0 ? h('span', { className: 'pw-chip' }, '★ ' + candidate.stars) : null,
          h(
            'span',
            { className: 'pw-score', title: t('label.score') },
            h('span', { className: 'pw-score-bar' }, h('span', { className: 'pw-score-fill', style: { width: score + '%' } })),
            String(score)
          )
        ),
        candidate.description ? h('p', { className: 'pw-cand-desc' }, String(candidate.description)) : null,
        h(
          'div',
          { className: 'pw-cand-foot' },
          candidate.url ? h('a', { href: String(candidate.url), target: '_blank', rel: 'noreferrer' }, String(candidate.url)) : null,
          candidate.installSpec ? h('span', {}, t('label.installSpec') + ': ' + String(candidate.installSpec)) : null,
          candidate.license ? h('span', {}, String(candidate.license)) : null
        )
      )
    }

    function CandidatesCard({ t, candidates }) {
      const list = Array.isArray(candidates) ? candidates : []
      return h(
        Card,
        { title: t('label.candidates'), hint: String(list.length) },
        list.length === 0
          ? h('p', { className: 'pw-note' }, t('value.noCandidates'))
          : list.map((candidate, index) => h(CandidateCard, { key: candidate.id || candidate.name || index, t, candidate, index }))
      )
    }

    function DecisionCard({ t, task }) {
      const decision = task.decision
      if (decision === null || decision === undefined || typeof decision !== 'object') {
        return h(Card, { title: t('label.decision') }, h('p', { className: 'pw-note' }, t('value.noDecision')))
      }
      return h(
        Card,
        { title: t('label.decision') },
        h(
          'div',
          { className: 'pw-decision' },
          h('span', { className: 'pw-decision-icon' }, h(CheckIcon)),
          h(
            'div',
            { className: 'pw-decision-main' },
            h('div', { className: 'pw-decision-title' }, decisionLabel(t, decision.decision) + (decision.candidateId ? ' · ' + decision.candidateId : '')),
            decision.note ? h('div', { className: 'pw-decision-sub' }, String(decision.note)) : null
          )
        )
      )
    }

    function UnitsCard({ t, task }) {
      const units = Array.isArray(task.units) ? task.units : []
      return h(
        Card,
        { title: t('label.units'), hint: String(units.length) },
        units.length === 0
          ? h('p', { className: 'pw-note' }, t('value.noUnits'))
          : units.map((unit, index) => {
              const reuse = unit.reuse !== null && unit.reuse !== undefined
                ? typeof unit.reuse === 'string'
                  ? unit.reuse
                  : [unit.reuse.kind, unit.reuse.source || unit.reuse.entry || unit.reuse.how].filter(Boolean).join(' · ')
                : ''
              return h(
                'div',
                { className: 'pw-unit', key: unit.id || unit.name || index },
                h(
                  'div',
                  { className: 'pw-unit-head' },
                  h('span', { className: 'pw-unit-index' }, String(unit.id || 'U' + (index + 1))),
                  h('span', { className: 'pw-unit-name' }, String(unit.name || '')),
                  unit.must === false ? h('span', { className: 'pw-chip' }, t('value.optional')) : null,
                  unit.gap ? h('span', { className: 'pw-chip tone-warn' }, t('label.gap')) : h('span', { className: 'pw-chip tone-ok' }, t('label.reuse'))
                ),
                h(
                  'div',
                  { className: 'pw-unit-body' },
                  unit.acceptance
                    ? h('div', { className: 'pw-unit-row' }, h('span', { className: 'pw-unit-key' }, t('label.acceptance')), h('span', { className: 'pw-unit-val' }, String(unit.acceptance)))
                    : null,
                  reuse ? h('div', { className: 'pw-unit-row' }, h('span', { className: 'pw-unit-key' }, t('label.reuse')), h('span', { className: 'pw-unit-val' }, reuse)) : null,
                  unit.gap ? h('div', { className: 'pw-unit-row' }, h('span', { className: 'pw-unit-key' }, t('label.gap')), h('span', { className: 'pw-unit-val' }, String(unit.gap))) : null
                )
              )
            })
      )
    }

    function HandoffCard({ t, task }) {
      const handoff = task.handoff !== null && task.handoff !== undefined && typeof task.handoff === 'object' ? task.handoff : null
      const install = task.plan !== null && task.plan !== undefined && typeof task.plan === 'object' && task.plan.install !== null && typeof task.plan.install === 'object'
        ? task.plan.install
        : null
      const validation = handoff !== null && handoff.validation !== null && handoff.validation !== undefined && typeof handoff.validation === 'object'
        ? handoff.validation
        : null
      if (handoff === null && install === null) return null
      const route = handoff !== null ? String(handoff.route || '') : 'install'
      const routeKey = 'handoff.' + route
      const routeRaw = t(routeKey)
      const routeLabel = routeRaw === routeKey ? route : routeRaw
      const status = handoff !== null ? String(handoff.status || '') : ''
      const statusKey = 'handoff.' + status
      const statusRaw = handoff !== null ? t(statusKey) : ''
      const statusLabel = handoff !== null ? (statusRaw === statusKey ? status : statusRaw) : ''
      const steps = install !== null && Array.isArray(install.steps) ? install.steps : []
      return h(
        Card,
        {
          title: t('label.handoff'),
          actions:
            handoff !== null
              ? h(
                  'span',
                  { className: 'pw-status-line' },
                  status === 'running' ? h('span', { className: 'pw-pulse' }) : h('span', { className: 'pw-dot' + (status === 'failed' ? ' off' : '') }),
                  statusLabel
                )
              : h('span', { className: 'pw-chip tone-warn' }, routeLabel)
        },
        h(
          'div',
          { className: 'pw-kv', style: { marginBottom: steps.length > 0 ? '10px' : '0' } },
          h('div', { className: 'pw-kv-key' }, t('label.route')),
          h('div', { className: 'pw-kv-val' }, routeLabel),
          install !== null ? h('div', { className: 'pw-kv-key' }, t('label.installSpec')) : null,
          install !== null ? h('div', { className: 'pw-kv-val' }, h('span', { className: 'pw-mono' }, String(install.packageSpec || t('label.none')))) : null,
          handoff !== null && handoff.packageName ? h('div', { className: 'pw-kv-key' }, t('label.packageName')) : null,
          handoff !== null && handoff.packageName ? h('div', { className: 'pw-kv-val' }, h('span', { className: 'pw-mono' }, String(handoff.packageName))) : null,
          handoff !== null && handoff.childId ? h('div', { className: 'pw-kv-key' }, t('label.childId')) : null,
          handoff !== null && handoff.childId ? h('div', { className: 'pw-kv-val' }, h('span', { className: 'pw-mono' }, String(handoff.childId))) : null
        ),
        steps.length > 0
          ? h(
              'div',
              {},
              h('p', { className: 'pw-note', style: { margin: '0 0 6px' } }, t('label.steps')),
              h(
                'ol',
                { className: 'pw-steps-list' },
                steps.map((step, index) =>
                  h('li', { key: index }, h('span', { className: 'pw-step-num' }, String(index + 1)), h('span', {}, String(step)))
                )
              )
            )
          : null,
        validation !== null
          ? h(
              'div',
              { style: { marginTop: '10px' } },
              h(
                'div',
                { className: 'pw-chips', style: { marginBottom: '6px' } },
                h('span', { className: 'pw-chip tone-' + (validation.ok ? 'ok' : 'warn') }, t('label.validation') + ' ' + t(validation.ok ? 'validation.passed' : 'validation.failed')),
                h('span', { className: 'pw-chip' }, t('validation.checks') + ' ' + String(Array.isArray(validation.checks) ? validation.checks.length : 0)),
                Array.isArray(validation.warnings) && validation.warnings.length > 0
                  ? h('span', { className: 'pw-chip' }, t('validation.warnings') + ' ' + String(validation.warnings.length))
                  : null
              ),
              h(
                'div',
                { className: 'pw-validate-list' },
                (Array.isArray(validation.checks) ? validation.checks : []).slice(0, 12).map((item) =>
                  h(
                    'div',
                    { key: String(item.id || item.label), className: 'pw-validate-row' + (item.ok === false ? ' fail' : '') },
                    h('span', { className: 'pw-validate-mark' }, item.ok === false ? '✗' : '✓'),
                    h('span', {}, String(item.label || item.id || '')),
                    item.detail ? h('span', { className: 'pw-validate-detail' }, String(item.detail)) : null
                  )
                )
              ),
              Array.isArray(validation.warnings) && validation.warnings.length > 0
                ? h('p', { className: 'pw-note', style: { margin: '6px 0 0' } }, t('validation.warnings') + ': ' + validation.warnings.join(' · '))
                : null
            )
          : null
      )
    }

    function InstallResultCard({ t, task }) {
      const install = task.install
      if (install === null || install === undefined || typeof install !== 'object') return null
      const application = String(install.application || '')
      const key = 'install.' + application
      const raw = t(key)
      const label = raw === key ? application : raw
      const tone = application === 'applied' ? 'ok' : application === 'failed' || application === 'restart-required' ? 'warn' : 'muted'
      return h(
        Card,
        { title: t('label.installResult'), actions: h('span', { className: 'pw-chip tone-' + tone }, label) },
        h(
          'div',
          { className: 'pw-kv' },
          install.packageName ? h('div', { className: 'pw-kv-key' }, t('label.packageName')) : null,
          install.packageName ? h('div', { className: 'pw-kv-val' }, h('span', { className: 'pw-mono' }, String(install.packageName))) : null,
          install.version ? h('div', { className: 'pw-kv-key' }, 'version') : null,
          install.version ? h('div', { className: 'pw-kv-val' }, String(install.version)) : null,
          h('div', { className: 'pw-kv-key' }, t('label.updated')),
          h('div', { className: 'pw-kv-val' }, timeAgo(t, install.at)),
          install.note ? h('div', { className: 'pw-kv-key' }, 'note') : null,
          install.note ? h('div', { className: 'pw-kv-val' }, String(install.note)) : null
        )
      )
    }

    function Detail({ t, task, busy, onCancel, onRemove }) {
      const cancelled = task.stage === 'cancelled'
      return h(
        'div',
        { className: 'pw-detail' },
        h(
          'section',
          { className: 'pw-hero' },
          h('p', { className: 'pw-goal' }, String(task.goal || '')),
          h(
            'div',
            { className: 'pw-chips' },
            h('span', { className: 'pw-chip tone-' + (STAGE_TONE[task.stage] || 'muted') }, stageLabel(t, task.stage)),
            h('span', { className: 'pw-chip' }, t('label.candidates') + ' ' + String((task.candidates || []).length)),
            h('span', { className: 'pw-chip' }, t('label.updated') + ' ' + timeAgo(t, task.updatedAt)),
            h('span', { className: 'pw-chip mono' }, String(task.id || ''))
          ),
          h(
            'div',
            { className: 'pw-actions' },
            cancelled ? null : h('button', { type: 'button', className: 'pw-btn', disabled: busy, onClick: onCancel }, t('action.cancel')),
            h('button', { type: 'button', className: 'pw-btn danger ghost', disabled: busy, onClick: onRemove }, t('action.remove'))
          )
        ),
        h(StageRail, { t, stage: task.stage }),
        h('div', { className: 'pw-grid2' }, h(SpecCard, { t, task }), h(ReportCard, { t, task })),
        h(CandidatesCard, { t, candidates: task.candidates }),
        h('div', { className: 'pw-grid2' }, h(DecisionCard, { t, task }), h(UnitsCard, { t, task })),
        h(HandoffCard, { t, task }),
        h(InstallResultCard, { t, task })
      )
    }

    function Skeleton() {
      return h(
        'div',
        { className: 'pw-detail' },
        h('div', { className: 'pw-skel-card' }, h('div', { className: 'pw-skeleton', style: { width: '55%' } }), h('div', { className: 'pw-skeleton', style: { width: '30%' } })),
        h(
          'div',
          { className: 'pw-skel-card' },
          h('div', { className: 'pw-skeleton', style: { width: '40%' } }),
          h('div', { className: 'pw-skeleton', style: { width: '85%' } }),
          h('div', { className: 'pw-skeleton', style: { width: '70%' } })
        )
      )
    }

    function EmptyState({ t }) {
      return h(
        'section',
        { className: 'pw-empty' },
        h('div', { className: 'pw-empty-icon' }, h(WorkbenchIcon, { size: 24 })),
        h('h2', { className: 'pw-empty-title' }, t('page.empty.title')),
        h('p', { className: 'pw-empty-desc' }, t('page.empty.desc')),
        h(
          'ol',
          { className: 'pw-empty-steps' },
          [t('page.empty.step1'), t('page.empty.step2'), t('page.empty.step3')].map((step, index) =>
            h('li', { key: index }, h('span', { className: 'pw-step-num' }, String(index + 1)), h('span', {}, step))
          )
        ),
        h('div', { className: 'pw-mono', style: { marginTop: '10px', maxWidth: '560px' } }, t('page.empty.example'))
      )
    }

    function WorkbenchPage(props) {
      const t = typeof props?.t === 'function' ? props.t : dictT
      const onBack = typeof props?.onBack === 'function' ? props.onBack : null
      const [snapshot, setSnapshot] = React.useState({ loading: true, error: null, tasks: [], dataDir: '' })
      const [selectedId, setSelectedId] = React.useState(null)
      const [detail, setDetail] = React.useState({ loading: false, error: null, task: null })
      const [busy, setBusy] = React.useState(false)
      const [lastSync, setLastSync] = React.useState(0)
      const mounted = React.useRef(true)
      const selectedRef = React.useRef(null)
      const inflight = React.useRef(false)

      selectedRef.current = selectedId

      React.useEffect(() => {
        mounted.current = true
        return () => {
          mounted.current = false
        }
      }, [])

      const loadDetail = React.useCallback(async (taskId) => {
        if (taskId === null || taskId === '') {
          if (mounted.current) setDetail({ loading: false, error: null, task: null })
          return
        }
        try {
          const task = await api('task', { taskId })
          if (!mounted.current) return
          setDetail({ loading: false, error: null, task })
        } catch (error) {
          if (!mounted.current) return
          setDetail({ loading: false, error: error && error.message ? error.message : String(error), task: null })
        }
      }, [])

      const refresh = React.useCallback(
        async (options) => {
          if (inflight.current) return
          inflight.current = true
          try {
            const result = await api('snapshot')
            if (!mounted.current) return
            const tasks = Array.isArray(result?.tasks) ? result.tasks : []
            setSnapshot({ loading: false, error: null, tasks, dataDir: typeof result?.dataDir === 'string' ? result.dataDir : '' })
            setLastSync(Date.now())
            const current = selectedRef.current
            const nextId = current !== null && tasks.some((task) => task.id === current) ? current : tasks.length > 0 ? tasks[0].id : null
            if (nextId !== current) setSelectedId(nextId)
            if (nextId !== null) await loadDetail(nextId)
          } catch (error) {
            if (!mounted.current) return
            setSnapshot((current) => ({ ...current, loading: false, error: error && error.message ? error.message : String(error) }))
          } finally {
            inflight.current = false
          }
        },
        [loadDetail]
      )

      React.useEffect(() => {
        refresh()
        const timer = setInterval(() => {
          if (typeof document === 'undefined' || document.visibilityState === 'visible') refresh()
        }, POLL_MS)
        const onVisible = () => {
          if (typeof document === 'undefined' || document.visibilityState === 'visible') refresh()
        }
        const onFocus = () => refresh()
        if (typeof document !== 'undefined') document.addEventListener('visibilitychange', onVisible)
        if (typeof window !== 'undefined') window.addEventListener('focus', onFocus)
        return () => {
          clearInterval(timer)
          if (typeof document !== 'undefined') document.removeEventListener('visibilitychange', onVisible)
          if (typeof window !== 'undefined') window.removeEventListener('focus', onFocus)
        }
      }, [refresh])

      const selectTask = React.useCallback(
        (taskId) => {
          setSelectedId(taskId)
          setDetail((current) => ({ ...current, loading: true, error: null }))
          loadDetail(taskId)
        },
        [loadDetail]
      )

      const runBusy = React.useCallback(async (fn) => {
        setBusy(true)
        try {
          await fn()
        } finally {
          if (mounted.current) setBusy(false)
        }
      }, [])

      const cancelTask = React.useCallback(() => {
        if (selectedId === null) return
        if (typeof window !== 'undefined' && !window.confirm(t('action.confirmCancel'))) return
        runBusy(async () => {
          try {
            await api('cancel', { taskId: selectedId })
          } catch (error) {
            setDetail((current) => ({ ...current, error: error && error.message ? error.message : String(error) }))
          }
          await refresh()
        })
      }, [selectedId, runBusy, refresh, t])

      const removeTask = React.useCallback(() => {
        if (selectedId === null) return
        if (typeof window !== 'undefined' && !window.confirm(t('action.confirmRemove'))) return
        runBusy(async () => {
          try {
            await api('remove', { taskId: selectedId })
            setSelectedId(null)
            setDetail({ loading: false, error: null, task: null })
          } catch (error) {
            setDetail((current) => ({ ...current, error: error && error.message ? error.message : String(error) }))
          }
          await refresh()
        })
      }, [selectedId, runBusy, refresh, t])

      const task = detail.task
      const isEmpty = snapshot.tasks.length === 0
      const currentStage = task !== null ? task.stage : (snapshot.tasks.find((item) => item.id === selectedId) || {}).stage

      const header = h(
        'header',
        { className: 'pw-head' },
        h(
          'div',
          { className: 'pw-head-left' },
          h('span', { className: 'pw-logo' }, h(WorkbenchIcon, { size: 22 })),
          h(
            'div',
            {},
            h('div', { className: 'pw-title-row' }, h('h1', { className: 'pw-title' }, t('page.title')), h('span', { className: 'pw-badge' }, t('page.preview'))),
            h('p', { className: 'pw-subtitle' }, t('page.subtitle'))
          )
        ),
        h(
          'div',
          { className: 'pw-head-actions' },
          h(
            'span',
            { className: 'pw-sync', title: t('page.autoRefresh') },
            h('span', { className: 'pw-dot' + (snapshot.error === null ? '' : ' off') }),
            lastSync > 0 ? t('page.lastSync') + ' ' + timeAgo(t, new Date(lastSync).toISOString()) : t('page.loading')
          ),
          h('button', { type: 'button', className: 'pw-btn', onClick: () => refresh(), disabled: snapshot.loading || busy }, h(RefreshIcon), t('page.refresh')),
          h('button', { type: 'button', className: 'pw-btn ghost', onClick: () => { if (typeof location !== 'undefined') location.reload() } }, t('page.reload')),
          onBack ? h('button', { type: 'button', className: 'pw-btn', onClick: onBack }, t('page.back')) : null
        )
      )

      let body
      if (snapshot.loading && snapshot.tasks.length === 0) {
        body = h(Skeleton)
      } else if (snapshot.error !== null && snapshot.tasks.length === 0) {
        body = h(
          'div',
          { className: 'pw-error-banner' },
          h('span', {}, t('page.error') + ': ' + snapshot.error),
          h('button', { type: 'button', className: 'pw-btn', onClick: () => refresh() }, t('page.retry'))
        )
      } else if (isEmpty) {
        body = h(EmptyState, { t })
      } else {
        body = h(
          'div',
          {},
          h(StageRail, { t, stage: currentStage }),
          h(
            'div',
            { className: 'pw-layout' },
            h(
              'aside',
              { className: 'pw-side' },
              h(
                'div',
                { className: 'pw-side-head' },
                h('span', {}, t('page.tasks')),
                h('span', { className: 'pw-chip' }, String(snapshot.tasks.length))
              ),
              h(
                'div',
                { className: 'pw-side-list' },
                snapshot.tasks.map((item) =>
                  h(
                    'button',
                    {
                      type: 'button',
                      key: item.id,
                      className: 'pw-task' + (item.id === selectedId ? ' active' : ''),
                      onClick: () => selectTask(item.id)
                    },
                    h('div', { className: 'pw-task-goal' }, String(item.goal || '')),
                    h(
                      'div',
                      { className: 'pw-task-meta' },
                      h('span', { className: 'pw-chip tone-' + (STAGE_TONE[item.stage] || 'muted') }, stageLabel(t, item.stage)),
                      h('span', {}, t('label.candidates') + ' ' + String(item.candidates)),
                      h('span', {}, timeAgo(t, item.updatedAt))
                    )
                  )
                )
              )
            ),
            h(
              'div',
              { className: 'pw-detail' },
              detail.error !== null
                ? h(
                    'div',
                    { className: 'pw-error-banner' },
                    h('span', {}, detail.error),
                    h('button', { type: 'button', className: 'pw-btn', onClick: () => loadDetail(selectedId) }, t('page.retry'))
                  )
                : task === null
                  ? detail.loading
                    ? h(Skeleton)
                    : h('div', { className: 'pw-empty-detail' }, t('page.selectTask'))
                  : h(Detail, { t, task, busy, onCancel: cancelTask, onRemove: removeTask })
            )
          )
        )
      }

      return h(
        'div',
        { className: 'pw-page' },
        h('style', { key: 'pw-style' }, CSS),
        h(
          'div',
          { className: 'pw-inner' },
          header,
          body,
          h(
            'footer',
            { className: 'pw-foot' },
            h('span', {}, h('b', {}, 'dsh-plugin-workbench'), ' v' + VERSION + ' · ' + t('label.build') + ' ' + BUILD),
            snapshot.dataDir !== '' ? h('span', { className: 'mono' }, snapshot.dataDir) : null,
            h('span', { className: 'spacer' }),
            h('span', {}, t('status.line'))
          )
        )
      )
    }

    return {
      inject: ['slots', 'layout', 'locale'],
      apply(ctx) {
        const layout = ctx.get('layout')
        ctx.effect(() => ctx.locale.register(NS, { zh: DICT.zh, en: DICT.en }), 'plugin-workbench: locale dictionaries')
        const t = ctx.locale.bind(NS)

        ctx.slots.inject('sidebar.panellist', () =>
          ctx.slots.register(
            {
              name: 'sidebar.panellist',
              id: PANEL_ID,
              order: 15,
              locale: NS,
              label: () => t('entry.title')
            },
            (props) => h(WorkbenchIcon, props)
          )
        )

        ctx.slots.inject('main', () =>
          ctx.slots.register(
            {
              name: 'main',
              key: PANEL_ID,
              locale: NS
            },
            (props) =>
              h(WorkbenchPage, {
                ...props,
                t,
                onBack: layout && typeof layout.selectPanel === 'function' ? () => layout.selectPanel(null) : null
              })
          )
        )
      }
    }
  }
})
