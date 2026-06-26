# Workflow — full restoration: rebuild an entire import tree

When the user wants to deobfuscate a chunk like [ref/webview/assets/app-shell-JLpboL12.js](../../../../ref/webview/assets/app-shell-JLpboL12.js) that pulls in dozens of sibling chunks, you can't do justice to it one file at a time — every `import { kn as t } from "./src-DAzAmbVS.js"` is a name decision that depends on what `kn` _really is_ in the source file. This workflow coordinates the renaming of an entire connected component of the import graph through two tables:

- **`manifest.json`** — file-level dependency graph: which chunks the entry transitively imports, what each file's `import`/`export` statements look like, and which stage (extract / rename / polish / finalize) each file is at.
- **`ledger.json`** — symbol-level checklist for each file: every binding (`status: pending | claimed | done`), plus a `crossFileBindings` table that links every consumer's local alias back to the producer's exported binding so a name decided in one file propagates to all its consumers automatically.

The two tables together make the work **resumable across sessions** (everything is on disk), **parallel-safe across agents** (file-level `O_EXCL` locks), and **auditable** (one place to see "did we already name `Mr`?").

← Back to [SKILL.md](../SKILL.md). Stage detail: [Stage 1](../stages/stage-1-deobfuscate.md), [Stage 2](../stages/stage-2-restore.md), [Stage 3](../stages/stage-3-finalize.md). Workspace: [stages/workspace.md](../stages/workspace.md). Sibling: [multi-export-bundle.md](multi-export-bundle.md) (single-file split), [react-vite.md](react-vite.md) (single-component recovery).

---

## When to use

**This is the default path** whenever the input is an app — an `index.html` plus a sibling-chunk asset tree (Vite/Rollup-style content-hashed graph). Load it when:

- There is an `index.html` + asset tree (many `import` / `export … from "./xxx-HASH.js"` statements pointing at sibling chunks). The entry is **auto-discovered** from `index.html` — you no longer need it named explicitly.
- No detectable sourcemap (run `scripts/sourcemap-check.ts` first; if a `.map` is recoverable, use it instead — orders of magnitude higher fidelity).

Restoration runs at **readable depth by default**; the deep keywords ("完整", "深度", "production", "typed", "restore everything") add the Stage 3 typed-`.tsx` + acceptance depth on top — they no longer gate _scope_.

If the input is a lone pasted snippet or a single chunk with no surrounding tree, fall back to:

- [small-minified.md](small-minified.md) — single-file readable fallback (no `index.html`/tree).
- [react-vite.md](react-vite.md) — single-component chunk.
- [multi-export-bundle.md](multi-export-bundle.md) — single multi-export bundle, split into a directory.
- [huge-single-file.md](huge-single-file.md) — single huge file, batch through a checklist.

**Current repo note:** when the entry lives under `ref/webview/assets` in
`codex-app-code`, read [reference/codex-ref.md](../reference/codex-ref.md)
first. It defines the default root, target/import-map reuse, and boundaries for
vendor/data chunks in the extracted Codex.app tree.

## Pipeline order

```
0.   (Always)  scripts/sourcemap-check.ts on the entry — bail out if a sourcemap is recoverable.
0.5. (Always)  scripts/check-entry.ts --discover --root <assets-dir> — read index.html, auto-discover the entry, and confirm it is the app, not a vendor leaf (exit 3). build-import-graph.ts auto-discovers too when the positional entry is omitted.
1. Build the import graph        → _full/manifest.json
1.5. Facade the huge vendor/runtime boundaries (optional):
     make-facade.ts <chunk>          →  typed `any` boundary so consumers compile
     ledger.ts mark-faced <basename> →  consumers stop waiting on it
2. Initialize the symbol ledger  → _full/ledger.json + per-file _full/files/<basename>/symbols.json
3. Loop until done:
     ledger.ts frontier               →  list EVERY file restorable now (leaf-first fan-out)
     ledger.ts claim <basename> <stg> →  acquire O_EXCL lock
     run existing stage scripts (extract → write renames → apply → polish)
     ledger.ts mark-done <basename> <stage>
     ledger.ts propagate-cross-file   →  push restored names to downstream consumers
4. ORGANIZE → PROMOTE (this is what carries the restore out of `_full/` into `restored/`):
     plan-organize.ts --target            →  propose a domain + kebab public path for every chunk (organize-plan.json)
     review/override the plan, then --apply  →  write approved entries into manifest.organization (stages.organized)
     promote-organized.ts --target --dry-run →  preview every move + gate verdict
     promote-organized.ts --target           →  drain the promote frontier: build typed deliverable, prettier-format it, gate, copy to restored/<domain>/, update IMPORT_MAP.json, rewrite imports, set stages.promoted
5. Stage 3 acceptance review (deep mode): the host agent reads each delivered file end-to-end and reworks any `NEEDS_FIX` file until all pass (no sub-agent required; optional one for extra eyes).
6. Final target audit (the completion proof): run `quality-gate.ts <target-dir> --check-format` over the whole public target. It now also fails the "checkpoints built but `restored/` empty" stall (`full-restoration-checkpoints-not-drained` / `-organize-incomplete`), a public file left in a hash-named dir (`-public-file-in-hash-dir`), a third-party npm boundary still left as an `any`-facade (`full-restoration-npm-boundary-not-resolved`), and any unformatted file (`--check-format`), in addition to mechanical / `@ts-nocheck` / facade / placeholder app-feature chunks.
```

