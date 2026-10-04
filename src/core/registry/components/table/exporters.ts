import { bool, text } from "../../../exporters/jsx";
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
  mantine: ({ props: p }) => ({
    jsx: [
      `<Table${bool("striped", p.striped)} withTableBorder${bool("withColumnBorders", p.bordered)}>`,
      `<Table.Thead><Table.Tr>${p.columns.map((c) => `<Table.Th>${text(c)}</Table.Th>`).join("")}</Table.Tr></Table.Thead>`,
      "<Table.Tbody>",
      ...p.rows.map((r) => `<Table.Tr>${p.columns.map((_, ci) => `<Table.Td>${text(r[ci] ?? "")}</Table.Td>`).join("")}</Table.Tr>`),
      "</Table.Tbody>",
      "</Table>",
    ].join("\n"),
    imports: [{ from: "@mantine/core", names: ["Table"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Table size="small" pagination={false}${bool("bordered", p.bordered)} columns={[${p.columns.map((c, i) => `{ title: ${JSON.stringify(c)}, dataIndex: "c${i}", key: "c${i}" }`).join(", ")}]} dataSource={[${p.rows.map((r, ri) => `{ key: "r${ri}", ${p.columns.map((_, ci) => `c${ci}: ${JSON.stringify(r[ci] ?? "")}`).join(", ")} }`).join(", ")}]} />`,
    imports: [{ from: "antd", names: ["Table"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      `<Table size="sm"${bool("striped", p.striped)}${bool("bordered", p.bordered)} className="mb-0">`,
      `<thead><tr>${p.columns.map((c) => `<th>${text(c)}</th>`).join("")}</tr></thead>`,
      "<tbody>",
      ...p.rows.map((r) => `<tr>${p.columns.map((_, ci) => `<td>${text(r[ci] ?? "")}</td>`).join("")}</tr>`),
      "</tbody>",
      "</Table>",
    ].join("\n"),
    imports: [{ from: "react-bootstrap", names: ["Table"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      `<Table.Root size="sm" variant="outline"${bool("striped", p.striped)}${bool("showColumnBorder", p.bordered)}>`,
      `<Table.Header><Table.Row>${p.columns.map((c) => `<Table.ColumnHeader>${text(c)}</Table.ColumnHeader>`).join("")}</Table.Row></Table.Header>`,
      "<Table.Body>",
      ...p.rows.map((r) => `<Table.Row>${p.columns.map((_, ci) => `<Table.Cell>${text(r[ci] ?? "")}</Table.Cell>`).join("")}</Table.Row>`),
      "</Table.Body>",
      "</Table.Root>",
    ].join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["Table"] }],
  }),
};
