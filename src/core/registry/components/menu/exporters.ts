import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { MenuProps } from "./schema";

const danger = (p: MenuProps, i: number) => p.destructiveLast && i === p.items.length - 1;

export const menuExporters: ComponentExporters<MenuProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      "<DropdownMenu defaultOpen>",
      '<DropdownMenuTrigger asChild><Button variant="outline">Open</Button></DropdownMenuTrigger>',
      '<DropdownMenuContent className="w-56">',
      ...p.items.map((item, i) => `<DropdownMenuItem${danger(p, i) ? ' variant="destructive"' : ""}>${text(item)}</DropdownMenuItem>`),
      "</DropdownMenuContent>",
      "</DropdownMenu>",
    ].join("\n"),
    imports: [
      { from: "@/components/ui/dropdown-menu", names: ["DropdownMenu", "DropdownMenuContent", "DropdownMenuItem", "DropdownMenuTrigger"] },
      { from: "@/components/ui/button", names: ["Button"] },
    ],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      '<Paper sx={{ width: "100%" }}>',
      "<MenuList>",
      ...p.items.map((item, i) => `<MenuItem${i === p.activeIndex ? " selected" : ""}${danger(p, i) ? ' sx={{ color: "error.main" }}' : ""}>${text(item)}</MenuItem>`),
      "</MenuList>",
      "</Paper>",
    ].join("\n"),
    imports: [{ from: "@mui/material", names: ["MenuItem", "MenuList", "Paper"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: [
      '<Menu opened width={220} position="bottom-start">',
      '<Menu.Target><Button variant="default">Open</Button></Menu.Target>',
      "<Menu.Dropdown>",
      ...p.items.map((item, i) => `<Menu.Item${danger(p, i) ? ' color="red"' : ""}>${text(item)}</Menu.Item>`),
      "</Menu.Dropdown>",
      "</Menu>",
    ].join("\n"),
    imports: [{ from: "@mantine/core", names: ["Button", "Menu"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Menu style={{ width: "100%" }}${p.activeIndex >= 0 ? ` selectedKeys={["item-${p.activeIndex}"]}` : ""} items={[${p.items.map((item, i) => `{ key: "item-${i}", label: ${JSON.stringify(item)}${danger(p, i) ? ", danger: true" : ""} }`).join(", ")}]} />`,
    imports: [{ from: "antd", names: ["Menu"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      '<Dropdown.Menu show className="position-static w-100">',
      ...p.items.map((item, i) => `<Dropdown.Item${i === p.activeIndex ? " active" : ""}${danger(p, i) ? ' className="text-danger"' : ""}>${text(item)}</Dropdown.Item>`),
      "</Dropdown.Menu>",
    ].join("\n"),
    imports: [{ from: "react-bootstrap", names: ["Dropdown"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      "<Menu.Root open>",
      '<Menu.Trigger asChild><Button variant="outline">Open</Button></Menu.Trigger>',
      "<Portal><Menu.Positioner><Menu.Content>",
      ...p.items.map((item, i) => `<Menu.Item value="item-${i}"${danger(p, i) ? ' color="fg.error"' : ""}>${text(item)}</Menu.Item>`),
      "</Menu.Content></Menu.Positioner></Portal>",
      "</Menu.Root>",
    ].join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["Button", "Menu", "Portal"] }],
  }),
};
