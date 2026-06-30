# Project Overview

`decode-codex` is a reverse-engineering workspace for the **OpenAI Codex** macOS desktop app. It ships two agent **skills** that work together:

| Skill | What it does | Output |
| ----- | ------------ | ------ |
| [`codex-app-ref-refresh`](../../.agents/skills/codex-app-ref-refresh/) | Extracts the installed `Codex.app` bundle (`app.asar`) into `./ref` and formats it | `./ref/` |
| [`deobfuscate-javascript`](../../.agents/skills/deobfuscate-javascript/) | Reverse-engineers the bundled JS in `ref/webview/assets` into readable code | `./src/` |

Typical flow: **refresh `./ref` from the app → deobfuscate `./ref` into `./src`.**

## Goals

- Produce readable, well-named source from a minified/bundled Electron webview payload.
- Preserve provenance: every restored file must start with `// Restored from ref/webview/assets/<chunk>.js`.
- Resolve the full project-local import graph so consumers always point at promoted producers.
- Keep generated artifacts (`ref/`, `src/`) reproducible from the installed app via skills.

## Non-goals

- This is not a fork, redistribution, or standalone reimplementation of Codex.
- It does not restore vendored npm packages (React, clsx, Shiki themes, 3Dmol, etc.). Those are left as bare npm imports.
- It does not modify the installed application.

## Boundaries

The project enforces two logical boundaries:

- **Restored UI code** follows the conventions in [`docs/frontend/README.md`](../frontend/README.md).
- **Pipeline / domain code** follows the conventions in [`docs/backend/README.md`](../backend/README.md).

Anything that crosses both boundaries — for example, shared types used by both restored UI and pipeline scripts — should be documented in [`architecture.md`](architecture.md).
