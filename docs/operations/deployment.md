# Deployment

This project is a local reverse-engineering workspace. It does not have a traditional deployment target.

## Distribution rules

- Do not redistribute `./ref/` or `./restored/`.
- The extracted and restored code is © OpenAI and subject to the Codex app's license and terms of service.
- Share only the pipeline scripts, documentation, and your own analysis notes.

## CI/CD considerations

If you add CI to validate the pipeline:

- Do not commit `./ref/` or `./restored/`.
- Validate scripts with `bun test` in `.agents/skills/deobfuscate-javascript/`.
- Run `bun scripts/quality-gate.ts restored --allow-flat` in CI to check the latest restored output.
- Keep CI secrets separate from the repo; do not check in `CODEX_APP_ASAR` paths or app bundles.
