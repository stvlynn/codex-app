# Imports

- Prefer relative imports inside the same feature folder.
- Prefer absolute/semantic imports across features, resolved through `IMPORT_MAP.json`.
- Do not import internals of another feature; use its public barrel or `boundaries/` facade.
- Keep vendored imports as bare npm specifiers (e.g., `from "react"`, `from "clsx"`).
- Never import from unpromoted candidate files under `src/.deobfuscate-javascript/_full/files/`.
