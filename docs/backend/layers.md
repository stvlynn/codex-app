# Pipeline Layers

| Layer | Responsibility | Location |
| ----- | -------------- | -------- |
| **Domain** | Core deobfuscation concepts: symbols, chunks, import graphs, quality rules. | `.agents/skills/deobfuscate-javascript/scripts/build-import-graph.ts`, `build-symbol-ledger.ts`, `quality-gate.ts` |
| **Application** | Orchestration of pipeline stages: detect → extract → rename → polish → finalize → organize → promote. | `.agents/skills/deobfuscate-javascript/scripts/auto-restore-full.ts`, `promote-organized.ts`, `semantic-finalize.ts` |
| **Infrastructure** | File system, AST parsing, formatting, shell invocation. | `.agents/skills/deobfuscate-javascript/scripts/`, `@babel/parser`, `prettier` |
| **Interfaces** | Agent-facing skill entry points and CLI scripts. | `.agents/skills/deobfuscate-javascript/SKILL.md`, `scripts/*.ts`, `scripts/*.mjs` |

## Dependencies point inward

- Interface scripts depend on application services.
- Application services depend on domain models and rules.
- Domain models have no dependency on infrastructure or interface details.
- Infrastructure implements parsing, file I/O, and formatting used by the application layer.
