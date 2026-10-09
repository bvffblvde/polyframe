# CLAUDE.md — Polyframe

Guidance for Claude Code working in this repository. The full product spec is in `docs/SPEC.md`. Read the relevant section before starting a feature.

## What this is
Polyframe is an open-source, browser-only drag-and-drop UI prototyping tool. One layout can be shown as a **wireframe** or **styled** with a skin imitating a popular UI kit (shadcn/ui, MUI, Mantine, Ant Design, Bootstrap), and exported as PNG, JSON or React code. There is no backend. The UI is in English (default) and Ukrainian.

## Commands
```bash
pnpm dev            # start dev server
pnpm build          # production build
pnpm lint           # eslint
pnpm typecheck      # tsc --noEmit
pnpm test           # vitest (unit + component)
pnpm test:e2e       # playwright
pnpm bench          # perf bench on a production build (pnpm build first)
pnpm storybook      # storybook dev
```
Before you call a task done, run `pnpm lint && pnpm typecheck && pnpm test`. Also run `pnpm test:e2e` if you touched editor interactions.

## Stack
Next.js (App Router) · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui (Radix) · Zustand + zundo · @dnd-kit · Zod · next-intl · idb-keyval · lz-string · html-to-image · Vitest + RTL · Playwright · Storybook · pnpm.

Do not add new dependencies without a reason. If one is needed, say why in the PR description. Prefer small, well-maintained, MIT-compatible packages.

## Architecture rules (do not break these)
1. **Never import real UI libraries** (`@mui/*`, `@mantine/*`, `antd`, `bootstrap`, `@chakra-ui/*`) into the app. Skins are imitations built from tokens. Library names may appear only as strings inside code **exporters**.
2. **`src/core/` is pure TypeScript.** It has no React (except the `Render` component in registry definitions), no Zustand, no DOM and no Next.js imports. Everything in `core/document` and `core/geometry` is a pure function with unit tests.
3. **All document mutations go through `core/document/ops.ts`.** Stores call ops; components never mutate document state directly.
4. **One history entry per user gesture.** Drag and resize update a transient preview and commit once on pointer up. Selection, viewport and hover state live in `editor-store` and are never in undo history.
5. **The document stays normalized:** `nodes: Record<ID, Node>` and order arrays. Coordinates are integers relative to the artboard.
6. **Mode and skin never change document data.** They only switch the CSS variables and the `data-mode` / `data-skin` attributes on the artboard root.
7. **Canvas components style themselves only through skin CSS variables and `data-*` attributes.** Branch on skin in JS only for structural differences, and do it through the per-component style map in `core/skins`.
8. **Editor chrome** (panels, dialogs, toolbar) uses `src/components/ui` (shadcn). Canvas components never use shadcn components, and chrome never uses canvas components.
9. **External data is untrusted.** Imported JSON and share links are always parsed with the Zod schema and run through `migrations.ts`. Never `JSON.parse` straight into the store.
10. **The selection overlay, guides and handles render in a separate layer** that is excluded from image export.
11. **Use narrow store selectors.** Dragging one node must not re-render the other nodes.

## Adding things (checklists)

### A new canvas component
1. Create `src/core/registry/components/<type>/` with `definition.tsx`, `schema.ts`, `render.tsx` and `exporters.ts`.
2. Implement `ComponentDefinition` (see SPEC §5.3): `propsSchema`, `defaultProps(t)`, `defaultSize`, `minSize`, `keywords` (EN + UK), `icon`, `labelKey`.
3. Register it in `src/core/registry/index.ts`, its exporters in `src/core/exporters/component-exporters.ts` and its SVG drawer in `src/core/exporters/svg/drawers.ts`. Definitions do not import exporters, so the editor and the landing page load them only on export.
4. Add i18n keys to **both** `messages/en.json` and `messages/uk.json`.
5. Style it for the wireframe mode and every skin's style map.
6. Add a Storybook story covering all skins × both modes.
7. Add exporter snapshot tests for each supported target.

### A new skin
Add tokens and a style map in `src/core/skins/<id>.ts`, register the `SkinId`, add it to the skin switcher, and add the skin to every component's story matrix.

### A new export target
Add `src/core/exporters/targets/<id>.ts`, register it, add per-component exporters, and add snapshot tests. The generated code must type-check: the CI job compiles the generated templates.

## Code conventions
- TypeScript strict. No `any` (use `unknown` and narrow). No non-null `!` unless you add a comment explaining why.
- Use named exports, except where Next.js requires default exports (pages and layouts).
- File names in kebab-case, components in PascalCase, hooks as `useXxx`.
- Keep components small. Move logic into hooks or `core` functions.
- Use Tailwind classes for chrome. Use CSS variables for skin tokens. No inline styles except for canvas geometry (`left`, `top`, `width`, `height`, `transform`).
- IDs are generated with `nanoid`.
- Comments explain *why*, not *what*.

## i18n
- Never hardcode UI strings. Use `useTranslations` / `getTranslations` from next-intl.
- Every new key goes into **both** `en.json` and `uk.json` in the same change. Write natural Ukrainian, not machine-literal translation.
- Default text inside inserted components comes from messages at insertion time. User-typed content is never translated.

## Accessibility
- Every interactive chrome element must be keyboard-reachable, have a visible focus state and an accessible name.
- Icon-only buttons need an `aria-label` (translated).
- Announce key editor actions through the shared live region helper.
- Keyboard shortcuts must not fire while focus is in an input, textarea or contenteditable element.

## Testing expectations
- New logic in `core/` must come with unit tests. Ops and geometry stay at ≥90% coverage.
- Fix a bug by writing a failing test first.
- Exporters use snapshot tests. Review snapshot diffs; do not blindly update them.
- E2E tests use `data-testid` only on elements that have no good accessible role or name.

## Git
- Use Conventional Commits (`feat(canvas): smart guides`, `fix(export): …`, `chore: …`).
- Keep PRs small and scoped to one feature. Update `docs/SPEC.md` when behavior changes.

## Don'ts
- Don't add a backend, auth, analytics or tracking.
- Don't use `localStorage` for projects. Use the IndexedDB layer in `lib/persistence`.
- Don't copy CSS source code from UI libraries into skins. Use public token values only.
- Don't widen scope beyond the current phase in SPEC §6 without asking.