**Completion definition (whole-tree).** The restore is done **iff** all three hold: `quality-gate.ts <target-dir>` exits 0 · every reachable local chunk has `stages.promoted` (deep mode also requires `stages.finalized`) · `ledger.ts frontier --stage promote --target <dir>` is empty. While checkpoints sit in `_full/checkpoints/` and `restored/` is empty, all three fail — so "mechanical checkpoint = done" is not a reachable state.

Step 3 is where most of the work lives. Each iteration is one **file × stage**; multiple agents can iterate in parallel as long as they `claim` different `(file, stage)` tuples. Use `ledger.ts frontier` (not just `next`) to see the whole restorable batch — every file whose local dependencies are all `done` or `faced` — and fan agents out across it, deepest first. `next` returns the single best of the same set.

For very large trees, use the batch checkpoint executor after Step 2:

```bash
bun <skill-dir>/scripts/auto-restore-full.ts --target "$TARGET" --format
```

This writes a flat `.tsx` checkpoint for every `kind: local` file under `_full/checkpoints/` by default, plus per-file `auto-renames.json` / `auto-renamed.js` / `auto-polished.tsx` under `_full/files/<basename>/`. It is intentionally a checkpoint accelerator, not a substitute for Stage 3: the host agent must rewrite/split into semantic public files, pre-filter with `quality-gate.ts`, and pass Stage 3 acceptance before declaring completion. Use `--write-target-checkpoints` only for explicit legacy/debug output; those files are still not deliverables.

## Step 0 — always: check the entry for a sourcemap

```bash
bun <skill-dir>/scripts/sourcemap-check.ts ref/webview/assets/app-shell-JLpboL12.js
```

If `✓ sourcemap detected` and the `.map` exists, **stop**. Recover from the map; renaming is wasted work.

## Step 0.5 — always: confirm the entry is the app, not a vendor leaf

```bash
bun <skill-dir>/scripts/check-entry.ts "$ENTRY" --root ref/webview/assets
```

