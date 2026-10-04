import { Gauge } from "lucide-react";
import { progressExporters } from "./exporters";
import { defineComponent } from "../../types";
import { ProgressRender } from "./render";
import { progressSchema } from "./schema";

export const progressDefinition = defineComponent(progressSchema)({
  type: "progress",
  category: "data",
  labelKey: "components.progress",
  keywords: ["progress", "loading", "bar", "meter", "прогрес", "завантаження", "індикатор"],
  icon: Gauge,
  defaultSize: { w: 280, h: 40 },
  minSize: { w: 40, h: 4 },
  defaultProps: (t) => ({ label: t("progress.label"), value: 60, showValue: true }),
  Render: ProgressRender,
  exporters: progressExporters,
});
