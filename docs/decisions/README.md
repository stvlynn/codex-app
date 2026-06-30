# Decisions

This section records architecture decision records (ADRs). Each ADR explains why a significant decision was made and what alternatives were considered.

## Documents

- [`adr-template.md`](adr-template.md) — template for new ADRs.
- [`001-rename-restored-to-src-and-adopt-fsd-ddd.md`](001-rename-restored-to-src-and-adopt-fsd-ddd.md) — rename `restored/` to `src/`, adopt FSD for UI and DDD for pipeline scripts.

## When to write an ADR

Write an ADR when the decision:

- Is hard to reverse.
- Affects multiple pipeline stages or the restored output structure.
- Has non-obvious trade-offs.

## Naming

Use a sequential number and a short kebab-case title:

```
decisions/
  001-leave-npm-leaves-as-bare-imports.md
  002-use-manifest-led-promotion-frontier.md
```
