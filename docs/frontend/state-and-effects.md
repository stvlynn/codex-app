# State and Side Effects

- Prefer explicit state atoms (Jotai) or React hooks over implicit module-level singletons.
- Async data access should go through typed query hooks or facades.
- Keep effects close to the component that owns them.
- Avoid derived state duplication; compute values close to where they are used.
