# Polyframe

One canvas, many UI kits. Sketch a layout as a wireframe, switch it to the look of shadcn/ui, MUI, Mantine, Ant Design or Bootstrap, and export it as PNG or JSON.

Polyframe runs entirely in the browser. There is no account and no backend: projects live in your browser's IndexedDB.

## Features

- 24 canvas components: layout, inputs, typography, media, data and feedback
- Wireframe mode plus five styled skins built from public design tokens
- Drag and drop from the palette, move, resize, marquee selection, grid snapping, z-order, copy and paste
- Schema-driven Inspector, Layers panel with drag reordering, undo and redo
- Autosave, project manager, JSON import and export, PNG export (1x, 2x, 3x, single artboard or ZIP)
- English and Ukrainian UI, keyboard shortcuts, screen reader announcements
- Read-only viewer for small screens

## Development

Requirements: Node.js 22+, pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm lint
pnpm typecheck
pnpm test         # unit and component tests
pnpm test:e2e     # Playwright
pnpm build
```

The product and technical spec lives in [docs/SPEC.md](docs/SPEC.md).

## Project layout

- `src/core` holds the framework-agnostic engine: document model, pure ops, geometry, component registry, skins and serialization.
- `src/features/editor` holds the editor UI: canvas, interactions, palette, layers, inspector, toolbar and dialogs.
- `src/stores` holds Zustand stores. Document history uses zundo.
- `messages` holds the `en` and `uk` translations.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Disclaimer

Polyframe is not affiliated with shadcn/ui, MUI, Mantine, Ant Design or Bootstrap. Skins are approximations built from the public default theme values of these MIT-licensed projects:
[shadcn/ui](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md),
[MUI](https://github.com/mui/material-ui/blob/master/LICENSE),
[Mantine](https://github.com/mantinedev/mantine/blob/master/LICENSE),
[Ant Design](https://github.com/ant-design/ant-design/blob/master/LICENSE),
[Bootstrap](https://github.com/twbs/bootstrap/blob/main/LICENSE).

## License

[MIT](LICENSE)
