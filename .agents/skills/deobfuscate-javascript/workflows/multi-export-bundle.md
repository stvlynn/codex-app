# Workflow — multi-export ESM bundle: split into a directory

> **Deep / production mode only.** Splitting a multi-export chunk into a directory of typed files is a deep-tier step. The default readable tier may leave a multi-export file flat — run this only when the user wants the directory split or typed/production output.

Vite/Rollup chunks often bundle a whole family of related components — a `Tooltip` chunk with `Tooltip + KBD + TooltipProvider`, an `AppShell` chunk with 8 named exports plus a 20-prop registry. After Stage 2, the single polished file is correct but unwieldy. This workflow adds a _split_ step that emits a **directory** of small files instead.

Use this when the bundle has many named exports or a registry object and you want each export (or each cohesive group) to live in its own file.

← Back to [SKILL.md](../SKILL.md). Stage detail: [Stage 2](../stages/stage-2-restore.md), [Stage 3](../stages/stage-3-finalize.md). Workspace: [stages/workspace.md](../stages/workspace.md). Sibling: [react-vite.md](react-vite.md) for single-component chunks.

---

## When to use

Load this workflow if the input matches **all** of:

- ESM syntax: contains `import` / `export` statements (not webpack `id: (e,t,n)=>{}`).
- Size ≥ 10 KB **OR** the trailing `export { … }` declares ≥ 3 names **OR** there is a registry-object export (a `var Mr = { Name1: …, Name2: … }` followed by `export { … Mr … }`).
- No detectable sourcemap (run `scripts/sourcemap-check.ts` first; if a `.map` exists, recover from that instead).

If only one export survives Stage 2 and the file is < 5 KB, fall back to [react-vite.md](react-vite.md) — splitting adds ceremony for no gain.

## Split is mandatory in deep mode once trigger matches

Once the trigger conditions above match **and the user asked for deep/typed/production output**, the split step is part of the deliverable, not a stylistic upgrade. (In the default readable tier the flat file is a valid deliverable — see [small-minified.md](small-minified.md).) Common ways agents talk themselves out of it in deep mode (do not do these):

- ❌ "The single polished file is already readable, so I'll skip the split." → Wrong. A 1 500-line file with 20 exports + a registry is not the same product as a directory of 20 files. Consumers read one component at a time; the single-file form forces them to scroll past 19 unrelated ones.
- ❌ "The generated split plan is good enough, so I won't read it." → Wrong. `scripts/plan-split.ts` gives a starting point; you still need to rename files/groups and assign helpers based on the code's actual domain.
- ❌ "I'll mark the split task complete because the deobfuscation is done." → A multi-export bundle that didn't get split has not finished this workflow. Report it as a partial result and ask the user whether to continue, don't silently complete.

If you genuinely can't complete the split in the current session, leave the polished single-file output in `$WS/polished.tsx`, **don't** copy it to the user's target dir, and tell the user the split is pending. That makes the unfinished state visible instead of disguising it as a finished deliverable.

## Pipeline order

1. **Workspace setup** — same `$WS` convention as everything else (see [stages/workspace.md](../stages/workspace.md)).
2. **Stage 1** (only if obfuscated — `scripts/detect.ts` says so). Otherwise skip.
3. **Stage 2 rename** — extract → rename → apply, against the **whole file**. Do not split before rename: extract's symbols, scope analysis, and apply's collision-safety all need the full AST. Pick semantic names for every exported binding (`t` → `Tooltip`, `n` → `KBD`, `Mr` → `AppShell`).
4. **Stage 2 polish** — polish the whole file if it's a React/Vite bundle (`bun scripts/polish.ts "$WS/renamed.js" --out "$WS/polished.tsx" --source "$INPUT"`). Don't pass `--format` here — the split in step 6 overwrites the formatted file. Format the directory in step 8 instead.
5. **Plan the split.** Agent reads the polished output and writes `$WS/split-plan.json` (schema below).
6. **Execute the split.** Use the tool path by default:
   ```bash
   bun <skill-dir>/scripts/plan-split.ts "$WS/polished.tsx" \
     --out "$WS/split-plan.json" \
     --out-dir "$WS/candidate/<bundle>"
   # Read and edit split-plan.json for real semantic groups before executing.
   bun <skill-dir>/scripts/split-bundle.ts "$WS/polished.tsx" "$WS/split-plan.json" \
     --out-dir "$WS/candidate/<bundle>"
   ```
   The generated plan is only a starting point. Rename files/groups and assign shared helpers based on the code's domain before running `split-bundle.ts`.
