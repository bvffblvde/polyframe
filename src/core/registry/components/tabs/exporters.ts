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
  mantine: ({ props: p }) => {
    const active = Math.min(p.activeIndex, Math.max(0, p.tabs.length - 1));
    return {
      jsx: [
        `<Tabs defaultValue="tab-${active}">`,
        `<Tabs.List>${p.tabs.map((t, i) => `<Tabs.Tab value="tab-${i}">${text(t)}</Tabs.Tab>`).join("")}</Tabs.List>`,
        p.content && `<Tabs.Panel value="tab-${active}" pt="md" style={{ whiteSpace: "pre-line" }}>${text(p.content)}</Tabs.Panel>`,
        "</Tabs>",
      ]
        .filter(Boolean)
        .join("\n"),
      imports: [{ from: "@mantine/core", names: ["Tabs"] }],
    };
  },
  antd: ({ props: p }) => {
    const active = Math.min(p.activeIndex, Math.max(0, p.tabs.length - 1));
    return {
      jsx: `<Tabs defaultActiveKey="tab-${active}" items={[${p.tabs.map((t, i) => `{ key: "tab-${i}", label: ${JSON.stringify(t)}, children: ${JSON.stringify(i === active ? p.content : "")} }`).join(", ")}]} />`,
      imports: [{ from: "antd", names: ["Tabs"] }],
    };
  },
  bootstrap: ({ props: p }) => {
    const active = Math.min(p.activeIndex, Math.max(0, p.tabs.length - 1));
    return {
      jsx: [
        `<Tabs defaultActiveKey="tab-${active}">`,
        ...p.tabs.map((t, i) =>
          i === active && p.content
            ? `<Tab eventKey="tab-${i}" title=${str(t)}><div className="pt-3" style={{ whiteSpace: "pre-line" }}>${text(p.content)}</div></Tab>`
            : `<Tab eventKey="tab-${i}" title=${str(t)} />`,
        ),
        "</Tabs>",
      ].join("\n"),
      imports: [{ from: "react-bootstrap", names: ["Tab", "Tabs"] }],
    };
  },
  chakra: ({ props: p }) => {
    const active = Math.min(p.activeIndex, Math.max(0, p.tabs.length - 1));
    return {
      jsx: [
        `<Tabs.Root defaultValue="tab-${active}">`,
        `<Tabs.List>${p.tabs.map((t, i) => `<Tabs.Trigger value="tab-${i}">${text(t)}</Tabs.Trigger>`).join("")}</Tabs.List>`,
        ...p.tabs.map((_, i) => `<Tabs.Content value="tab-${i}" whiteSpace="pre-line">${i === active ? text(p.content) : ""}</Tabs.Content>`),
        "</Tabs.Root>",
      ]
        .filter(Boolean)
        .join("\n"),
      imports: [{ from: "@chakra-ui/react", names: ["Tabs"] }],
    };
  },
};
