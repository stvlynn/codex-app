# 001: Rename `restored/` to `src/` and adopt FSD/DDD layouts

## Context

The deobfuscation pipeline produced restored UI code under `./restored/`. As the output matured, the flat domain-folder layout became hard to navigate and did not clearly separate application shells, pages, widgets, features, entities, and shared concerns. At the same time, the pipeline scripts under the skill grew organically into a flat `scripts/` directory with no clear boundary between domain rules, application orchestration, infrastructure adapters, and interface entry points.

## Decision

1. Rename the restored-code root from `./restored/` to `./src/`.
2. Restructure `src/` according to Feature-Sliced Design (FSD):
   - `app/` — application initialization, providers, global styles.
   - `pages/` — page components and routing targets.
   - `widgets/` — composite UI blocks (e.g. app-shell, composer, threads).
   - `features/` — user-facing capabilities (e.g. auth, settings, streaming).
   - `entities/` — domain models and data-centric modules.
   - `shared/` — reusable UI, hooks, utils, boundaries, and icons.
3. Restructure the `deobfuscate-javascript` skill scripts according to Domain-Driven Design (DDD) layers:
   - `domain/` — symbols, import graph, quality rules, ledger, manifests.
   - `application/` — stage orchestration, promotion, organization, semantic finalize.
   - `infrastructure/` — parsing, formatting, AST transforms, file I/O.
   - `interfaces/` — skill entry points and CLI scripts.
4. Change `IMPORT_MAP.json` so each promoted chunk records its restored path under the key `path` instead of `restored`.
5. Keep pipeline metadata under `src/.deobfuscate-javascript/_full/` so that ledger and manifest paths remain target-relative and the existing skill logic continues to work.

## Consequences

- The restored codebase is easier to navigate and extend because concerns are grouped by standard FSD layers.
- Pipeline scripts are easier to test and reason about because dependencies point inward (interfaces → application → domain; infrastructure implements domain ports).
- Skill runtime code and helper scripts must reference `src/` and `entry.path` instead of `restored/` and `entry.restored`.
- The rename is a one-way change: any downstream tooling that hardcoded `restored/` must be updated.

## Alternatives considered

- Keep `restored/` but add FSD subfolders inside it. Rejected because the directory name itself did not signal that this is the main source tree.
- Move pipeline metadata to the repo root alongside `src/`. Rejected because the skill's `pathsForTarget` helper expects metadata under `<targetDir>/.deobfuscate-javascript/_full/`; changing that would require wider test and logic changes.
- Leave `IMPORT_MAP.json` using the `restored` key. Rejected because the old name no longer matched the new `src/` root and would confuse future maintainers.
