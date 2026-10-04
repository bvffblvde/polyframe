# Polyframe — Product & Technical Specification

> Working name. One canvas, many UI kits: sketch a layout as a wireframe, flip it into the look of a real component library, export it as a PNG or as code.
> Repo: `github.com/bvffblvde/polyframe` · License: MIT · Status: pre-MVP

---

## 1. Concept

Polyframe is a browser-only, open-source tool for quickly assembling UI prototypes by drag-and-drop.

The core idea is that **one layout is rendered in many visual languages.** A user places components on an artboard once, then switches between:

- **Wireframe mode**: low-fidelity, grayscale, sketch-like (Balsamiq-style), for thinking about structure.
- **Styled mode**: the same layout rendered with a *skin* that imitates a popular component library (shadcn/ui, MUI, Mantine, Ant Design, Bootstrap).

The main differentiator is **code export**: the layout can be exported as React JSX targeting a real library (shadcn/ui + Tailwind, MUI, and more later). The output is a starting point, not production code.

### 1.1 Goals
- Zero friction: open the URL and start building. No account, no backend.
- Be fast and pleasant on a 300-node document.
- Be a showcase of complex, logic-heavy frontend: editor engine, undo/redo, geometry, codegen, i18n, a11y, tests.
- Keep contributions easy: adding a component, skin or exporter means adding a file that follows a documented contract.

### 1.2 Non-goals (for now)
- Accounts, cloud sync, real-time collaboration.
- Pixel-perfect replicas of libraries. Skins are recognizable approximations.
- Production-grade, responsive code export.
- Mobile editing. Phones and tablets get a read-only viewer.

### 1.3 Audience
- Frontend developers sketching a screen before coding.
- Designers, PMs and freelancers who need a quick wireframe.
- Teachers and students comparing how component libraries look.

---

## 2. Key technical decisions

| # | Decision | Why |
|---|----------|-----|
| D1 | **Do not bundle real UI libraries into the canvas.** Use our own component set rendered from JSON and styled by **skins** made of design tokens and per-component style maps. | MUI (emotion), Bootstrap (global reset), Mantine and Tailwind preflight conflict in one page, and bundling them all would make the bundle huge. With our own components we fully control rendering, the wireframe mode and the export. |
| D2 | **Absolute layout on artboards** (Figma-like). Each node has `{x, y, w, h}` relative to its artboard. Auto-layout containers come in a later phase. | Simplest robust model. Free mode and grid-snap mode share one data model; snapping only rounds values. |
| D3 | **dnd-kit only for palette → canvas and sortable lists** (layers panel). **Our own pointer controller for move, resize and marquee selection on the canvas.** | Canvas interactions need zoom-aware coordinates, snapping, smart guides and resize handles, which dnd-kit does not fit well. react-grid-layout is dropped: it forces its own grid model. |
| D4 | **Zustand + zundo** for state and undo/redo. Document mutations are **pure functions** in `core/document/ops.ts`. | Pure ops are easy to test, and history lives in one place. |
| D5 | **No backend.** Projects are stored in IndexedDB (`idb-keyval`). Sharing uses a compressed URL hash (`lz-string`). Projects can be imported and exported as JSON files. | Free hosting on Vercel, privacy, nothing to maintain. |
| D6 | **Schema versioning with Zod** (`schemaVersion` plus migrations). | Imported JSON and share links come from outside and must be validated. Old files must keep opening. |
| D7 | **Next.js App Router.** The editor route is client-only. | The landing page, docs and SEO come later in the same app. `/[locale]` routing is needed for EN/UK. |
| D8 | **Editor chrome is built with shadcn/ui (Radix + Tailwind).** It is fully separate from the canvas component set. | Accessible primitives, and it matches the portfolio stack. |

---

## 3. Tech stack

Use the latest stable versions at setup time.

