# Domain Folders

| Folder | Purpose | FSD equivalent |
| ------ | ------- | -------------- |
| `app/` | App-level entry points, shells, and orchestration | `app` / `pages` |
| `app-shell/` | Window chrome, tab controllers, browser sidebar | `widgets` |
| `components/` | Reusable generic UI primitives | `shared/ui` |
| `composer/` | Composer input, suggestions, mentions | `feature` |
| `threads/` | Thread layout, messages, navigation rail | `feature` |
| `conversations/` | Conversation list, turn rendering | `feature` |
| `settings/` | Settings pages and panels | `feature` |
| `utils/` | Shared utilities, hooks, queries | `shared` |
| `hooks/` | Shared React hooks | `shared` |
| `icons/` | SVG icon components | `shared/ui` |
| `boundaries/` | Typed facades for vendored/runtime chunks | external API stubs |

## What belongs in restored UI code

- React components, hooks, and UI utilities extracted from the Codex webview bundle.
- Typed facades for runtime boundaries consumed by UI code.

## What does not belong

- Pipeline scripts (those live in `.agents/skills/`).
- Analysis drafts and temporary scripts (those live at repo root or `.tmp-*`).
- Unpromoted candidate files (those live in `restored/.deobfuscate-javascript/_full/files/`).
