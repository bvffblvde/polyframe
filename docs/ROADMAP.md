# Polyframe 1.0: flagship roadmap

This plan takes Polyframe from a feature-rich local tool to a flagship product: measured, fast, accessible, reusable as a library, exportable to many stacks, and collaborative in real time with accounts and cloud projects.

It merges `docs/NEXT.md` (phases 1 to 6, kept as written with small additions) with two new tracks: alternative code export and cloud collaboration.

Every phase ends green in CI, deployed, and with a number, a test or a published artifact that can go into the README and the portfolio case study.

## Decisions

| Topic | Decision |
|---|---|
| Order | Foundation first (phases 1 to 6), then export variants, then accounts and collaboration. Collaboration changes the store and undo, so it goes on top of a measured, stable core. |
| Collaboration server | Our own Node server on Render, using Yjs (CRDT) over WebSocket. |
| Collaboration scope | Accounts, cloud projects, roles and invites, plus live co-editing with presence. Local projects keep working with no account and no network. |
| Export variants | Other frameworks, plain HTML and CSS, a runnable project in one click, and code style options. |
| CLAUDE.md | "No backend, no auth" changes to: a backend lives only in `apps/server`; auth only for cloud projects; still no analytics or tracking. |

## Target architecture

```
apps/web        Next.js app (Vercel). Editor, viewer, site. Local-first, works offline.
apps/server     Node server (Render). REST API + Yjs WebSocket rooms + auth checks.
packages/core   Document model, Zod schemas, migrations, ops, geometry, auto layout. No React.
packages/export Exporters as pure functions, framework printers, kit adapters.
packages/cli    `npx polyframe export design.json --kit mui --layout stacked --out ./src/ui`
exporter-check  Type-check and render fixtures for every target (CI only).
```

Data flow for a cloud project:

```
store (Zustand) <-> binding <-> Y.Doc <-> y-indexeddb (offline cache)
                                    \-> WebSocket provider <-> apps/server <-> Postgres
```

---

## Phase 1. Measure (from NEXT.md)

- `bench/` with Playwright scenarios on a production build: 100, 500, 1000 and 2000 nodes; drag one node, marquee-select all, zoom, undo 50 steps; skin switch on 500 nodes; export time per target on 500 nodes.
- Collect FPS (rAF sampling), long tasks and input latency. Output `bench/results.json` and a markdown table.
- CI job `bench` on `main` only; fail if a scenario regresses more than 20% against the last stored result.
- Bundle size per route and per lazy chunk (editor, skins, exporters, Shiki). Fail CI if the editor initial JS grows more than 10%.
- README badges: tests, coverage, editor initial JS (KB gzip), FPS at 1000 nodes.

Done when: the README shows a metrics table produced by CI.

## Phase 2. Scale (from NEXT.md, only where Phase 1 shows a problem)

- Viewport culling with a margin; memoized node renderers keyed by id and version.
- Pointer moves batched with rAF, one history entry per gesture (already true, keep it measured).
- Lazy-load skin tokens and exporters on first use.
- Target: 55 FPS or more when dragging at 1000 nodes with 4x CPU throttling. Before and after in `bench/HISTORY.md`.

## Phase 3. Export fidelity (from NEXT.md)

- For every target: export the 6 templates, type-check them, render them in a fixture app with the real library, compare a Playwright screenshot with the editor preview, report a pixel-diff percentage.
- Publish a fidelity table (target x template) in docs; fail CI above a per-target threshold.
- Run `axe` on the rendered fixtures; no violations that the kit controls.

This phase builds the harness that Phase 7 reuses for every new target.

## Phase 4. Accessibility of the editor (from NEXT.md)

- Keyboard-only editing: Tab to the canvas, arrows move, Alt+arrows resize, Enter edits text, Esc exits, layer tree fully operable.
- Debounced live-region announcements for move, group and undo.
- e2e: build the login template with the keyboard only.
- Docs page "Accessibility" with what works and the known gaps.

## Phase 5. Reusable core (from NEXT.md)

- pnpm workspace with `apps/web`, `packages/core`, `packages/export`, `packages/cli`.
- Publish `@polyframe/core` and `@polyframe/export` to npm with provenance; versions with changesets.
- Docs page "Use the exporter in your own tool" with a 10-line example.

