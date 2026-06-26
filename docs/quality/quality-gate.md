# Quality Gate

The deobfuscation skill uses `.agents/skills/deobfuscate-javascript/scripts/quality-gate.ts` to decide whether a candidate can be promoted into `./restored/`.

Run it with:

```bash
bun .agents/skills/deobfuscate-javascript/scripts/quality-gate.ts restored
```

## Default checks

| Check | Meaning |
| ----- | ------- |
| `missing-provenance-header` | File must start with `// Restored from ref/webview/assets/<chunk>.js`. |
| `mechanical-names` | Public names must be semantic, not minified or mechanical. |
| `mechanical-import-bindings` | Imports from boundaries must use semantic aliases. |
| `missing-relative-exports` | Relative named imports/exports must reference names that exist in the target file. |
| `unresolved-relative-imports` | Relative imports must resolve inside `./restored/`. |
| `unbound-identifiers` | No referenced identifiers without local bindings. |
| `untyped-component-props` | Exported component props need explicit TypeScript types. |
| `untyped-public-function-params` | Exported function parameters need explicit types. |
| `public-cryptic-names` | Public exports must not use cryptic names. |
| `split-required` | Large flat modules with many exports should be split. |
| `bundle-residue` | Detected leftover minified fragments. |

## Tier differences

| Tier | Trigger | Typing enforcement |
| ---- | ------- | ------------------ |
| **Readable** | Default request | Relaxed; readable naming is the bar. |
| **Deep** | Say "deep" / "typed" / "full" / "深度" / "完整" | Strict; exported props and params must be typed. |

## When to allow exceptions

- `--allow-flat` is acceptable for data-asset files (locales, themes, large JSON-like exports) and typed boundary facades.
- `--allow-mechanical-names` is acceptable for faithful vendored boundary facades.
- `--vendored` marks a file as deliberately unrewritten vendored code.
