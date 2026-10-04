import { str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { TabsProps } from "./schema";

export const tabsExporters: ComponentExporters<TabsProps> = {
  shadcn: ({ props: p }) => {
    const active = Math.min(p.activeIndex, Math.max(0, p.tabs.length - 1));
    return {
      jsx: [
        `<Tabs defaultValue="tab-${active}" className="h-full w-full">`,
        `<TabsList>${p.tabs.map((t, i) => `<TabsTrigger value="tab-${i}">${text(t)}</TabsTrigger>`).join("")}</TabsList>`,
        `<TabsContent value="tab-${active}" className="whitespace-pre-line text-sm">${text(p.content)}</TabsContent>`,
        "</Tabs>",
      ].join("\n"),
      imports: [{ from: "@/components/ui/tabs", names: ["Tabs", "TabsContent", "TabsList", "TabsTrigger"] }],
    };
  },
  mui: ({ props: p }) => ({
    jsx: [
      '<Box sx={{ width: "100%", height: "100%" }}>',
      '<Box sx={{ borderBottom: 1, borderColor: "divider" }}>',
      `<Tabs value={${Math.min(p.activeIndex, Math.max(0, p.tabs.length - 1))}}>${p.tabs.map((t) => `<Tab label=${str(t)} />`).join("")}</Tabs>`,
      "</Box>",
      `<Typography sx={{ p: 2, whiteSpace: "pre-line" }}>${text(p.content)}</Typography>`,
      "</Box>",
    ].join("\n"),
    imports: [{ from: "@mui/material", names: ["Box", "Tab", "Tabs", "Typography"] }],
  }),
};
