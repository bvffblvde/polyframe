import { ChartColumn } from "lucide-react";
import { barchartExporters } from "./exporters";
import { barchartSvg } from "./svg";
import { defineComponent, list } from "../../types";
import { BarchartRender } from "./render";
import { barchartSchema } from "./schema";

export const barchartDefinition = defineComponent(barchartSchema)({
  type: "barchart",
  category: "charts",
  labelKey: "components.barchart",
  keywords: ["bar chart", "column chart", "chart", "graph", "histogram", "стовпчикова діаграма", "графік", "діаграма"],
  icon: ChartColumn,
  defaultSize: { w: 480, h: 280 },
  minSize: { w: 160, h: 120 },
  defaultProps: (t) => ({
    labels: list(t, "chart.labels"),
    values: [120, 190, 150, 220, 180, 260],
    values2: [80, 110, 130, 140, 120, 170],
    series: list(t, "chart.series"),
    showGrid: true,
    showLegend: true,
  }),
  Render: BarchartRender,
  exporters: barchartExporters,
  svg: barchartSvg,
});
