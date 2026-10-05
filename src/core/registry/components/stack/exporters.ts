import type { ComponentExporters } from "../../../exporters/types";
import { CSS_ALIGN, CSS_JUSTIFY, type StackProps } from "./schema";

const TW_ALIGN = { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch" } as const;
const TW_JUSTIFY = { start: "justify-start", center: "justify-center", end: "justify-end", between: "justify-between" } as const;

export const stackExporters: ComponentExporters<StackProps> = {
  shadcn: ({ props: p }, ctx) => {
    const bg = { none: "", surface: " rounded-lg border bg-card", muted: " rounded-lg bg-muted" }[p.background];
    return {
      jsx: `<div className="flex${p.direction === "column" ? " flex-col" : ""} gap-[${p.gap}px] p-[${p.padding}px] ${TW_ALIGN[p.align]} ${TW_JUSTIFY[p.justify]} h-full w-full${bg}">\n${ctx.children ?? ""}\n</div>`,
    };
  },
  mui: ({ props: p }, ctx) => {
    const bg = { none: "", surface: ', bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 2', muted: ', bgcolor: "action.hover", borderRadius: 2' }[p.background];
    return {
      jsx: `<Stack direction="${p.direction}" sx={{ gap: "${p.gap}px", p: "${p.padding}px", alignItems: "${CSS_ALIGN[p.align]}", justifyContent: "${CSS_JUSTIFY[p.justify]}", width: "100%", height: "100%"${bg} }}>\n${ctx.children ?? ""}\n</Stack>`,
      imports: [{ from: "@mui/material", names: ["Stack"] }],
    };
  },
  mantine: ({ props: p }, ctx) => {
    const bg = { none: "", surface: ' bg="var(--mantine-color-body)" bdrs="md" bd="1px solid var(--mantine-color-gray-3)"', muted: ' bg="gray.0" bdrs="md"' }[p.background];
    return {
      jsx: `<Flex direction="${p.direction}" gap={${p.gap}} p={${p.padding}} align="${CSS_ALIGN[p.align]}" justify="${CSS_JUSTIFY[p.justify]}" w="100%" h="100%"${bg}>\n${ctx.children ?? ""}\n</Flex>`,
      imports: [{ from: "@mantine/core", names: ["Flex"] }],
    };
  },
  antd: ({ props: p }, ctx) => {
    const bg = { none: "", surface: ', background: "#fff", border: "1px solid #f0f0f0", borderRadius: 8', muted: ', background: "rgba(0, 0, 0, 0.02)", borderRadius: 8' }[p.background];
    return {
      jsx: `<Flex${p.direction === "column" ? " vertical" : ""} gap={${p.gap}} align="${CSS_ALIGN[p.align]}" justify="${CSS_JUSTIFY[p.justify]}" style={{ padding: ${p.padding}, width: "100%", height: "100%"${bg} }}>\n${ctx.children ?? ""}\n</Flex>`,
      imports: [{ from: "antd", names: ["Flex"] }],
    };
  },
  bootstrap: ({ props: p }, ctx) => {
    const align = { start: "start", center: "center", end: "end", stretch: "stretch" }[p.align];
    const justify = { start: "start", center: "center", end: "end", between: "between" }[p.justify];
    const bg = { none: "", surface: " bg-body border rounded-3", muted: " bg-body-tertiary rounded-3" }[p.background];
    return {
      jsx: `<div className="d-flex flex-${p.direction} align-items-${align} justify-content-${justify} w-100 h-100${bg}" style={{ gap: ${p.gap}, padding: ${p.padding} }}>\n${ctx.children ?? ""}\n</div>`,
    };
  },
  chakra: ({ props: p }, ctx) => {
    const bg = { none: "", surface: ' bg="bg" borderWidth="1px" borderRadius="lg"', muted: ' bg="bg.muted" borderRadius="lg"' }[p.background];
    return {
      jsx: `<Flex direction="${p.direction}" gap="${p.gap}px" p="${p.padding}px" align="${CSS_ALIGN[p.align]}" justify="${CSS_JUSTIFY[p.justify]}" w="full" h="full"${bg}>\n${ctx.children ?? ""}\n</Flex>`,
      imports: [{ from: "@chakra-ui/react", names: ["Flex"] }],
    };
  },
};
