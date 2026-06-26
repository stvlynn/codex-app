# Workspace convention

Where intermediate files for a deobfuscation run live, and why. Referenced by every workflow under [../workflows/](../workflows/) — read this once, then bake the `$WS` pattern into the rest of your shell.

← Back to [SKILL.md](../SKILL.md).

---

Put every intermediate file in a per-chunk subdirectory of a single shared hidden parent directory under the *target* output directory:

```
<target-dir>/                              # final outputs land here (e.g. spinner.tsx)
├── spinner.tsx                            # final, semantic kebab output (exports Spinner; Stage 3 PASS)
└── .deobfuscate-javascript/               # shared parent — one per target dir, all chunks underneath
    └── <basename>/                        # workspace — all intermediates for this chunk
        ├── original.js                    # archived pristine copy of the input
        ├── symbols.json                   # scripts/extract.ts output
        ├── renames.json                   # agent-written (Stage 2 rename)
        ├── renamed.js                     # scripts/apply.ts output
        ├── polished.tsx                   # scripts/polish.ts output (Stage 2 polish)
        └── polish-report.json             # scripts/polish.ts --report JSON
```

`<basename>` is the input file name minus its directory and extension, **with the hash suffix kept** — for `ref/webview/assets/spinner-D37df5tU.js` use `spinner-D37df5tU`. The hash makes each workspace unique to its source chunk; the leading dot on the parent keeps it hidden from default `ls` and most file-tree views. The nested layout means a single `.gitignore` entry (`.deobfuscate-javascript/`) covers every chunk in the target.

**Pattern — bake this into every workflow:**

```bash
INPUT=ref/webview/assets/spinner-D37df5tU.js   # the file to deobfuscate
TARGET=restored                                 # the shared restore root; final .tsx lands here
WS="$TARGET/.deobfuscate-javascript/$(basename "$INPUT" .js)"

mkdir -p "$WS"
cp "$INPUT" "$WS/original.js"
```

Then run every script against `$WS/original.js` and write every output back into `$WS/`. The host-agent rewritten final `.tsx` (Stage 3, after acceptance review `PASS`) lands directly in `$TARGET/` with a semantic filename, not the workspace.

- **Don't use `/tmp/`** — it's volatile, not resumable across sessions, and two parallel deobfuscations collide.
- **Don't use the skill's own `archive/`** — it's inside the skill installation, shared across users; per-target workspaces keep different chunks isolated and co-located with their work.
- **Don't put final outputs in the workspace** — the workspace is for intermediates only. The reader of the final `.tsx` shouldn't need to dig into a hidden directory.
- **Don't fall back to the old flat `.deobfuscate-javascript-<basename>` layout** — it scatters siblings at the top of `<target-dir>` and resists a single `.gitignore` line. Always nest under `.deobfuscate-javascript/`.

For batched/plan workflows on huge files, the plan files go in the workspace too (`$WS/plan/CHECKLIST.md`, `$WS/plan/batch-N.json`, `$WS/plan/renames-N.json`).

For multi-export bundle splits (see [../workflows/multi-export-bundle.md](../workflows/multi-export-bundle.md)), the per-output directory and `split-plan.json` also live in `$WS/` — the final split directory lands under the target dir.

## Multi-file restoration: the `_full/` workspace

Full-tree restoration (see [../workflows/full-restoration.md](../workflows/full-restoration.md)) coordinates renaming an entire connected component of the import graph rooted at one entry chunk. It needs a *shared* workspace that all per-file workspaces hang off of, plus two cross-cutting JSON tables:

```
<target-dir>/                              # final split outputs land here, e.g. app-shell/index.ts
└── .deobfuscate-javascript/
    └── _full/                             # one per restoration tree; co-exists with per-chunk workspaces
        ├── manifest.json                  # file-level dependency graph + per-file imports/exports + per-file stage status
        ├── ledger.json                    # per-file symbol-level status + crossFileBindings table
        ├── checkpoints/                   # auto-restore-full mechanical checkpoints; never final deliverables
        │   └── <basename>.tsx
        ├── locks/                         # O_EXCL lockfiles for parallel agents
        │   └── <basename>.<stage>.lock    # one per (file, stage) pair; e.g. app-shell-JLpboL12.rename.lock
        └── files/
            └── <basename>/                # same layout as a single-chunk $WS, just nested
                ├── original.js
                ├── symbols.json
                ├── renames.json
                ├── renamed.js
                └── polished.tsx
```

`_full/files/<basename>/` follows the *same* layout as a single-chunk `$WS` — every existing Stage 1 + Stage 2 script (`extract.ts`, `apply.ts`, `polish.ts`, …) operates on a `_full/files/<basename>/` directory unchanged. The two new top-level files (`manifest.json`, `ledger.json`) are the coordination layer. The public import map is **not** here: it is the single shared `restored/IMPORT_MAP.json` at the restore root, reused regardless of entry.

Pattern (the entry is auto-discovered from `index.html`; the positional is optional):

```bash
TARGET=restored
FULL="$TARGET/.deobfuscate-javascript/_full"

mkdir -p "$FULL/files" "$FULL/locks"
bun scripts/build-import-graph.ts --target "$TARGET" \
  --root ref/webview/assets --out "$FULL/manifest.json"
bun scripts/build-symbol-ledger.ts --target "$TARGET" --out "$FULL/ledger.json"
```

The leading `_` on `_full` keeps it sorted ahead of the per-chunk subdirectories (`spinner-D37df5tU/`, …) when both styles coexist under the same target. npm-leaf chunks (`clsx-XXXX.js`, `react-XXXX.js`, etc.) are recorded in `manifest.files` with `kind: "npm-leaf"` but **never** get a `files/<basename>/` workspace — they're terminal nodes that the existing `polish.ts` rewrites to bare specifiers.

Add `.deobfuscate-javascript/` to `.gitignore` if you want intermediates off version control — they regenerate from `original.js` + `renames.json` any time.
