import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { TableProps } from "./schema";

export const tableExporters: ComponentExporters<TableProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      '<div className="h-full w-full overflow-hidden rounded-md border">',
      "<Table>",
      `<TableHeader><TableRow>${p.columns.map((c) => `<TableHead>${text(c)}</TableHead>`).join("")}</TableRow></TableHeader>`,
      "<TableBody>",
      ...p.rows.map(
        (r, i) =>
          `<TableRow${p.striped && i % 2 === 1 ? ' className="bg-muted/50"' : ""}>${p.columns.map((_, ci) => `<TableCell${p.bordered && ci > 0 ? ' className="border-l"' : ""}>${text(r[ci] ?? "")}</TableCell>`).join("")}</TableRow>`,
      ),
      "</TableBody>",
      "</Table>",
      "</div>",
    ].join("\n"),
    imports: [{ from: "@/components/ui/table", names: ["Table", "TableBody", "TableCell", "TableHead", "TableHeader", "TableRow"] }],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      '<TableContainer component={Paper} sx={{ height: "100%" }}>',
      '<Table size="small">',
      `<TableHead><TableRow>${p.columns.map((c) => `<TableCell>${text(c)}</TableCell>`).join("")}</TableRow></TableHead>`,
      "<TableBody>",
      ...p.rows.map(
        (r, i) =>
          `<TableRow${p.striped && i % 2 === 1 ? ' sx={{ bgcolor: "action.hover" }}' : ""}>${p.columns.map((_, ci) => `<TableCell${p.bordered ? ' sx={{ borderRight: 1, borderColor: "divider" }}' : ""}>${text(r[ci] ?? "")}</TableCell>`).join("")}</TableRow>`,
      ),
      "</TableBody>",
      "</Table>",
      "</TableContainer>",
    ].join("\n"),
    imports: [{ from: "@mui/material", names: ["Paper", "Table", "TableBody", "TableCell", "TableContainer", "TableHead", "TableRow"] }],
  }),
};
