# Getting started

Polyframe is a Next.js app with no backend. Everything runs in the browser, so a local setup is all you need to work on any part of it.

## Requirements

- Node.js 22 or newer
- pnpm (run `corepack enable` to use the version pinned in `package.json`)

## Run the app

```bash
git clone https://github.com/bvffblvde/polyframe.git
cd polyframe
pnpm install
pnpm dev
```

Open http://localhost:3000. The locale is detected from your browser; `/en/editor` and `/uk/editor` open the editor directly.

## Checks

Run these before you open a pull request:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

`pnpm test` runs unit and component tests with Vitest. `pnpm test:coverage` also enforces 90% coverage for document ops and geometry. `pnpm test:e2e` runs Playwright against the dev server.

## Check generated code

Code exporters are type-checked against the real UI libraries in a separate package, so those libraries never enter the app:

```bash
EXPORT_FIXTURE_DIR=exporter-check/generated pnpm vitest run src/core/exporters
pnpm --dir exporter-check install --ignore-workspace
pnpm --dir exporter-check check
```

## Where to go next

- [Architecture](/docs/architecture) explains how the pieces fit together.
- [Add a component](/docs/add-component), [add a skin](/docs/add-skin) and [add an export target](/docs/add-exporter) are step-by-step recipes.
