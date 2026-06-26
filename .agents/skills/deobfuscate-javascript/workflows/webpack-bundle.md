# Workflow — webpack bundle

> **Technique (both tiers).** webcrack pre-splits a webpack bundle into per-module files; then restore each module via the default single-file flow ([small-minified.md](small-minified.md)) or deep mode.

Pre-split a webpack/browserify bundle into per-module files with [webcrack](https://github.com/j4k0xb/webcrack), then rename one module at a time. This is the right path when the input is one giant `{ 123: (e,t,n) => {…}, 456: … }` shape — usually > 500 KB and full of internal `__webpack_require__` calls.

← Back to [SKILL.md](../SKILL.md). Stage detail: [Stage 2](../stages/stage-2-restore.md). Workspace: [stages/workspace.md](../stages/workspace.md).

---

## When to use

- Input is one big bundle with many `id: (e, t, n) => { … }` module declarations.
- ≥ 500 KB, or many cryptic top-level modules.
- No usable sourcemap (run `scripts/sourcemap-check.ts` first — if `.map` exists, recover originals instead).

For ESM-style multi-export chunks that don't have webpack's module-id shape, use [multi-export-bundle.md](multi-export-bundle.md) instead — webcrack won't help there.

## Recipe

```bash
cd <skill-dir>
WS=<target-dir>/.deobfuscate-javascript/$(basename bundle.js .js)
mkdir -p "$WS" && cp bundle.js "$WS/original.js"

bun scripts/sourcemap-check.ts "$WS/original.js"
# (no sourcemap) → pre-split
npx webcrack "$WS/original.js" -o "$WS/webcracked/"
# Pick a module of interest, say modules/3658.js, and restore it via the default
# single-file flow (small-minified.md) — its one-shot polish.ts --rename --fast does
# rename + apply + reading-aid polish in one step:
bun scripts/polish.ts "$WS/webcracked/modules/3658.js" --rename --fast \
  --source "$WS/webcracked/modules/3658.js" --out modules/3658.tsx --format
# Then hand-name the residue, as in small-minified.md.
```

Repeat per module. Each module is just a single file → run it through [small-minified.md](small-minified.md) (default readable tier) or deep mode if the user wants typed output. Drop restored modules back into a `modules/` folder in the user's project — that's the same shape the reference `reverse-engineer-js` workflow uses, and it's compatible with stub-and-replace re-integration into the bundle later.

## Per-module workspaces

For larger modules you want to track separately, create a per-module sub-workspace:

```bash
MOD_WS="$WS/webcracked/.dj-3658"
mkdir -p "$MOD_WS"
cp "$WS/webcracked/modules/3658.js" "$MOD_WS/original.js"
```

This keeps `symbols.json` / `renames.json` / `renamed.js` isolated per module so two modules being worked on in parallel don't collide.

## What webcrack doesn't help with

webcrack is webpack-shaped. For Rollup, esbuild, and Vite output, the bundle is *not* a `{ id: factory }` map — it's flat ESM with hoisted imports and aliased exports. Running webcrack against a Rollup bundle usually returns the file unchanged. In that case, use [multi-export-bundle.md](multi-export-bundle.md) for many-export chunks or [react-vite.md](react-vite.md) for single-component JSX-runtime chunks.

**Alternative splitter for scope-hoisted single bundles:** `wakaru --unpack` (`bun <skill-dir>/scripts/wakaru-normalize.ts <bundle> -o <out-dir>/ --unpack`) splits webpack 4/5, esbuild, Bun, SystemJS, AMD, and Browserify bundles — including scope-hoisted ones webcrack leaves unchanged — and recovers filenames. **Scope it to the single-bundle case only.** Do **not** run `--unpack` on an already-split chunk tree (e.g. Codex `./ref/webview/assets`): it re-derives its own module boundaries/filenames matching nothing in the manifest/ledger/`CHUNK_NAME_REGISTRY` and forks the restore root. For an already-split tree the graph is built by `build-import-graph.ts` from the real chunk files; wakaru there is body-only normalization, never `--unpack` (see [full-restoration.md](full-restoration.md)).

## Stage 3 acceptance — deep mode only

Each restored module finishes in the default readable tier (see [small-minified.md](small-minified.md)) — an optional naming-only (E1) self-review is enough. The Stage 3 acceptance review ([stages/stage-3-finalize.md](../stages/stage-3-finalize.md)) — the host agent's own end-to-end read, no sub-agent required — runs **only in deep mode**, when the user asks for typed/production output.
