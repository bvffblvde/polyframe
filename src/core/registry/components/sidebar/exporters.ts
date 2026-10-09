import { bool, str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { SidebarProps } from "./schema";

export const sidebarExporters: ComponentExporters<SidebarProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      '<aside className="flex h-full flex-col gap-1 border-r bg-muted/40 p-3">',
      p.title && `<p className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">${text(p.title)}</p>`,
      ...p.items.map(
        (item, i) => `<Button variant="${i === p.activeIndex ? "secondary" : "ghost"}" className="justify-start">${text(item)}</Button>`,
      ),
      "</aside>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: p.items.length ? [{ from: "@/components/ui/button", names: ["Button"] }] : [],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      '<Paper square sx={{ height: "100%", overflow: "auto" }}>',
      p.title ? `<List subheader={<ListSubheader>${text(p.title)}</ListSubheader>}>` : "<List>",
      ...p.items.map(
        (item, i) => `<ListItem disablePadding><ListItemButton${bool("selected", i === p.activeIndex)}><ListItemText primary=${str(item)} /></ListItemButton></ListItem>`,
      ),
      "</List>",
      "</Paper>",
    ].join("\n"),
    imports: [{ from: "@mui/material", names: ["Paper", "List", "ListItem", "ListItemButton", "ListItemText", ...(p.title ? ["ListSubheader"] : [])] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: [
      '<Stack gap={2} p="sm" h="100%" bg="gray.0" style={{ borderRight: "1px solid var(--mantine-color-gray-3)" }}>',
      p.title && `<Text size="xs" fw={700} c="dimmed" tt="uppercase" px="sm" py={6}>${text(p.title)}</Text>`,
      ...p.items.map((item, i) => `<NavLink href="#" label=${str(item)}${bool("active", i === p.activeIndex)} />`),
      "</Stack>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@mantine/core", names: ["Stack", ...(p.title ? ["Text"] : []), ...(p.items.length ? ["NavLink"] : [])] }],
  }),
  antd: ({ props: p }) => ({
    jsx: [
      '<Flex vertical style={{ height: "100%", background: "#fff", borderRight: "1px solid #f0f0f0" }}>',
      p.title && `<Typography.Text type="secondary" style={{ padding: "12px 24px 4px", fontSize: 12, textTransform: "uppercase" }}>${text(p.title)}</Typography.Text>`,
      `<Menu mode="inline" selectedKeys={["item-${p.activeIndex}"]} style={{ borderInlineEnd: "none" }} items={[${p.items.map((l, i) => `{ key: "item-${i}", label: ${JSON.stringify(l)} }`).join(", ")}]} />`,
      "</Flex>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "antd", names: ["Flex", "Menu", ...(p.title ? ["Typography"] : [])] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      '<div className="d-flex flex-column h-100 p-3 bg-body-tertiary border-end">',
      p.title && `<div className="small text-uppercase fw-semibold text-secondary px-3 mb-2">${text(p.title)}</div>`,
      `<Nav variant="pills" className="flex-column" defaultActiveKey="item-${p.activeIndex}">${p.items.map((item, i) => `<Nav.Link eventKey="item-${i}" href="#">${text(item)}</Nav.Link>`).join("")}</Nav>`,
      "</div>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "react-bootstrap", names: ["Nav"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      '<Stack h="full" p="3" gap="1" bg="bg.subtle" borderRightWidth="1px">',
      p.title && `<Text textStyle="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" px="3" py="2">${text(p.title)}</Text>`,
      ...p.items.map((item, i) => `<Button variant="${i === p.activeIndex ? "subtle" : "ghost"}" justifyContent="flex-start">${text(item)}</Button>`),
      "</Stack>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["Stack", ...(p.title ? ["Text"] : []), ...(p.items.length ? ["Button"] : [])] }],
  }),
};
