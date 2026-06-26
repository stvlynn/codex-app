# Review Expectations

## Review checklist

- Restored code must be readable without referring back to the minified source.
- Names should describe intent, not implementation mechanics.
- File structure should match the conventions in [`docs/frontend/README.md`](../frontend/README.md).
- Do not promote files that fail the gate unless the failure is explicitly accepted and documented.

## Definition of done

- The chunk passes the quality gate at the requested tier.
- Provenance header is present and correct.
- `IMPORT_MAP.json` is updated if exports changed.
- Related documentation is updated if the change introduces a new convention or pipeline stage.
- No hardcoded strings, duplicated logic, or clever fallback bypasses were added.
