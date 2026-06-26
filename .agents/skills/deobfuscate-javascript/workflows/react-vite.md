# Workflow — React/Vite/Rollup bundle: rename + polish to recover JSX

A single React/Vite/Rollup component chunk is just the **single-file fallback flow** — there's no separate recipe. The `--fast` polish already runs jsx-runtime recovery, so `jsxRuntime.jsx("svg", …)` and `jsxs`/`Fragment` calls come back as JSX automatically. For a full app (`index.html` + asset tree) the default is the whole-tree restore ([full-restoration.md](full-restoration.md)); this single-component flow is the fallback for a lone chunk.

→ Use [small-minified.md](small-minified.md) for the single-file readable fallback.

Typed `.tsx` output — `Props` interfaces, `forwardRef`, `as const` lookup tables — is **deep mode only**, via [Stage 3](../stages/stage-3-finalize.md).