7. **Verify** — `tsc --noEmit` if `.tsx`, or `node --check` per file; spot-read the entry `index.ts` to confirm re-exports match the original `export { … }` list.
8. **Format** — `bun scripts/format.ts <target-dir>/<bundle>/` runs prettier across every split file.
9. **Gate + promote, then Stage 3 acceptance** — `bun scripts/quality-gate.ts "$WS/candidate/<bundle>"` must exit 0. Then run `scripts/promote-final.ts "$WS/candidate/<bundle>" <target-dir>/<bundle>/ --report "$WS/final-quality-report.json"`. If either fails, the split still contains half-renamed files, residue, generated names, or an oversized flat subfile; do not copy it to the public target. A successful promote is still only the pre-filtered candidate; run the Stage 3 acceptance review next (the host agent reads the split directory end-to-end).

## `split-plan.json` schema

```json
{
  "outDir": "<target-dir>/app-shell",
  "extension": ".tsx",
  "sections": [
    {
      "dir": "layout",
      "files": [
        {
          "name": "root.tsx",
          "exports": ["Root"],
          "bindings": ["Root", "useRootLayout"]
        },
        {
          "name": "left-panel.tsx",
          "exports": ["LeftPanel"],
          "bindings": ["LeftPanel"]
        },
        {
          "name": "content.tsx",
          "exports": ["Content"],
          "bindings": ["Content"]
        },
        {
          "name": "main-content-layout.tsx",
          "exports": ["MainContentLayout"],
          "bindings": ["MainContentLayout"]
        }
      ]
    },
    {
      "dir": "header",
      "files": [
        /* … */
      ]
    },
    {
      "dir": "panels",
      "files": [
        {
          "name": "bottom-panel.tsx",
          "exports": [
            "BottomPanel",
            "BottomPanelTabs",
            "BottomPanelTabsEmptyState",
            "BottomPanelTabListAfter",
            "BottomPanelTabListAfterSticky",
            "BottomPanelOutlet"
          ],
          "bindings": [
            "BottomPanel",
            "BottomPanelTabs",
            "BottomPanelTabsEmptyState",
            "BottomPanelTabListAfter",
            "BottomPanelTabListAfterSticky",
            "BottomPanelOutlet"
          ]
        },
        {
          "name": "right-panel.tsx",
          "exports": [
            "RightPanel",
            "RightPanelTabs",
            "RightPanelTabsEmptyState",
            "RightPanelTabListAfter",
            "RightPanelTabListAfterSticky",
            "RightPanelTabListBefore",
            "RightPanelOutlet"
          ],
          "bindings": [
            "RightPanel",
            "RightPanelTabs",
            "RightPanelTabsEmptyState",
            "RightPanelTabListAfter",
            "RightPanelTabListAfterSticky",
            "RightPanelTabListBefore",
            "RightPanelOutlet"
          ]
        }
      ]
    }
  ],
  "shared": { "name": "shared.ts", "bindings": ["clsx", "useTooltip", "..."] },
  "barrel": {
    "name": "index.ts",
    "reExports": [
      { "from": "./layout/root", "names": ["Root"] },
      { "from": "./layout/left-panel", "names": ["LeftPanel"] },
      {
        "from": "./panels/bottom-panel",
        "names": ["BottomPanel", "BottomPanelTabs", "..."]
      }
    ],
    "registry": {
      "name": "AppShell",
      "from": [
        /* maps registry props → file::export */
      ]
    }
  }
}
```

