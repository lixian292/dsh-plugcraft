# Changelog

All notable changes to `dsh-plugin-workbench` are documented here.

## [0.12.0] - 2026-11-10

### Changed

- **Task detail is now a single “bubble”** connected to the selected task row: selecting a task grows a border/background boundary around all of its information panels, with a connector line and arrow from the task card to the bubble. Other tasks clearly belong to a different bubble.
- **Five-stage progress moved into the task info card** as a vertical stepper (clarify → search → decide → decompose → build). The fill animates smoothly to the active node, completed nodes show checks, and the active node has a subtle pulse.
- Removed the standalone full-width progress strip, reclaiming vertical space; the bubble/tab layout keeps the page short.
- Task list active row has a stronger brand edge so the selected task and its bubble read as one unit.

## [0.11.1] - 2026-11-10

### Changed

- Screenshots: the workspace/conversation list in the left sidebar is now blurred in every screenshot (`assets/screenshots/*.png`). The plugin navigation rail remains visible so the sidebar entry and feature context can still be seen; only personal workspace and session names are obscured.
- Repository history was squashed for the initial public release so earlier screenshots containing private workspace names are no longer reachable from `main`; the previous release asset was replaced.

## [0.11.0] - 2026-11-10

### Changed

- **Workbench page redesign** — shorter layout, more visual hierarchy and fewer scrolled-away sections:
  - removed the duplicated stage rail and the development/build footer and “M4” badge from the UI;
  - compact header with icon-only secondary actions and a live-sync indicator;
  - one slim five-step progress strip instead of a tall card grid;
  - detail view split into three tabs — **Overview / Candidates / Plan & handoff**;
  - candidate list shows five rows by default with a “show all” toggle; descriptions are clamped;
  - overview combines spec, search report, decision, unit summary and handoff summary in a two-column grid;
  - verification checks and install results live in the plan tab instead of the main scroll.
- UI text no longer mentions milestones, build dates or development status; version/stage info comes from the task itself.
- Screenshots (overview, candidates, plan & handoff, generated result) added under `assets/screenshots/` and declared in `screenshots.json`; README now leads with a screenshot tour and emphasizes the reuse-first workflow.

## [0.10.0] - 2026-11-10

### Changed

- **Renamed the project to Plugcraft (`dsh-plugcraft`).** The previous name `dsh-plugin-workbench` was too generic and collided with unrelated plugins on npm and in the ecosystem. The GitHub repository, npm package (planned), bundle row, client module id and install commands all use the new name; `dsh-plugin-workbench` remains only as a historical reference in this changelog.
- UI display name is **Plugcraft** in English and **插件工坊 / 插件工作台** in Chinese; the tool and skill keep their functional names (`plugin_workbench`, `plugin-workbench`).
- Install channels for the first release are GitHub and GitHub Release tarballs; npm registration was unavailable, so `dsh-plugcraft` on npm is planned rather than published.

## [0.9.1] - 2026-11-09

### Changed

- npm package renamed to `@lixian292/dsh-plugin-workbench`: the unscoped `dsh-plugin-workbench` name belongs to an unrelated, discontinued plugin. The GitHub repository keeps its name.
- README rewritten for onboarding: separate English (`README.md`) and Chinese (`README.zh.md`) files, quick start, pipeline overview, configuration and development sections; development history moved to this changelog.
- GitHub Actions CI enabled at `.github/workflows/ci.yml` (token now has the `workflow` scope).

### Added

- `assets/screenshots/workbench.png` and `screenshots.json` (marketplace screenshots).
- `assets/icon-180.png` and a marketplace `icon:` entry (raster icon, as the registry requires).
- `prepublishOnly` check for npm releases.

## [0.9.0] - 2026-11-09

First public release candidate.

### Changed

- Project/package name is `dsh-plugin-workbench`; `package.json` now declares `homepage`, `repository` and `bugs` pointing at the public repository.
- GitHub token file lookup accepts both `github-token.txt` and `github_token.txt`, in `$DSH_HOME/plugin-workbench/` or the workspace directory; the workspace fallback lets users keep the token next to the project without editing DSH home.
- `status` reports `githubAuth: "token" | "anonymous"`; the workbench search report shows the same as an `auth · …` chip.

## [0.8.0] - 2026-11-09

### Added

- **Optional GitHub token** for higher search quota and fewer anonymous rate-limit failures:
  - resolution order: `DSH_GITHUB_TOKEN` → `DSH_PLUGIN_WORKBENCH_GITHUB_TOKEN` → `GITHUB_TOKEN` → `$DSH_HOME/plugin-workbench/github-token.txt`;
  - with a token, the Host calls the GitHub REST API through Node `fetch` with a bearer header; without one it keeps using the Harness web fetch seam anonymously;
  - the token never enters task state, the page API, logs or the model context; invalid-token and rate-limit errors are reported without echoing it;
  - `action: "search"` reports `githubAuth: "token" | "anonymous"`.
