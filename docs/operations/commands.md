# Commands

## Makefile targets

The root `Makefile` delegates to `pnpm` scripts and keeps common tasks in one place.

```bash
make dev      # Install dependencies, validate, and start the extracted Electron app
make electron-smoke # Validate and smoke-test the extracted Electron app launch
make check    # Run typecheck + test + docs:check
make test     # Run deobfuscation skill tests
make typecheck
make lint
make format
make docs     # Validate docs/ structure
make deploy   # Show deployment pointer
make help     # Show all targets
```

## Refresh `./ref` from the installed app

```bash
node .agents/skills/codex-app-ref-refresh/scripts/refresh-codex-ref.mjs
```

Options:

| Flag / env | Effect |
| ---------- | ------ |
| `--dry-run` | Print resolved paths without deleting or extracting. |
| `--skip-format` | Extract only; skip Prettier formatting. |
| `CODEX_APP_ASAR=/path/to/app.asar` | Use a non-default app bundle path. |

## Run the deobfuscation quality gate

```bash
bun .agents/skills/deobfuscate-javascript/src/domain/quality-gate.ts src
```

Use `--allow-flat` to suppress the split-required check on large data-asset files.

## Promote the current frontier

```bash
bun .agents/skills/deobfuscate-javascript/src/application/promote-organized.ts --target src
```

Use `--tier readable` to allow untyped public parameters.

## Running through an agent

- `Use codex-app-ref-refresh to refresh ./ref from the installed Codex app.`
- `Use deobfuscate-javascript to restore ./ref.`
- Add **"deep" / "full" / "typed"** for the production-grade rewrite tier.
