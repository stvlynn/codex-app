# Local Development Setup

## Prerequisites

- **macOS** with the [Codex desktop app](https://chatgpt.com/codex) installed at `/Applications/Codex.app`.
- **Node.js** `>=20.0.0` — used by the refresh skill to run `npx @electron/asar` and `prettier`, and by `pnpm` for workspace scripts.
- **pnpm** `9.0.0` — declared in `packageManager`; run `corepack enable` to use it automatically.
- **Bun** — the deobfuscation skill scripts are TypeScript run with `bun`.
- An agent harness that reads `.agents/skills/` (e.g., Claude Code).

## Install dependencies

The root workspace uses `pnpm`; the deobfuscation skill sub-project still uses `bun` for its runtime.

```bash
# Install root workspace dependencies and validate the setup
make dev
```

This is equivalent to:

```bash
pnpm install
cd .agents/skills/deobfuscate-javascript && bun install
pnpm run docs:check
```

## Common commands

Use the `Makefile` for day-to-day tasks:

```bash
make dev      # Install dependencies and validate the workspace
make check    # Run typecheck + test + docs:check
make test     # Run deobfuscation skill tests
make typecheck
make docs     # Validate docs/ structure
make lint
make format
make help     # Show all available targets
```

You can also run `pnpm run <script>` directly; see `package.json` for the script definitions.

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
