# Bench history

Before and after numbers for performance work. Each pair was measured back to back on the same machine with the same bench (`pnpm bench`, production build, Chromium, 4x CPU throttling, median of 3 runs). Run to run noise on the "fit" scenarios is about 10%, so only bigger changes are listed as wins.

## 2026-10-09: Phase 2 (scale)

Changes:

- Viewport culling: artboards with 200 or more nodes render only nodes inside the view plus half a view of margin, snapped to 512 px tiles. The window grows at once and shrinks 300 ms after the view settles, so zooming in and out does not remount nodes. PNG export renders every node.
- Code exporters and SVG drawers moved out of component definitions into `core/exporters`, and the export dialogs load on first open.
- The landing demo loads when it comes near the viewport.

| Scenario | Before | After |
|---|---:|---:|
| Drag at 100% zoom, 2000 nodes | 50.3 FPS | 56.9 FPS |
| Pan at 100% zoom, 1000 nodes | 35.4 FPS | 41.0 FPS |
| Pan at 100% zoom, 2000 nodes | 42.8 FPS | 60.0 FPS |
| Editor initial JS | 457 KB | 406 KB |
| Landing initial JS | 356 KB | 328 KB |

Unchanged within noise: drag, marquee and zoom with the whole artboard in view, undo, load time.

Findings that did not make it in:

- `will-change: transform` on the dragged node and on the world layer while zooming made raster time 3x worse (1427 ms vs 469 ms per 20 zoom steps at 1000 nodes), because Chrome keeps re-rastering promoted layers at the new scale.
- `contain: layout style` on nodes raised Layerize time.
- With the whole artboard in view, frame time goes to Chrome raster and Layerize (about 3 ms per frame per 1000 text nodes before throttling), not to React. JavaScript per pointer move is under 4 ms. A level of detail mode for very small zoom is the next lever if needed.
- The editor initial JS is still above the 300 KB budget from SPEC 5.6. The biggest parts are React DOM (70 KB), Zod with the component schemas (about 90 KB) and the Next runtime (45 KB).
