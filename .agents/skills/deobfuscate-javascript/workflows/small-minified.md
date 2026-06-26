# Restore a single file — readable fallback

> **Single-file fallback (readable).** Goal: code a human can read. The only hard bar is naming quality — types, npm-import resolution, and the reviewer LOOP are deep mode only.

This is the **single-file fallback** — use it for a lone pasted snippet or when there is no `index.html` / asset tree to restore. When the input is an app (an `index.html` + sibling-chunk tree), the default is the whole-tree restore ([full-restoration.md](full-restoration.md)). Works whether the input is *minified* (short names, single-line) or a React/Vite/Rollup component — the one-shot polish recovers JSX for you. Skip Stage 1 entirely unless `detect.ts` finds obfuscation (Packer wrapper, `_0x` arrays, hex/unicode walls).

← Back to [SKILL.md](../SKILL.md). Stage detail: [Stage 2](../stages/stage-2-restore.md). Workspace: [stages/workspace.md](../stages/workspace.md).

---

## Happy path

```bash
cd <skill-dir>
WS=<target-dir>/.deobfuscate-javascript/$(basename <input.js> .js)
mkdir -p "$WS" && cp <input.js> "$WS/original.js"

# Step 0a — sourcemap check. If a .map exists, recover originals from it instead;
#           that beats any rename. A dangling //# sourceMappingURL with no .map is harmless.
bun scripts/sourcemap-check.ts "$WS/original.js"

# Step 0b — detect. If this reports obfuscation, go to full-obfuscation.md FIRST,
#           then come back here. If it's just minified, skip Stage 1.
bun scripts/detect.ts "$WS/original.js"

# Step 0c — wakaru mechanical normalization (default-on). Recovers ES6 classes,
#           async/await, optional chaining, for-of, destructuring, TS enums, … so the
#           rename starts from cleaner code. Byte-rewriting → from here on, work on
#           normalized.js. Auto-skips (passthrough) if @wakaru/cli is unavailable, so
#           normalized.js always exists. Skip this when a usable .map exists (Step 0a).
bun scripts/wakaru-normalize.ts "$WS/original.js" -o "$WS/normalized.js" --level standard

# One-shot: smart-rename + apply + reading-aid polish (--fast) + prettier.
#   File operand is the wakaru-normalized output; --source still points at the
#   ORIGINAL input for the `// Restored from <path>` provenance header.
#   --rename runs smart-rename + apply as a pre-step.
#   --fast runs the reading-aid subset only and skips the import-resolution tail
#          (react-shim-elim, resolve-npm-imports, npm-cjs-shim-elim, dead-shim-elim) —
#          that tail is deep mode only.
bun scripts/polish.ts "$WS/normalized.js" --rename --fast \
  --source <input.js> --out "$WS/draft.tsx" --format
```

## Hand-name the residue

`smart-rename` covers the mechanical cases (React `props`, event handlers, `.map`/`.reduce` callbacks, hook returns). Then **read `$WS/draft.tsx`** and name what it couldn't reach — this is the only hard bar:

- **Program-scope domain nouns** — the top-level exports and the concepts they model (a lookup map, a context value, a reducer).
- **Lookup-table names** — `{0:"sm",1:"md"}` → `buttonSizeClassNames`, etc.
- **JSX component aliases** — a lowercase `<r>` that's really `<Spinner>`, `<o>` that's really `<Tooltip>`. Rename the binding so the tag reads true.

Keep going into the function bodies until single-letter density is low (see [stage-2-restore.md → Step 2.5](../stages/stage-2-restore.md#step-25--dont-stop-at-program-scope)). Refuse generated fallback names (`buttonValue3`, `contextParam14`). For a second rename pass, re-extract on the draft:

```bash
bun scripts/extract.ts "$WS/draft.tsx" --out "$WS/symbols.json" --only-cryptic --min-refs 2
# ... Write "$WS/renames.json" with the residue names ...
bun scripts/apply.ts "$WS/draft.tsx" "$WS/renames.json" --out "$WS/draft.tsx"
bun scripts/format.ts "$WS/draft.tsx"
```

## Deliver

A semantic kebab public filename (`spinner.tsx`, not `spinner-D37df5tU.tsx`; it exports `Spinner`) with the provenance header intact. That's the readable deliverable. Types, npm-import resolution, and the reviewer loop are optional — deep mode is a continuation, not a correction. Tell the user it's available.

## Sub-cases (branch only if it applies)

Load a technique doc **only** when its case matches — none of these is mandatory in the default tier:

- **React / JSX** — already handled. `--fast` runs jsx-runtime recovery, so `jsxRuntime.jsx("svg", …)` arrives as JSX. Nothing extra to do.
- **≥ 3 exports or a registry object** (`export const Foo = { Name1, Name2, … }`) → see [multi-export-bundle.md](multi-export-bundle.md) to split into a directory. This is a **deep-tier** step — optional in the default tier, which may leave the file flat.
- **≥ 500 KB or > 1000 cryptic symbols** → see [huge-single-file.md](huge-single-file.md) for `plan.ts` batching (one rename pass won't fit).
- **Webpack `id:(e,t,n)=>{}` modules** → see [webpack-bundle.md](webpack-bundle.md) to webcrack-pre-split first, then restore each module here.

## Stage 3 acceptance — optional naming self-review (E1)

Default tier needs no acceptance LOOP. If you want extra confidence, do a single naming-only (E1) self-review of the draft — meaningful identifiers, no fallback names, low single-letter density. The Stage 3 acceptance review ([stages/stage-3-finalize.md](../stages/stage-3-finalize.md)) is **deep mode only**, and the host agent runs it itself — no sub-agent required.
