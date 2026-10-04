import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { AlertProps } from "./schema";

const ICON = { info: "Info", success: "CircleCheck", warning: "TriangleAlert", danger: "CircleAlert" } as const;
const SEVERITY = { info: "info", success: "success", warning: "warning", danger: "error" } as const;

export const alertExporters: ComponentExporters<AlertProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      `<Alert${p.variant === "danger" ? ' variant="destructive"' : ""} className="h-full">`,
      `<${ICON[p.variant]} />`,
      p.title && `<AlertTitle>${text(p.title)}</AlertTitle>`,
      p.description && `<AlertDescription>${text(p.description)}</AlertDescription>`,
      "</Alert>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      { from: "@/components/ui/alert", names: ["Alert", ...(p.title ? ["AlertTitle"] : []), ...(p.description ? ["AlertDescription"] : [])] },
      { from: "lucide-react", names: [ICON[p.variant]] },
    ],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      `<Alert severity="${SEVERITY[p.variant]}" sx={{ height: "100%" }}>`,
      p.title && `<AlertTitle>${text(p.title)}</AlertTitle>`,
      text(p.description),
      "</Alert>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@mui/material", names: ["Alert", ...(p.title ? ["AlertTitle"] : [])] }],
  }),
};
