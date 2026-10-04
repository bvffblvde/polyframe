import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { ProgressProps } from "./schema";

export const progressExporters: ComponentExporters<ProgressProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      '<div className="grid h-full content-center gap-2">',
      (p.label || p.showValue) &&
        `<div className="flex justify-between text-sm"><span className="font-medium">${text(p.label)}</span>${p.showValue ? `<span className="text-muted-foreground">${p.value}%</span>` : ""}</div>`,
      `<Progress value={${p.value}} />`,
      "</div>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@/components/ui/progress", names: ["Progress"] }],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      '<Box sx={{ width: "100%" }}>',
      (p.label || p.showValue) &&
        `<Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}><Typography variant="body2">${text(p.label)}</Typography>${p.showValue ? `<Typography variant="body2" color="text.secondary">${p.value}%</Typography>` : ""}</Box>`,
      `<LinearProgress variant="determinate" value={${p.value}} />`,
      "</Box>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@mui/material", names: ["Box", "LinearProgress", ...(p.label || p.showValue ? ["Typography"] : [])] }],
  }),
};
