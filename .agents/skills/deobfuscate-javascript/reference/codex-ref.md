# Project profile — codex-app-code `./ref`

Use this profile whenever the task targets this repo's extracted Codex.app
bundle under `./ref`. It narrows the generic Vite/Rollup restoration workflow
so agents spend effort on app code instead of rediscovering the local layout.

← Back to [SKILL.md](../SKILL.md). Primary workflow:
[full-restoration.md](../workflows/full-restoration.md).

## Scope map

- `ref/package.json` identifies the extracted app as
  `openai-codex-electron`; use it as the dependency oracle.
- `ref/webview/index.html` names the browser entry and modulepreload roots.
  Read it before picking an entry when the user says "restore ./ref".
- `ref/webview/assets/*.js` is the bundled code root. These chunks are the
  normal input for the deobfuscation workflow.
- `ref/webview/assets/*.css`, WASM, fonts, images, and animation/data files are
  assets. Preserve or reference them; do not turn them into TS/TSX unless a JS
  chunk wraps them.
- `ref/node_modules/**` is extracted dependency/native-module source. Use it for
  package identity and API shape, not as a target for bundle restoration.
- `ref/native-menu-locales/**` is JSON data. Treat it as a data source, not a JS
  restoration target.

## Default command frame

For a main app restore or continuation:

```bash
SKILL_DIR=.agents/skills/deobfuscate-javascript
# Auto-discover the entry from index.html (do NOT hard-code the hash — they
# rotate every build). Falls back to globbing app-main-*.js if you prefer:
ENTRY=$(bun "$SKILL_DIR/scripts/check-entry.ts" --discover --root ref/webview/assets)
TARGET=restored
FULL="$TARGET/.deobfuscate-javascript/_full"

bun "$SKILL_DIR/scripts/sourcemap-check.ts" "$ENTRY" || true
# --discover already confirmed the entry is the app, not a vendor leaf (exit 3 = leaf).
bun "$SKILL_DIR/scripts/build-import-graph.ts" "$ENTRY" \
  --target "$TARGET" \
  --root ref/webview/assets \
  --max-lines 0
bun "$SKILL_DIR/scripts/build-symbol-ledger.ts" \
  --target "$TARGET" \
  --manifest "$FULL/manifest.json" \
  --out "$FULL/ledger.json"
bun "$SKILL_DIR/scripts/auto-restore-full.ts" --target "$TARGET" --format
```

Always resolve the hashed entry from `ref/webview/index.html` or by globbing
`app-main-*.js` — chunk hashes rotate every build (the snapshot this profile was
written against used `app-main-DG-Mf4Wj.js`; later snapshots differ). The
`<script>` root in `index.html` is the true bootstrap; `app-main-*` is the usual
deep-restore target because it has the largest local fan-out.

## Resume before rebuilding

Before running graph or auto-restore scripts, inspect existing restoration
state:

```bash
find restored -maxdepth 3 \( -name README.md -o -name 'IMPORT_MAP.json' \)
find restored \( -path '*/.deobfuscate-javascript/_full/manifest.json' -o -path '*/.deobfuscate-javascript/_full/ledger.json' \)
```

If `TARGET/.deobfuscate-javascript/_full/manifest.json` and `ledger.json`
exist, resume from them unless the user explicitly asked to rebuild or the
entry hash changed. Reuse the single shared `restored/IMPORT_MAP.json` (one map
at the restore root, regardless of entry).

## Boundary classification

Use `--max-lines 0` for true deep restores, but do not treat every reachable
asset-like chunk as a feature module:

- Known npm chunks should become bare imports. If a package-like chunk basename
  matches `ref/package.json` dependencies or a well-known package entry, extend
  `CHUNK_NAME_REGISTRY` / use `--treat-as-npm` rather than restoring vendor
  internals as app code.
