# Adding a Pipeline Stage

1. Define the domain model or rule change first.
2. Add an application service that orchestrates the new behavior.
3. Expose it through a CLI script or skill trigger only after domain + application logic is solid.
4. Update [`docs/backend/layers.md`](layers.md) and [`docs/project/architecture.md`](../project/architecture.md).
5. Add or update tests in the skill's test files.
