# Frontend

This section defines how restored React/TypeScript UI code in `./restored/` is organized.

`decode-codex` does not enforce strict Feature-Sliced Design, but the restored output uses semantic-domain folders that map closely to FSD concepts. When you edit or extend restored UI code, follow these conventions.

## Documents

- [`domain-folders.md`](domain-folders.md) — folder responsibilities and FSD equivalents.
- [`file-naming.md`](file-naming.md) — naming conventions for components and utilities.
- [`imports.md`](imports.md) — cross-feature and cross-boundary import rules.
- [`components.md`](components.md) — component structure and typing rules.
- [`state-and-effects.md`](state-and-effects.md) — state, atoms, hooks, and side effects.

## Core principle

Code is organized by **scope of change**, not by technical type. A feature folder contains everything it needs — UI, state, queries, and utilities — so that changes to one feature do not leak into unrelated files.
