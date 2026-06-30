# Architecture

High-level architecture of `decode-codex`: how data flows from the installed app to the restored output, and where the boundaries between skills and code layers lie.

## System diagram

```
┌─────────────────────────────────────────┐
│ /Applications/Codex.app                 │
│ Contents/Resources/app.asar             │
└──────────────┬──────────────────────────┘
               │ read
               ▼
┌─────────────────────────────────────────┐
│ Skill: codex-app-ref-refresh            │
│  - extract with @electron/asar          │
│  - format with prettier                 │
└──────────────┬──────────────────────────┘
               │ writes
               ▼
┌─────────────────────────────────────────┐
│ ./ref/                                  │
│  - node_modules/ (vendored deps)        │
│  - webview/index.html                   │
│  - webview/assets/*.js (bundled chunks) │
└──────────────┬──────────────────────────┘
               │ reads
               ▼
┌─────────────────────────────────────────┐
│ Skill: deobfuscate-javascript           │
│  - detect / extract / rename / polish   │
│  - semantic rewrite (deep mode)         │
│  - organize / promote / quality gate    │
└──────────────┬──────────────────────────┘
               │ writes
               ▼
┌─────────────────────────────────────────┐
│ ./src/                             │
│  - semantic-domain folders              │
│  - provenance headers                   │
│  - IMPORT_MAP.json                      │
└─────────────────────────────────────────┘
```

## Skill 1: codex-app-ref-refresh

- Entry script: `.agents/skills/codex-app-ref-refresh/scripts/refresh-codex-ref.mjs`
- Input: installed Codex app bundle.
- Output: `./ref/` directory.
- Behavior:
  - Resolves the asar path (default `/Applications/Codex.app/Contents/Resources/app.asar`, override with `CODEX_APP_ASAR`).
  - Wipes `./ref/` only if it resolves under the current working directory.
  - Extracts the asar with `npx @electron/asar`.
  - Formats every `.js` / `.css` with Prettier, skipping `ref/node_modules`.

## Skill 2: deobfuscate-javascript

- Entry: `.agents/skills/deobfuscate-javascript/SKILL.md` defines triggers and behavior.
- Pipeline stages:
  1. **Detect** — read `ref/webview/index.html`, discover entry chunks and the full asset tree.
  2. **Extract** — parse each chunk, build symbol ledger and import graph.
  3. **Rename** — machine-renaming of minified identifiers.
  4. **Polish** — structural cleanup, import/export normalization.
  5. **Finalize** — optional typed `.tsx` rewrite in deep mode.
  6. **Organize** — assign semantic domains, paths, and recipes.
  7. **Promote** — copy finalized files into `./src/` after passing `quality-gate.ts`.
- Intermediate artifacts live in `src/.deobfuscate-javascript/_full/`; only promoted files appear in `./src/`.

## Data stores

| File / Directory | Purpose |
| ---------------- | ------- |
| `src/.deobfuscate-javascript/_full/manifest.json` | Central manifest: all local chunks, npm leaves, stages, organization, export maps. |
| `src/.deobfuscate-javascript/_full/ledger.json` | Cross-file symbol ledger and binding statuses. |
| `src/IMPORT_MAP.json` | Maps every promoted chunk to its public path and public exports. |
| `src/.deobfuscate-javascript/_full/files/<basename>/` | Per-chunk workspace with original, checkpoints, and candidate files. |

## Module boundaries

- **Skill scripts** must not hardcode project-specific behavior; they are generic pipeline machinery.
- **Project-specific helpers** can live under `scripts/` or as one-off `.mjs` / `.ts` files at the repo root, but must be documented if they are reused.
- **Restored code** in `./src/` is a generated artifact. Do not edit it directly; fix the candidate or the pipeline instead.

## Cross-cutting concerns

- **Provenance**: every file in `./src/` must carry a header pointing back to `ref/webview/assets/<chunk>.js`.
- **Import graph integrity**: promotions are ordered by the frontier so producers are promoted before consumers. `IMPORT_MAP.json` must stay consistent.
- **Npm-leaf boundaries**: vendored code is represented by typed facades or bare imports, not restored file-by-file.
