# Domain Concepts

- **Chunk**: a single bundled JS file from `ref/webview/assets/`.
- **Symbol**: an identifier inside a chunk, tracked with original name, restored name, kind, and binding scope.
- **Import graph**: directed edges from consumer chunks to producer chunks, including named import/export specifiers.
- **Frontier**: chunks whose producers are already promoted and are therefore ready to promote.
- **Organization**: semantic domain, classification (`app-feature`, `boundary`, `vendor-runtime`, `data-asset`), target path, and recipe.
- **Quality gate**: automated checks that a restored file must pass before promotion.
- **Npm-leaf**: a vendored dependency chunk (React, clsx, Shiki themes, 3Dmol, etc.) left as a bare npm import or boundary facade.
