import { LayoutGrid } from "lucide-react";
import { gridExporters } from "./exporters";
import { gridSvg } from "./svg";
import { defineComponent } from "../../types";
import { GridRender } from "./render";
import { gridSchema } from "./schema";

export const gridDefinition = defineComponent(gridSchema)({
  type: "grid",
  category: "layout",
  labelKey: "components.grid",
  keywords: ["grid", "columns", "auto layout", "cards", "gallery", "грід", "сітка", "колонки", "картки", "галерея"],
  icon: LayoutGrid,
  defaultSize: { w: 480, h: 240 },
  minSize: { w: 16, h: 16 },
  defaultProps: () => ({ columns: 3, columnGap: 16, rowGap: 16, padding: 0, fill: true, align: "start", hug: true, background: "none" }),
  Render: GridRender,
  exporters: gridExporters,
  svg: gridSvg,
});
