# Documentation

This directory is the single source of truth for how `decode-codex` is built, organized, and evolved by agents.

## Domain map

- [`project/`](project/README.md) — project overview, goals, architecture, and boundaries.
- [`frontend/`](frontend/README.md) — conventions for restored React/TypeScript UI code.
  - [`domain-folders.md`](frontend/domain-folders.md) — how semantic source folders map to FSD layers.
- [`backend/`](backend/README.md) — conventions for the deobfuscation pipeline and domain scripts.
  - [`layers.md`](backend/layers.md) — DDD layer responsibilities and dependency direction.
- [`operations/`](operations/README.md) — local development, skill execution, and deployment.
- [`quality/`](quality/README.md) — quality gates, testing expectations, and review rules.
- [`decisions/`](decisions/README.md) — architecture decision records (ADRs).

## How to use this documentation

1. If you are new to the project, read [`project/README.md`](project/README.md) and [`project/architecture.md`](project/architecture.md) first.
2. Before modifying restored UI code, read [`frontend/README.md`](frontend/README.md).
3. Before changing the deobfuscation pipeline or skill scripts, read [`backend/README.md`](backend/README.md).
4. Before changing how skills are run or deployed, read [`operations/README.md`](operations/README.md).
5. If you change behavior, architecture, or conventions, update the relevant doc in the same change set.
