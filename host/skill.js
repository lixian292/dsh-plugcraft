/** Model-facing skill: when and how to run the reuse-first pipeline. */
export const SKILL_DESCRIPTION =
  'Use when the user wants to build/add a DeepSeek Harness plugin, asks whether an existing DSH plugin already covers a need, or wants to extend one. Runs the reuse-first pipeline: clarify → search installed/market/GitHub → user decision → capability decomposition → build only the gaps. Prefer it over ad-hoc web research.'

export const SKILL_CONTENT = `# Plugin Workbench

Reuse-first pipeline for authoring DeepSeek Harness (DSH) plugins. The Host tool \`plugin_workbench\` owns the task state and does the retrieval; this skill defines when and how to use it.

## When to use this skill

- The user wants to create, add, or extend a DSH plugin: a tool, panel, page, view, command, skill, model provider, or MCP bridge.
- The user asks "is there already a plugin for X?" or "can we reuse something for this?" in the context of a plugin need.
- The user wants to DIY on top of an existing DSH plugin instead of starting from zero.

Do **not** use it for normal coding tasks, for changing a third-party plugin's configuration, or for questions that the built-in feature set already answers directly.

## Non-negotiable rules

1. **Do not design or write plugin code before the reuse search has run.** The whole point of the workbench is to avoid reinventing a wheel.
2. Start with \`plugin_workbench { action: "start", goal }\`. Keep one task per plugin need.
3. Fill the structured spec before searching: \`surface\` (host tool / client view / panel / command / skill / mixed), \`mustCapabilities\`, inputs, outputs, data sources, acceptance criteria, constraints. Ask the user only about facts that change the design; bundle at most three questions with \`ask_user_question\`.
4. Run \`action: "search"\`. Read the compact candidate list first. Call \`action: "get_report"\` only when you need descriptions or install specs for specific candidates — never paste it into chat.
5. The reuse decision belongs to the user. Ask with \`ask_user_question\` using exactly these options:
   - \`use_as_is\` — install and use the found plugin unchanged
   - \`diy\` — build on top of the found plugin, keep its working parts
   - \`reference_only\` — do not install it, use its code/APIs as a reference
   - \`from_scratch\` — nothing reusable, build from zero
   Then call \`action: "record_decision"\`.
6. For \`diy\` / \`reference_only\` / \`from_scratch\`, decompose the need into capability units and call \`action: "set_decomposition"\`. Every unit has an acceptance check and either a \`reuse\` source (plugin, DSH slot/service, library) or a \`gap\` to implement.
7. Only after the user confirms the reuse map and plan may implementation start. Call \`action: "handoff"\` with the confirmed route:
   - \`install\` — the Host returns the exact package spec. Ask the user to confirm installing it, then call the \`plugin_manager\` tool (\`action: "install_bundle"\`, target = that spec). Whatever \`application\` value it returns, call \`plugin_workbench { action: "record_install", taskId, application, packageName?, version? }\` to close the task, then report that value to the user. Never claim the plugin is installed before the host confirms it.
   - \`fork\` / \`create\` — the Host starts a Creator sub-agent in its own context (the \`cordis\` preset). Do not poll it; wait for the completion notice. When it finishes, call \`action: "verify"\` with \`packageDir\` (the directory the Creator wrote, e.g. \`.dsh-created-plugins/<packageName>\`). The Host validates the bundle structure and parses its JavaScript without executing it; report the failed checks if any, fix or re-run the Creator, then call verify again. Only after it passes may you ask the user whether to install it (still through the \`plugin_manager\` tool), and only after that call \`record_install\` with the returned \`application\`.
8. Report only: task id, stage, source counts, matched candidates (name + URL + one-line reason), the decision, and the gap count. Full state lives in the workbench page.

## Token discipline

- Do not run \`web_search\` / \`web_fetch\` yourself for plugin discovery. The Host searches installed plugins, the market catalog, and GitHub, and returns a compact summary.
- Do not repeat the search when the user only asks a follow-up question; read \`status\` or the existing report instead.
- Keep the model-facing summary under ten bullets.

## Current milestone

- Supported actions: \`start\`, \`update_spec\`, \`search\`, \`get_report\`, \`record_decision\`, \`set_decomposition\`, \`handoff\`, \`verify\`, \`record_install\`, \`status\`, \`cancel\`.
- \`handoff\` routes: \`install\` returns an install plan for the \`plugin_manager\` tool; \`fork\` / \`create\` start a Creator sub-agent with the confirmed brief.
- \`verify\` performs structural checks and \`node --check\` parsing on a generated bundle (no execution).
- Not yet automated: installation itself stays with you (the agent) through the \`plugin_manager\` tool, with explicit user confirmation.

## Reference

- Authoring rules: load the official \`cordis-plugin-development\` skill only when implementation starts.
- Common UI extension points: \`conversation.view\` (session tab), \`sidebar.panellist\` + \`main\` (global page like this workbench), \`conversation.session.header.actions\` (header button).
`
