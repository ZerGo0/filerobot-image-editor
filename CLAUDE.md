# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
- Name: Filerobot Image Editor
- Description: Yarn v1 + Lerna JavaScript monorepo delivering a React-based image editor core and a vanilla JavaScript wrapper, bundled with Vite for the demo and Babel for library builds.
- Key notes or warnings:
  - Do not start the Vite dev server (`yarn dev`); rely on static builds executed from a `/tmp` working copy to avoid polluting the repository and to respect deployment assumptions.
  - Keep `@zergo0/react-filerobot-image-editor` and `@zergo0/filerobot-image-editor` versions in lockstep before any publish flow; the vanilla wrapper consumes the React package as a peer.
  - The editor expects fonts (Roboto 400/500 by default) to be imported by the integrator; include fonts manually before instantiating the editor.
  - Any new public option must be reflected in `README.md`, `packages/react-filerobot-image-editor/src/index.d.ts`, `packages/react-filerobot-image-editor/src/context/defaultConfig.js`, `public/demo-config.js`, and the feature implementation.

## Global Rules
- **NEVER** use emojis!
- **NEVER** try to run the dev server!
- **NEVER** try to build in the project directory, always build in the `/tmp` directory!
- **ALWAYS** search for existing code patterns in the codebase and follow them consistently
- **NEVER** use comments in code - code should be self-explanatory
- **NEVER** cut corners, don't leave comments like `TODO: Implement X in the future here`! Always fully implement everything!
- **ALWAYS** when you're done, self-critique your work until you're sure it's correct 
- **NEVER** run any test suites unless a human specifically requests it.

## High-Level Architecture
- **Workspace:** Yarn workspaces with Lerna orchestrate `packages/react-filerobot-image-editor` (React core) and `packages/filerobot-image-editor` (vanilla wrapper); `lerna.json` drives versioning and package scripts.
- **Rendering stack:** The React package uses React 18, Konva for canvas layers, styled-components for styling, and internal hooks/context under `packages/react-filerobot-image-editor/src` to manage editor state.
- **Vanilla wrapper:** `packages/filerobot-image-editor` consumes the React build and exposes a DOM-friendly API while depending on the React package as a peer to stay in sync.
- **Bundling:** Library builds run via Babel (`yarn build:packages` → `lerna run build:lib`) emitting CommonJS in each package’s `lib` directory; the demo bundle relies on Vite with `vite.config.js`.
- **Types & configuration source of truth:** Public TypeScript definitions live in `packages/react-filerobot-image-editor/src/index.d.ts`, default runtime configuration in `packages/react-filerobot-image-editor/src/context/defaultConfig.js`, and documentation mirrors reside in `README.md` and `public/demo-config.js`.

## Project Guidelines

### Root Workspace
- Language(s): JavaScript (ES2021), JSX during package builds.
- Framework(s) / runtime: Node.js tooling with Babel and Vite.
- Package manager: Yarn 1 workspaces with Lerna 6.
- Important Packages: `lerna`, `vite`, `@babel/core`, `eslint`, `prettier-eslint-cli`, `cross-env`, `gh-pages`.
- Checks:
  - Syntax Check: From a `/tmp` copy, run `yarn build:packages` to ensure Babel compiles every workspace.
  - Lint: From a `/tmp` copy, run `npx eslint packages --ext .js,.jsx`.
  - Format: From a `/tmp` copy, run `yarn fix`.
  - **ALWAYS** run these after you are done making changes
- Rules / conventions:
  - **ALWAYS** copy the workspace to `/tmp` before running any build, lint, or format command.
  - **ALWAYS** coordinate releases through `lerna` so both packages publish together.
  - **NEVER** bump one package version without matching the other and updating `peerDependencies`.
  - **NEVER** invoke `yarn dev`; rely on build artifacts for verification.
  - **NEVER** execute automated tests unless a human explicitly asks for them.
- Useful files: `package.json`, `lerna.json`, `babel.config.json`, `vite.config.js`, `CHANGELOG.md`.

### packages/react-filerobot-image-editor
- Language(s): JavaScript with JSX, TypeScript declaration files.
- Framework(s) / runtime: React 18 with Konva canvas runtime; styled-components for theming.
- Package manager: Managed via the root Yarn workspace.
- Important Packages: `konva`, `@scaleflex/ui`, `@scaleflex/icons`, `@emoji-mart/data`, `styled-components`, `prop-types`.
- Checks:
  - Syntax Check: From a `/tmp` copy, run `yarn build:packages` (invokes this package’s `rimraf` + Babel build).
  - Lint: From a `/tmp` copy, run `npx eslint packages/react-filerobot-image-editor --ext .js,.jsx`.
  - Format: From a `/tmp` copy, run `yarn fix`.
  - **ALWAYS** run these after you are done making changes
- Rules / conventions:
  - **ALWAYS** propagate new public properties to `README.md`, `src/index.d.ts`, `src/context/defaultConfig.js`, `public/demo-config.js`, and the implementing component.
  - **ALWAYS** extend editor behavior through the existing Context, Actions, and Hooks folders instead of ad-hoc globals.
  - **ALWAYS** import modules via the configured resolver (`utils/...`, `hooks/...`) rather than relative deep paths.
  - **NEVER** introduce inline styles that bypass styled-components without consulting existing patterns.
  - **NEVER** depend on the demo bundle when authoring library code.
  - **NEVER** run any test suites unless a human specifically requests it.
