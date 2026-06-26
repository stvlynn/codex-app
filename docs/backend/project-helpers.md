# Project Helpers

One-off helpers for the current restore session can live at the repo root (e.g., `scripts/`, `debug-promote.ts`, `*.mjs`). If a helper becomes reusable across restore sessions, move it into `.agents/skills/deobfuscate-javascript/scripts/` and document it.

## What belongs in the skill

- Deobfuscation pipeline scripts and their orchestration.
- Quality-gate rules and analysis logic.
- Import-graph and symbol-ledger builders.

## What does not belong in the skill

- Restored UI code (that lives in `./restored/` and follows [`docs/frontend/README.md`](../frontend/README.md)).
- Analysis drafts or temporary notes (keep those at repo root or `.tmp-*`).
- Skills that are not part of the deobfuscation pipeline (e.g., `codex-app-ref-refresh` is its own skill, documented in [`docs/operations/README.md`](../operations/README.md)).
