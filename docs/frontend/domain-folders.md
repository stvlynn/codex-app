# Domain Folders

Runtime UI code lives under `src/` and follows Feature-Sliced Design layering.

| Layer | Path | Purpose |
| ----- | ---- | ------- |
| `app` | `src/app/` | App-level entry points, shells, and orchestration |
| `pages` | `src/pages/` | Top-level page/view containers (when identifiable) |
| `widgets` | `src/widgets/` | Complex UI blocks: app-shell, composer, threads, conversations, settings, sidebar |
| `features` | `src/features/` | User-facing capabilities: automations, mcp, plugins, permissions, remote-connections, review |
| `entities` | `src/entities/` | Core domain models: files, git, diff, host |
| `shared` | `src/shared/` | Cross-cutting code usable by any layer |
| `shared/ui` | `src/shared/ui/` | Generic UI primitives (former `components/` + `ui/`) |
| `shared/utils` | `src/shared/utils/` | Shared utilities |
| `shared/hooks` | `src/shared/hooks/` | Shared React hooks |
| `shared/icons` | `src/shared/icons/` | SVG icon components |
| `shared/boundaries` | `src/shared/boundaries/` | Typed facades for vendored/runtime chunks |
| `shared/animations` | `src/shared/animations/` | Shared animations |
| `shared/analytics` | `src/shared/analytics/` | Shared analytics utilities |
| `shared/config` | `src/shared/config/` | Shared configuration |
| `shared/locales` | `src/shared/locales/` | i18n assets |
| `shared/themes` | `src/shared/themes/` | Theme assets |

## What belongs in `src/`

- React components, hooks, and UI utilities extracted from the Codex webview bundle.
- Typed facades for runtime boundaries consumed by UI code.

## What does not belong

- Pipeline scripts (those live in `.agents/skills/deobfuscate-javascript/src/`).
- Analysis drafts and temporary scripts (those live at repo root or `.tmp-*`).
- Unpromoted candidate files (those live in `src/.deobfuscate-javascript/_full/files/`).
