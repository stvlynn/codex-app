# File Naming

- React components: `PascalCase.tsx`.
- Utilities, hooks, atoms: `kebab-case.ts` or `kebab-case.tsx`.
- Co-located component internals: `component-name/lib.ts`, `component-name/constants.ts`.
- Public barrel: `component-name/index.ts`.
- When the restored chunk hash leaks into the semantic path, keep the hash as a suffix only if the base name would otherwise collide (e.g., `dropdown-ctb-ro-adh.tsx`). Prefer pure semantic names for new files.
