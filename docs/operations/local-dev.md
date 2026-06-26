# Local Development Setup

## Prerequisites

- **macOS** with the [Codex desktop app](https://chatgpt.com/codex) installed at `/Applications/Codex.app`.
- **Node.js** — used by the refresh skill to run `npx @electron/asar` and `prettier`.
- **Bun** — the deobfuscation scripts are TypeScript run with `bun`.
- An agent harness that reads `.agents/skills/` (e.g., Claude Code).

## Install deobfuscation script dependencies

```bash
cd .agents/skills/deobfuscate-javascript
bun install
```

## Generated artifacts

| Path | What it is | How to regenerate |
| ---- | ---------- | ----------------- |
| `./ref/` | Extracted Codex app source | `codex-app-ref-refresh` skill |
| `./restored/` | Promoted deobfuscated output | `deobfuscate-javascript` skill |
| `restored/.deobfuscate-javascript/_full/` | Hidden workspace: checkpoints, candidates, manifest, ledger | Produced during deobfuscation |

Do not hand-edit `./ref/` or `./restored/`. Regenerate them with the skills.

## Operational notes

- Always run skills from the repo root so `./ref` and `./restored` resolve correctly.
- The refresh skill deletes `./ref/`; commit any analysis results you need before refreshing.
- Temporary helper scripts at the repo root are allowed for one-off debugging, but clean them up when the session ends.
