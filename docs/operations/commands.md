# Commands

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
bun .agents/skills/deobfuscate-javascript/scripts/quality-gate.ts restored
```

Use `--allow-flat` to suppress the split-required check on large data-asset files.

## Promote the current frontier

```bash
bun .agents/skills/deobfuscate-javascript/scripts/promote-organized.ts --target restored
```

Use `--tier readable` to allow untyped public parameters.

## Running through an agent

- `Use codex-app-ref-refresh to refresh ./ref from the installed Codex app.`
- `Use deobfuscate-javascript to restore ./ref.`
- Add **"deep" / "full" / "typed"** for the production-grade rewrite tier.
