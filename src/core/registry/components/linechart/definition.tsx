import { ChartSpline } from "lucide-react";
import { linechartExporters } from "./exporters";
import { linechartSvg } from "./svg";
import { defineComponent, list } from "../../types";
import { LinechartRender } from "./render";
import { linechartSchema } from "./schema";

export const linechartDefinition = defineComponent(linechartSchema)({
  type: "linechart",
  category: "charts",
  labelKey: "components.linechart",
  keywords: ["line chart", "area chart", "trend", "chart", "graph", "лінійний графік", "графік", "тренд", "діаграма"],
  icon: ChartSpline,
  defaultSize: { w: 480, h: 280 },
  minSize: { w: 160, h: 120 },
  defaultProps: (t) => ({
    labels: list(t, "chart.labels"),
    values: [120, 190, 150, 220, 180, 260],
    values2: [80, 110, 130, 140, 120, 170],
    series: list(t, "chart.series"),
    smooth: true,
    area: false,
    showGrid: true,
    showLegend: true,
  }),
  Render: LinechartRender,
  exporters: linechartExporters,
  svg: linechartSvg,
});
