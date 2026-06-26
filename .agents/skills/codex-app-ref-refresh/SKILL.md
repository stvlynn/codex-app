---
name: codex-app-ref-refresh
description: Refresh the local Codex app reference source from the installed macOS Codex.app asar. Use when Codex needs to get the latest installed Codex app code, recreate ./ref from /Applications/Codex.app/Contents/Resources/app.asar, or format extracted JavaScript and CSS while excluding ref/node_modules.
---

# Codex App Ref Refresh

## Workflow

Use this skill from the repository root that should receive `./ref`.

1. Verify the current working directory is the intended workspace.
2. Run the bundled script:

```bash
node .agents/skills/codex-app-ref-refresh/scripts/refresh-codex-ref.mjs
```

The script deletes only `<cwd>/ref`, extracts `/Applications/Codex.app/Contents/Resources/app.asar` into that fresh `ref` directory, then formats extracted `.js` and `.css` files with Prettier while skipping any `node_modules` directory under `ref`.

## Options

- Set `CODEX_APP_ASAR=/path/to/app.asar` before running when the Codex app bundle lives somewhere else.
- Pass `--skip-format` only when the user explicitly wants extraction without Prettier formatting.
- Pass `--dry-run` to inspect the resolved paths without deleting or extracting anything.

## Safety

- Do not run the script from the wrong directory; it intentionally replaces `./ref`.
- Prefer the script over manually chaining `rm`, `npx @electron/asar`, and `prettier`, because the script guards the target path and consistently excludes `ref/node_modules`.
- After running, report the extracted `ref` path and whether formatting completed.