- **`@pierre/trees` + `@pierre/diffs` (file tree + diff views) → vendored
  package boundaries, NOT app code.** Codex bundles these two published packages
  inline: the file tree is `@pierre/trees` (npm `1.0.0-beta.4`; built on
  **Preact**, exports `.`/`./react`/`./ssr`/`./web-components`) and the diff view
  is `@pierre/diffs` (`1.2.11`; deps `shiki ^3`, `@pierre/theme`, `@pierre/theming`,
  `diff`; exports `.`/`./react`/`./worker`). Recognize the family by fingerprint,
  not basename:
  - CSS tokens `--trees-*` (`--trees-row-height`, `--trees-file-icon-color-rust`,
    `--trees-git-modified-color`) and `--diffs-*` (`--diffs-addition-base`,
    `--diffs-line-bg`, `--diffs-column-number-width`).
  - DOM attrs `data-file-tree-*` (`-virtualized-root`, `-sticky-row`,
    `-search-input`), `data-diffs-header`, `data-diff-type`, `data-diff-span`.
  - The `pierre-light`/`pierre-dark`(+`-soft`) Shiki themes, and the residual
    `/** @pierre/truncate css here, manually copy pasted for now */` comment.
  - Renderer cluster (the package engine): `file-tree-search-input-*` (the tree),
    `shiki-highlight-provider-gate-*` (the `@pierre/diffs` **main-entry/gate**),
    `file-diff-*`, `diff-unified-*`, `parsePatchFiles-*`, and the highlight
    `worker-*` chunk.

  **Codex FORKED these, so a clean bare swap is usually INFEASIBLE.** The bundled
  chunks are not pristine upstream copies — e.g. `file-tree-search-input` ships a
  **React fork** of the Preact `@pierre/trees` and exports
  `FileTree`/`FileTreeSearchInput`/`extractFilePathFromEvent` that don't exist
  upstream; the `@pierre/diffs` gate is entangled with Codex inputs (settings
  `lightCodeThemeId`/`darkCodeThemeId`, app-scope store, window-context route
  gating); `FileDiff` wraps the renderer in a settings-driven theming layer
  (`var(--codex-diffs-surface)`). Treatment, in order of cleanliness:
  - **Clean leaves → real bare import.** The highlight worker (no Codex logic,
    `ShikiError`+`set-render-options`+`data-diff-span`, sole dep an Oniguruma WASM)
    → `@pierre/diffs/worker`. The self-contained patch parser (`parsePatchFiles`,
    0 imports, `diffs-container`/`--diffs-scrollbar-gutter-measured` fingerprints)
    → `@pierre/diffs` — but reconcile the layout/CSS constants its consumers also
    pull (`DIFFS_CONTAINER_CLASS`, `MAX_DIFF_SIZE`, `THEME_BY_MODE`, …) against the
    real public surface; keep a re-exporting facade if not all are public.
  - **Forked / entangled engine → keep the wrapper, relabel + boundary-ize.** Do
    NOT delete the forked file or pretend it's upstream. Mark it a vendored
    `@pierre/*` boundary (provenance header + `quality-gate.ts --vendored`), keep
    the thin Codex wrapper, and lift Codex-local inputs to props/config.
  - Themes `pierre-*` → `@pierre/theme` data (low priority; fine as inline frozen
    JSON, relabel optional).
  - **Mechanics in this restore:** there is no vendored `node_modules`; bare npm
    imports type-check via ambient `declare module "…"` stubs in
    `restored/globals.d.ts` (alongside `clsx`, `zod`, `@radix-ui/*`). So
    externalizing = add `@pierre/trees`/`@pierre/diffs`/`@pierre/diffs/*`/
    `@pierre/theme` ambient decls + reclassify the chunk in the IMPORT_MAP +
    provenance relabel — not a node_modules install.

  **Basename traps — these are NOT Pierre, leave them as restored Codex/data:**
  `diff-stats-*` (animated git-stat badge, react-intl + Codex i18n),
  `diff-view-mode-*` (Codex editor-theme catalog + settings enum),
  `use-diff-annotations-*` (PDF.js annotation layer + Codex review-comment
  threading — decisive: the real `diff-unified` renderer imports FROM it),
  `parse-diff-*` (Codex size-guard wrapper around `parsePatchFiles`),
  `grammars/diffGrammar.ts` (`diff-*` = Shiki TextMate `source.diff` grammar),
  `treeView-SZITEDCU-*` / `treemap-*` (Mermaid/d3 diagram vendor),
  `worktree-*` / `pending-worktree-*` (git-worktree features). And the genuine
  Codex consumers that merely *use* the surface — `review-*`,
  `pull-request-code-review-comments-*`, `thread-side-panel-tabs-*`,
  `workspace-directory-tree-*`, `editor-diff-page-*` — stay restored.
