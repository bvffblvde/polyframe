# Contributing to Polyframe

Thanks for helping. Please read [docs/SPEC.md](docs/SPEC.md) and [CLAUDE.md](CLAUDE.md) first: they describe the architecture rules every change has to follow.

## Workflow

1. Fork and create a branch from `main`.
2. Keep the change small and scoped to one feature.
3. Run `pnpm lint && pnpm typecheck && pnpm test`. Run `pnpm test:e2e` if you touched editor interactions.
4. Use Conventional Commits, for example `feat(canvas): smart guides` or `fix(export): keep fonts`.
5. Open a pull request and fill in the template.

## Guides

- [Add a canvas component](docs/contributing/add-component.md)
- [Add a skin](docs/contributing/add-skin.md)
- [Add an export target](docs/contributing/add-exporter.md)

## Rules of thumb

- Never import real UI libraries into the app.
- `src/core` stays free of React state, Zustand, the DOM and Next.js.
- Document changes go through `src/core/document/ops.ts`.
- No hardcoded UI strings.
