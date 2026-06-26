# Backend

This section defines how the deobfuscation pipeline and supporting scripts are organized.

Because `decode-codex` is not a traditional backend service, this document adapts Domain-Driven Design layering to the pipeline domain: transforming minified/bundled JavaScript into readable, structured source.

## Documents

- [`layers.md`](layers.md) — domain, application, infrastructure, and interface responsibilities.
- [`domain-concepts.md`](domain-concepts.md) — chunks, symbols, import graph, frontier, organization, quality gate.
- [`adding-a-stage.md`](adding-a-stage.md) — how to add a new pipeline stage.
- [`project-helpers.md`](project-helpers.md) — where one-off and reusable helpers live.

## Core principle

Business rules of deobfuscation are isolated in the domain layer. All other layers depend on domain through abstractions. Infrastructure implements those abstractions. Interfaces adapt the application to the outside world.
