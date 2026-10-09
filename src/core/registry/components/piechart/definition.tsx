import { ChartPie } from "lucide-react";
import { defineComponent, list } from "../../types";
import { PiechartRender } from "./render";
import { piechartSchema } from "./schema";

export const piechartDefinition = defineComponent(piechartSchema)({
  type: "piechart",
  category: "charts",
  labelKey: "components.piechart",
  keywords: ["pie chart", "donut chart", "share", "breakdown", "chart", "кругова діаграма", "пончик", "частки", "діаграма"],
  icon: ChartPie,
  defaultSize: { w: 360, h: 220 },
  minSize: { w: 120, h: 80 },
  defaultProps: (t) => ({ labels: list(t, "chart.pieLabels"), values: [42, 26, 20, 12], donut: true, showLegend: true }),
  Render: PiechartRender,
});
