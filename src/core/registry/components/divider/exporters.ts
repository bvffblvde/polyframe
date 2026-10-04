import { text } from "../../../exporters/jsx";
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
};
