# dsh-plugin-workbench

[中文](#中文) | [English](#english)

---

## 中文

> 仓库：<https://github.com/lixian292/dsh-plugin-workbench> · 市场条目：[`market-entry.yml`](market-entry.yml)（仓库满 24 小时后提交 PR）

**插件工作台**是 DeepSeek Harness（DSH）的插件创建编排器：它不急着写代码，而是先帮你判断"这个插件该不该自己写"。

流程固定为五步：

1. **需求澄清** —— 把一句话需求整理成结构化需求（目标、入口、数据、验收标准）。
2. **检索复用** —— 依次检索：本机已装插件 → DSH 插件市场/目录 → GitHub 仓库 → 仓库详情。
3. **匹配决策** —— 全量匹配时询问用户：直接使用 / 在此基础上 DIY / 仅参考实现。
4. **解构补缺** —— 部分匹配时把需求拆成能力单元，映射到可复用实现，只留下缺口清单。
5. **实现验证** —— 把缺口交给 Creator 子代理实现，校验后安装并验证。

设计目标：**减少重复造轮子，并显著降低父会话 token 消耗**（检索与生成在宿主侧或子代理内完成，主对话只收摘要与决策）。

### 当前状态

**M3.5（结构校验 + 安装闭环）**：新增 `verify` 与 `record_install` 两个工具动作。Creator 生成插件后，Host 会**不执行生成代码**地做结构校验（manifest / patch / client / locale / icon / `node --check`）；安装完成后，Agent 用 `record_install` 把 `plugin_manager` 返回的 `application` 回写任务，阶段进入「已完成 / 安装失败」，页面新增「安装结果」卡片。

**M4（发布准备，进行中）**：界面重做（顶部品牌区、阶段轨道、任务列表 + 详情双栏、来源着色候选卡、决策/能力单元/交接/校验/安装结果卡片、骨架屏与错误态、自动刷新、构建标记）；新增**可选 GitHub token**、**零依赖测试套件**（`npm test`）、`npm run check` 与 GitHub Actions CI。构建标记：`v0.9.0 · BUILD`。

**已修复**：① `plugin-workbench` Skill 缺 `source` 导致加载失败；② DSH 重启后 Host 启动早于 webServer 服务导致 `/workbench/api` 路由未注册、页面报 `HTTP 405`（现在所有 Host 注册都通过 `ctx.inject([...])` 等待服务就绪）。

### 使用

装好后在任意会话里直接描述需求，例如：

> 帮我做一个能在 DSH 里管理每日待办、把数据存在本地的插件。

Agent 会加载 `plugin-workbench` Skill，并依次调用 `plugin_workbench`：`start` → `update_spec` → `search` → 询问你「直接用 / DIY / 仅参考 / 从零」→ `record_decision` → `set_decomposition`。所有状态保存在 `$DSH_HOME/plugin-workbench/state.json`，也可以用 `/workbench` 查看当前任务。

### 安装

在 DSH 的插件页面安装本地 bundle，或通过 `plugin_manager` 安装：

```
plugin_manager install_bundle <此目录的绝对路径>
```

安装后在左侧栏出现「插件工作台」入口（与「插件市场」「上下文洞察」同组），点击打开工作台页面。

### 安全说明

- 所有任务数据只保存在本机 `$DSH_HOME/plugin-workbench/`（`state.json` 与市场缓存）。
- 工作台页面通过同源 `POST /workbench/api` 读取数据；跨源请求与跨站 `sec-fetch-site` 会被拒绝。该路由仅随本机 Harness 的 loopback web 服务提供。
- 安装第三方插件始终需要用户明确确认；工作台不会静默安装插件，也不会直接改写 profile 的 `package.json` / `cordis.patch.yml`。
- 市场目录来自 `awesome-dsh-plugin.com`，首次检索时下载并缓存 24 小时；如不希望联网，可在后续版本中关闭市场源。

### GitHub token（可选）

匿名调用 GitHub 有较低配额（搜索约 10 次/分钟），高频使用时建议配置一个只读 token。解析顺序：

1. 环境变量 `DSH_GITHUB_TOKEN`
2. 环境变量 `DSH_PLUGIN_WORKBENCH_GITHUB_TOKEN`
3. 环境变量 `GITHUB_TOKEN`
4. 文件 `$DSH_HOME/plugin-workbench/github-token.txt`（或 `github_token.txt`）；也接受工作区目录下的同名文件。第一行即 token，注意不要提交到 git（`.gitignore` 已包含这两个文件名）

配置后检索走 Node `fetch` + Bearer 头；未配置时仍走 Harness 的匿名 web fetch。token 不会进入任务状态、页面 API、日志或模型上下文。工具返回里的 `githubAuth` 会报告当前是 `token` 还是 `anonymous`。

### 开发与测试

- 纯 JavaScript，无需构建：`index.js`（Host 半）+ `client.js`（浏览器半），Node ≥ 22。
- 浏览器半使用 `window.__ModuleLoader__.load({ id, factory })` 格式，React 来自宿主的共享模块表。
- 样式只使用 `--dsw-alias-*` 主题 token，自动适配明暗主题。
- 修改 `client.js` 后重新安装 bundle 或重启 DSH 以加载新的模块代。
- `npm run check`：对所有 JS 做 `node --check`，并校验所有 JSON。
- `npm test`：零依赖测试（`node --test test/`），覆盖结构校验 fixtures、关键词/排序、GitHub token 路径、以及带假 Host 服务的完整工具流程。
- CI 配置已随仓库提供为 [`docs/ci.yml`](docs/ci.yml)；要启用 GitHub Actions，把它复制到 `.github/workflows/ci.yml`（推送该路径需要带 `workflow` scope 的 token 或直接在 GitHub 网页添加）。

### 发布到市场

仓库：<https://github.com/lixian292/dsh-plugin-workbench>

1. `package.json` 的 `name`（`dsh-plugin-workbench`）、`version`、`repository`、`homepage`、`author` 已就绪；
2. 推送代码并给仓库添加 `dsh-plugin` topic；
3. 向 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) 提交 `data/plugins/lixian292__dsh-plugin-workbench.yml`（一个文件即全部投稿；README 由维护者生成，不要手改）；
4. 可选：发布 npm 包（市场可显示下载量）；或在 GitHub Release 附预构建 `.tgz` 并在条目标 `tarball:`。
5. 市场要求仓库**创建满 1 天**后才能通过 CI，请在仓库满 24 小时后再提 PR；条目内容在 [`market-entry.yml`](market-entry.yml)，可用 `node scripts/submit-market.mjs --token-file <file> --pr` 自动 fork + 提交 PR。

