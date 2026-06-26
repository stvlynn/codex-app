# Workflow — full obfuscation (Stage 1 + Stage 2 rename)

Use when `detect.ts` identifies one or more obfuscation techniques: Packer/AAEncode wrappers, Obfuscator.IO `_0x` string arrays, hex/unicode escape walls, dead-code injection, opaque predicates, or control-flow flattening.

← Back to [SKILL.md](../SKILL.md). Stage detail: [Stage 1](../stages/stage-1-deobfuscate.md), [Stage 2](../stages/stage-2-restore.md). Workspace: [stages/workspace.md](../stages/workspace.md).

---

## Standard run

```bash
cd <skill-dir>
WS=<target-dir>/.deobfuscate-javascript/$(basename <input.js> .js)
mkdir -p "$WS" && cp <input.js> "$WS/original.js"
bun scripts/detect.ts "$WS/original.js"                                   # see what's there
bun scripts/deobfuscate.ts "$WS/original.js" --out "$WS/stageA.js" --report "$WS/stageA.json"
# (Read $WS/stageA.json. If control-flow-report flagged flatteners, rewrite them manually now.)
```

`$WS/stageA.js` is now plain deobfuscated (but still cryptic-named) JavaScript. **Continue in the default tier** — feed it to the single-file flow in [small-minified.md](small-minified.md) starting at the one-shot `polish.ts --rename --fast` step (run it on `$WS/stageA.js` instead of `original.js`), then hand-name the residue and deliver. Deep/typed/production output is opt-in from there.

The order matters — `extract.ts`'s byte offsets are invalidated by Stage 1 rewrites, so always run Stage 1 to completion *before* renaming. See [Stage 1 ordering notes](../stages/stage-1-deobfuscate.md#ordering--critical).

## Packer-wrapped suspicious input — refuse eval, inspect first

When the input is from an untrusted source (malware sample, scraped script, user-submitted blob), gate the eval with `--no-eval` first to confirm a Packer wrapper is present without executing it:

```bash
cd <skill-dir>
WS=<target-dir>/.deobfuscate-javascript/$(basename <input.js> .js)
mkdir -p "$WS" && cp <input.js> "$WS/original.js"

bun scripts/unpack.ts "$WS/original.js" --no-eval                # confirms eval would be needed
# ... visually verify the packer wrapper looks legit ...
bun scripts/deobfuscate.ts "$WS/original.js" --out "$WS/clean.js" # allow eval
```

`unpack.ts` uses `new Function(...)` to parse Packer arg lists and decode AAEncode. Sandboxed JS strings can't break out of `new Function` to read your filesystem, but it *does* execute the input. Stderr warns before each eval; `--no-eval` short-circuits all evaluation and exits 0 with `evalRefused: true` in the result.

## Control-flow flattening

If `deobfuscate.ts`'s report shows `control-flow-report` flagged flatteners (`while(true){switch(_0x123){case 0: …}}`), the report gives you the dispatch graph but the rewrite is manual. See [reference/examples.md → Example 6](../reference/examples.md#example-6-control-flow-flattening--read-the-report-manually-rewrite) for the recipe.

## Stage 3 acceptance — deep mode only

Stage 1's output goes through the default readable tier (see [small-minified.md](small-minified.md)) — an optional naming-only (E1) self-review is enough. The Stage 3 acceptance review ([stages/stage-3-finalize.md](../stages/stage-3-finalize.md)) — the host agent's own end-to-end read, no sub-agent required — runs **only in deep mode**, when the user asks for typed/production output.