Exit `3` means the entry is a **transitive dependency** (a vendored package or
shared util imported by many siblings), not an application entry. Building the
graph from it walks only its tiny dependency closure — you get a handful of
files that _look_ complete but are the wrong subtree (the classic "got 6 files,
declared the app restored" failure). The check compares the entry's local
fan-out (high for a real entry) against how many siblings import it (high for a
leaf) and whether `index.html` references it. When it flags, switch to the
`index.html` `<script>` root or a high-fan-out `app-main-*` chunk.

`build-import-graph.ts` runs this same check and prints a warning, but does not
block — so run it here first, or heed the warning, before sinking effort into
the wrong tree.

## Step 1 — build the import graph

```bash
TARGET=restored
FULL="$TARGET/.deobfuscate-javascript/_full"
mkdir -p "$FULL/files" "$FULL/locks"

# Entry auto-discovered from index.html (omit the positional). To pin it:
#   ENTRY=$(bun <skill-dir>/scripts/check-entry.ts --discover --root ref/webview/assets)
bun <skill-dir>/scripts/build-import-graph.ts \
  --target "$TARGET" \
  --root ref/webview/assets \
  --out "$FULL/manifest.json"
```

What the script does:

1. Parses the entry as ESM, walks every `import`/`export … from "./…"` statement, classifies each import target as either
   - **`local`** — `./xxx-HASH.js` whose stripped basename is _not_ in `resolve-npm-imports.ts`'s `CHUNK_NAME_REGISTRY` → push onto BFS queue, copy the source into `_full/files/<basename>/original.js`. This is the default for every reachable project-local sibling, regardless of size.
   - **`oversized-local`** — only when you explicitly pass a positive `--max-lines N` and a non-entry local file exceeds that cap → record imports/exports for cross-file binding lookup but **don't BFS into it** and **don't restore it**. This is a quick/targeted-mode boundary, not deep restoration.
   - **`npm-leaf`** — basename matches a known npm package (`clsx`, `react`, `jsx-runtime`, `tslib.es6`, `marked.esm`, `floating-ui.react-dom`, `core.esm`, …) **or its _content_ is bundled vendor data** (a Shiki TextMate grammar, a Shiki/VSCode theme, or a known data lib like 3Dmol — detected by `classifyVendorDataChunk` in `chunk-classification.ts`) → record terminal node, do not descend, **do not stage or restore it**. The manifest stores a `vendorSpecifier` (`@shikijs/langs/<id>`, `@shikijs/themes/<id>`, `3dmol`) and `promote-organized.ts` rewrites consumers' `./rust-HASH.js` imports to it. This is why `restored/` holds app code only — the ~200 grammar + ~60 theme chunks never land in `utils/`.
   - **`external`** — bare specifiers like `"react"` (rare in this kind of bundle) → record as terminal.
2. Repeats BFS until every reachable local chunk is recorded.
3. Writes `_full/manifest.json` with the schema in the next section.

Re-running is idempotent: existing `kind`, `npmPackage`, and `stages` fields are preserved; only `imports`/`exports` are refreshed (so you can re-run after files change without losing progress).

### Useful flags

| Flag                         | Default      | Effect                                                                                                                                                                                                                       |
| ---------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--max-lines N`              | `0`          | Default `0` disables the cap and restores every reachable project-local sibling. A positive value enables quick/targeted mode: files exceeding `N` lines are marked `oversized-local` (skipped). The entry is always exempt. |
| `--include foo,bar`          | (entry only) | Force-restore the listed basenames even if they exceed `--max-lines`. Useful when the user says "also restore `app-server-manager-signals`".                                                                                 |
| `--treat-as-npm name1,name2` | (registry)   | Treat the listed basenames as npm leaves regardless of `CHUNK_NAME_REGISTRY`.                                                                                                                                                |
| `--rebuild`                  | `false`      | Discard the prior manifest's `stages`/`owner` fields and start from scratch.                                                                                                                                                 |

Typical opening run for a fresh restoration:

```bash
# Deep/full: no line cap; every reachable project-local sibling is in scope
bun scripts/build-import-graph.ts "$ENTRY" --target "$TARGET" --root ref/webview/assets

# Quick/targeted: skip huge siblings after recording their import/export boundary
bun scripts/build-import-graph.ts "$ENTRY" --target "$TARGET" --root ref/webview/assets --max-lines 5000

# Targeted: skip almost all deps but pull in two specific ones
bun scripts/build-import-graph.ts "$ENTRY" --target "$TARGET" --root ref/webview/assets \
  --max-lines 500 --include score-query-match-BVCuhDNS,thread-env-icon-HLFXTgnn
```

Read the manifest console summary (`X local · Y oversized-local (skipped) · Z npm-leaf · E edges`) before proceeding. In a deep/full task, `Y oversized-local` must be `0`; if it is non-zero, rebuild with `--max-lines 0` or explicitly report that you are producing a partial restore.

> **wakaru in full-restoration is guarded, not default-on.** `wakaru --unpack` is **forbidden** here — the on-disk chunk tree _is_ the module graph, and unpacking re-derives its own filenames matching nothing in the manifest/ledger/`CHUNK_NAME_REGISTRY`. You may run wakaru's _rule_ pipeline (no `--unpack`) on a chunk **body** (`scripts/wakaru-normalize.ts "$WS/original.js" -o "$WS/original.js"`), but only **before** Step 2's `build-symbol-ledger.ts` extracts that chunk's symbols (it is byte-rewriting), and treat any import/export specifiers it emits as untrusted — `build-import-graph.ts` derives the graph from the real chunk files and `resolve-npm-imports.ts` + the Codex registry remain the authoritative import rewriter; wakaru's `un_esm` does not substitute for them.

### `manifest.json` schema

```json
{
  "version": 1,
  "entry": "app-shell-JLpboL12",
  "rootDir": "ref/webview/assets",
  "targetDir": "restored",
  "createdAt": "2026-05-22T21:09:00.000Z",
  "updatedAt": "2026-05-22T21:09:00.000Z",
  "files": {
    "app-shell-JLpboL12": {
      "path": "ref/webview/assets/app-shell-JLpboL12.js",
      "basename": "app-shell-JLpboL12",
      "kind": "local",
      "depth": 0,
      "size": 105421,
      "imports": [
        {
          "source": "./AnimatePresence-BMR_rf2Q.js",
          "target": "AnimatePresence-BMR_rf2Q",
          "kind": "local",
          "specifiers": [{ "imported": "t", "local": "Le", "kind": "named" }]
        },
        {
          "source": "./clsx-DDuZWq6Y.js",
          "target": "clsx-DDuZWq6Y",
          "kind": "npm-leaf",
          "npmPackage": "clsx",
          "specifiers": [{ "imported": "t", "local": "c", "kind": "named" }]
        }
      ],
      "exports": [
        { "exported": "t", "local": "Mr", "kind": "named" },
        { "exported": "a", "local": "sn", "kind": "named" }
      ],
      "stages": {
        "extracted": false,
        "renamed": false,
        "polished": false,
        "finalized": false
      },
      "owner": null,
      "claimedAt": null,
      "lastUpdated": null
    },
    "AnimatePresence-BMR_rf2Q": { "kind": "local", "depth": 1 /* … */ },
    "clsx-DDuZWq6Y": {
      "kind": "npm-leaf",
      "npmPackage": "clsx",
      "stages": { "skipped": true }
    }
  },
  "edges": [
    { "from": "app-shell-JLpboL12", "to": "AnimatePresence-BMR_rf2Q" },
    { "from": "app-shell-JLpboL12", "to": "clsx-DDuZWq6Y" }
  ]
}
```

**Field semantics:**

- `files[*].kind` ∈ `local | npm-leaf | external`. Only `local` files get a `_full/files/<basename>/` workspace.
- `files[*].depth` — BFS depth from the entry (entry = 0). Used by `ledger.ts next` to suggest leaves first.
- `files[*].imports[*].kind` mirrors the _target_ file's `kind`.
- `files[*].imports[*].specifiers[*].kind` ∈ `named | default | namespace`. `named` is the only one you'll typically see in Vite output.
- `files[*].exports[*]` records `re-export from` and direct `export {…}` clauses. A `var X = …; export { X as Y };` shows up as `{ exported: "Y", local: "X", kind: "named" }`.
- `stages` is the per-file overall checklist; `extracted` means `symbols.json` has been written, `renamed` means `apply.ts` has run, `polished` means `polish.ts` has run, `finalized` means a hand-cleaned `.tsx` has been delivered, `faced` means a boundary facade stands in for the chunk (see Step 1.5).

## Step 1.5 — facade the huge vendor/runtime boundaries (optional but unblocking)

Some local chunks are enormous and vendor/runtime-dominated — the 300+-export
Zod `src-*` chunk, a React + react-query scope layer, a `vscode-api`/host
bridge, the Statsig SDK — yet dozens of feature chunks import them via cryptic
aliases (`import { kn as t } from "./src-*.js"`). You can't restore the feature
chunks until those names resolve, but the runtime itself is a session's work on
its own. The fix is a **typed boundary facade**: expose every export as `any` so
consumers type-check now, and deep-restore the runtime only when it's scoped.

**Facing is for genuine third-party vendor/runtime chunks only** — never for
app/feature chunks (`app-shell-*`, `app-main-*`, pages, panels, components,
contexts, hooks), which are recursively restored even when large or widely
imported. A facade is an _open boundary_: while one stands in for a project-local
chunk, the deep/full restore is **incomplete**. `mark-faced` refuses app-entry
basenames unless you pass `--force` (use it only for a chunk you have confirmed is
genuinely vendor/runtime).

```bash
CHUNK=ref/webview/assets/src-C7fSIbpz.js
bun <skill-dir>/scripts/make-facade.ts "$CHUNK" \
  --provenance "ref/webview/assets/$(basename "$CHUNK")" \
  --out "$TARGET/boundaries/zod.facade.ts"
bun <skill-dir>/scripts/ledger.ts mark-faced "$(basename "$CHUNK" .js)" --target "$TARGET"
```

`make-facade.ts` is reserved-word-safe (the Zod chunk literally exports `in`,
emitted as `declare const in_: any; export { in_ as in };`). `mark-faced` sets
`stages.faced` on the chunk so `ledger.ts frontier`/`next` treat it as a
satisfied dependency at every stage and its consumers become restorable. Record
the alias map under `dependencyBoundaryFacades` in the project IMPORT_MAP, and
note in the README that the runtime behind the facade is unrestored. `quality-gate.ts`
auto-relaxes its naming/typing/split checks on facade files (and on any file run
with `--vendored`), since a wall of `any` boundary stubs is intentional.

## Step 2 — initialize the symbol ledger

```bash
bun <skill-dir>/scripts/build-symbol-ledger.ts \
  --target "$TARGET" \
  --manifest "$FULL/manifest.json" \
  --out "$FULL/ledger.json"
```

What the script does, **for each `kind: local` file**:

1. Run `extractSymbols(source)` (the same library as `scripts/extract.ts`) → write `symbols.json` into the file's workspace.
2. Walk the AST's `import`/`export` declarations to map every `localName` → `{ producer, exportedAs }`. This is what populates `crossFileBindings`.
3. Tag each symbol with `isExport`/`exportedAs` (matched against the file's own `export { local as exported }` list) and `importedFrom` (matched against the file's `import { imported as local }` list).
4. Initialize every symbol's `status` to `"pending"` and persist into `ledger.json`.
5. Set the file's `manifest.stages.extracted = true`.

Re-running with `--rebuild` regenerates everything; without `--rebuild`, only `pending` symbols are refreshed (already-`done` symbols keep their `restoredName`).

### `ledger.json` schema

```json
{
  "version": 1,
  "manifest": "manifest.json",
  "createdAt": "…",
  "updatedAt": "…",
  "files": {
    "app-shell-JLpboL12": {
      "totals": { "pending": 312, "claimed": 0, "done": 0 },
      "symbols": [
        {
          "id": "Mr@4321",
          "originalName": "Mr",
          "restoredName": "AppShell",
          "kind": "var",
          "isExport": true,
          "exportedAs": "t",
          "importedFrom": null,
          "referenceCount": 23,
          "declStart": 4321,
          "declEnd": 4323,
          "status": "done",
          "owner": null,
          "claimedAt": null,
          "completedAt": "2026-05-22T21:11:00.000Z"
        },
        {
          "id": "Le@230",
          "originalName": "Le",
          "kind": "module",
          "isExport": false,
          "importedFrom": {
            "target": "AnimatePresence-BMR_rf2Q",
            "imported": "t"
          },
          "restoredName": null,
          "referenceCount": 8,
          "declStart": 230,
          "declEnd": 232,
          "status": "pending",
          "owner": null
        }
      ]
    }
  },
  "crossFileBindings": [
    {
      "consumer": "app-shell-JLpboL12",
      "consumerLocal": "Le",
      "consumerSymbolId": "Le@230",
      "producer": "AnimatePresence-BMR_rf2Q",
      "producerExportedAs": "t",
      "producerSymbolId": null,
      "producerRestoredName": null
    }
  ]
}
```

`producerSymbolId` and `producerRestoredName` get filled in once the producer file is renamed and `propagate-cross-file` is run — that's how a name like `AppShell` flows from the source file to every consumer.

## Step 3 — iterate (this is the loop)

For each pass (single agent or one of N parallel agents):

```bash
# See the whole restorable batch (deps all done or faced), deepest-first — fan
# N agents across these rows. `next` returns just the single best of the same set.
bun <skill-dir>/scripts/ledger.ts frontier --stage rename --target "$TARGET"
# Output (one per line): AnimatePresence-BMR_rf2Q  rename  depth=2  pending=47
bun <skill-dir>/scripts/ledger.ts next --target "$TARGET"   # single suggestion

# Claim one — creates _full/locks/AnimatePresence-BMR_rf2Q.rename.lock with O_EXCL
bun <skill-dir>/scripts/ledger.ts claim AnimatePresence-BMR_rf2Q rename --target "$TARGET" --owner agent-1
```

If `claim` exits non-zero, another agent already holds the lock. Pick a different file with `next --skip <basename>` or `next --filter-stage rename --not-claimed`.

Inside the claim, work the standard Stage 2 rename pipeline (the per-file workspace already exists from Step 2):

```bash
WS="$FULL/files/AnimatePresence-BMR_rf2Q"
# (a) Read symbols + crossFileBindings to inform names
cat "$WS/symbols.json" | jq '.[].name' | head
# (b) Decide names → write renames.json (one entry per id you've claimed)
#     Use Write tool to author the JSON; reference symbols in pending status only.
# (c) Apply
bun <skill-dir>/scripts/apply.ts "$WS/original.js" "$WS/renames.json" --out "$WS/renamed.js"
# (d) Polish if it's a React/Vite chunk
bun <skill-dir>/scripts/polish.ts "$WS/renamed.js" --source "${manifest.files[…].path}" --out "$WS/polished.tsx"
# (e) Mark each renamed symbol done in the ledger (script reads renames.json and toggles status)
bun <skill-dir>/scripts/ledger.ts mark-done AnimatePresence-BMR_rf2Q rename --target "$TARGET" --renames "$WS/renames.json"
# (f) Propagate this file's exported renames to downstream consumers' ledgers
bun <skill-dir>/scripts/ledger.ts propagate-cross-file --target "$TARGET" --from AnimatePresence-BMR_rf2Q
# (g) Lock auto-released by mark-done; or: bun ledger.ts release AnimatePresence-BMR_rf2Q rename
```

Then loop. `ledger.ts next` will skip files where the requested stage is already `done` and prefer ones whose dependencies (other files this one imports from) are further along — so by the time you rename the entry, all its consumed names are already decided.

## Step 4 — organize → promote (carry the restore out of `_full/`)

When `ledger.ts status --target "$TARGET"` reports `0 pending across N files`, the rename pass is done — but the deliverables are still **mechanical checkpoints in `_full/checkpoints/`, and `restored/` is empty.** Step 4 is the phase that actually produces the public tree. It is a drainable, resumable, gated loop — not per-file eyeballing.

**Recursion check first:** `status` counts a `faced` chunk as _satisfied_, not pending, so "0 pending" does **not** prove every project chunk was restored. Confirm `ledger.ts frontier` is empty **and** that no project-local feature chunk remains `faced` — only genuine third-party vendor/runtime boundaries (Zod, Statsig, the host/runtime bridge) may remain, and each must be reported as an open boundary in the README/import map. A referenced `app-shell-*` / feature chunk left as a facade means the restore is **not done**.

**Track progress while draining.** `ledger.ts status --target "$TARGET"` now prints a **completion overview** — `completion: <promoted>/<total> promoted (pct%) · <organized> organized · <ready> ready-to-promote` — plus the **blocked list**: chunks whose deps are ready but that have no agent candidate yet (`write files/<basename>/candidate.tsx, then promote-organized`). That list _is_ the remaining deep-restore worklist; the restore is incomplete while it (or the promote frontier) is non-empty. The long-running batch scripts (`build-import-graph`, `build-symbol-ledger`, `auto-restore-full`, `promote-organized`) print a throttled `[i/n] (pct%) elapsed` progress line to stderr, so a 1400-chunk pass shows where it is instead of going silent.

### 4.1 — Plan the organization (one batch pass)

```bash
bun <skill-dir>/scripts/plan-organize.ts --target "$TARGET"
```

This reads the manifest + each chunk's checkpoint + `auto-restore-report.json` and writes `_full/organize-plan.json` proposing, for every local chunk, a `{ domain, semanticPath, recipe, classification, status, fallbackRenameRatio }`. It uses **project-agnostic shape heuristics**: icon-shaped → `icons/`, button-shaped → `ui/`, single-export → `utils/<kebab>.ts`, known vendor/runtime → `boundaries/`. Everything else is an `app-feature` left `status: "needs-review"` with **no domain** — a generic planner can't know your domain layout. Colliding public paths are auto-downgraded to `needs-review` so a promote never silently overwrites. `fallbackRenameRatio` surfaces the 62–91 %-fallback checkpoints to hand-clean first.

### 4.2 — Review / override the plan, then apply

Read `organize-plan.json`. For every `needs-review` app-feature chunk, decide its domain + semantic kebab path (a component file is kebab, e.g. `composer/composer-footer.tsx` exporting `ComposerFooter`). Either edit the plan's `status`/`domain`/`semanticPath` in place, or override one chunk at a time:

```bash
bun <skill-dir>/scripts/ledger.ts set-organization composer-footer-DyRbFsKV \
  --domain composer --semantic-path composer/composer-footer.tsx \
  --recipe manual --classification app-feature --target "$TARGET"
```

Then write the approved entries into the manifest (idempotent; only `status: "approved"` rows land):

```bash
bun <skill-dir>/scripts/plan-organize.ts --target "$TARGET" --apply
```

A project may supply an optional `--domain-map map.json` (`{ "<basename-prefix>": "<domain>" }`) to auto-assign app chunks; the planner core stays generic.

### 4.3 — Hand-clean / type the chunks that need it (deep mode)

`icon`/`button` recipe chunks are produced typed by `semantic-finalize.ts` at promote time — no hand work. For `manual`/`split` app-feature chunks, the checkpoint is the _input_, not the deliverable: drop a hand-cleaned, typed candidate at `_full/files/<basename>/candidate.tsx` (semantic names throughout, a `Props` interface on every exported component, `forwardRef`+`displayName` where appropriate, lookup tables `as const`). The promote gate rejects an untyped/mechanical candidate, so this is enforced, not optional, in deep mode. Readable-tier `manual` chunks may stay untyped as long as names are semantic. Use [multi-export-bundle.md](multi-export-bundle.md) (`plan-split.ts` → `split-bundle.ts`) to pre-split a `split`-recipe chunk into a directory candidate.

### 4.4 — Drain the promote frontier

```bash
bun <skill-dir>/scripts/promote-organized.ts --target "$TARGET" --dry-run   # preview moves + gate verdicts
bun <skill-dir>/scripts/promote-organized.ts --target "$TARGET"             # do it
```

For each organized chunk whose local deps are already promoted (producers before consumers), this builds the typed deliverable (recipe or candidate), writes it at its semantic path, runs the **same quality gate** through `analyzeSource`, and on pass: upserts `restored/IMPORT_MAP.json` (`restored` path, `exports`, `status: "done"`), rewrites this chunk's imports of already-promoted producers to their semantic names/paths, and sets `stages.promoted`. On gate fail it rolls the file back, records the issues, and **continues** — one bad chunk never blocks the batch. It is resumable (skips `promoted`, idempotent IMPORT_MAP upsert) and fleet-safe (per-chunk `promote` lock). Fan multiple agents across the frontier; each claims a different chunk. Re-run after hand-fixing the chunks it reported.

It writes only into `restored/`; promote into `restored/` is never a manual `cp`. The legacy single-file `promote-final.ts "$WS/candidate/<basename>" "<target>/<path>"` gate-before-copy primitive is still available for a one-off delta.

### 4.5 — Quality gate over the whole target before acceptance

```bash
bun <skill-dir>/scripts/quality-gate.ts <target-dir>
```

A non-zero exit means the target is not ready for review. Fix the named issues (replace mechanical names, hand-clean another chunk's candidate, split a large flat file, or delete residue) and re-run promote + the gate. This must be the whole target, not only `boundaries/`, because app chunks have semantic public paths outside `boundaries/` while still failing the deep bar. The gate also fails the **stall** — `full-restoration-checkpoints-not-drained` / `-organize-incomplete` when checkpoints exist but chunks aren't `promoted`, and `-public-file-in-hash-dir` when a deliverable still sits in a hash-named dir. Pass `--allow-organize-incomplete` only for an intermediate mid-drain run.

### 4.6 — Stage 3 acceptance review (deep mode)

The host agent reads each delivered file end-to-end against the quality bar — no sub-agent and no authorization required. Read 5–10 sibling files together so cross-file consistency is checked (delegating a batch to an optional reviewer sub-agent is fine when one is available and authorized). `NEEDS_FIX` means rewrite the candidate and re-promote. Only a clean pass marks the file finalized.

### 4.7 — Final target audit after acceptance (completion proof)

```bash
bun <skill-dir>/scripts/quality-gate.ts <target-dir>
```

This final run is the completion proof. It reads `_full/manifest.json` plus the shared import map and rejects reachable app-feature chunks whose public output is a boundary/facade, `mechanical-readable-restored`, `@ts-nocheck`, empty `export {}`, `export declare const`, `oversized-local`, or lacks `manifest.stages.finalized=true` / an explicit Stage 3 acceptance record — and the stall checks above. `IMPORT_MAP.status === "done"` by itself is not completion evidence. Done **iff** this exits 0, every reachable local chunk is `stages.promoted` (deep: + `stages.finalized`), and `ledger.ts frontier --stage promote` is empty.

### Quality bar checklist (per restored file)

Before marking a file's `finalize` stage `done`, confirm:

- [ ] Public filename/directory is semantic, kebab-case, and hash-free (component identifiers stay PascalCase); original chunk path preserved in provenance/report.
- [ ] Renamed to `.tsx` (no leftover `.js` extension).
- [ ] Provenance header: `// Restored from <original-path>` followed by a one-line summary.
- [ ] Exported components have a typed `Props` interface (or type alias) and use destructured params with defaults — not `function X(props)` with implicit `any`.
- [ ] Pure SVG icon modules have no runtime shim residue and use `IconProps = SVGProps<SVGSVGElement>`.
- [ ] Chunks with ≥ 2 independent SVG icon exports are directories with `types.ts`, one icon file per component, and an `index.ts` barrel.
- [ ] Chunks with ≥ 3 named exports, a registry-object export, or > 1000 lines are split directories with an `index.ts` barrel.
- [ ] No generated fallback names remain (`ImportedBinding1`, `callbackValue1`, `localValue1`, `elementNode1`, `hookValue1`, `restoredHelper1`, `param1`, `buttonValue3`, `contextParam14`, `DistO`, …).
- [ ] No leftover lazy-getter scaffolding (`var X = lazyY();`). `dead-shim-elim` should have removed them; if any remain, hand-delete.
- [ ] No leftover React Compiler cache reads (`compilerCache.c(N)`, `t[5] !== n ? …`). If `strip-react-compiler` couldn't unwind a function, hand-strip it.
- [ ] Finalized local imports use semantic public paths; npm imports are bare specifiers (`from "clsx"`, not `from "./clsx-DDuZWq6Y.js"`).
- [ ] Lookup tables are named with the consumer's domain noun (`buttonColorClassNames`, not `colorClasses`) and frozen with `as const`.
- [ ] Variant prop unions use `keyof typeof <table>` rather than hand-rolled string unions.
- [ ] `displayName` set on every exported component; `forwardRef` recovered if the bundle had a ref shim.
- [ ] Consumers import semantic producer names (`DownloadIcon`, `Button`, `ExpandIcon`) rather than bundle aliases (`t`, `n`), and split chunks import from semantic barrels.
- [ ] Final `bun scripts/format.ts <file-or-dir>` pass run (`promote-organized.ts` already formats each deliverable; this catches hand-edited files).
- [ ] Every `boundaries/*.ts` is either a bare third-party re-export shim (`make-facade.ts --reexport`), a tracked runtime facade/passthrough, or already restored out of `boundaries/` — no third-party npm chunk left as an `any`-facade.
- [ ] `scripts/promote-final.ts` or an equivalent gate-before-copy path promoted the candidate; no direct copy from `$WS`; Stage 3 acceptance still follows.
- [ ] Final `bun scripts/quality-gate.ts <file-or-dir>` pass exits 0.
- [ ] Stage 3 acceptance review passed every delivered file (host self-review, or an optional sub-agent).
- [ ] Final target-level `bun scripts/quality-gate.ts <target-dir> --check-format` pass exits 0 after acceptance; no boundary-only or import-map-status-only substitute.

## Locking & parallelism rules

- **One lockfile per `(basename, stage)`**. Path: `_full/locks/<basename>.<stage>.lock`. Stages are `extract`, `rename`, `polish`, `finalize`. Lockfile content is `{owner, pid, claimedAt}`.
- **`O_EXCL` create** — second `claim` for the same `(basename, stage)` fails with exit code 75 (`EX_TEMPFAIL`-ish; we use 75 as "lock held").
- **`release` is required only on cancellation**. `mark-done` deletes the lockfile as part of its commit.
- **No global lock**. Different stages of the same file can be in flight at once, but in practice you don't run them out-of-order — `polish` always follows `rename` for the same file, and they're naturally sequential.
- **Crash recovery**: if a lockfile is older than 30 minutes (`stat -f %m` vs `now`), `ledger.ts claim --steal` repossesses it. Without `--steal`, stale locks block forever — intentional, so you investigate before assuming the previous agent died.
- **Atomic writes**: every ledger / manifest mutation goes via `read → mutate → write tmp → rename`. The temp file lives next to the target (`ledger.json.tmp.<pid>`), so the rename is atomic on the same filesystem.

## Recovery & resume

- **Restart cold**: just re-run `ledger.ts status` and pick up. Nothing is in memory.
- **Re-extract a single file** (its source changed, or the rename went sideways): delete `_full/files/<basename>/symbols.json`, re-run `build-symbol-ledger.ts --rebuild --only <basename>`. Already-done downstream consumers stay done; their `crossFileBindings.producerRestoredName` keeps the value you committed.
- **Roll back a rename**: `ledger.ts release <basename> rename --reset` reverts every `done` symbol in that file back to `pending` and clears its `restoredName`. Use sparingly — propagate-cross-file results into downstream ledgers are not auto-undone (you have to re-propagate after re-renaming).

## Caveats

- **`extractChunkBasename` is the source of truth for npm-leaf detection.** [scripts/resolve-npm-imports.ts](../scripts/resolve-npm-imports.ts) defines `CHUNK_NAME_REGISTRY`. If a vendored package shows up that's not in the registry, it'll be incorrectly classified as `local` and the BFS will descend into it. Either add it to the registry first, or pass `--treat-as-npm <basename>` to `build-import-graph.ts` for that one run.
- **Cycles are tolerated** — the BFS skips already-visited basenames. Re-exports through a `shared.js` chunk are common and don't break anything.
- **Dynamic `import("…")`** is recorded as a local edge if its argument is a literal string; non-literal dynamic imports are reported in `manifest.unresolved[]` for manual review.
- **`new URL("./asset.svg", import.meta.url)`** is _not_ an import — the script ignores it. Asset chunks (woff2, wasm, png) are filtered out before BFS by extension.
- **Don't run two `build-import-graph.ts` invocations against the same `_full/`** — there's no top-level lock on the manifest itself (locks are per-file-stage). One graph build per restoration tree is the assumption.
- **`ledger.ts propagate-cross-file` only writes downstream**. If a consumer was renamed _before_ its producer (because `ledger.ts next` was overridden), the consumer's local alias keeps its hand-chosen name; `propagate-cross-file` updates `crossFileBindings.producerRestoredName` for context but won't overwrite the consumer's already-decided `restoredName`.

## Stage 3 acceptance — Acceptance LOOP (mandatory)

See [stages/stage-3-finalize.md](../stages/stage-3-finalize.md). The skill is not done until the host agent's end-to-end read passes every delivered file — no sub-agent and no authorization required. For full restoration trees, read 5–10 sibling files together so cross-file consistency is verified (consumer imports use the producer's semantic name and semantic file path, lookup-table naming is uniform across components, etc.) — not just per-file quality; delegating a batch to an optional reviewer sub-agent is fine when one is available and authorized. `NEEDS_FIX` means rewrite and re-read; there is no TODO-header completion path. Skipping this step is a fail mode listed in the skill's [quality bar](../SKILL.md#quality-bar--anti-patterns-to-refuse-before-declaring-done); it is the same severity as skipping Step 4's per-file [Quality bar checklist](#quality-bar-checklist-per-restored-file).
