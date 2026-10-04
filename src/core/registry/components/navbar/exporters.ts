import { bool, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { NavbarProps } from "./schema";

export const navbarExporters: ComponentExporters<NavbarProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      '<header className="flex h-full items-center gap-6 border-b bg-background px-6">',
      `<span className="text-lg font-bold">${text(p.brand)}</span>`,
      p.links.length > 0 &&
        `<nav className="flex gap-5 text-sm text-muted-foreground">${p.links.map((l) => `<a href="#" className="hover:text-foreground">${text(l)}</a>`).join("")}</nav>`,
      '<div className="ml-auto flex items-center gap-3">',
      p.actionLabel && `<Button size="sm">${text(p.actionLabel)}</Button>`,
      p.showAvatar && '<Avatar className="size-8"><AvatarFallback /></Avatar>',
      "</div>",
      "</header>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      ...(p.actionLabel ? [{ from: "@/components/ui/button", names: ["Button"] }] : []),
      ...(p.showAvatar ? [{ from: "@/components/ui/avatar", names: ["Avatar", "AvatarFallback"] }] : []),
    ],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      '<AppBar position="static" sx={{ height: "100%", justifyContent: "center" }}>',
      '<Toolbar sx={{ gap: 2 }}>',
      `<Typography variant="h6" component="div">${text(p.brand)}</Typography>`,
      ...p.links.map((l) => `<Button color="inherit">${text(l)}</Button>`),
      "<Box sx={{ flexGrow: 1 }} />",
      p.actionLabel && `<Button color="inherit" variant="outlined">${text(p.actionLabel)}</Button>`,
      p.showAvatar && "<Avatar sx={{ width: 32, height: 32 }} />",
      "</Toolbar>",
      "</AppBar>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@mui/material", names: ["AppBar", "Toolbar", "Typography", "Box", "Button", ...(p.showAvatar ? ["Avatar"] : [])] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: [
      '<Group h="100%" px="md" gap="lg" wrap="nowrap" style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }}>',
      `<Text fw={700} size="lg">${text(p.brand)}</Text>`,
      ...p.links.map((l) => `<Anchor href="#" c="dimmed" size="sm">${text(l)}</Anchor>`),
      '<Group ml="auto" gap="sm">',
      p.actionLabel && `<Button size="xs">${text(p.actionLabel)}</Button>`,
      p.showAvatar && '<Avatar size="sm" radius="xl" />',
      "</Group>",
      "</Group>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      {
        from: "@mantine/core",
        names: ["Group", "Text", ...(p.links.length ? ["Anchor"] : []), ...(p.actionLabel ? ["Button"] : []), ...(p.showAvatar ? ["Avatar"] : [])],
      },
    ],
  }),
  antd: ({ props: p }) => ({
    jsx: [
      '<Flex align="center" gap={24} style={{ height: "100%", padding: "0 24px", background: "#fff", borderBottom: "1px solid #f0f0f0" }}>',
      `<Typography.Text strong style={{ fontSize: 18 }}>${text(p.brand)}</Typography.Text>`,
      p.links.length > 0 &&
        `<Menu mode="horizontal" selectedKeys={["link-0"]} style={{ flex: 1, borderBottom: "none" }} items={[${p.links.map((l, i) => `{ key: "link-${i}", label: ${JSON.stringify(l)} }`).join(", ")}]} />`,
      '<Flex gap={12} align="center" style={{ marginLeft: "auto" }}>',
      p.actionLabel && `<Button type="primary">${text(p.actionLabel)}</Button>`,
      p.showAvatar && "<Avatar icon={<UserOutlined />} />",
      "</Flex>",
      "</Flex>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      { from: "antd", names: ["Flex", "Typography", ...(p.links.length ? ["Menu"] : []), ...(p.actionLabel ? ["Button"] : []), ...(p.showAvatar ? ["Avatar"] : [])] },
      ...(p.showAvatar ? [{ from: "@ant-design/icons", names: ["UserOutlined"] }] : []),
    ],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      '<Navbar bg="body-tertiary" className="h-100 px-4 border-bottom">',
      `<Navbar.Brand href="#">${text(p.brand)}</Navbar.Brand>`,
      `<Nav className="me-auto">${p.links.map((l, i) => `<Nav.Link href="#"${bool("active", i === 0)}>${text(l)}</Nav.Link>`).join("")}</Nav>`,
      p.actionLabel && `<Button size="sm">${text(p.actionLabel)}</Button>`,
      p.showAvatar && '<div className="rounded-circle bg-secondary-subtle ms-3" style={{ width: 32, height: 32 }} />',
      "</Navbar>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "react-bootstrap", names: ["Nav", "Navbar", ...(p.actionLabel ? ["Button"] : [])] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      '<Flex as="header" h="full" px="6" gap="6" align="center" borderBottomWidth="1px" bg="bg">',
      `<Text fontWeight="bold" textStyle="lg">${text(p.brand)}</Text>`,
      `<HStack gap="5">${p.links.map((l) => `<Link href="#" color="fg.muted" textStyle="sm">${text(l)}</Link>`).join("")}</HStack>`,
      '<HStack ml="auto" gap="3">',
      p.actionLabel && `<Button size="sm">${text(p.actionLabel)}</Button>`,
      p.showAvatar && '<Avatar.Root size="sm"><Avatar.Fallback /></Avatar.Root>',
      "</HStack>",
      "</Flex>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      {
        from: "@chakra-ui/react",
        names: ["Flex", "HStack", "Text", ...(p.links.length ? ["Link"] : []), ...(p.actionLabel ? ["Button"] : []), ...(p.showAvatar ? ["Avatar"] : [])],
      },
    ],
  }),
};