- **Test suite (zero dependencies)**: `npm test` runs `node --test test/` covering verification fixtures, keyword/ranking adapters, GitHub token paths and a full tool flow with fake Host services.
- **`npm run check`**: parses every JavaScript file (`node --check`) and validates every JSON file.
- **GitHub Actions CI** for Node 22 and 24 running `check` + `test`.
- README: GitHub token setup, development/testing, and publishing sections.

## [0.7.0] - 2026-11-09

### Fixed

- **The workbench page showed `读取失败: HTTP 405` after a DSH restart.** The `/workbench/api` route was registered with a one-shot `ctx.get('webServer')` during `apply`; on a fresh boot the web server can come up later, so the route was silently skipped and POST requests fell through to the SPA fallback (405 GET/HEAD). Every host registration (webServer route, tools, skills, commands) now waits for its service with `ctx.inject([...], ...)`, so a late-starting service still gets its registration.

### Added

- `record_install` action: after the `plugin_manager` tool reports an `application` value, the agent closes the task with `plugin_workbench { action: "record_install", taskId, application, packageName?, version? }`. The host stores the install result, moves the stage to `done` (or `install_failed`) and the workbench page renders it in an "Install result" card.
- Task state and page API expose `installStatus` / `install`.

## [0.6.0] - 2026-11-09

### Added

- **M3.5 verification**: new `verify` tool action (`plugin_workbench { action: "verify", taskId, packageDir }`). The Host validates a generated bundle deterministically and without executing it:
  - `package.json` parses and declares name/version/type/exports;
  - `dsh.bundle.patch` points to an existing patch that inserts the package by name;
  - `dsh.client` (when present) declares `platform: "web"`, exports `./client` and has a `client.js` that uses `window.__ModuleLoader__`;
  - `locale/zh.json` and `locale/en.json` carry `meta.title`, and the icon file exists;
  - every JavaScript file parses via `node --check` (source is never run).
- Verification results are stored on the task (`handoff.validation`), shown in the workbench handoff card (passed/failed checks and warnings), and the stage becomes `verifying` or `verification_failed`.
- Skill instructions now require `verify` after a Creator run and before asking the user to install.

### Changed

- Workbench handoff card renders a verification block with per-check results.
- New stage label for `verification_failed`.

## [0.5.0] - 2026-11-09

### Fixed

- **Workbench skill failed to load** with `loaded skill plugin-workbench source must be a string`. Runtime skill registrations must carry a `source`; the registration now sets it explicitly. This is why a plugin-creation attempt could "work" while the workbench never recorded a task.

### Changed

- Workbench page rebuilt for clarity and density:
  - branded header with live sync indicator, refresh / reload / back actions;
  - five-stage rail with active/done states;
  - sticky task list plus detail column;
  - spec and search report as a two-column grid;
  - candidate cards with source-colored rail, score bar and install spec;
  - decision, capability units and handoff rendered as dedicated cards, with a numbered install/handoff timeline;
  - skeleton loading state, empty state with a three-step "how to start" guide, error banner;
  - footer build stamp (`v0.5.0 · BUILD`) to make stale client bundles obvious.
- Auto refresh now reloads both the task list and the selected task detail every 4 seconds, and immediately when the page becomes visible or the window regains focus.
- Added a "Reload UI" action to recover from a stale client module generation.

### Added

- `/workbench` command (from 0.2.0) and the `plugin-workbench` skill (fixed here).
- `host/handoff.js`: install plan and Creator sub-agent handoff (0.4.0).
- Same-origin `POST /workbench/api` data route (0.3.0).

## [0.4.0] - 2026-11-09

### Added

- Handoff action: `install` returns an exact package spec for the approval-gated `plugin_manager` tool; `fork` / `create` start a Creator sub-agent with the `cordis` preset in its own context.
- Task records store the handoff route, package name, child id and status.
- Workbench page renders handoff status and install steps.

## [0.3.0] - 2026-11-09

### Added

- Workbench page reads real task data over a same-origin `POST /workbench/api` route (`snapshot`, `task`, `cancel`, `remove`); cross-origin requests are rejected.
- Task list, stage rail, spec, candidate cards, search report, decision, capability units and plan are rendered from the store.
- Curated market catalog adapter with a 24-hour on-disk cache.

## [0.2.0] - 2026-11-09

### Added

- Host orchestration: persistent task store, `plugin_workbench` tool (`start`, `update_spec`, `search`, `get_report`, `record_decision`, `set_decomposition`, `status`, `cancel`), on-demand skill and `/workbench` command.
- Reuse search across installed plugins, the curated market catalog and GitHub, with deterministic ranking and a compact model-facing summary.

## [0.1.0] - 2026-11-09

### Added

- Initial bundle: sidebar entry (next to Plugins / Market / Context insights), full-page workbench shell, zh/en localization, plugin icon.
