# Reference — bundler runtime helpers (esbuild / Rolldown / Vite)

When a chunk wraps modules in a runtime helper (`__esm`, `__commonJS`,
`__export`, `__toESM`, `__require`), you must convert the call sites back to
plain ESM by hand. The trap: **the same helper name means different things in
different bundlers**, and the helpers are minified to one-letter aliases. Write
the wrong form (e.g. esbuild's `__export` for a Rolldown chunk) and the restored
module is subtly broken. Always read the chunk's own runtime preamble first —
this doc tells you what to look for.

← Back to [SKILL.md](../SKILL.md). Related: Stage 2 [`normalize-exports.ts`](../scripts/normalize-exports.ts), [`dead-shim-elim.ts`](../scripts/dead-shim-elim.ts), [`resolve-npm-imports.ts`](../scripts/resolve-npm-imports.ts).

## Identify the bundler first

The helpers live in a shared runtime chunk (often `chunk-*.js`) and are imported
into other chunks as short aliases (`import { t as __export } from "./chunk-*.js"`).
Grep the runtime preamble:

| Marker | Bundler |
| ------ | ------- |
| `__esm` / `__commonJS` / `__export` mutating a `target` param, `__toESM`, `__toCommonJS` | **esbuild** |
| `__export` that **builds and returns a new object** and stamps `Symbol.toStringTag: "Module"` | **Rolldown** (Vite ≥ 5 / Rolldown-Vite) |
| `__vite__mapDeps`, `__vitePreload`, `import.meta.glob` residue | **Vite** app shell (orthogonal — can wrap either of the above) |

## This repo: Rolldown (codex `./ref`)

The codex `./ref` tree is bundled with **Rolldown**. Its runtime preamble (from
`ref/webview/assets/chunk-Cq_f4orQ.js`, minified aliases expanded) is:

```js
var __create   = Object.create,
    __defProp  = Object.defineProperty,
    __getOwnPropDesc  = Object.getOwnPropertyDescriptor,
    __getOwnPropNames = Object.getOwnPropertyNames,
    __getProtoOf = Object.getPrototypeOf,
    __hasOwnProp = Object.prototype.hasOwnProperty,

    // __esm — lazy ESM module init; returns the module's exports on first call
    __esm = (fn, res) => () => (fn && (res = fn((fn = 0))), res),

    // __commonJS — lazy CJS init; returns module.exports
    __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports),

    // __export — RETURNS A NEW namespace object (Rolldown-specific!)
    __export = (all, noToStringTag) => {
      let target = {};
      for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
      return (noToStringTag || __defProp(target, Symbol.toStringTag, { value: "Module" }), target);
    },

    // __copyProps / __toESM — copy own props of a CJS module onto an ESM namespace
    __copyProps = (to, from, except, desc) => { /* defineProperty getter copy loop */ };
```

### The `__export` gotcha (this is the one that bites)

| | esbuild | **Rolldown (this repo)** |
| --- | --- | --- |
| Signature | `__export(target, all)` | `__export(all)` |
| Behaviour | **mutates** `target` in place | **builds and returns a new object** |
| Return | `undefined` | the namespace object |
| `Symbol.toStringTag` | not added by `__export` | added (`"Module"`) unless 2nd arg truthy |
| Typical call site | `__export(exports, { foo: () => foo });` | `var ns = __export({ foo: () => foo, … });` |

In this repo you will see `var ee = t({ AnnotatedTextEdit: () => E, … })` — `t`
is Rolldown's `__export`, and `ee` is the resulting namespace object. **Do not**
rewrite it as esbuild's `__export(ee, {…})`; that mutates a non-existent target
and drops the return.

## What each helper restores to

| Helper | Minified shape | Restore to |
| ------ | -------------- | ---------- |
| `__esm(fn, res)` | `o = (e,t)=>()=>(e&&(t=e((e=0))),t)` | A normal ESM module. The `var initFoo = __esm({ "foo.js"() { … } })` wrapper + every `initFoo()` call disappears; inline the body once. |
| `__commonJS(cb, mod)` | `s = (e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports)` | A module whose `module.exports = …` becomes ESM `export`s; drop the lazy wrapper and the `require_foo()` calls. |
| `__export(all)` (Rolldown) | `c = (e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return(n\|\|t(r,Symbol.toStringTag,{value:\`Module\`}),r)}` | `export { foo, bar }` (each `name: () => binding` getter becomes a named export). `normalize-exports.ts` handles the simple cases; the registry-object form (`var ns = __export({…})`) is a multi-export split — see [multi-export-bundle.md](../workflows/multi-export-bundle.md). |
| `__toESM(mod, isNode)` | copy loop building a `default`-bearing namespace | `import X from "pkg"` (default) or `import * as X from "pkg"`. `react-shim-elim.ts` / `npm-cjs-shim-elim.ts` cover the React/CJS cases. |
| `__require(id)` | per-chunk alias for a CJS `require` | A static `import`, or a bare specifier via `resolve-npm-imports.ts`. |

## Rule of thumb

1. Find the runtime chunk (`grep -l 'Object.getOwnPropertyNames' chunk-*.js`).
2. Expand the one-letter aliases against the table above to learn _which_
   bundler and _which_ `__export` semantics you're dealing with.
3. Convert call sites to plain ESM accordingly; let `normalize-exports.ts`,
   `react-shim-elim.ts`, `npm-cjs-shim-elim.ts`, and `dead-shim-elim.ts` clean
   the residue (they are bundler-shape aware), then hand-finish what remains.

Never assume the esbuild shape by default — read the preamble. The cost of
guessing wrong is a module that re-exports nothing (Rolldown `__export` return
dropped) or throws on a missing `target` (esbuild form applied to Rolldown).