`apps/server` joins the workspace in Phase 8 and imports `@polyframe/core` to validate documents on the server.

## Phase 6. Local-first robustness (from NEXT.md, adjusted)

- Move the document state into a Y.Doc now, behind the existing store API. Ops stay pure: an op produces a new project, a binding writes the difference into the Y.Doc in one transaction, and remote or other-tab updates flow back into the store.
- Multi-tab sync through `y-indexeddb` plus a BroadcastChannel provider. This replaces the planned last-writer-wins notice with real merging.
- Undo through `Y.UndoManager` scoped to local changes, so it already behaves per user when collaboration arrives.
- Version history: Yjs snapshots every N ops and on manual save; list, preview and restore; size cap in IndexedDB.
- File System Access API: open and save `.polyframe` files where supported.
- Tests: IndexedDB migrations from every previous schema version; two-tab e2e with concurrent edits.

Why here: doing the Yjs move inside the local-first phase keeps the risky refactor offline and testable. Phase 9 then only adds a network provider and presence.

Done when: two tabs edit the same project at once without losing changes, and undo only undoes your own tab.

---

## Phase 7. Alternative code export

### 7.1 Export pipeline refactor

Today each component returns a JSX string per target. That does not scale to new frameworks. Split it into three layers inside `packages/export`:

1. **Semantic model.** Each component describes what it is: `button { label, variant, size, disabled, role }`. One function per component, framework-agnostic, unit-tested.
2. **Kit adapters.** Map a semantic node to an element tree for one kit: `mui.button -> <Button variant="contained">`. The element tree (IR) holds tag, props, children, imports and bindings.
3. **Framework printers.** Print the IR as JSX, Vue SFC templates, Svelte 5 markup, Angular templates or HTML. Printers own syntax details: `className` vs `class`, `:prop` bindings, self-closing rules, escaping.

The six React targets move onto this pipeline first with identical snapshots, so the refactor is proven before anything new is added.

### 7.2 New targets

| Framework | Kits | Notes |
|---|---|---|
| HTML + CSS | Plain CSS, Tailwind (CDN) | Plain CSS reuses Polyframe's own canvas markup and the active skin as CSS variables, so fidelity is close to 100%. Ships first. |
| Vue 3 | shadcn-vue, Vuetify, PrimeVue | shadcn-vue mirrors the shadcn API, so its adapter is the cheapest. |
| Svelte 5 | shadcn-svelte | Same idea. |
| Angular | Angular Material | Standalone components, template plus component class. |

Every new target goes through the Phase 3 harness: type-check (`vue-tsc`, `svelte-check`, `ngc`), render, screenshot diff, `axe`.

### 7.3 Runnable project in one click

- "Download project": a ZIP with a Vite app for the chosen framework and kit: `package.json` with exact dependencies, theme providers (MantineProvider, ChakraProvider, MUI ThemeProvider), Tailwind setup for shadcn, one route per artboard, and a README.
- "Open in StackBlitz" with `@stackblitz/sdk`: the same files, opened in the browser, no backend.
- For shadcn targets the ZIP includes the needed `components/ui` sources from the registry, so it builds without running the CLI.
- CI: every template x target project runs `npm install` and `vite build` in the fixture job (nightly, since it is slow).

### 7.4 Code style options

Options in the export dialog, remembered per project:

- TypeScript or JavaScript.
- Styling: Tailwind or CSS modules (for shadcn and HTML); style objects or CSS modules (for the rest).
- Layout: absolute, stacked, and auto layout from stacks and grids (already exported as flex and grid).
- Texts: hardcoded, or extracted into a messages file with `t()` calls (react-i18next, vue-i18n, svelte-i18n).
- Props: texts and images become component props with defaults, so the screen becomes a reusable component.
- Extras: a Storybook story per artboard; Prettier settings (semicolons, quotes, print width).

Done when: the fidelity table covers the new targets, every target builds as a downloaded project, and the README links to a StackBlitz demo per framework.

---

## Phase 8. Accounts and cloud projects

### 8.1 Server (`apps/server` on Render)