**Field semantics:**

- `outDir` — directory the split lands in. Should be under the user's chosen target, **not** under `$WS/`.
- `extension` — `.tsx` for files containing JSX, `.ts` otherwise. Per-file overrides via `name`.
- `sections[].dir` — subdirectory under `outDir`. Omit (or set to `""`) for flat layouts.
- `sections[].files[].exports` — what the file _publicly_ exports. The barrel's `reExports` re-emits these.
- `sections[].files[].bindings` — every top-level binding the file owns (exports + private helpers). Used to assign program-level statements to files.
- `shared` — helpers used by ≥ 2 sections. Optional; omit if there are no cross-cutting helpers.
- `barrel` — the entry `index.ts` that re-exports everything in the original `export { … }` order. `registry` is optional and only applies when the original bundle had a registry-object export.

## Section-grouping heuristic

This is agent judgment work, not a strict algorithm:

1. **Identify the export list** from the file-final `export { … }` and any registry object.
2. **Compute call-graph cohesion**: for each export, list the bindings it transitively calls inside the file. Two exports go in the same section when their call-graphs overlap substantially or share a prefix in their post-rename names (`BottomPanel*` → `panels/`).
3. **Apply size thresholds**:
   - ≤ 5 exports total, no registry → **flat** (no subdirs), one file per export.
   - 6–15 exports OR ≤ 2 sections by cohesion → **flat with grouping by prefix** (so e.g. `Tooltip + TooltipProvider` share a file rather than each getting their own).
   - 16+ exports OR registry with ≥ 10 props → **subdirs by section**.
4. **Shared bindings** (helpers used by ≥ 2 sections) go to `shared.ts` (or `shared.tsx` if it contains JSX).
5. **Barrel `index.ts`** re-exports everything the original `export { … }` declared, in the same order, preserving original alias names. If the original bundle had a registry-object export (`export const AppShell = { Root, LeftPanel, … }`), reconstruct it in the barrel — pull each prop from its target file.

## Worked sketches

```
restored/tooltip/                            restored/app-shell/
├── index.ts                                 ├── index.ts
├── tooltip.tsx                              ├── shared.ts
├── tooltip-provider.tsx                     ├── layout/
├── kbd.tsx                                  │   ├── root.tsx
└── shared.ts (utils + ref helpers)          │   ├── left-panel.tsx
                                             │   ├── content.tsx
                                             │   └── main-content-layout.tsx
                                             ├── header/
                                             │   ├── header.tsx
                                             │   ├── header-action.tsx
                                             │   └── header-context-menu-item.tsx
                                             └── panels/
                                                 ├── bottom-panel.tsx
                                                 └── right-panel.tsx
```

Both directories land under the user's chosen `<target-dir>`, not the `$WS` workspace — same rule as the existing single-file output.

### `restored/tooltip/index.ts` (small case)

```ts
export { Tooltip } from "./tooltip";
export { TooltipProvider } from "./tooltip-provider";
export { KBD } from "./kbd";
```

### `restored/app-shell/index.ts` (registry case)

```ts
export { Root } from "./layout/root";
export { LeftPanel } from "./layout/left-panel";
export { Content } from "./layout/content";
export { MainContentLayout } from "./layout/main-content-layout";
export { Header, HeaderAction, HeaderContextMenuItem } from "./header/header";
export { BottomPanel, BottomPanelTabs /* … */ } from "./panels/bottom-panel";
export { RightPanel, RightPanelTabs /* … */ } from "./panels/right-panel";

import { Root } from "./layout/root";
import { LeftPanel } from "./layout/left-panel";
// … rest of the imports needed for the registry …

export const AppShell = {
  Root,
  LeftPanel,
  Content,
  MainContentLayout,
  Header,
  HeaderAction,
  HeaderContextMenuItem,
  BottomPanel,
  BottomPanelTabs,
  /* … all 20 props in the original order … */
} as const;
```