- **Framework:** Next.js (App Router) · React 19 · TypeScript (strict)
- **Styling:** Tailwind CSS v4 · CSS variables for skin tokens
- **Editor UI:** shadcn/ui (Radix primitives) · lucide-react icons · cmdk for the ⌘K command palette
- **State:** Zustand · zundo (temporal undo/redo) · immer (inside ops where helpful)
- **DnD:** @dnd-kit (palette → canvas, sortable layers panel)
- **Validation:** Zod
- **i18n:** next-intl · locales `en` (default) and `uk`
- **Persistence:** idb-keyval (IndexedDB) · lz-string (share links)
- **Image export:** html-to-image. If it struggles with fonts or CSS variables, fall back to modern-screenshot behind the same interface.
- **Code export:** string templates plus `prettier/standalone` for formatting in the browser · shiki for the code preview
- **Quality:** ESLint · Prettier · Vitest + React Testing Library · Playwright (e2e) · Storybook (canvas components × skins × modes)
- **Tooling:** pnpm · Husky + lint-staged · Conventional Commits · GitHub Actions (lint, typecheck, test, build, e2e) · Vercel

---

## 4. Product modules

### 4.1 Layout of the editor
```
┌──────────────────────────── Toolbar ─────────────────────────────┐
│ Project ▾ | Undo Redo | Mode: Wireframe/Styled | Skin ▾ | Grid ▾ │
│ Zoom − 100% + | Export ▾ (PNG · JSON · Code) | Share | ⌘K | EN/UK │
├──────────┬─────────────────────────────────────────┬─────────────┤
│ Palette  │                                         │ Inspector   │
│ (tabs:   │           Canvas (pan/zoom)             │ (props of   │
│ Components│     ┌─ Artboard: Desktop 1440 ─┐       │  selection) │
│ / Layers)│      │                          │        │             │
│          │      └──────────────────────────┘       │             │
└──────────┴─────────────────────────────────────────┴─────────────┘
```
The left panel has two tabs, **Components** and **Layers**. The right panel is the **Inspector**.

### 4.2 Palette (component library)
- Components are grouped into categories and can be searched (filter by name, EN/UK keywords).
- Each item shows a small preview rendered in the **current mode and skin**.
- Drag an item onto an artboard to insert it at the drop point (snapped if the grid is on). Click an item to insert it at the center of the visible part of the active artboard.
- Default text content is localized to the UI locale at the moment of insertion.

**MVP component set (24):**

| Category | Components |
|---|---|
| Layout | Box (rectangle/container), Card, Divider, Header/Navbar, Sidebar |
| Inputs | Button, Text input, Textarea, Select, Checkbox, Radio group, Switch, Slider |
| Typography | Heading (h1–h4), Text, Link, Badge |
| Media | Image placeholder, Avatar, Icon placeholder |
| Data & feedback | Table, Tabs, Alert, Progress |

(List, Breadcrumbs, Pagination, Modal and Tooltip mock come later.)

### 4.3 Canvas
- An infinite, pannable and zoomable viewport containing **artboards**.
- **Artboard presets:** Desktop 1440×1024, Laptop 1280×800, Tablet 768×1024, Mobile 390×844, plus custom sizes. Artboards can be added, renamed, resized and deleted.
- **Pan:** Space + drag, middle mouse button, or trackpad scroll. **Zoom:** ⌘/Ctrl + scroll, pinch, the toolbar, or `⌘0` (fit), `⌘1` (100%). Range 10%–400%.
- **Selection:** click to select, Shift-click to add or remove, marquee drag on empty space, Esc to clear.
- **Move:** drag; arrow keys nudge by 1px, Shift + arrow by 10px (or 1 grid step in snap mode).
- **Resize:** 8 handles. Shift keeps the aspect ratio, Alt resizes from the center. Each component has its own min size.
- **Grid:** off / snap. Grid size is 4, 8 (default) or 16px, and the grid can be shown or hidden. Holding Alt while dragging temporarily disables snapping.
- **Smart guides:** snap to the edges and centers of siblings and of the artboard, within 5 screen px (converted by zoom). Show distance labels.
- **Z-order:** bring forward or send backward (`⌘]` / `⌘[`), to front or to back (`⌘⇧]` / `⌘⇧[`).
- **Selection overlay** (outline, handles, guides) is rendered in a separate layer and is never part of image export.

