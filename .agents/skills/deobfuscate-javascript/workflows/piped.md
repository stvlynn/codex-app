# Workflow — piped (stdin/stdout chains)

Skip temp files entirely when chaining tools. Every script accepts `-` as input path to read from stdin and writes to stdout when `--out` is omitted. Warnings and stats go to stderr so the pipe stays clean.

← Back to [SKILL.md](../SKILL.md). Stage detail: [Stage 1](../stages/stage-1-deobfuscate.md), [Stage 2](../stages/stage-2-restore.md).

---

## Examples

```bash
# Full Stage 1 in one pipe (warnings to stderr, code to stdout)
cat obf.js | bun scripts/unpack.ts - | bun scripts/string-array.ts - \
  | bun scripts/decode-strings.ts - | bun scripts/simplify.ts -

# Stage 1 → extract (skip Stage 2's rename for now)
bun scripts/deobfuscate.ts obf.js | bun scripts/extract.ts - | jq '[.[] | select(.referenceCount > 1)]'

# Apply renames to a piped bundle and post-process with prettier in one shot
cat bundle.js | bun scripts/apply.ts - $WS/renames.json | npx prettier --stdin-filepath x.js > out.js

# Stage 2 rename + Stage 2 polish in one pipe (renamed → polished → prettier)
bun scripts/apply.ts bundle.js $WS/renames.json | bun scripts/polish.ts - \
  | npx prettier --stdin-filepath x.tsx > out.tsx
```

## When piping is and isn't appropriate

**Good fit:**
- Quick experimentation — you want to see what comes out without committing intermediates to disk.
- Filtering with `jq` between stages.
- One-shot Stage 1 → prettier passes where you don't need to inspect the renamed output before formatting.

**Bad fit:**
- Anything that needs `renames.json` (which is written by *you*, the agent, between extract and apply) — there's no piping past the rename decision.
- Anything that produces a `--report` JSON you want to inspect (the orchestrators emit code to stdout but reports to a file).
- Stage 2's plan/batch workflow — by design that's checklist-driven across sessions and needs a workspace.

For everything else, the [workspace convention](../stages/workspace.md) is the cleaner default — intermediates land in `$WS/` so you can re-run any stage without redoing the upstream work.

## Stage 3 acceptance — review level depends on the tier

Piping is fine for experimentation. If the piped output (e.g. `> out.tsx`) becomes a deliverable that lands in the user's project, an **optional naming review** by default is enough; the acceptance review runs only if the user wants a deep/typed deliverable — see [stages/stage-3-finalize.md](../stages/stage-3-finalize.md). In deep mode the skill is not done until the host agent's end-to-end read passes every delivered file (`NEEDS_FIX` means rewrite and re-read; there is no TODO-header completion path; no sub-agent required). Skipping the deep-mode loop is a fail mode listed in the skill's [quality bar](../SKILL.md#quality-bar--anti-patterns-to-refuse-before-declaring-done).
