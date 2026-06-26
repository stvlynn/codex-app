# Stage 1 — Deobfuscation

Unwind obfuscator _transformations_: Dean Edwards Packer, AAEncode, Obfuscator.IO string arrays, hex/unicode/base64 escapes, dead code, opaque predicates. Each pass is a pure Babel transform — no LLM dependency.

Run Stage 1 _before_ Stage 2 on obfuscated input (`extract.ts` byte offsets are invalidated by Stage 1 rewrites). On purely _minified_ (not obfuscated) input, skip Stage 1.

← Back to [SKILL.md](../SKILL.md). Companions: [Stage 2 — Restore](stage-2-restore.md), [Stage 3 — Finalize](stage-3-finalize.md), [workspace](workspace.md).

---

## Detect

```bash
bun <skill-dir>/scripts/detect.ts <input.js|->
```

Emits JSON with a `techniques` array (each `{ name, confidence, evidence }`) and a `recommendation` naming the scripts to run in order. Read `recommendation`; if `techniques` is empty, skip Stage 1.

## Unpack (Packer / AAEncode / URLEncode)

```bash
bun <skill-dir>/scripts/unpack.ts <input.js|-> [--out output.js] [--max-iterations 5] [--no-eval]
```

Iterates Packer → AAEncode → URLEncode until no layer matches or `max-iterations` is hit (layered packers are common).

**Eval safety:** unpack uses `new Function(...)` to parse Packer arg lists and decode AAEncode — sandboxed JS can't read your filesystem, but it does execute the input. `--no-eval` refuses (exits 0, input unchanged, `evalRefused: true`). URLEncode is pure `decodeURIComponent`, unaffected by `--no-eval`.

## String-array inlining

```bash
bun <skill-dir>/scripts/string-array.ts <input.js|-> [--out output.js]
```

Detects Obfuscator.IO `var _0x123 = ['log','hi',…];` arrays, inlines indexed refs (`_0x123[2]` → `"hi"`), removes the rotation IIFE, deletes the dead array.

**Decoder-indirection escape hatch:** if access is wrapped behind a function (`_0x456 = function(i){ return _0x123[i-0x10]; }`), the script can't inline through it (`decoderIndirection: true`). Run `simplify` first (it inlines small functions), then re-run `string-array`.

## Decode strings

```bash
bun <skill-dir>/scripts/decode-strings.ts <input.js|-> [--out output.js]
```

Literal-only decoder: `String.fromCharCode(72,101,…)` → `"Hello"` (all-numeric args), `atob("…")` → decoded (string-literal arg), and source-level `\xNN` / `\uNNNN` escapes normalized to their character. Variables and non-numeric args are left alone.

## Simplify (constant folding, dead code, inlining)

```bash
bun <skill-dir>/scripts/simplify.ts <input.js|-> [--out output.js] [--max-passes 10] [--no-inline]
```

Loops to a fixed point. Per pass: constant folding (`1+2`→`3`, `!![]`→`true`), dead-code removal (`if(false)…`, `5>3?a:b`→`a`), logical short-circuit (`true&&x`→`x`), identity ops (`x+0`→`x`), sequence-in-statement (`(a,b);`→`a;b;`), computed-to-dot (`obj["foo"]`→`obj.foo` when id-safe), and scope-aware literal inlining (`var k=5; …k+1`→`…6`, only when `k` is provably constant). Pass `--no-inline` to keep names for Stage 2. Stats to stderr per pass.

## Control-flow report (read-only)

```bash
bun <skill-dir>/scripts/control-flow-report.ts <input.js|-> [--out report.json]
```

**Does not mutate code.** Detects `while(true){switch(state){…}}` flatteners (emits `dispatchVariable`, `caseCount`, `caseLabels`, `containingFunction`, `rewriteHint`), `"0|1|2".split("|")` dispatch arrays, and opaque predicates `simplify` missed (`if(1===2)`, `if(!![])`, `if(void 0)`). Read the JSON, then **rewrite by hand** — trace state transitions via `dispatchVariable` and inline cases in execution order. Automatic CFG reconstruction is unreliable; agent-driven rewrite is more accurate.

## Orchestrator (one-shot Stage 1)

```bash
bun <skill-dir>/scripts/deobfuscate.ts <input.js|-> [--out output.js] [--report report.json] \
  [--skip step1,step2] [--stop-after step] [--no-eval] [--no-inline] \
  [--max-iterations 5] [--max-passes 10]
```

Runs detect → unpack → string-array → decode-strings → simplify → control-flow-report in order, re-running `detect` after `unpack` (unpacking reveals hidden techniques). Per-step try/catch — one failing step won't abort the rest. Valid `--skip` / `--stop-after` names: `detect`, `unpack`, `string-array`, `decode-strings`, `simplify`, `control-flow-report`.

## Ordering — critical

Each step expects the _input shape_ the previous one produced; out-of-order runs silently no-op or mangle:

- **`unpack` first** — packed input is one giant `CallExpression`; AST passes have nothing to chew on until it's unpacked.
- **`string-array` before `decode-strings`** — inlining first lets `decode-strings` walk only _used_ literals instead of the whole array.
- **`simplify` after `string-array` + `decode-strings`** — folding works on resolved literals; running it first splits rotation IIFEs so `string-array`'s matcher won't recognize them.
- **`control-flow-report` last** — opaque predicates fed to `simplify` fold out first; what's left is the real CFG.
- **Stage 1 before Stage 2** — `extract.ts` byte offsets are invalid across Stage 1 rewrites; `renames.json` ids from pre-deobfuscation code are stale afterward. The full order is **Stage 1 → (wakaru-normalize) → extract**: wakaru (Stage 2 Step 0b.5) is also byte-rewriting, so it must finish before any `extract`/`apply`, and it runs *after* Stage 1 because it is a transpiler/minifier decompiler, not a deobfuscator.

For gotchas (eval safety, decoder indirection, sourcemap invalidation), see [reference/caveats.md → Stage 1 safety](../reference/caveats.md#stage-1-safety).
