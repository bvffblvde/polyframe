import { Table } from "lucide-react";
import { tableExporters } from "./exporters";
import { tableSvg } from "./svg";
import { defineComponent, list } from "../../types";
import { TableRender } from "./render";
import { tableSchema } from "./schema";

export const tableDefinition = defineComponent(tableSchema)({
  type: "table",
  category: "data",
  labelKey: "components.table",
  keywords: ["table", "grid", "data", "rows", "columns", "таблиця", "дані", "рядки"],
  icon: Table,
  defaultSize: { w: 560, h: 180 },
  minSize: { w: 80, h: 40 },
  defaultProps: (t) => ({
    columns: list(t, "table.columns"),
    rows: [list(t, "table.row1"), list(t, "table.row2"), list(t, "table.row3")],
    striped: false,
    bordered: false,
  }),
  Render: TableRender,
  exporters: tableExporters,
  svg: tableSvg,
});