- Node 22, Hono for HTTP, Hocuspocus (Yjs WebSocket server with auth and persistence hooks), Drizzle ORM, Postgres.
- Hosting: a Render web service (WebSockets are supported). Postgres on Neon, because Render's free Postgres expires after a short trial period; check the current terms when we start.
- Free Render instances sleep after about 15 minutes idle and take 30 to 60 seconds to wake. For a portfolio demo the Starter plan (about $7 a month) avoids that; the app shows a "waking up the server" state either way.

### 8.2 Auth

- Auth.js in the Next app with GitHub and Google sign-in. No passwords stored.
- The app issues a short-lived signed token for the server (shared secret, 15 minutes, refreshed in the background). The server verifies it on every HTTP request and WebSocket connection. This avoids cross-domain cookies between Vercel and Render.

### 8.3 Data model (Postgres)

| Table | Columns |
|---|---|
| `users` | id, provider, provider_id, name, avatar_url, created_at |
| `projects` | id, owner_id, name, ydoc (bytea), schema_version, updated_at, deleted_at |
| `members` | project_id, user_id, role (`owner`, `editor`, `viewer`) |
| `invites` | token, project_id, role, expires_at, created_by |
| `snapshots` | id, project_id, ydoc, created_at, label |

### 8.4 Product

- Projects dialog gets two sections: "On this device" and "Cloud". "Move to cloud" uploads a local project; "Save a local copy" works the other way.
- Share dialog becomes "Invite": a link with a role and expiry, plus a members list where the owner changes roles or removes people. The existing read-only share links stay for anonymous viewing.
- Account menu: profile, sign out, export all my data (JSON ZIP), delete my account and my projects.

### 8.5 Security

- Every room connection checks membership and role; viewers get a read-only connection enforced on the server.
- The server validates the merged document with `@polyframe/core` Zod schemas before persisting; invalid updates are rejected and logged.
- Limits: document size, updates per second per connection, rooms per user, invite expiry.
- No analytics and no tracking, as before. Server logs keep no document content.

Done when: a user signs in, moves a project to the cloud, opens it on another device, invites a teammate as editor, and removes access again. Covered by integration tests against a test database.

## Phase 9. Live collaboration

- Add the WebSocket provider to the Y.Doc from Phase 6; offline edits sync when the connection returns.
- Presence through Yjs awareness: name, color, live cursor in world coordinates, current selection outline, the artboard each person is on. Avatars in the toolbar; click an avatar to follow that person's viewport.
- Per-user undo (already in place since Phase 6).
- Conflict rules: concurrent edits merge per property; a deleted node wins over a moved one; layout containers re-run after merges.
- Connection status in the toolbar: connected, reconnecting, offline with local changes pending.
- Tests: Playwright with two and three browser contexts editing the same project; a load test with 20 simulated clients on one room measuring update latency.

Done when: two people edit the same artboard at the same time with p95 update latency under 150 ms on the paid instance, and the result survives a server restart.

---

## Portfolio deliverables

- README: metrics table (bench and bundle), fidelity table, accessibility page, npm badges, architecture diagram (document -> skins -> exporters -> frameworks; client -> Yjs -> server -> Postgres).
- `docs/CASE_STUDY.md` with real numbers and the hardest problem of each phase, for example: moving pure ops onto a CRDT without losing undo; printing one IR into five frameworks; keeping render fidelity measurable.
- A short screen recording of two people editing together.

## What I need from you

| When | What |
|---|---|
| Phase 5 | An npm account (or org) for publishing `@polyframe/*`. |
| Phase 8 | A Render account, a Neon account, a GitHub OAuth app and a Google OAuth client (I will list the exact callback URLs), and a decision on Free vs Starter on Render. |
| Phase 8 | Optional: a custom domain, so the app and the server share it and the setup gets simpler. |

## Open questions

- Pricing: does anything become paid later, or is the cloud free with limits? This affects quotas, not the architecture.
- Vue kits: all three (shadcn-vue, Vuetify, PrimeVue) or start with shadcn-vue only?
- Should anonymous visitors be allowed into a live room through an editor link without signing in, or is sign-in required for any editing?
