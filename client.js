window.__ModuleLoader__.load({
  id: 'dsh-plugcraft',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'dsh-plugcraft'
    const PANEL_ID = 'plugin-workbench'
    const VERSION = '0.12.0'
    const API_PATH = '/workbench/api'
    const POLL_MS = 4000

    const DICT = {
      zh: {
        'entry.title': '插件工作台',
        'page.title': '插件工作台',
        'page.subtitle': '先复用，再补缺，最后才从零。',
        'page.back': '回到对话',
        'page.refresh': '刷新',
        'page.reload': '重载界面',
        'page.loading': '正在读取工作台…',
        'page.error': '读取失败',
        'page.retry': '重试',
        'page.sync': '自动刷新',
        'page.lastSync': '更新于',
        'page.tasks': '任务',
        'page.noTasks': '暂无任务',
        'page.selectTask': '选择左侧任务查看详情',
        'page.detailLoading': '正在读取任务…',
        'page.empty.title': '还没有进行中的插件任务',
        'page.empty.desc': '插件工作台会先帮你找现成实现，再决定复用方式，最后才让你从零写。',
        'page.empty.example': '帮我做一个能在 DSH 里管理每日待办、并把数据存在本地的插件。',
        'page.empty.step1': '在任意对话里描述插件需求（一句话即可）。',
        'page.empty.step2': 'Agent 会加载工作台技能，完成澄清、检索与四选一决策。',
        'page.empty.step3': '回到这个页面，查看候选实现、匹配报告和复用计划。',
        'tabs.overview': '概览',
        'tabs.candidates': '候选',
        'tabs.plan': '计划与交接',
        'label.stage': '阶段',
        'label.candidates': '候选',
        'label.gaps': '缺口',
        'label.updated': '更新',
        'label.created': '创建',
        'label.taskId': '任务 ID',
        'label.spec': '需求规格',
        'label.surface': '落点',
        'label.must': '必须能力',
        'label.acceptance': '验收标准',
        'label.constraints': '约束',
        'label.matchReport': '检索报告',
        'label.auth': '检索方式',
        'label.decision': '用户决策',
        'label.units': '能力单元',
        'label.handoff': '实现交接',
        'label.installResult': '安装结果',
        'label.verification': '结构校验',
        'label.route': '路线',
        'label.packageName': '包名',
        'label.packageSpec': '安装方式',
        'label.childId': '子代理',
        'label.steps': '步骤',
        'value.cancelled': '已取消',
        'value.noDecision': '尚未决策',
        'value.noCandidates': '没有候选实现',
        'value.noUnits': '尚未解构',
        'value.noSpec': '尚未填写',
        'value.optional': '可选',
        'value.passed': '通过',
        'value.failed': '失败',
        'value.checks': '检查项',
        'value.warnings': '提醒',
        'action.cancel': '取消任务',
        'action.remove': '删除任务',
        'action.confirmRemove': '确定从工作台删除这个任务吗？只删除工作台记录，不影响任何已安装插件。',
        'action.confirmCancel': '确定取消这个任务吗？',
        'action.showAll': '显示全部 {n} 个',
        'action.showLess': '收起',
        'action.copy': '复制',
        'action.copied': '已复制',
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
        'steps.clarify': '澄清',
        'steps.search': '检索',
        'steps.decide': '决策',
        'steps.decompose': '解构',
        'steps.build': '实现',
        'handoff.running': '子代理实现中',
        'handoff.done': '子代理已完成',
        'handoff.failed': '子代理失败',
        'handoff.install': '安装现成插件',
        'handoff.fork': '基于现有插件改造',
        'handoff.create': '从零创建',
        'install.applied': '已安装',
        'install.restart-required': '待重启生效',
        'install.failed': '安装失败',
        'install.overridden': '被更高优先级覆盖',
        'install.cancelled': '已取消安装',
        'time.justNow': '刚刚',
        'time.minutesAgo': '{n} 分钟前',
        'time.hoursAgo': '{n} 小时前',
        'time.daysAgo': '{n} 天前'
      },
      en: {
        'entry.title': 'Plugcraft',
        'page.title': 'Plugcraft',
        'page.subtitle': 'Reuse first, fill the gaps second, build last.',
        'page.back': 'Back to chat',
        'page.refresh': 'Refresh',
        'page.reload': 'Reload UI',
        'page.loading': 'Reading the workbench…',
        'page.error': 'Failed to load',
        'page.retry': 'Retry',
        'page.sync': 'Auto refresh',
        'page.lastSync': 'Updated',
        'page.tasks': 'Tasks',
        'page.noTasks': 'No tasks',
        'page.selectTask': 'Select a task on the left to see its details',
        'page.detailLoading': 'Reading the task…',
        'page.empty.title': 'No plugin task in progress',
        'page.empty.desc': 'Plugcraft finds an existing implementation first, then decides how to reuse it, and only then writes the missing parts.',
        'page.empty.example': 'Build a plugin that manages a daily todo list inside DSH and stores the data locally.',
        'page.empty.step1': 'Describe the plugin need in any conversation (one sentence is enough).',
        'page.empty.step2': 'The agent loads the workbench skill and walks clarification, search and the four-way decision.',
        'page.empty.step3': 'Come back here to inspect candidates, the match report and the final reuse plan.',
        'tabs.overview': 'Overview',
        'tabs.candidates': 'Candidates',
        'tabs.plan': 'Plan & handoff',
        'label.stage': 'Stage',
        'label.candidates': 'Candidates',
        'label.gaps': 'Gaps',
        'label.updated': 'Updated',
        'label.created': 'Created',
        'label.taskId': 'Task id',
        'label.spec': 'Spec',
        'label.surface': 'Surface',
        'label.must': 'Must capabilities',
        'label.acceptance': 'Acceptance',
        'label.constraints': 'Constraints',
        'label.matchReport': 'Search report',
        'label.auth': 'Auth',
        'label.decision': 'Decision',
        'label.units': 'Capability units',
        'label.handoff': 'Handoff',
        'label.installResult': 'Install result',
        'label.verification': 'Verification',
        'label.route': 'Route',
        'label.packageName': 'Package',
        'label.packageSpec': 'Install spec',
        'label.childId': 'Sub-agent',
        'label.steps': 'Steps',
        'value.cancelled': 'Cancelled',
        'value.noDecision': 'Not decided yet',
        'value.noCandidates': 'No candidates',
        'value.noUnits': 'Not decomposed yet',
        'value.noSpec': 'Not filled in yet',
        'value.optional': 'optional',
        'value.passed': 'passed',
        'value.failed': 'failed',
        'value.checks': 'Checks',
        'value.warnings': 'Warnings',
        'action.cancel': 'Cancel task',
        'action.remove': 'Delete task',
        'action.confirmRemove': 'Remove this task from the workbench? Only the workbench record is deleted; installed plugins are untouched.',
        'action.confirmCancel': 'Cancel this task?',
        'action.showAll': 'Show all {n}',
        'action.showLess': 'Show less',
        'action.copy': 'Copy',
        'action.copied': 'Copied',
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
        'steps.clarify': 'Clarify',
        'steps.search': 'Search',
        'steps.decide': 'Decide',
        'steps.decompose': 'Decompose',
        'steps.build': 'Build',
        'handoff.running': 'Creator running',
        'handoff.done': 'Creator done',
        'handoff.failed': 'Creator failed',
        'handoff.install': 'Install existing plugin',
        'handoff.fork': 'Adapt existing plugin',
        'handoff.create': 'Build from scratch',
        'install.applied': 'Installed',
        'install.restart-required': 'Restart required',
        'install.failed': 'Install failed',
        'install.overridden': 'Overridden by a higher layer',
        'install.cancelled': 'Install cancelled',
        'time.justNow': 'just now',
        'time.minutesAgo': '{n}m ago',
        'time.hoursAgo': '{n}h ago',
        'time.daysAgo': '{n}d ago'
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
      verification_failed: 4,
      install_failed: 4,
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
      verification_failed: 'bad',
      install_failed: 'bad',
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

    function installLabel(t, application) {
      const key = 'install.' + String(application || '')
      const value = t(key)
      return value === key ? String(application || '') : value
    }

    function timeAgo(t, value) {
      if (typeof value !== 'string' || value === '') return '—'
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
      .pc-page { height: 100%; overflow-y: auto; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); font-family: inherit; }
      .pc-inner { max-width: 1160px; margin: 0 auto; padding: 20px 24px 40px; box-sizing: border-box; }
      [data-platform='darwin'] .pc-inner { padding-top: calc(20px + var(--dsh-frame-top-clearance, 0px)); }

      .pc-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 14px; }
      .pc-head-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
      .pc-logo { flex: none; width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-brand-primary); border: 1px solid var(--dsw-alias-border-l2); }
      .pc-title { margin: 0; font-size: 18px; font-weight: 600; line-height: 26px; letter-spacing: .1px; }
      .pc-subtitle { margin: 0; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
      .pc-head-actions { display: flex; align-items: center; gap: 6px; flex: none; }
      .pc-sync { display: inline-flex; align-items: center; gap: 6px; margin-right: 4px; font-size: 11px; line-height: 16px; color: var(--dsw-alias-label-tertiary); white-space: nowrap; }
      .pc-dot { width: 6px; height: 6px; border-radius: 999px; background: var(--dsw-alias-state-success-primary); }
      .pc-dot.off { background: var(--dsw-alias-label-dimmed); }
      .pc-btn { display: inline-flex; align-items: center; gap: 5px; font: inherit; font-size: 12.5px; line-height: 18px; padding: 5px 10px; border-radius: 7px; border: 1px solid var(--dsw-alias-border-l3); background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-primary); cursor: pointer; transition: background .12s ease, border-color .12s ease; }
      .pc-btn:hover { background: var(--dsw-alias-interactive-bg-hover); border-color: var(--dsw-alias-border-l4); }
      .pc-btn[disabled] { opacity: .5; cursor: default; }
      .pc-btn.ghost { background: transparent; border-color: transparent; color: var(--dsw-alias-label-secondary); }
      .pc-btn.ghost:hover { background: var(--dsw-alias-interactive-bg-hover); }
      .pc-btn.danger { color: var(--dsw-alias-state-error-primary, #d33); }
      .pc-icon-btn { padding: 5px 7px; }

      .pc-stepper { position: relative; display: flex; flex-direction: column; gap: 0; padding: 2px 0; }
      .pc-stepper-track { position: absolute; left: 12px; top: 10px; bottom: 10px; width: 2px; border-radius: 999px; background: var(--dsw-alias-border-l2); overflow: hidden; }
      .pc-stepper-fill { position: absolute; left: 0; top: 0; width: 100%; height: var(--pc-stage-fill, 0%); border-radius: 999px; background: var(--dsw-alias-brand-primary); transition: height .55s cubic-bezier(.4, 0, .2, 1); }
      .pc-step { position: relative; z-index: 1; display: flex; align-items: center; gap: 8px; min-height: 25px; padding: 1px 0; font-size: 11px; line-height: 16px; color: var(--dsw-alias-label-tertiary); }
      .pc-step-dot { position: relative; flex: none; width: 20px; height: 20px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; font-size: 9.5px; font-weight: 600; background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-tertiary); transition: background .35s ease, color .35s ease, box-shadow .35s ease; }
      .pc-step.done { color: var(--dsw-alias-label-secondary); }
      .pc-step.done .pc-step-dot { background: var(--dsw-alias-brand-primary); color: var(--dsw-alias-label-primary-foreground, #fff); }
      .pc-step.active { color: var(--dsw-alias-label-primary); font-weight: 600; }
      .pc-step.active .pc-step-dot { background: var(--dsw-alias-brand-primary); color: var(--dsw-alias-label-primary-foreground, #fff); box-shadow: 0 0 0 3px var(--dsw-alias-bg-layer-2); }
      .pc-step.active .pc-step-dot::after { content: ''; position: absolute; inset: -5px; border-radius: 999px; border: 2px solid var(--dsw-alias-brand-primary); opacity: .32; animation: pc-pulse 1.7s ease-in-out infinite; }
      .pc-step-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      @media (max-width: 760px) { .pc-hero { grid-template-columns: minmax(0, 1fr); } .pc-hero-progress { display: none; } }

      .pc-layout { position: relative; display: grid; grid-template-columns: 262px minmax(0, 1fr); gap: 14px; align-items: start; }
      @media (max-width: 920px) { .pc-layout { grid-template-columns: minmax(0, 1fr); } }
      .pc-neck { position: absolute; z-index: 3; border-radius: 12px; background: var(--dsw-alias-bg-layer-2); pointer-events: none; }
      .pc-side { position: sticky; top: 8px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; background: var(--dsw-alias-bg-base); overflow: hidden; max-height: calc(100vh - 190px); display: flex; flex-direction: column; }
      .pc-side-head { flex: none; padding: 8px 11px; display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; font-weight: 600; color: var(--dsw-alias-label-secondary); border-bottom: 1px solid var(--dsw-alias-border-l1); letter-spacing: .2px; }
      .pc-side-list { overflow-y: auto; flex: 1 1 auto; }
      .pc-task { display: block; width: 100%; text-align: left; font: inherit; color: inherit; background: transparent; border: 0; border-bottom: 1px solid var(--dsw-alias-border-l1); padding: 8px 11px; cursor: pointer; }
      .pc-task:last-child { border-bottom: 0; }
      .pc-task:hover { background: var(--dsw-alias-interactive-bg-hover); }
      .pc-task.active { background: var(--dsw-alias-bg-layer-2); border-radius: 12px; box-shadow: inset 3px 0 0 var(--dsw-alias-brand-primary); }
      .pc-task-goal { font-size: 12.5px; line-height: 18px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .pc-task-meta { margin-top: 4px; display: flex; gap: 6px; flex-wrap: wrap; align-items: center; font-size: 10.5px; line-height: 15px; color: var(--dsw-alias-label-tertiary); }

      .pc-detail { position: relative; min-width: 0; display: flex; flex-direction: column; gap: 10px; }
      .pc-bubble { position: relative; z-index: 1; border: 1px solid var(--dsw-alias-border-l2); border-radius: 16px; background: var(--dsw-alias-bg-layer-2); padding: 12px 14px 14px; box-shadow: 0 6px 22px rgba(0, 0, 0, .18); }
      .pc-bubble .pc-card { background: var(--dsw-alias-bg-base); border-color: var(--dsw-alias-border-l1); }
      .pc-hero { display: grid; grid-template-columns: minmax(0, 1fr) 168px; gap: 14px; padding: 2px 2px 12px; border-bottom: 1px dashed var(--dsw-alias-border-l2); }
      .pc-hero-left { min-width: 0; display: flex; flex-direction: column; gap: 8px; }
      .pc-hero-progress { border-left: 1px solid var(--dsw-alias-border-l1); padding-left: 12px; }
      .pc-goal { margin: 0; font-size: 15px; line-height: 22px; font-weight: 600; letter-spacing: .1px; overflow-wrap: anywhere; }
      .pc-chip-row { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
      .pc-chip { display: inline-flex; align-items: center; gap: 4px; padding: 0 7px; border-radius: 999px; background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-secondary); font-size: 10.5px; line-height: 17px; white-space: nowrap; }
      .pc-chip.mono { font-family: var(--dsw-font-family-mono, ui-monospace, Menlo, monospace); font-size: 10px; }
      .pc-chip.tone-brand { color: var(--dsw-alias-brand-primary); border: 1px solid var(--dsw-alias-brand-primary); background: transparent; }
      .pc-chip.tone-ok { color: var(--dsw-alias-state-success-primary); border: 1px solid var(--dsw-alias-state-success-primary); background: transparent; }
      .pc-chip.tone-warn { color: var(--dsw-alias-state-warn-primary); border: 1px solid var(--dsw-alias-state-warn-primary); background: transparent; }
      .pc-chip.tone-info { color: var(--dsw-alias-state-business-primary, var(--dsw-alias-brand-primary)); border: 1px solid var(--dsw-alias-border-l3); background: transparent; }
      .pc-chip.tone-bad { color: var(--dsw-alias-state-error-primary, #d33); border: 1px solid var(--dsw-alias-state-error-primary, #d33); background: transparent; }
      .pc-chip.tone-muted { color: var(--dsw-alias-label-tertiary); }
      .pc-hero-actions { display: flex; justify-content: flex-end; gap: 6px; }

      .pc-tabs { display: flex; align-items: center; gap: 2px; border-bottom: 1px solid var(--dsw-alias-border-l2); padding: 0 2px; margin-top: 2px; }
      .pc-tab { font: inherit; font-size: 12.5px; line-height: 18px; color: var(--dsw-alias-label-tertiary); background: transparent; border: 0; padding: 7px 10px 8px; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; }
      .pc-tab:hover { color: var(--dsw-alias-label-primary); }
      .pc-tab.active { color: var(--dsw-alias-label-primary); border-bottom-color: var(--dsw-alias-brand-primary); font-weight: 600; }
      .pc-tab .pc-tab-count { margin-left: 5px; font-size: 10.5px; color: var(--dsw-alias-label-tertiary); }

      .pc-pane { display: flex; flex-direction: column; gap: 10px; }
      .pc-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 10px; align-items: stretch; }
      @media (max-width: 760px) { .pc-grid { grid-template-columns: minmax(0, 1fr); } }
      .pc-card { display: flex; flex-direction: column; border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; background: var(--dsw-alias-bg-layer-2); padding: 11px 13px; }
      .pc-card-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
      .pc-card-title { margin: 0; font-size: 12px; font-weight: 600; line-height: 17px; color: var(--dsw-alias-label-secondary); letter-spacing: .2px; display: flex; align-items: center; gap: 6px; }
      .pc-card-title::before { content: ''; width: 3px; height: 11px; border-radius: 2px; background: var(--dsw-alias-brand-primary); opacity: .8; }
      .pc-card-hint { font-size: 10.5px; line-height: 15px; color: var(--dsw-alias-label-tertiary); }
      .pc-kv { display: grid; grid-template-columns: 86px minmax(0, 1fr); gap: 5px 10px; font-size: 12px; line-height: 18px; }
      .pc-clamp { max-height: 168px; overflow: hidden; position: relative; }
      .pc-clamp::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 26px; background: linear-gradient(transparent, var(--dsw-alias-bg-base)); }
      .pc-kv-key { color: var(--dsw-alias-label-tertiary); }
      .pc-kv-val { color: var(--dsw-alias-label-primary); overflow-wrap: anywhere; }
      .pc-note { margin: 0; font-size: 11.5px; line-height: 17px; color: var(--dsw-alias-label-tertiary); }
      .pc-chips { display: flex; flex-wrap: wrap; gap: 5px; }

      .pc-cand-list { display: flex; flex-direction: column; gap: 7px; }
      .pc-cand { position: relative; border: 1px solid var(--dsw-alias-border-l1); border-radius: 9px; background: var(--dsw-alias-bg-base); padding: 9px 11px 8px 13px; }
      .pc-cand::before { content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 3px; border-radius: 999px; background: var(--dsw-alias-border-l3); }
      .pc-cand.src-installed::before { background: var(--dsw-alias-state-success-primary); }
      .pc-cand.src-market::before { background: var(--dsw-alias-brand-primary); }
      .pc-cand.src-github::before { background: var(--dsw-alias-state-business-primary, #2f6fbf); }
      .pc-cand.src-web::before { background: var(--dsw-alias-label-tertiary); }
      .pc-cand-top { display: flex; align-items: baseline; gap: 7px; flex-wrap: wrap; }
      .pc-cand-name { font-size: 12.5px; line-height: 18px; font-weight: 600; overflow-wrap: anywhere; }
      .pc-src { font-size: 9.5px; line-height: 15px; padding: 0 5px; border-radius: 999px; background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-tertiary); text-transform: lowercase; }
      .pc-cand-desc { margin: 4px 0 0; font-size: 11.8px; line-height: 17px; color: var(--dsw-alias-label-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; overflow-wrap: anywhere; }
      .pc-cand-foot { margin-top: 5px; display: flex; flex-wrap: wrap; align-items: center; gap: 5px 10px; font-size: 10.5px; line-height: 16px; color: var(--dsw-alias-label-tertiary); }
      .pc-cand-foot a { color: var(--dsw-alias-brand-primary); text-decoration: none; overflow-wrap: anywhere; }
      .pc-cand-foot a:hover { text-decoration: underline; }
      .pc-score { display: inline-flex; align-items: center; gap: 5px; margin-left: auto; font-size: 10px; color: var(--dsw-alias-label-tertiary); }
      .pc-score-bar { width: 42px; height: 3px; border-radius: 999px; background: var(--dsw-alias-bg-layer-3); overflow: hidden; }
      .pc-score-fill { height: 100%; border-radius: 999px; background: var(--dsw-alias-brand-primary); }
      .pc-more { align-self: center; margin-top: 2px; }

      .pc-decision { display: flex; align-items: center; gap: 9px; padding: 8px 10px; border-radius: 8px; background: var(--dsw-alias-bg-layer-3); }
      .pc-decision-icon { flex: none; width: 22px; height: 22px; border-radius: 999px; display: flex; align-items: center; justify-content: center; background: var(--dsw-alias-brand-primary); color: var(--dsw-alias-label-primary-foreground, #fff); }
      .pc-decision-main { min-width: 0; }
      .pc-decision-title { font-size: 12px; line-height: 17px; font-weight: 600; }
      .pc-decision-sub { font-size: 11px; line-height: 16px; color: var(--dsw-alias-label-tertiary); overflow-wrap: anywhere; }

      .pc-unit { border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; padding: 8px 10px; background: var(--dsw-alias-bg-base); margin-bottom: 6px; }
      .pc-unit:last-child { margin-bottom: 0; }
      .pc-unit-head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
      .pc-unit-index { font-family: var(--dsw-font-family-mono, ui-monospace, Menlo, monospace); font-size: 10px; color: var(--dsw-alias-label-tertiary); }
      .pc-unit-name { font-size: 12px; font-weight: 600; line-height: 17px; }
      .pc-unit-body { margin-top: 4px; display: grid; gap: 3px; font-size: 11.5px; line-height: 17px; color: var(--dsw-alias-label-secondary); }
      .pc-unit-row { display: grid; grid-template-columns: 58px minmax(0, 1fr); gap: 6px; }
      .pc-unit-key { color: var(--dsw-alias-label-tertiary); }
      .pc-unit-val { overflow-wrap: anywhere; }

      .pc-steps-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; }
      .pc-steps-list li { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 8px; align-items: start; font-size: 11.8px; line-height: 17px; color: var(--dsw-alias-label-secondary); }
      .pc-step-num { width: 20px; height: 20px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-label-secondary); }
      .pc-mono { font-family: var(--dsw-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace); font-size: 11px; line-height: 17px; padding: 5px 8px; border-radius: 7px; background: var(--dsw-alias-bg-layer-3); overflow-wrap: anywhere; color: var(--dsw-alias-label-primary); }
      .pc-status-line { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; line-height: 16px; color: var(--dsw-alias-label-secondary); }
      .pc-pulse { width: 6px; height: 6px; border-radius: 999px; background: var(--dsw-alias-state-warn-primary); animation: pc-pulse 1.4s ease-in-out infinite; }
      @keyframes pc-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .45; transform: scale(.8); } }
      .pc-validate { display: grid; gap: 3px; border-top: 1px dashed var(--dsw-alias-border-l1); padding-top: 7px; margin-top: 7px; }
      .pc-validate-row { display: grid; grid-template-columns: 14px minmax(0, 1fr) auto; gap: 7px; align-items: baseline; font-size: 11px; line-height: 16px; color: var(--dsw-alias-label-secondary); }
      .pc-validate-mark { color: var(--dsw-alias-state-success-primary); font-weight: 700; text-align: center; }
      .pc-validate-row.fail .pc-validate-mark { color: var(--dsw-alias-state-error-primary, #d33); }
      .pc-validate-detail { color: var(--dsw-alias-label-tertiary); font-size: 10px; overflow-wrap: anywhere; text-align: right; }

      .pc-errors { margin: 0; padding-left: 16px; font-size: 11.5px; line-height: 17px; color: var(--dsw-alias-state-warn-primary, #b8860b); overflow-wrap: anywhere; }
      .pc-error-banner { display: flex; justify-content: space-between; align-items: center; gap: 10px; border: 1px solid var(--dsw-alias-state-error-primary, #d33); border-radius: 9px; padding: 8px 11px; font-size: 12px; line-height: 18px; color: var(--dsw-alias-state-error-primary, #d33); background: var(--dsw-alias-bg-layer-2); }
      .pc-empty-detail { border: 1px dashed var(--dsw-alias-border-l3); border-radius: 10px; padding: 26px; text-align: center; color: var(--dsw-alias-label-tertiary); font-size: 12.5px; background: var(--dsw-alias-bg-layer-2); }
      .pc-empty { border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; background: var(--dsw-alias-bg-layer-2); padding: 24px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; }
      .pc-empty-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: var(--dsw-alias-bg-layer-3); color: var(--dsw-alias-brand-primary); margin-bottom: 2px; }
      .pc-empty-title { margin: 0; font-size: 14px; line-height: 21px; font-weight: 600; }
      .pc-empty-desc { margin: 0; max-width: 540px; font-size: 12.2px; line-height: 19px; color: var(--dsw-alias-label-secondary); }
      .pc-empty-steps { margin: 8px 0 0; padding: 0; list-style: none; display: grid; gap: 6px; text-align: left; max-width: 540px; width: 100%; }
      .pc-empty-steps li { display: grid; grid-template-columns: 20px minmax(0, 1fr); gap: 8px; font-size: 11.8px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
      .pc-skeleton { position: relative; overflow: hidden; border-radius: 6px; background: var(--dsw-alias-bg-layer-3); height: 11px; }
      .pc-skeleton::after { content: ''; position: absolute; inset: 0; transform: translateX(-100%); background: linear-gradient(90deg, transparent, var(--dsw-alias-bg-layer-2), transparent); animation: pc-shimmer 1.4s infinite; }
      @keyframes pc-shimmer { 100% { transform: translateX(100%); } }
      .pc-skel-card { border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; background: var(--dsw-alias-bg-layer-2); padding: 13px; display: flex; flex-direction: column; gap: 8px; }
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
        { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        h('path', { d: 'M21 12a9 9 0 1 1-2.64-6.36' }),
        h('path', { d: 'M21 3v6h-6' })
      )
    }

    function CheckIcon({ size = 11 }) {
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        h('path', { d: 'M20 6 9 17l-5-5' })
      )
    }

    function VerticalProgress({ t, stage }) {
      if (stage === undefined || stage === null) return null
      const active = STAGE_INDEX[stage] === undefined ? -1 : STAGE_INDEX[stage]
      const cancelled = stage === 'cancelled'
      const fill = cancelled || active < 0 ? 0 : (active / (STEPS.length - 1)) * 100
      return h(
        'div',
        { className: 'pc-stepper', style: { '--pc-stage-fill': fill + '%' }, role: 'list', 'aria-label': t('label.stage') },
        h('div', { className: 'pc-stepper-track' }, h('div', { className: 'pc-stepper-fill' })),
        STEPS.map((step, index) => {
          const done = !cancelled && active >= 0 && index < active
          const isActive = !cancelled && active >= 0 && index === active
          return h(
            'div',
            {
              key: step,
              role: 'listitem',
              className: 'pc-step' + (done ? ' done' : '') + (isActive ? ' active' : ''),
              title: t('steps.' + step)
            },
            h('span', { className: 'pc-step-dot' }, done ? h(CheckIcon) : String(index + 1)),
            h('span', { className: 'pc-step-label' }, t('steps.' + step))
          )
        })
      )
    }

    function Card({ title, hint, children }) {
      return h(
        'section',
        { className: 'pc-card' },
        title === undefined
          ? null
          : h(
              'div',
              { className: 'pc-card-head' },
              h('h3', { className: 'pc-card-title' }, title),
              hint !== undefined ? h('span', { className: 'pc-card-hint' }, hint) : null
            ),
        children
      )
    }

    function SpecCard({ t, task }) {
      const spec = task.spec
      const [showAll, setShowAll] = React.useState(false)
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
      const long = rows.reduce((sum, [, value]) => sum + String(value).length, 0) > 260
      return h(
        Card,
        { title: t('label.spec') },
        rows.length === 0
          ? h('p', { className: 'pc-note' }, t('value.noSpec'))
          : h(
              'div',
              {},
              h(
                'div',
                { className: 'pc-kv' + (long && !showAll ? ' pc-clamp' : '') },
                rows.flatMap(([key, value], index) => [
                  h('div', { className: 'pc-kv-key', key: 'k' + index }, key),
                  h('div', { className: 'pc-kv-val', key: 'v' + index }, value)
                ])
              ),
              long
                ? h(
                    'button',
                    { type: 'button', className: 'pc-btn ghost pc-more', style: { marginTop: '6px', alignSelf: 'flex-start' }, onClick: () => setShowAll(!showAll) },
                    showAll ? t('action.showLess') : tf(t, 'action.showAll', { n: rows.length })
                  )
                : null
            )
      )
    }

    function ReportCard({ t, task }) {
      const report = task.matchReport
      if (report === null || typeof report !== 'object') return null
      const counts = report.counts !== null && typeof report.counts === 'object' ? report.counts : {}
      const errors = stringList(report.errors)
      return h(
        Card,
        { title: t('label.matchReport'), hint: t('label.auth') + ': ' + String(report.auth || 'anonymous') },
        h(
          'div',
          { className: 'pc-chips' },
          Object.entries(counts).map(([source, count]) => h('span', { className: 'pc-chip', key: source }, String(source) + ' · ' + String(count)))
        ),
        errors.length > 0
          ? h('ul', { className: 'pc-errors', style: { marginTop: '6px' } }, errors.slice(0, 4).map((line, index) => h('li', { key: index }, line)))
          : null
      )
    }

    function DecisionCard({ t, task }) {
      const decision = task.decision
      if (decision === null || decision === undefined || typeof decision !== 'object') {
        return h(Card, { title: t('label.decision') }, h('p', { className: 'pc-note' }, t('value.noDecision')))
      }
      return h(
        Card,
        { title: t('label.decision') },
        h(
          'div',
          { className: 'pc-decision' },
          h('span', { className: 'pc-decision-icon' }, h(CheckIcon)),
          h(
            'div',
            { className: 'pc-decision-main' },
            h('div', { className: 'pc-decision-title' }, decisionLabel(t, decision.decision) + (decision.candidateId ? ' · ' + decision.candidateId : '')),
            decision.note ? h('div', { className: 'pc-decision-sub' }, String(decision.note)) : null
          )
        )
      )
    }

    function UnitsSummary({ t, task }) {
      const units = Array.isArray(task.units) ? task.units : []
      const [showAll, setShowAll] = React.useState(false)
      const gaps = units.filter((unit) => unit !== null && typeof unit === 'object' && typeof unit.gap === 'string' && unit.gap !== '').length
      const visible = showAll ? units : units.slice(0, 3)
      React.useEffect(() => setShowAll(false), [task.id])
      return h(
        Card,
        { title: t('label.units'), hint: String(units.length) + ' · ' + t('label.gaps') + ' ' + String(gaps) },
        units.length === 0
          ? h('p', { className: 'pc-note' }, t('value.noUnits'))
          : h(
              'div',
              {},
              visible.map((unit, index) =>
                h(
                  'div',
                  { className: 'pc-unit', key: unit.id || unit.name || index },
                  h(
                    'div',
                    { className: 'pc-unit-head' },
                    h('span', { className: 'pc-unit-index' }, String(unit.id || 'U' + (index + 1))),
                    h('span', { className: 'pc-unit-name' }, String(unit.name || '')),
                    unit.gap ? h('span', { className: 'pc-chip tone-warn' }, t('label.gaps')) : h('span', { className: 'pc-chip tone-ok' }, t('label.reuse'))
                  ),
                  unit.gap ? h('div', { className: 'pc-unit-body' }, h('div', { className: 'pc-unit-row' }, h('span', { className: 'pc-unit-key' }, t('label.gaps')), h('span', { className: 'pc-unit-val' }, String(unit.gap)))) : null
                )
              ),
              units.length > 3
                ? h(
                    'button',
                    { type: 'button', className: 'pc-btn ghost pc-more', style: { marginTop: '6px' }, onClick: () => setShowAll(!showAll) },
                    showAll ? t('action.showLess') : tf(t, 'action.showAll', { n: units.length })
                  )
                : null
            )
      )
    }

    function HandoffSummary({ t, task }) {
      const handoff = task.handoff !== null && task.handoff !== undefined && typeof task.handoff === 'object' ? task.handoff : null
      const install = task.plan !== null && task.plan !== undefined && typeof task.plan === 'object' && task.plan.install !== null && typeof task.plan.install === 'object' ? task.plan.install : null
      const installResult = task.install !== null && task.install !== undefined && typeof task.install === 'object' ? task.install : null
      const validation = handoff !== null && handoff.validation !== null && handoff.validation !== undefined && typeof handoff.validation === 'object' ? handoff.validation : null
      const rows = []
      if (install !== null) rows.push([t('label.route'), 'install'])
      else if (handoff !== null) rows.push([t('label.route'), String(handoff.route || '')])
      if (install !== null && install.packageSpec) rows.push([t('label.packageSpec'), h('span', { className: 'pc-mono' }, String(install.packageSpec))])
      if (handoff !== null && handoff.packageName) rows.push([t('label.packageName'), h('span', { className: 'pc-mono' }, String(handoff.packageName))])
      if (validation !== null) rows.push([t('label.verification'), (validation.ok ? t('value.passed') : t('value.failed')) + ' · ' + String((validation.checks || []).length) + ' ' + t('value.checks')])
      if (installResult !== null) rows.push([t('label.installResult'), installLabel(t, installResult.application)])
      if (rows.length === 0) return null
      return h(
        Card,
        { title: t('label.handoff') },
        h('div', { className: 'pc-kv' }, rows.flatMap(([key, value], index) => [h('div', { className: 'pc-kv-key', key: 'k' + index }, key), h('div', { className: 'pc-kv-val', key: 'v' + index }, value)]))
      )
    }

    function CandidateList({ t, candidates, expanded, onToggle }) {
      const list = Array.isArray(candidates) ? candidates : []
      const limit = expanded ? list.length : Math.min(5, list.length)
      return h(
        'div',
        { className: 'pc-cand-list' },
        list.slice(0, limit).map((candidate) => {
          const source = String(candidate.source || 'github')
          const score = typeof candidate.score === 'number' ? Math.max(0, Math.min(100, candidate.score)) : 0
          return h(
            'div',
            { className: 'pc-cand src-' + source, key: candidate.id || candidate.name },
            h(
              'div',
              { className: 'pc-cand-top' },
              h('span', { className: 'pc-cand-name' }, String(candidate.name || '')),
              h('span', { className: 'pc-src' }, source),
              typeof candidate.stars === 'number' && candidate.stars > 0 ? h('span', { className: 'pc-chip' }, '★ ' + candidate.stars) : null,
              h(
                'span',
                { className: 'pc-score', title: 'score' },
                h('span', { className: 'pc-score-bar' }, h('span', { className: 'pc-score-fill', style: { width: score + '%' } })),
                String(score)
              )
            ),
            candidate.description ? h('p', { className: 'pc-cand-desc' }, String(candidate.description)) : null,
            h(
              'div',
              { className: 'pc-cand-foot' },
              candidate.url ? h('a', { href: String(candidate.url), target: '_blank', rel: 'noreferrer' }, String(candidate.url)) : null,
              candidate.installSpec ? h('span', {}, String(candidate.installSpec)) : null
            )
          )
        }),
        list.length > 5
          ? h(
              'button',
              { type: 'button', className: 'pc-btn ghost pc-more', onClick: onToggle },
              expanded ? t('action.showLess') : tf(t, 'action.showAll', { n: list.length })
            )
          : null
      )
    }

    function PlanPane({ t, task }) {
      const handoff = task.handoff !== null && task.handoff !== undefined && typeof task.handoff === 'object' ? task.handoff : null
      const install = task.plan !== null && task.plan !== undefined && typeof task.plan === 'object' && task.plan.install !== null && task.plan.install !== undefined && typeof task.plan.install === 'object' ? task.plan.install : null
      const installResult = task.install !== null && task.install !== undefined && typeof task.install === 'object' ? task.install : null
      const validation = handoff !== null && handoff.validation !== null && handoff.validation !== undefined && typeof handoff.validation === 'object' ? handoff.validation : null
      const route = handoff !== null ? String(handoff.route || '') : install !== null ? 'install' : ''
      const routeKey = 'handoff.' + route
      const routeRaw = t(routeKey)
      const routeLabel = routeRaw === routeKey ? route : routeRaw
      const status = handoff !== null ? String(handoff.status || '') : ''
      const statusKey = 'handoff.' + status
      const statusRaw = handoff !== null ? t(statusKey) : ''
      const statusLabel = handoff !== null ? (statusRaw === statusKey ? status : statusRaw) : ''
      const steps = install !== null && Array.isArray(install.steps) ? install.steps : []
      return h(
        'div',
        { className: 'pc-pane' },
        install !== null || handoff !== null
          ? h(
              Card,
              {
                title: t('label.handoff'),
                hint: handoff !== null ? statusLabel : routeLabel
              },
              h(
                'div',
                { className: 'pc-kv' },
                h('div', { className: 'pc-kv-key' }, t('label.route')),
                h('div', { className: 'pc-kv-val' }, routeLabel),
                install !== null && install.packageSpec ? h('div', { className: 'pc-kv-key' }, t('label.packageSpec')) : null,
                install !== null && install.packageSpec ? h('div', { className: 'pc-kv-val' }, h('span', { className: 'pc-mono' }, String(install.packageSpec))) : null,
                handoff !== null && handoff.packageName ? h('div', { className: 'pc-kv-key' }, t('label.packageName')) : null,
                handoff !== null && handoff.packageName ? h('div', { className: 'pc-kv-val' }, h('span', { className: 'pc-mono' }, String(handoff.packageName))) : null,
                handoff !== null && handoff.childId ? h('div', { className: 'pc-kv-key' }, t('label.childId')) : null,
                handoff !== null && handoff.childId ? h('div', { className: 'pc-kv-val' }, h('span', { className: 'pc-mono' }, String(handoff.childId))) : null
              ),
              steps.length > 0
                ? h(
                    'div',
                    { style: { marginTop: '8px' } },
                    h('p', { className: 'pc-note', style: { margin: '0 0 5px' } }, t('label.steps')),
                    h('ol', { className: 'pc-steps-list' }, steps.map((step, index) => h('li', { key: index }, h('span', { className: 'pc-step-num' }, String(index + 1)), h('span', {}, String(step)))))
                  )
                : null
            )
          : h(Card, { title: t('label.handoff') }, h('p', { className: 'pc-note' }, '—')),
        validation !== null
          ? h(
              Card,
              { title: t('label.verification'), hint: validation.ok ? t('value.passed') : t('value.failed') },
              h(
                'div',
                { className: 'pc-validate' },
                (Array.isArray(validation.checks) ? validation.checks : []).slice(0, 12).map((item) =>
                  h(
                    'div',
                    { key: String(item.id || item.label), className: 'pc-validate-row' + (item.ok === false ? ' fail' : '') },
                    h('span', { className: 'pc-validate-mark' }, item.ok === false ? '✗' : '✓'),
                    h('span', {}, String(item.label || item.id || '')),
                    item.detail ? h('span', { className: 'pc-validate-detail' }, String(item.detail)) : null
                  )
                )
              ),
              Array.isArray(validation.warnings) && validation.warnings.length > 0
                ? h('p', { className: 'pc-note', style: { marginTop: '6px' } }, t('value.warnings') + ': ' + validation.warnings.join(' · '))
                : null
            )
          : null,
        installResult !== null
          ? h(
              Card,
              { title: t('label.installResult'), hint: installLabel(t, installResult.application) },
              h(
                'div',
                { className: 'pc-kv' },
                installResult.packageName ? h('div', { className: 'pc-kv-key' }, t('label.packageName')) : null,
                installResult.packageName ? h('div', { className: 'pc-kv-val' }, h('span', { className: 'pc-mono' }, String(installResult.packageName))) : null,
                installResult.version ? h('div', { className: 'pc-kv-key' }, 'version') : null,
                installResult.version ? h('div', { className: 'pc-kv-val' }, String(installResult.version)) : null,
                h('div', { className: 'pc-kv-key' }, t('label.updated')),
                h('div', { className: 'pc-kv-val' }, timeAgo(t, installResult.at)),
                installResult.note ? h('div', { className: 'pc-kv-key' }, 'note') : null,
                installResult.note ? h('div', { className: 'pc-kv-val' }, String(installResult.note)) : null
              )
            )
          : null
      )
    }

    function Detail({ t, task, busy, tab, setTab, expanded, setExpanded, onCancel, onRemove, bubbleRef }) {
      const cancelled = task.stage === 'cancelled'
      const candidates = Array.isArray(task.candidates) ? task.candidates : []
      const gaps = Array.isArray(task.units) ? task.units.filter((unit) => unit !== null && typeof unit === 'object' && typeof unit.gap === 'string' && unit.gap !== '').length : 0
      const tabs = [
        { id: 'overview', label: t('tabs.overview'), count: null },
        { id: 'candidates', label: t('tabs.candidates'), count: candidates.length },
        { id: 'plan', label: t('tabs.plan'), count: null }
      ]
      return h(
        'div',
        { className: 'pc-detail pc-bubble', ref: bubbleRef },
        h(
          'section',
          { className: 'pc-hero' },
          h(
            'div',
            { className: 'pc-hero-left' },
            h('p', { className: 'pc-goal' }, String(task.goal || '')),
            h(
              'div',
              { className: 'pc-chip-row' },
              h('span', { className: 'pc-chip tone-' + (STAGE_TONE[task.stage] || 'muted') }, stageLabel(t, task.stage)),
              h('span', { className: 'pc-chip' }, t('label.candidates') + ' ' + String(candidates.length)),
              h('span', { className: 'pc-chip' }, t('label.gaps') + ' ' + String(gaps)),
              h('span', { className: 'pc-chip' }, t('label.updated') + ' ' + timeAgo(t, task.updatedAt)),
              h('span', { className: 'pc-chip mono' }, String(task.id || ''))
            ),
            h(
              'div',
              { className: 'pc-hero-actions' },
              cancelled ? null : h('button', { type: 'button', className: 'pc-btn ghost', disabled: busy, onClick: onCancel }, t('action.cancel')),
              h('button', { type: 'button', className: 'pc-btn ghost danger', disabled: busy, onClick: onRemove }, t('action.remove'))
            )
          ),
          h('div', { className: 'pc-hero-progress' }, h(VerticalProgress, { t, stage: task.stage }))
        ),
        h(
          'div',
          { className: 'pc-tabs', role: 'tablist' },
          tabs.map((item) =>
            h(
              'button',
              {
                type: 'button',
                role: 'tab',
                key: item.id,
                'aria-selected': tab === item.id,
                className: 'pc-tab' + (tab === item.id ? ' active' : ''),
                onClick: () => setTab(item.id)
              },
              item.label,
              item.count !== null ? h('span', { className: 'pc-tab-count' }, String(item.count)) : null
            )
          )
        ),
        tab === 'overview'
          ? h(
              'div',
              { className: 'pc-pane' },
              h('div', { className: 'pc-grid' }, h(SpecCard, { t, task }), h(ReportCard, { t, task })),
              h('div', { className: 'pc-grid' }, h(DecisionCard, { t, task }), h(UnitsSummary, { t, task })),
              h(HandoffSummary, { t, task })
            )
          : tab === 'candidates'
            ? h(
                'div',
                { className: 'pc-pane' },
                candidates.length === 0
                  ? h(Card, { title: t('tabs.candidates') }, h('p', { className: 'pc-note' }, t('value.noCandidates')))
                  : h(Card, { title: t('tabs.candidates'), hint: String(candidates.length) }, h(CandidateList, { t, candidates, expanded, onToggle: () => setExpanded(!expanded) }))
              )
            : h(PlanPane, { t, task })
      )
    }

    function Skeleton() {
      return h(
        'div',
        { className: 'pc-detail' },
        h('div', { className: 'pc-skel-card' }, h('div', { className: 'pc-skeleton', style: { width: '55%' } }), h('div', { className: 'pc-skeleton', style: { width: '30%' } })),
        h('div', { className: 'pc-skel-card' }, h('div', { className: 'pc-skeleton', style: { width: '40%' } }), h('div', { className: 'pc-skeleton', style: { width: '85%' } }), h('div', { className: 'pc-skeleton', style: { width: '70%' } }))
      )
    }

    function EmptyState({ t }) {
      return h(
        'section',
        { className: 'pc-empty' },
        h('div', { className: 'pc-empty-icon' }, h(WorkbenchIcon, { size: 22 })),
        h('h2', { className: 'pc-empty-title' }, t('page.empty.title')),
        h('p', { className: 'pc-empty-desc' }, t('page.empty.desc')),
        h(
          'ol',
          { className: 'pc-empty-steps' },
          [t('page.empty.step1'), t('page.empty.step2'), t('page.empty.step3')].map((step, index) =>
            h('li', { key: index }, h('span', { className: 'pc-step-num' }, String(index + 1)), h('span', {}, step))
          )
        ),
        h('div', { className: 'pc-mono', style: { marginTop: '8px', maxWidth: '540px' } }, t('page.empty.example'))
      )
    }

    function WorkbenchPage(props) {
      const t = typeof props?.t === 'function' ? props.t : dictT
      const onBack = typeof props?.onBack === 'function' ? props.onBack : null
      const [snapshot, setSnapshot] = React.useState({ loading: true, error: null, tasks: [] })
      const [selectedId, setSelectedId] = React.useState(null)
      const [detail, setDetail] = React.useState({ loading: false, error: null, task: null })
      const [busy, setBusy] = React.useState(false)
      const [lastSync, setLastSync] = React.useState(0)
      const [tab, setTab] = React.useState('overview')
      const [expanded, setExpanded] = React.useState(false)
      const mounted = React.useRef(true)
      const selectedRef = React.useRef(null)
      const inflight = React.useRef(false)
      const layoutRef = React.useRef(null)
      const bubbleRef = React.useRef(null)
      const taskRefs = React.useRef(new Map())
      const [neck, setNeck] = React.useState(null)

      selectedRef.current = selectedId

      React.useLayoutEffect(() => {
        const layoutEl = layoutRef.current
        const bubbleEl = bubbleRef.current
        const buttonEl = selectedId === null ? null : taskRefs.current.get(selectedId)
        if (!layoutEl || !bubbleEl || !buttonEl) {
          setNeck(null)
          return
        }
        const layoutRect = layoutEl.getBoundingClientRect()
        const bubbleRect = bubbleEl.getBoundingClientRect()
        const buttonRect = buttonEl.getBoundingClientRect()
        const top = buttonRect.top - layoutRect.top + 5
        const height = Math.max(24, buttonRect.height - 10)
        const left = buttonRect.right - layoutRect.left - 3
        const width = bubbleRect.left - buttonRect.right + 11
        if (width < 6 || top + height < bubbleRect.top - layoutRect.top || top > bubbleRect.bottom - layoutRect.top) {
          setNeck(null)
          return
        }
        setNeck({ top, height, left, width })
      }, [selectedId, snapshot.tasks, detail.task, tab, expanded])

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

      const refresh = React.useCallback(async () => {
        if (inflight.current) return
        inflight.current = true
        try {
          const result = await api('snapshot')
          if (!mounted.current) return
          const tasks = Array.isArray(result?.tasks) ? result.tasks : []
          setSnapshot({ loading: false, error: null, tasks })
          setLastSync(Date.now())
          const current = selectedRef.current
          const nextId = current !== null && tasks.some((task) => task.id === current) ? current : tasks.length > 0 ? tasks[0].id : null
          if (nextId !== current) {
            setSelectedId(nextId)
            setTab('overview')
            setExpanded(false)
          }
          if (nextId !== null) await loadDetail(nextId)
        } catch (error) {
          if (!mounted.current) return
          setSnapshot((current) => ({ ...current, loading: false, error: error && error.message ? error.message : String(error) }))
        } finally {
          inflight.current = false
        }
      }, [loadDetail])

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
          setTab('overview')
          setExpanded(false)
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
      const stageTask = task !== null ? task : snapshot.tasks.find((item) => item.id === selectedId) || null

      const header = h(
        'header',
        { className: 'pc-head' },
        h(
          'div',
          { className: 'pc-head-left' },
          h('span', { className: 'pc-logo' }, h(WorkbenchIcon, { size: 18 })),
          h(
            'div',
            {},
            h('h1', { className: 'pc-title' }, t('page.title')),
            h('p', { className: 'pc-subtitle' }, t('page.subtitle'))
          )
        ),
        h(
          'div',
          { className: 'pc-head-actions' },
          h(
            'span',
            { className: 'pc-sync', title: t('page.sync') },
            h('span', { className: 'pc-dot' + (snapshot.error === null ? '' : ' off') }),
            lastSync > 0 ? timeAgo(t, new Date(lastSync).toISOString()) : t('page.loading')
          ),
          h('button', { type: 'button', className: 'pc-btn', onClick: () => refresh(), disabled: snapshot.loading || busy }, h(RefreshIcon), t('page.refresh')),
          h('button', { type: 'button', className: 'pc-btn ghost', onClick: () => { if (typeof location !== 'undefined') location.reload() } }, t('page.reload')),
          onBack ? h('button', { type: 'button', className: 'pc-btn ghost', onClick: onBack }, t('page.back')) : null
        )
      )

      let body
      if (snapshot.loading && snapshot.tasks.length === 0) {
        body = h(Skeleton)
      } else if (snapshot.error !== null && snapshot.tasks.length === 0) {
        body = h(
          'div',
          { className: 'pc-error-banner' },
          h('span', {}, t('page.error') + ': ' + snapshot.error),
          h('button', { type: 'button', className: 'pc-btn', onClick: () => refresh() }, t('page.retry'))
        )
      } else if (isEmpty) {
        body = h(EmptyState, { t })
      } else {
        body = h(
          'div',
          {},
          h(
            'div',
            { className: 'pc-layout', ref: layoutRef },
            h(
              'aside',
              { className: 'pc-side' },
              h('div', { className: 'pc-side-head' }, h('span', {}, t('page.tasks')), h('span', { className: 'pc-chip' }, String(snapshot.tasks.length))),
              h(
                'div',
                { className: 'pc-side-list' },
                snapshot.tasks.map((item) =>
                  h(
                    'button',
                    {
                      type: 'button',
                      key: item.id,
                      ref: (el) => {
                        if (el) taskRefs.current.set(item.id, el)
                        else taskRefs.current.delete(item.id)
                      },
                      className: 'pc-task' + (item.id === selectedId ? ' active' : ''),
                      onClick: () => selectTask(item.id)
                    },
                    h('div', { className: 'pc-task-goal' }, String(item.goal || '')),
                    h(
                      'div',
                      { className: 'pc-task-meta' },
                      h('span', { className: 'pc-chip tone-' + (STAGE_TONE[item.stage] || 'muted') }, stageLabel(t, item.stage)),
                      h('span', {}, String(item.candidates) + ' ' + t('label.candidates').toLowerCase()),
                      h('span', {}, timeAgo(t, item.updatedAt))
                    )
                  )
                )
              )
            ),
            neck !== null
              ? h('div', { className: 'pc-neck', style: { top: neck.top + 'px', left: neck.left + 'px', width: neck.width + 'px', height: neck.height + 'px' } })
              : null,
            h(
              'div',
              { className: 'pc-detail' },
              detail.error !== null
                ? h(
                    'div',
                    { className: 'pc-error-banner' },
                    h('span', {}, detail.error),
                    h('button', { type: 'button', className: 'pc-btn', onClick: () => loadDetail(selectedId) }, t('page.retry'))
                  )
                : task === null
                  ? detail.loading
                    ? h(Skeleton)
                    : h('div', { className: 'pc-empty-detail' }, t('page.selectTask'))
                  : h(Detail, { t, task, busy, tab, setTab, expanded, setExpanded, onCancel: cancelTask, onRemove: removeTask, bubbleRef })
            )
          )
        )
      }

      return h('div', { className: 'pc-page' }, h('style', { key: 'pc-style' }, CSS), h('div', { className: 'pc-inner' }, header, body))
    }

    return {
      inject: ['slots', 'layout', 'locale'],
      apply(ctx) {
        const layout = ctx.get('layout')
        ctx.effect(() => ctx.locale.register(NS, { zh: DICT.zh, en: DICT.en }), 'plugcraft: locale dictionaries')
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
            { name: 'main', key: PANEL_ID, locale: NS },
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