### 路线图

| 里程碑 | 内容 | 状态 |
|---|---|---|
| M0 | 侧栏入口 + 工作台页面骨架 + 本地化 | ✅ |
| M1 | Host 状态机、检索适配（已装/市场/GitHub）、`plugin_workbench` 工具与 Skill | ✅ |
| M2 | 工作台页面数据接入（任务列表/候选卡/匹配报告/复用计划） | ✅ |
| M3 | Creator 交接（install 方案 + fork/create 子代理） | ✅ 基础版 |
| M3.5 | 结构校验（`verify`）+ 安装结果回写（`record_install`） | ✅ |
| M4 | 界面打磨、自动刷新、GitHub token、测试/CI、发布准备 | 🚧 进行中 |

### 设计文档

- 需求分析与设计方案：见同工作区的 `插件工作台设计/插件工作台-需求分析与设计方案.md`。
- 官方插件开发规范：`cordis-plugin-development` Skill（DSH 随包提供）。

### 许可

MIT。见 [LICENSE](LICENSE)。

---

## English

> Repository: <https://github.com/lixian292/dsh-plugin-workbench> · Market entry: [`market-entry.yml`](market-entry.yml) (PR after the repository is 24h old)

**Plugin Workbench** is a plugin-authoring orchestrator for DeepSeek Harness (DSH). It does not rush into writing code. It first decides whether the plugin should be written at all.

Fixed five-stage pipeline:

1. **Clarify** the request into a structured spec (goal, surface, data, acceptance).
2. **Search & reuse**: installed plugins → DSH market/catalog → GitHub repositories → repository details.
3. **Decide**: on a full match, ask the user to use it as-is, DIY on top, or use it as reference only.
4. **Decompose & fill gaps**: on a partial match, split the need into capability units and map them to existing implementations; leave only a gap list.
5. **Build & verify**: hand the gaps to a Creator sub-agent, validate, install and verify.

The point: **avoid reinventing wheels and cut parent-session token usage** — retrieval and generation happen in the Host or in sub-agents, while the main conversation only receives summaries and decisions.

### Status

**M3.5 (verification and install closure)**: the `verify` tool action validates a generated bundle deterministically and without executing it — manifest fields, `dsh.bundle.patch` target and insert row, `dsh.client` / `./client` / `client.js`, locale `meta.title`, icon presence, and `node --check` parsing of every JavaScript file. After installation, the agent closes the task with `record_install` (the `application` value from `plugin_manager`), which moves the stage to `done` / `install_failed` and renders an "Install result" card.

