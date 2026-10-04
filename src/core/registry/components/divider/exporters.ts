import { str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { DividerProps } from "./schema";

const sep = { from: "@/components/ui/separator", names: ["Separator"] };

export const dividerExporters: ComponentExporters<DividerProps> = {
  shadcn: ({ props: p }) => {
    if (p.orientation === "vertical") {
      return { jsx: '<div className="flex h-full justify-center"><Separator orientation="vertical" /></div>', imports: [sep] };
    }
    if (p.label) {
      return {
        jsx: `<div className="flex h-full items-center gap-3"><Separator className="flex-1" /><span className="text-xs text-muted-foreground">${text(p.label)}</span><Separator className="flex-1" /></div>`,
        imports: [sep],
      };
    }
    return { jsx: '<div className="flex h-full items-center"><Separator /></div>', imports: [sep] };
  },
  mui: ({ props: p }) => ({
    jsx:
      p.orientation === "vertical"
        ? '<Box sx={{ display: "flex", justifyContent: "center", height: "100%" }}><Divider orientation="vertical" /></Box>'
        : `<Box sx={{ display: "flex", alignItems: "center", height: "100%" }}><Divider sx={{ flex: 1 }}>${text(p.label)}</Divider></Box>`,
    imports: [{ from: "@mui/material", names: ["Box", "Divider"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx:
      p.orientation === "vertical"
        ? '<Center h="100%"><Divider orientation="vertical" h="100%" /></Center>'
        : `<Center h="100%"><Divider w="100%"${p.label ? ` label=${str(p.label)} labelPosition="center"` : ""} /></Center>`,
    imports: [{ from: "@mantine/core", names: ["Center", "Divider"] }],
  }),
  antd: ({ props: p }) => ({
    jsx:
      p.orientation === "vertical"
        ? '<Flex justify="center" style={{ height: "100%" }}><Divider orientation="vertical" style={{ height: "100%" }} /></Flex>'
        : `<Flex align="center" style={{ height: "100%" }}><Divider style={{ margin: 0 }}>${text(p.label)}</Divider></Flex>`,
    imports: [{ from: "antd", names: ["Divider", "Flex"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx:
      p.orientation === "vertical"
        ? '<div className="d-flex justify-content-center h-100"><div className="vr" /></div>'
        : p.label
          ? `<div className="d-flex align-items-center gap-3 h-100"><hr className="flex-grow-1 m-0" /><span className="small text-secondary">${text(p.label)}</span><hr className="flex-grow-1 m-0" /></div>`
          : '<div className="d-flex align-items-center h-100"><hr className="w-100 m-0" /></div>',
  }),
  chakra: ({ props: p }) => ({
    jsx:
      p.orientation === "vertical"
        ? '<Flex justify="center" h="full"><Separator orientation="vertical" h="full" /></Flex>'
        : p.label
          ? `<Flex align="center" gap="3" h="full"><Separator flex="1" /><Text textStyle="xs" color="fg.muted">${text(p.label)}</Text><Separator flex="1" /></Flex>`
          : '<Flex align="center" h="full"><Separator w="full" /></Flex>',
    imports: [{ from: "@chakra-ui/react", names: ["Flex", "Separator", ...(p.orientation === "horizontal" && p.label ? ["Text"] : [])] }],
  }),
};
