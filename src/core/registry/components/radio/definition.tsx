import { CircleDot } from "lucide-react";
import { radioExporters } from "./exporters";
import { radioSvg } from "./svg";
import { defineComponent, list } from "../../types";
import { RadioRender } from "./render";
import { radioSchema } from "./schema";

export const radioDefinition = defineComponent(radioSchema)({
  type: "radio",
  category: "inputs",
  labelKey: "components.radio",
  keywords: ["radio", "option", "choice", "group", "перемикач", "радіо", "варіант"],
  icon: CircleDot,
  defaultSize: { w: 200, h: 112 },
  minSize: { w: 40, h: 24 },
  defaultProps: (t) => ({
    label: t("radio.label"),
    options: list(t, "radio.options"),
    activeIndex: 0,
    orientation: "vertical",
    disabled: false,
  }),
  Render: RadioRender,
  exporters: radioExporters,
  svg: radioSvg,
});
