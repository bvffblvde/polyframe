# Architecture

## One document, many looks

A project is plain JSON: artboards with an ordered list of layers, and layers with a type, a position and props. The editor renders every layer with Polyframe's own components. Skins never change the document; they only switch CSS variables and the `data-mode` and `data-skin` attributes on the artboard root.

```
document (JSON) ──▶ canvas components ──▶ skin tokens (CSS variables)
        │
        └────────▶ exporters ──▶ React code for six libraries
```

## Folders

| Folder | Role |
|---|---|
| `src/core/document` | Types, Zod schema, migrations and pure ops such as `addNodes` or `moveNodes` |
| `src/core/geometry` | Snapping, smart guides, resize, align and viewport math |
| `src/core/registry` | One folder per canvas component: schema, render, definition, exporters |
| `src/core/skins` | Tokens and structural flags for each skin, compiled into CSS |
| `src/core/exporters` | Targets, layout strategies and code generation |
| `src/core/serialization` | JSON import and export, share links |
| `src/core/templates` | Starter templates |
| `src/features/editor` | Canvas, interactions, palette, layers, inspector, toolbar, dialogs, tour |
| `src/stores` | Zustand stores: document with undo history, editor UI state, projects |
| `src/lib` | Persistence in IndexedDB, image export, downloads |

`src/core` is framework-agnostic: no Zustand, no DOM and no Next.js. A lint rule enforces it.

## State

- **document-store** holds the project and is wrapped in zundo for undo and redo. Every change goes through a pure op from `core/document/ops.ts`.
- **editor-store** holds selection, viewport, drag previews, dialogs and the tour. It is never part of history.
- **projects-store** lists projects and runs the debounced autosave to IndexedDB.

Drag and resize update a transient preview in the editor store and commit once on pointer up, so one gesture is one undo step. Components use narrow selectors, so moving one layer does not re-render the others.

## Rendering

Canvas components read only `--pf-*` CSS variables and `data-*` attributes. When a skin needs different markup, for example MUI's floating input label, the component reads a structural flag from `skinStructure(mode, skin)` instead of branching on the skin name.

The selection overlay, guides and handles live in a separate layer above the artboards, so image export never includes them.

## Untrusted data

Imported files and share links are parsed with the Zod schema and run through `migrations.ts`, and every layer's props are validated against its component schema before anything reaches the store.

## Code export

Each component has an exporter per target that returns a JSX string and the imports it needs. A layout strategy wraps the chunks: *absolute* keeps exact positions, *stacked* infers rows from vertical overlap and nests layers inside Box and Card containers. The result is formatted with Prettier in the browser.