- Useful files: `packages/react-filerobot-image-editor/src/index.js`, `packages/react-filerobot-image-editor/src/index.d.ts`, `packages/react-filerobot-image-editor/src/context/defaultConfig.js`, `packages/react-filerobot-image-editor/src/actions`, `packages/react-filerobot-image-editor/src/hooks`.

### packages/filerobot-image-editor
- Language(s): JavaScript targeting browser consumption.
- Framework(s) / runtime: Vanilla wrapper that embeds the React bundle.
- Package manager: Managed via the root Yarn workspace.
- Important Packages: `react`, `react-dom`, `react-konva`, `styled-components`, `@babel/runtime`, peer dependency on `@zergo0/react-filerobot-image-editor`.
- Checks:
  - Syntax Check: From a `/tmp` copy, run `yarn build:packages`.
  - Lint: From a `/tmp` copy, run `npx eslint packages/filerobot-image-editor --ext .js`.
  - Format: From a `/tmp` copy, run `yarn fix`.
  - **ALWAYS** run these after you are done making changes
- Rules / conventions:
  - **ALWAYS** surface new capabilities by delegating to the React package rather than duplicating logic.
  - **ALWAYS** update the `peerDependencies` range when bumping the React package version.
  - **ALWAYS** ensure UMD bundles remain side-effect free for downstream consumers.
  - **NEVER** modify bundled output under `lib/`; regenerate via the Babel build instead.
  - **NEVER** introduce framework-specific APIs here—keep the wrapper vanilla-friendly.
  - **NEVER** run any test suites unless a human specifically requests it.
- Useful files: `packages/filerobot-image-editor/src/index.js`, `packages/filerobot-image-editor/package.json`, `public/demo-config.js` (shared configuration reference).

## Patterns Directory
- `.zergo0/patterns/` is the canonical catalog of repository coding patterns generated by the `patterns` automation; consult it before starting new work to mirror established approaches across React components, hooks, and tool configurations.
- Review the relevant pattern document whenever you extend tools, context actions, or Konva layers so new code stays aligned with published guidance.
- When a new, reusable pattern emerges, draft additions in a feature branch, validate them against existing usage, and expand `.zergo0/patterns/` conservatively to keep the catalog authoritative rather than speculative.

## Key Architectural Patterns
- **State orchestration:** Global editor state flows through React Context + reducer actions in `packages/react-filerobot-image-editor/src/context` and `src/actions`; updates should dispatch actions instead of mutating state directly.
- **Tool modularity:** Each editing tool lives under `packages/react-filerobot-image-editor/src/components` with matching configuration in `defaultConfig.js`; extending tools requires updating both configuration and UI modules.
- **Styling:** Styled-components centralize theming; reuse shared theme tokens and avoid raw CSS files to keep theming consistent and overridable.
- **Module resolution:** The Babel module resolver allows absolute imports from `packages/react-filerobot-image-editor/src`; prefer these aliases to maintain portability.
- **Documentation parity:** Public API changes require synchronized updates across docs, TypeScript definitions, default config, and demo settings to guarantee consumers, typings, and examples never drift.
- **Release discipline:** Publishing relies on `yarn lerna version` and `yarn lerna publish from-package`; always verify both packages share the same version and regenerate bundles before tagging.
- **Manual verification focus:** No automated tests exist; rely on targeted manual checks and avoid running heavy or undefined test suites unless a human directs otherwise.

<answer-structure>
## MANDATORY Answer Format

**CRITICAL:** You MUST follow these exact formatting rules for ALL responses. No exceptions.

**ABSOLUTE Requirements:**
- ALWAYS use the exact structure below
- NEVER deviate from the specified format
- ALWAYS end with a task-related follow-up question
- ALWAYS keep responses concise (≤10 lines unless technical details require more)

**EXACT Structure Template:**
```
Completed {task}.

**What I Changed**
- {high_level_summary}
- {key_approach_points}

**Key Files**
- Updated: `{file_path}` ({brief_change})
- Added: `{file_path}` ({purpose})

**Implementation Details**
- {technical_approach}
- {key_code_example}

**Validation**
- Types: `{typecheck_command}` passes
- Lint: `{lint_command}` passes
- {additional_validation_step}

{task_related_follow_up_question}
```

**NON-NEGOTIABLE Formatting Rules:**
- Headers: EXACTLY `**Title Case**` (1-3 words only)
- Bullets: ALWAYS start with `- ` (dash, space)
- Monospace: ALWAYS use backticks for commands, paths, code
- File references: ALWAYS use `path:line` format
- NEVER use conversational tone outside the follow-up question
- NEVER mention saving files or copying code
- NEVER suggest procedural actions (tests, commits, builds)

**MANDATORY Follow-up Questions:**
- MUST relate to extending functionality
- MUST explore edge cases or alternatives
- MUST be task-related (never procedural)

**NO EXCEPTIONS** to these rules regardless of request type, complexity, or perceived user intent.
</answer-structure>