### 4.4 Inspector
The Inspector is **generated from each component's Zod props schema**, so no hand-written forms are needed per component.
- **Common section:** name, x / y / w / h, lock, hide, opacity.
- **Component section:** text, variant, size, state (disabled, checked), options for selects, radios and tabs, table rows and columns, and so on.
- **Style section (Styled mode):** color role (primary, secondary, neutral, danger, success), radius override, shadow override.
- **Actions:** duplicate (`⌘D`), delete (Del/Backspace), copy and paste (`⌘C` / `⌘V`, works between artboards).
- **With several nodes selected:** shared fields only, plus align (left, center, right, top, middle, bottom) and distribute (horizontal, vertical).
- **With nothing selected:** project settings (name, mode, skin, grid).

### 4.5 Layers panel
- A tree of artboards and their nodes in z-order.
- Rename on double-click, toggle lock and hide, reorder by drag (dnd-kit sortable).
- Selection is synced both ways with the canvas.

### 4.6 Modes and skins
- **Wireframe mode:** grayscale palette, 1.5px strokes, image placeholders drawn with an ✕, optional "sketch" font (Caveat, which supports Cyrillic) and optional slightly rough borders. It ignores color roles and shows them only as gray shades.
- **Styled mode:** applies the selected skin.

Each skin is made of tokens (palette, radii, shadows, font family and sizes, control heights, spacing, density) **plus a per-component style map** for the signature details (for example, MUI uppercase buttons with elevation; Ant Design 32px controls; Bootstrap's classic radii and focus rings).

| Skin | MVP | Notes |
|---|---|---|
| Wireframe (base) | ✅ | Always available |
| shadcn/ui | ✅ | Neutral, Tailwind-like |
| MUI (Material) | ✅ | |
| Mantine | ✅ | |
| Ant Design | ✅ | |
| Bootstrap | ✅ | |
| Chakra UI, others | later | |

Skins are approximations. The README states that the project is "not affiliated with" any of these libraries and links to each library's MIT license where tokens are referenced.

Switching mode or skin **never mutates the document data**. It only changes the CSS variables and the `data-skin` / `data-mode` attributes on the artboard root.

### 4.7 Persistence and projects
- **Autosave** to IndexedDB, debounced by 500ms, with a "Saved" indicator.
- **Project manager:** list, create, rename, duplicate, delete (with confirmation). The last opened project reopens on the next visit.
- **JSON export and import** (`.polyframe.json`). Imports are validated with Zod and migrated. Errors are shown in a readable, localized form.
- **Undo/redo history** of at least 100 steps. History is per session and is not persisted. Selection, zoom and pan are not part of history.

### 4.8 Export
- **PNG:** the active artboard or all artboards (zipped with fflate). Scale 1×, 2× or 3×. Optional transparent background. Rendered in the current mode and skin, without overlays.
- **JSON:** see 4.7.
- **Code** (Phase 2):
  - Targets: **shadcn/ui + Tailwind** and **MUI** first, then Mantine, Ant Design, Bootstrap and Chakra.
  - Layout strategies:
    - *Absolute* (faithful to the canvas, wrapper with `position: relative`).
    - *Stacked* (rows inferred by vertical-overlap clustering, then flex rows sorted by x; an approximation). Nodes fully inside a Box or Card are nested into that container and laid out relative to it.
  - The output is one `.tsx` component per artboard, formatted with Prettier, with an import list and a header comment listing the dependencies to install.
  - UI: a dialog with target and strategy selectors, a highlighted preview, copy and download buttons.
  - Each component definition supplies an exporter per target. If a target has no exporter for a component, the export falls back to a commented `<div>` placeholder with a warning.
  - `exporter-check/` is a separate package that type-checks the generated code for every template, target and strategy against real shadcn/ui sources and MUI.

### 4.9 Sharing (Phase 2)
- **Share** compresses the document into the URL hash: `#/share/<lz-string>`. Nothing is sent to a server.
- Opening a share link shows a **read-only viewer**, with buttons to "Duplicate to my projects" and to export as PNG or JSON.
- If the compressed payload is larger than about 64 KB, the user is warned and offered JSON export instead.

### 4.10 Command palette (Phase 2)
- `⌘K` opens a command palette with: insert component, switch skin or mode, toggle grid, zoom presets, export, new project, open project, switch language, and the shortcuts cheatsheet (`?`).

### 4.11 Mobile and small screens
- Below 1024px, the editor shows a notice and opens the **viewer**: pan and zoom, switch skin and mode, export PNG.
- Share links work on mobile.

### 4.12 Internationalization
- The UI is in English (default) and Ukrainian. Routes are `/en/...` and `/uk/...`. The locale is detected from `Accept-Language` on first visit, and the language switcher is in the toolbar.
- All UI strings live in `messages/en.json` and `messages/uk.json`. Hardcoded strings are not allowed (enforced by a lint rule or review).
- The content users type is not translated. Default component texts come from the messages files at insertion.

### 4.13 Accessibility
- The editor chrome is fully keyboard-operable and has visible focus.
- Canvas nodes are reachable through the Layers panel, and the selected node can be moved and resized with the keyboard (arrows, plus Shift/Alt modifiers documented in the shortcuts panel).
- Live region announcements for key actions ("Button added", "3 items deleted", "Exported").
- The editor UI meets WCAG 2.2 AA contrast. Skins may be lower-contrast by design, which is fine because that is user content.

---

## 5. Architecture

### 5.1 Folder structure
```
src/
  app/
    [locale]/
      layout.tsx
      page.tsx                 # Phase 3: landing. Until then, redirect to /editor
      editor/page.tsx          # client-only editor shell
      view/page.tsx            # read-only viewer for share links
  core/                        # framework-agnostic, pure TS, unit-tested
    document/
      types.ts                 # Project, Artboard, Node, ...
      schema.ts                # Zod schemas + schemaVersion
      migrations.ts
      ops.ts                   # pure mutations: addNode, moveNodes, resize, reorder...
      selectors.ts
    geometry/                  # snap, guides, hit-test, bounds, align/distribute, viewport math
    registry/
      index.ts                 # component registry
      components/<type>/       # one folder per canvas component (see 5.3)
    skins/
      tokens.ts                # token types
      wireframe.ts shadcn.ts mui.ts mantine.ts antd.ts bootstrap.ts
    exporters/
      index.ts                 # target registry
      layout/absolute.ts layout/stacked.ts
      targets/shadcn.ts targets/mui.ts
    serialization/             # json import/export, share-link encode/decode
  features/
    editor/
      canvas/                  # Viewport, Artboard, NodeRenderer, SelectionOverlay, Guides, Marquee
      interactions/            # pointer controller: move, resize, marquee, pan, zoom
      palette/
      layers/
      inspector/               # schema-driven form
      toolbar/
      command-palette/
      dialogs/                 # export, projects, shortcuts
      shortcuts.ts
    viewer/
  stores/
    document-store.ts          # Zustand + zundo temporal
    editor-store.ts            # selection, viewport, tool, grid, active artboard
    projects-store.ts          # project list + persistence orchestration
  lib/
    persistence/idb.ts
    export-image.ts
    zip.ts
  components/ui/               # shadcn components (editor chrome only)
  i18n/                        # next-intl config, routing
messages/en.json  messages/uk.json
e2e/                           # Playwright
.storybook/
docs/SPEC.md  CLAUDE.md
```

### 5.2 Data model
```ts
type ID = string; // nanoid

interface Project {
  schemaVersion: 1;
  id: ID;
  name: string;
  createdAt: string;   // ISO
  updatedAt: string;
  settings: {
    mode: 'wireframe' | 'styled';
    skin: SkinId;      // 'shadcn' | 'mui' | 'mantine' | 'antd' | 'bootstrap'
    grid: { enabled: boolean; size: 4 | 8 | 16; visible: boolean };
    sketchFont: boolean;
  };
  artboards: Record<ID, Artboard>;
  artboardOrder: ID[];
  nodes: Record<ID, Node>;
}

interface Artboard {
  id: ID; name: string;
  x: number; y: number;          // position in world space
  width: number; height: number;
  preset: 'desktop' | 'laptop' | 'tablet' | 'mobile' | 'custom';
  background?: string;
  childOrder: ID[];              // z-order, last = top
}

interface Node<T extends ComponentType = ComponentType> {
  id: ID; type: T; artboardId: ID;
  parentId?: ID;                 // Phase 2: groups
  name: string;
  x: number; y: number; w: number; h: number;  // relative to artboard
  locked: boolean; hidden: boolean; opacity: number;
  style?: { colorRole?: ColorRole; radius?: number; shadow?: 0 | 1 | 2 | 3 };
  props: PropsOf<T>;             // validated by the component's Zod schema
}
```
The data is normalized (records + order arrays), which keeps updates cheap and simple. Coordinates are integers.

### 5.3 Component registry contract
Every canvas component is one folder that exports a `ComponentDefinition`:
```ts
interface ComponentDefinition<P> {
  type: ComponentType;
  category: 'layout' | 'inputs' | 'typography' | 'media' | 'data';
  labelKey: string;                      // i18n key
  keywords: string[];                    // search, EN + UK
  icon: LucideIcon;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  propsSchema: z.ZodType<P>;             // drives the Inspector + validation
  defaultProps: (t: Translator) => P;
  Render: React.FC<{ props: P; node: Node; mode: Mode; skin: SkinId }>;
  exporters?: Partial<Record<ExportTarget, (node: Node<P>, ctx: ExportCtx) => ExportChunk>>;
}
```
**Rendering rule:** `Render` reads only skin CSS variables and `data-*` attributes. It must not branch on the skin in JS unless the structure differs between skins (for example, the MUI "outlined" label notch). If it does, it uses the per-component style map from `core/skins`.

### 5.4 Stores
- **document-store:** holds the `Project`. Actions call `ops.*`. It is wrapped in zundo's `temporal`. Continuous gestures (drag, resize) commit **one** history entry on pointer up; intermediate frames update a transient preview state.
- **editor-store:** selection, hovered node, viewport `{x, y, zoom}`, active artboard, interaction state, panel visibility. Not part of history.
- **projects-store:** the list of project metadata, the load and save lifecycle, and the "Saved" status.
- Components subscribe with narrow selectors (`useStore(s => s.nodes[id])`, plus `shallow`) so that dragging one node does not re-render the others.

### 5.5 Interaction engine
- A single pointer controller on the viewport, built as a state machine: `idle → pressing → dragging | resizing | marquee | panning`.
- Screen ↔ world ↔ artboard coordinate conversion lives in `core/geometry/viewport.ts`.
- During a drag: rAF-throttled updates, a preview transform via CSS `transform` (no layout writes), then snapping (grid, then guides), then commit on pointer up.
- The viewport is a single CSS transform (`translate(x,y) scale(z)`) on the world container.

### 5.6 Performance budget
- 300 nodes across 3 artboards: drag at 60 fps on a mid-range laptop, with no long tasks above 50 ms.
- The initial editor JS (gzipped) stays under 300 KB. Code export, shiki and prettier are lazy-loaded.

---

## 6. Phases and acceptance criteria

### Phase 0: Foundation
- Next.js + TS strict, Tailwind v4, shadcn init, next-intl with `/en` and `/uk`, ESLint/Prettier/Husky, Vitest, Playwright, Storybook, GitHub Actions CI, Vercel preview deploys.
- README (EN) with a short pitch, a dev setup section and contribution basics. Also LICENSE (MIT), CONTRIBUTING.md, issue and PR templates.
- ✅ Done when: CI is green on an empty editor shell deployed to Vercel in both locales.

### Phase 1: MVP editor
- Document model, Zod schema, pure ops with unit tests.
- Canvas: viewport with pan and zoom, artboards with presets, rendering of nodes.
- Palette with all 22 components; drag and click to insert.
- Select, multi-select, marquee, move, resize, nudge, grid snap, z-order, duplicate, delete, copy and paste.
- Inspector (schema-driven) and Layers panel.
- Wireframe mode, plus the shadcn, MUI, Mantine, Ant Design and Bootstrap skins.
- Undo/redo, keyboard shortcuts and the cheatsheet.
- IndexedDB autosave, project manager, JSON import and export.
- PNG export (artboard or all; 1×/2×/3×).
- Mobile notice and read-only viewer of local projects.
- ✅ Done when: a user can build a login screen and a dashboard screen in Wireframe mode, switch to each skin, reload the page without losing work, and export a PNG. The e2e suite covers this flow. The ops and geometry modules have ≥90% unit coverage. Storybook has every component × every skin × both modes.

### Phase 2: Power features
- Smart guides with distance labels, align and distribute.
- Groups (`⌘G` / `⌘⇧G`). Group members share a `parentId` (the group id); there is no separate group node. Clicking a member on the canvas selects the whole group, the Layers panel selects single members.
- **Code export: shadcn/ui + Tailwind and MUI**, with absolute and stacked strategies.
- Share links and the viewer for them.
- ⌘K command palette.
- Starter templates (Login, Dashboard, Landing hero, Settings, Pricing, Mobile profile).
- ✅ Done when: the exported code for each template compiles in a fresh Vite project with the target library installed (checked by a CI job that type-checks the generated output).

### Phase 3: Reach
- More exporters (Mantine, Ant Design, Bootstrap, Chakra). Done: Bootstrap targets React Bootstrap, Chakra targets v3; every target is type-checked in `exporter-check`.
- Product landing page and `/docs` (MDX): getting started, shortcuts, how to add a component, skin or exporter.
- OG images, SEO, PWA (offline editor). Done: localized OG images, hreflang alternates, sitemap and robots, a web manifest and a service worker that serves the editor offline after the first visit. The site URL comes from `NEXT_PUBLIC_SITE_URL` (default `https://polyframe.vercel.app`).
- Done before the landing: a first-visit product tour in the editor and a user guide at `/guide`.

### Phase 4: Ideas backlog
- Auto-layout containers (flex/grid) for a cleaner export.
- More skins (Chakra, Fluent, Radix Themes), a custom skin editor, and import of design tokens.
- SVG and Figma-compatible export.
- Optional backend for cloud projects and collaboration.

---

## 7. Keyboard shortcuts (MVP)
| Action | Shortcut |
|---|---|
| Undo / Redo | ⌘Z / ⌘⇧Z (Ctrl on Windows/Linux) |
| Duplicate / Delete | ⌘D / Del, Backspace |
| Copy / Paste | ⌘C / ⌘V |
| Select all (in artboard) | ⌘A |
| Nudge | Arrows · Shift + Arrows |
| Bring forward / Send backward | ⌘] / ⌘[ |
| Toggle grid snap | G |
| Toggle mode | M |
| Zoom fit / 100% / in / out | ⌘0 / ⌘1 / ⌘= / ⌘− |
| Pan | Space + drag |
| Shortcuts cheatsheet | ? |
| Command palette (Phase 2) | ⌘K |

Shortcuts are disabled while the user is typing in an input.

---

## 8. Testing strategy
- **Unit (Vitest):** `core/**`, covering ops, geometry (snap, guides, align, viewport math), schema and migrations, share encode/decode, the exporters (snapshot tests per component × target) and stacked-layout inference.
- **Component (RTL):** the Inspector form generation, the Layers panel and the toolbar.
- **Visual (Storybook):** every canvas component × skin × mode. Optional Chromatic later.
- **E2E (Playwright):** the insert → edit → skin switch → reload → export flow; undo/redo; import of an invalid JSON file; locale switching.

---

## 9. Portfolio integration
- Add Polyframe to the Projects section as an open-source personal project, with links to the GitHub repo and the live app.
- Optionally add a Playground demo that embeds the viewer with a template and a skin switcher. It reuses the existing "Tokens → code" story.

---

## 10. Open items
- Final name: check that it is free on GitHub, npm and as a Vercel subdomain. Alternatives: **Skinframe**, **Kitsketch**, **Wirekit**, **Framekit**.
- Exact token values per skin are taken from each library's public theme defaults during Phase 1.
