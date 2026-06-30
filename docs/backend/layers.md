# Pipeline Layers

The deobfuscation pipeline is organized into Domain-Driven Design layers under `.agents/skills/deobfuscate-javascript/src/`.

| Layer | Responsibility | Location |
| ----- | -------------- | -------- |
| **Domain** | Core deobfuscation concepts: symbols, chunks, import graphs, quality rules. | `.agents/skills/deobfuscate-javascript/src/domain/` |
| **Application** | Orchestration of pipeline stages: detect → extract → rename → polish → finalize → organize → promote. | `.agents/skills/deobfuscate-javascript/src/application/` |
| **Infrastructure** | File system, AST parsing, formatting, shell invocation. | `.agents/skills/deobfuscate-javascript/src/infrastructure/` |
| **Interfaces** | Agent-facing skill entry points and CLI scripts. | `.agents/skills/deobfuscate-javascript/SKILL.md`, `src/interfaces/*.mjs` |

## Key files by layer

- **Domain**: `build-import-graph.ts`, `build-symbol-ledger.ts`, `chunk-classification.ts`, `quality-gate.ts`, `ledger.ts`, `check-entry.ts`
- **Application**: `auto-restore-full.ts`, `plan-organize.ts`, `promote-organized.ts`, `semantic-finalize.ts`, `prepare-stage-e-review.ts`
- **Infrastructure**: `extract.ts`, `format.ts`, `polish.ts`, `apply.ts`, `smart-rename.ts`, `detect.ts`, `split-bundle.ts`
- **Interfaces**: `regen-import-map.mjs`, `bulk-facade-one.mjs`, `find-consumers.mjs`, `find-duplicate.mjs`

## Dependencies point inward

- Interface scripts depend on application services.
- Application services depend on domain models and rules.
- Domain models have no dependency on infrastructure or interface details.
- Infrastructure implements parsing, file I/O, and formatting used by the application layer.
