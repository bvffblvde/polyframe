# Contributing to Polyframe

Thanks for helping. Please read [docs/SPEC.md](docs/SPEC.md) and [CLAUDE.md](CLAUDE.md) first: they describe the architecture rules every change has to follow.

## Workflow

1. Fork and create a branch from `main`.
2. Keep the change small and scoped to one feature.
3. Run `pnpm lint && pnpm typecheck && pnpm test`. Run `pnpm test:e2e` if you touched editor interactions.
4. Use Conventional Commits, for example `feat(canvas): smart guides` or `fix(export): keep fonts`.
5. Open a pull request and fill in the template.

## Adding a canvas component

1. Create `src/core/registry/components/<type>/` with `schema.ts`, `render.tsx` and `definition.tsx`.
2. Describe props with a Zod schema. The Inspector form is generated from it.
3. Add the type to `COMPONENT_TYPES` and register the definition in `src/core/registry/index.ts`.
4. Add the label and default texts to both `messages/en.json` and `messages/uk.json`.
5. Style it in `src/styles/canvas.css` using only `--pf-*` skin variables and `data-*` attributes.

## Adding a skin

Add tokens, component variables and structure flags in `src/core/skins/<id>.ts`, register the id in `SKIN_IDS` and in `src/core/skins/index.ts`. Use public default theme values only, never copied CSS.

## Rules of thumb

- Never import real UI libraries into the app.
- `src/core` stays free of React state, Zustand, the DOM and Next.js.
- Document changes go through `src/core/document/ops.ts`.
- No hardcoded UI strings.
