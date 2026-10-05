import type { ComponentExporters } from "../../../exporters/types";
import { GRID_ALIGN, gridColumns, type GridProps } from "./schema";

const TW_ALIGN = { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch" } as const;

export const gridExporters: ComponentExporters<GridProps> = {
  shadcn: ({ props: p }, ctx) => {
    const bg = { none: "", surface: " rounded-lg border bg-card", muted: " rounded-lg bg-muted" }[p.background];
    return {
      jsx: `<div className="grid grid-cols-${p.columns} gap-x-[${p.columnGap}px] gap-y-[${p.rowGap}px] p-[${p.padding}px] ${TW_ALIGN[p.align]}${p.fill ? "" : " justify-items-start"} w-full${bg}">\n${ctx.children ?? ""}\n</div>`,
    };
  },
  mui: ({ props: p }, ctx) => {
    const bg = { none: "", surface: ', bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 2', muted: ', bgcolor: "action.hover", borderRadius: 2' }[p.background];
    return {
      jsx: `<Box sx={{ display: "grid", gridTemplateColumns: "${gridColumns(p.columns)}", columnGap: "${p.columnGap}px", rowGap: "${p.rowGap}px", p: "${p.padding}px", alignItems: "${GRID_ALIGN[p.align]}", justifyItems: "${p.fill ? "stretch" : "start"}", width: "100%"${bg} }}>\n${ctx.children ?? ""}\n</Box>`,
      imports: [{ from: "@mui/material", names: ["Box"] }],
    };
  },
  mantine: ({ props: p }, ctx) => {
    const bg = { none: "", surface: ' bg="var(--mantine-color-body)" bdrs="md" bd="1px solid var(--mantine-color-gray-3)"', muted: ' bg="gray.0" bdrs="md"' }[p.background];
    return {
      jsx: `<SimpleGrid cols={${p.columns}} spacing={${p.columnGap}} verticalSpacing={${p.rowGap}} p={${p.padding}}${bg} style={{ alignItems: "${GRID_ALIGN[p.align]}", justifyItems: "${p.fill ? "stretch" : "start"}" }}>\n${ctx.children ?? ""}\n</SimpleGrid>`,
      imports: [{ from: "@mantine/core", names: ["SimpleGrid"] }],
    };
  },
  antd: ({ props: p }, ctx) => {
    const bg = { none: "", surface: ', background: "#fff", border: "1px solid #f0f0f0", borderRadius: 8', muted: ', background: "rgba(0, 0, 0, 0.02)", borderRadius: 8' }[p.background];
    return {
      jsx: `<div style={{ display: "grid", gridTemplateColumns: "${gridColumns(p.columns)}", columnGap: ${p.columnGap}, rowGap: ${p.rowGap}, padding: ${p.padding}, alignItems: "${GRID_ALIGN[p.align]}", justifyItems: "${p.fill ? "stretch" : "start"}"${bg} }}>\n${ctx.children ?? ""}\n</div>`,
    };
  },
  bootstrap: ({ props: p }, ctx) => {
    const bg = { none: "", surface: " bg-body border rounded-3", muted: " bg-body-tertiary rounded-3" }[p.background];
    return {
      jsx: `<div className="d-grid w-100${bg}" style={{ gridTemplateColumns: "${gridColumns(p.columns)}", columnGap: ${p.columnGap}, rowGap: ${p.rowGap}, padding: ${p.padding}, alignItems: "${GRID_ALIGN[p.align]}", justifyItems: "${p.fill ? "stretch" : "start"}" }}>\n${ctx.children ?? ""}\n</div>`,
    };
  },
  chakra: ({ props: p }, ctx) => {
    const bg = { none: "", surface: ' bg="bg" borderWidth="1px" borderRadius="lg"', muted: ' bg="bg.muted" borderRadius="lg"' }[p.background];
    return {
      jsx: `<Grid templateColumns="${gridColumns(p.columns)}" columnGap="${p.columnGap}px" rowGap="${p.rowGap}px" p="${p.padding}px" alignItems="${GRID_ALIGN[p.align]}" justifyItems="${p.fill ? "stretch" : "start"}" w="full"${bg}>\n${ctx.children ?? ""}\n</Grid>`,
      imports: [{ from: "@chakra-ui/react", names: ["Grid"] }],
    };
  },
};
