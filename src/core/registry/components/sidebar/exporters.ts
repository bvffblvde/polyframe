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
        (item, i) => `<ListItemButton${bool("selected", i === p.activeIndex)}><ListItemText primary=${str(item)} /></ListItemButton>`,
      ),
      "</List>",
      "</Paper>",
    ].join("\n"),
    imports: [{ from: "@mui/material", names: ["Paper", "List", "ListItemButton", "ListItemText", ...(p.title ? ["ListSubheader"] : [])] }],
  }),
};