- Syntax grammar, theme, locale, Mermaid, KaTeX, PDF, workbook, and protobuf
  runtime chunks may be public output, but they should be compact semantic
  facades or data modules. Do not invent app-specific component names for them.
- Feature chunks named after product concepts (`composer-*`,
  `composer-controller-*`, `local-conversation-*`, `conversation-*`,
  `thread-*`, `review-*`, `plugins-*`, `mcp-*`, `settings-*`,
  `pets-settings-*`, `app-shell-*`, `app-server-*`, `native-apps-*`) and any
  app-facing `*-page-*` / `*-panel-*` chunk deserve Stage 3 semantic splitting
  and typed TS/TSX surfaces. `pdf-preview-panel-*` is a panel by default; do not
  turn it into `export {}` or a doc/vendor boundary merely because it references
  PDF/doc renderer internals. Prove a chunk is genuine vendor/data by fingerprint
  before boundary-izing it.
- If a consumer only needs a boundary name from an unfinished huge **third-party
  runtime** chunk, leave a documented facade and revisit the runtime only when the
  user scopes it. **Facing applies to genuine vendor/runtime chunks only — never to
  app/feature chunks** (`app-shell-*`, `app-main-*`, pages, panels, components,
  contexts, hooks); those are recursively restored even when large or widely
  imported. A facade is an _open boundary_, so a deep/full restore is **not
  complete** while one stands in for a project-local chunk. Generate it
  mechanically: `make-facade.ts <chunk> --provenance ref/webview/assets/<basename>.js`
  emits a typed `export declare const … : any` facade (reserved-word-safe — the Zod
  `src` chunk literally exports `in`), then `ledger.ts mark-faced <basename>`
  (which refuses app-entry basenames without `--force`) so the chunk's many
  consumers stop waiting on it and become restorable. Record the alias map under
  `dependencyBoundaryFacades` in the project IMPORT_MAP. The vendor/runtime
  chunks that warrant a typed **`any`-facade** in this repo are the genuine app/host
  runtime: the React/react-query `app-scope` layer, the `vscode-api`/host bridge,
  the Codex `rpc`/`host-config`/`product-logger`/persisted-signal runtime — and the
  app is made runnable before they are restored via `make-facade.ts --passthrough`
  (re-exports the original ref chunk under `@ts-nocheck` + `// TODO`).

### Bundled third-party packages — resolve to bare re-exports, not facades

Many Codex boundary chunks are stock npm packages the bundler renamed after an
internal module (`isEqual-*`, `lib-*`, `single-value-*`, `chunk-XXXX-*`), so
`CHUNK_NAME_REGISTRY`'s stem match misses them. Once identified, the deliverable is
a **bare re-export shim** (`make-facade.ts <chunk> --reexport <specifier>`), not an
`any`-facade — `boundaries/highlight-js-core.ts` is the model. The map seen in this
repo (record the package in IMPORT_MAP `vendor`; `classifyBoundary()` reads it):

