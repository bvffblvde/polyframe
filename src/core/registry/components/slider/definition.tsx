import { SlidersHorizontal } from "lucide-react";
import { sliderExporters } from "./exporters";
import { sliderSvg } from "./svg";
import { defineComponent } from "../../types";
import { SliderRender } from "./render";
import { sliderSchema } from "./schema";

export const sliderDefinition = defineComponent(sliderSchema)({
  type: "slider",
  category: "inputs",
  labelKey: "components.slider",
  keywords: ["slider", "range", "volume", "повзунок", "слайдер", "діапазон"],
  icon: SlidersHorizontal,
  defaultSize: { w: 280, h: 48 },
  minSize: { w: 40, h: 16 },
  defaultProps: (t) => ({ label: t("slider.label"), value: 40, showValue: true, disabled: false }),
  Render: SliderRender,
  exporters: sliderExporters,
  svg: sliderSvg,
});
