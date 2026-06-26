# Workflow — huge single file (≥ 500 KB or > 1000 symbols)

> **Technique (both tiers).** This is about batching a too-big file's renames via plan.ts — it applies whenever a single file is too large for one rename pass, in either tier. It is not about typing.

Plan + batched renames. When `extract.ts` returns thousands of symbols, doing one giant rename pass is impractical — the JSON alone might be tens of MB, and you'll burn through token budget. Split the work into batches you walk through a checklist.

← Back to [SKILL.md](../SKILL.md). Stage detail: [Stage 2](../stages/stage-2-restore.md). Workspace: [stages/workspace.md](../stages/workspace.md).

---

## Recipe

```bash
cd <skill-dir>

# 0. Set up workspace (see Workspace convention)
WS=<target-dir>/.deobfuscate-javascript/$(basename <input.js> .js)
mkdir -p "$WS" && cp <input.js> "$WS/original.js"

# 1. Filtered extract — keep context, drop noise
bun scripts/extract.ts "$WS/original.js" --out "$WS/symbols.json" \
  --only-cryptic --min-refs 3 --top 200 --max-same-scope 5 --context-size 300

# 2. Plan: group + rank + split
bun scripts/plan.ts "$WS/symbols.json" --out-dir "$WS/plan" --input "$WS/original.js" --batch-size 50

# 3. Iterate batches — Read $WS/plan/CHECKLIST.md to track progress.
#    For each unchecked batch:
#      Read  $WS/plan/batch-N.json
#      Write $WS/plan/renames-N.json
#      Edit  $WS/plan/CHECKLIST.md  (flip [ ] → [x] for that batch)
#    You can pause and resume the session — the checklist persists state.

# 4. Merge and apply once
cat "$WS"/plan/renames-*.json | jq -s 'add' > "$WS/plan/renames.json"
bun scripts/apply.ts "$WS/original.js" "$WS/plan/renames.json" --out <output.js>

# 5. (Optional) Re-extract on the renamed output to see what's left, re-plan, repeat
bun scripts/extract.ts <output.js> --out "$WS/symbols-pass2.json" --only-cryptic --top 200 --max-same-scope 5
```

## Why filter first, then plan

- `--only-cryptic` skips identifiers like `useState`, `parseUrl` that are already meaningful.
- `--min-refs 3` skips one-shot scratch bindings — there are usually hundreds, naming them is low-value.
- `--top 200` caps the work to a tractable number of *high-impact* names. Anything beyond the top 200 by scope+ref ranking is diminishing returns.
- `--max-same-scope 5` trims `sameScopeBindings` from "all 1000+ siblings" to "5 examples" — useful for choosing consistent style without ballooning JSON size.
- `--context-size 300` keeps enough surrounding code to choose names without copying entire functions.

## Why the checklist

- Each batch is a small, isolated decision (~50 symbols, ~30 KB JSON). Fits comfortably in one focused pass.
- The checklist persists across sessions — work two batches, take a break, resume cold.
- Batches are largest-scope-first; even doing batches 0–3 gives most of the readability win for the top-level concepts.

For a worked example see [reference/examples.md → Example 7](../reference/examples.md#example-7-huge-bundle--plan-then-batch-with-a-checklist).

## Stage 3 acceptance — deep mode only

Once the batched renames land, finish in the default readable tier (see [small-minified.md](small-minified.md)) — an optional naming-only (E1) self-review is enough. The Stage 3 acceptance review ([stages/stage-3-finalize.md](../stages/stage-3-finalize.md)) — the host agent's own end-to-end read, no sub-agent required — runs **only in deep mode**, when the user asks for typed/production output.