## Manual-path split: what to write per file

For each `sections[].files[]` entry, emit a file containing:

1. **Imports** — every external (`react`, `clsx`, …) or sibling-file (`../shared`, `./RightPanel`) import the bindings actually use. The Stage 2 polish output already carries the externals; you transplant the relevant ones into each file. For sibling-file refs, add relative-path imports during the split.
2. **The bindings** listed in `bindings` — in program order from the polished source.
3. **The exports** listed in `exports` — `export const Foo = …` or `export function Foo …` directly on the declarations. Don't emit a trailing `export { Foo }` aggregate per file; the barrel handles aggregation.
4. **No re-export of helpers** — private helpers stay un-exported. Only `exports[]` names become named exports.

Use `scripts/split-bundle.ts` to create the first pass whenever possible; hand-edit the candidate files after that for imports/types/names the splitter cannot infer. Use `tsc --noEmit` on the resulting directory to catch missing imports.

## Stage 3 rewrite — judgment-only touches that still apply

Stage 3's [TypeScript recipe](../stages/stage-3-finalize.md#d5--typescript-types-and-the-tsx-recipe) applies per-file after the split:

- Each component file gets its own `forwardRef` + `displayName` + `export default` pair (if it's a reusable UI component).
- Lookup tables (`buttonColorClassNames`, `tooltipPlacementClassNames`) live with the component that owns them — or in `shared.ts` if cross-cut.
- The barrel `index.ts` is type-light: it only re-exports.

## Caveats

- **Don't split before Stage 2 polish.** The split heuristic relies on the polished output's bindings being human-named. Splitting raw renamed JS leaves you with `t.tsx`, `n.tsx`, `Mr.tsx`.
- **The registry object is the source of truth for export _order_.** When the original bundle has `export const Mr = { Root, LeftPanel, … }`, the barrel must reconstruct that object in the same key order — downstream consumers may do `Object.keys(AppShell)` or rely on the visual grouping.
- **Cross-file refs to private helpers force them to `shared.ts`.** If `bottom-panel.tsx` and `right-panel.tsx` both call `useResizeObserver`, lift it to `shared.ts` and import — don't duplicate.
- **`tsc --noEmit` plus `quality-gate.ts` are the canonical verification.** Splitting can silently drop a binding if `bindings[]` is wrong; a clean `tsc` pass confirms every reference resolved. The quality gate confirms the output is actually split and not still full of cryptic locals.
- **The splitter is conservative.** `scripts/plan-split.ts` and `scripts/split-bundle.ts` handle the mechanical extraction, barrel, registry, and simple cross-file helper imports. They do not replace semantic judgment: if the generated plan names a file `root.tsx` but the component is really a panel layout (`panel-layout.tsx` exporting `PanelLayout`), edit the plan and names before promoting.

## Stage 3 acceptance — deep mode only

This whole workflow is a deep-tier step, so the Stage 3 acceptance review applies. See [stages/stage-3-finalize.md](../stages/stage-3-finalize.md). The deep restore is not done until the host agent's end-to-end read passes every delivered file — no sub-agent and no authorization required. `NEEDS_FIX` means rewrite and re-read; there is no TODO-header completion path. For multi-export splits, read every file in the split directory (`root.tsx`, `left-panel.tsx`, …, `index.ts`) as one batch so naming and import consistency across siblings can be verified, not just per-file quality (delegating the batch to an optional reviewer sub-agent is fine when one is available and authorized). Skipping this step is a fail mode listed in the skill's [quality bar](../SKILL.md#quality-bar--anti-patterns-to-refuse-before-declaring-done).