**M4 (release prep, in progress)**: rebuilt UI (branded header, stage rail, task list + detail, source-colored candidates, decision/unit/handoff/verification/install cards, skeleton/error states, auto refresh, build stamp); optional **GitHub token**; zero-dependency **test suite** (`npm test`); `npm run check`; GitHub Actions CI. Build stamp: `v0.9.0 · BUILD`.

**Fixed**: ① the `plugin-workbench` skill failed to load because its runtime registration was missing `source`; ② after a DSH restart the `/workbench/api` route was never registered because the host plugin applied before the web server service existed, so the page showed `HTTP 405`. All host registrations now wait for their service via `ctx.inject([...])`.

### Usage

Describe the need in any session, for example:

> Build a plugin that manages a daily todo list inside DSH and stores the data locally.

The agent loads the `plugin-workbench` skill and walks the tool: `start` → `update_spec` → `search` → asks you `use as-is / DIY / reference only / from scratch` → `record_decision` → `set_decomposition`. Task state lives in `$DSH_HOME/plugin-workbench/state.json`; `/workbench` prints the current task.

### Install

Install this local bundle from the DSH Plugins page, or through `plugin_manager`:

```
plugin_manager install_bundle <absolute path to this directory>
```

After installation a **Plugin Workbench** entry appears in the left sidebar (next to Plugins / Market / Context insights). Click it to open the page.

### Security

- All task data stays locally in `$DSH_HOME/plugin-workbench/` (`state.json` and the market cache).
- The page reads data over a same-origin `POST /workbench/api`; cross-origin requests and cross-site `sec-fetch-site` values are rejected. The route is only served by the local Harness loopback web server.
- Installing third-party plugins always needs explicit user confirmation; the workbench never installs silently and never rewrites the profile's `package.json` / `cordis.patch.yml` directly.
- The market catalog comes from `awesome-dsh-plugin.com`; it is downloaded on first search and cached for 24 hours.

### GitHub token (optional)

Anonymous GitHub access has a low quota (about 10 search requests per minute). For heavier use, configure a read-only token. Resolution order:

1. `DSH_GITHUB_TOKEN`
2. `DSH_PLUGIN_WORKBENCH_GITHUB_TOKEN`
3. `GITHUB_TOKEN`
4. `$DSH_HOME/plugin-workbench/github-token.txt` or `github_token.txt`; the workspace directory is also searched. First line is the token; never commit it — both filenames are in `.gitignore`

With a token the Host calls the GitHub REST API through Node `fetch` with a bearer header; without one it keeps using the Harness web fetch seam anonymously. The token never enters task state, the page API, logs or model context. Tool results report `githubAuth: "token" | "anonymous"`.

### Development & tests

- Plain JavaScript, no build step: `index.js` (Host half) + `client.js` (browser half), Node ≥ 22.
- The browser half uses `window.__ModuleLoader__.load({ id, factory })`; React comes from the host module table.
- Styles use `--dsw-alias-*` theme tokens only, so light/dark themes follow the host.
- Reinstalling the bundle or restarting DSH loads a new module generation after `client.js` changes.
- `npm run check`: `node --check` every JavaScript file and validate every JSON file.
- `npm test`: zero-dependency tests (`node --test test/`) over verification fixtures, keyword/ranking adapters, the GitHub token paths and a full tool flow with fake Host services.
- The CI workflow ships as [`docs/ci.yml`](docs/ci.yml); to enable GitHub Actions, copy it to `.github/workflows/ci.yml` (pushing that path requires a token with the `workflow` scope, or add it in the GitHub web UI).

### Publishing

Repository: <https://github.com/lixian292/dsh-plugin-workbench>

1. `package.json` already declares the package name (`dsh-plugin-workbench`), version, repository, homepage and author;
2. Push the code and add the `dsh-plugin` topic to the repository;
3. Submit `data/plugins/lixian292__dsh-plugin-workbench.yml` to [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) (one file is the whole submission; the READMEs are generated, never edit them by hand);
4. Optional: publish to npm (storefronts can show downloads), or attach a prebuilt `.tgz` to a GitHub release and declare `tarball:` in the entry.
5. The market requires the repository to be **at least 1 day old** before CI passes — open the PR after the first 24 hours. The entry content is in [`market-entry.yml`](market-entry.yml); `node scripts/submit-market.mjs --token-file <file> --pr` forks the registry and opens the PR for you.

### License

MIT. See [LICENSE](LICENSE).