| Boundary file (chunk) | npm specifier | notes |
| --- | --- | --- |
| `lodash.ts` (`isEqual-*`) | `lodash` | named/star re-export |
| `react-router.ts` (`chunk-LFPYN7LY-*`) | `react-router` | |
| `formatjs.ts` (`lib-BWT6A3Q0`) | `react-intl` | consumers import `useIntl`/`FormattedMessage` |
| `motion.ts` (`single-value-*`) | `framer-motion` | |
| `markdown-ast.ts` (`lib-CqEvD6Nn`) | `mdast-util-*` | confirm the exact util |
| `parse-patch-files.ts` (`parsePatchFiles-*`) | `@pierre/diffs` | **forked** — see Pierre note; keep wrapper if it diverges |
| `src.ts` (`src-*`) | `zod` | verify it is stock Zod, not a fork |
| `analytics.ts` (`pkg-*`) | `@segment/analytics-next` | Segment browser SDK |
| `radix-*.ts` (`dist-*`, `Combination-*`) | `@radix-ui/react-*` | per-primitive; **may be forked** |

**Fork caveat:** `@pierre/*`, `@radix-ui/*`, and `zod`(`src`) may be Codex forks, not
stock npm. Before swapping to a bare specifier, confirm the export surface matches
stock and the specifier resolves in `ref/node_modules`; for a confirmed fork keep the
forked wrapper and boundary-ize it (`quality-gate.ts --vendored`).

## Semantic rewrite playbook

When converting checkpoints into public files:

- Use chunk basename as a hint, then confirm with UI text, query keys, route
  paths, action IDs, localStorage keys, plugin IDs, IPC/channel names, CSS class
  names, and consumer imports.
- Group output by product domain (kebab-case directory names): `app`,
  `app-shell`, `composer`, `conversations`, `threads`, `settings`, `plugins`,
  `mcp`, `native-apps`, `files`, `diff`, `sidebar`, `artifacts`, `popcorn`,
  `ui`, `icons`, `locales`, `markdown`, `queries`, `host`, `config`, and
  `utils`. All directly under the shared `restored/` root — no per-entry folder.
- Preserve chunk identity only in provenance headers and import maps:
  `// Restored from ref/webview/assets/<basename>.js`. Public file and directory
  names are kebab-case and hash-free (React component identifiers stay
  PascalCase: `button.tsx` exports `Button`).
- Prefer target-local barrels (`index.ts`) for split feature folders. Update the
  shared `restored/IMPORT_MAP.json` at the same time as the public files so later
  chunks import the semantic path instead of the hashed chunk.
- Reuse existing restored modules if the hash already maps to a semantic file.
  Do not create parallel modules with slightly different names for the same
  source chunk.

## Stage 3 acceptance review in this repo

Run Stage 3 acceptance review automatically after the deterministic gate, with no
extra confirmation. The host agent performs the acceptance read itself — reading
every delivered file end-to-end against the quality bar — so it needs no sub-agent
and no authorization, and is never blocked by their absence. If the runtime offers a
reviewer/sub-agent tool _and_ the user has authorized delegation, you may use it
for independent eyes (`prepare-stage-e-review.ts <target>` then `--verify`
batches the packets); otherwise just read the files yourself and proceed. Never
report "reviewer unavailable" as though Stage 3 acceptance review could not run,
and never pretend files passed without an actual read.

After acceptance, run the final whole-target gate:

```bash
bun .agents/skills/deobfuscate-javascript/scripts/quality-gate.ts restored
```

This command understands this repo's legacy `IMPORT_MAP.json` sections
(`chunks`, `boundaries`, `appScope`, `vscodeApi`, `src`, `statsig`) as well as
newer `publicOutputs`. It is the guard against the recurring failure where most
files look mapped but many app chunks remain mechanical or placeholder outputs.
Do not accept a boundary-only audit, a count of placeholder files under
`boundaries/`, or `status: "done"` as proof of a complete deep restore.
