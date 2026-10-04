# Add a canvas component

A component is one folder in `src/core/registry/components/<type>/`. Use an existing one, for example `badge`, as a starting point.

## 1. Schema

`schema.ts` describes the props with Zod. The Inspector form is generated from it:

| Zod type | Inspector control |
|---|---|
| `z.string()` | text input (`.meta({ multiline: true })` for a textarea) |
| `z.number().min().max()` | number input, clamped |
| `z.boolean()` | switch |
| `z.enum([...])` | select |
| `z.array(z.string())` | one item per line |
| `z.array(z.array(z.string()))` | table: rows per line, cells split by `|` |

## 2. Render

`render.tsx` returns markup with `pf-*` class names and `data-*` attributes only. Style it in `src/styles/canvas.css` with `--pf-*` skin variables. Never import a UI library, and never branch on the skin in JS unless the structure differs; in that case read `skinStructure(mode, skin)` from `core/skins`.

## 3. Definition

`definition.tsx` wires everything together:

```ts
export const badgeDefinition = defineComponent(badgeSchema)({
  type: "badge",
  category: "typography",
  labelKey: "components.badge",
  keywords: ["badge", "tag", "бейдж", "мітка"],
  icon: Tag,
  defaultSize: { w: 64, h: 24 },
  minSize: { w: 16, h: 12 },
  defaultProps: (t) => ({ text: t("badge.text"), variant: "solid" }),
  Render: BadgeRender,
  exporters: badgeExporters,
});
```

## 4. Exporters

`exporters.ts` returns JSX strings and imports for every target in `EXPORT_TARGETS`. Helpers in `core/exporters/jsx.ts` escape text and attributes.

## 5. Register and translate

- Add the type to `COMPONENT_TYPES` in `core/document/types.ts`.
- Register the definition in `core/registry/index.ts`.
- Add `components.<type>` and `defaults.<type>.*` to both `messages/en.json` and `messages/uk.json`.

## 6. Test

`pnpm test` checks that default props are valid in both languages and that every target has an exporter. Review the new snapshots, then run the exporter type check described in `exporter-check/README.md`.
