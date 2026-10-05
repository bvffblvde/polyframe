import { TrendingUp } from "lucide-react";
import { statExporters } from "./exporters";
import { statSvg } from "./svg";
import { defineComponent } from "../../types";
import { StatRender } from "./render";
import { statSchema } from "./schema";

export const statDefinition = defineComponent(statSchema)({
  type: "stat",
  category: "data",
  labelKey: "components.stat",
  keywords: ["stat", "kpi", "metric", "number", "statistic", "dashboard", "показник", "метрика", "статистика"],
  icon: TrendingUp,
  defaultSize: { w: 240, h: 110 },
  minSize: { w: 80, h: 60 },
  defaultProps: (t) => ({ label: t("stat.label"), value: "$48,200", delta: "12.5%", trend: "up" }),
  Render: StatRender,
  exporters: statExporters,
  svg: statSvg,
});
