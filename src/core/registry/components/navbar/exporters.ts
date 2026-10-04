import { text } from "../../../exporters/jsx";
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
};
