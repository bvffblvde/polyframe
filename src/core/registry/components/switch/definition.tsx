import { ToggleRight } from "lucide-react";
import { switchExporters } from "./exporters";
import { switchSvg } from "./svg";
import { defineComponent } from "../../types";
import { SwitchRender } from "./render";
import { switchSchema } from "./schema";

export const switchDefinition = defineComponent(switchSchema)({
  type: "switch",
  category: "inputs",
  labelKey: "components.switch",
  keywords: ["switch", "toggle", "on off", "перемикач", "тумблер"],
  icon: ToggleRight,
  defaultSize: { w: 200, h: 28 },
  minSize: { w: 36, h: 16 },
  defaultProps: (t) => ({ label: t("switch.label"), checked: true, disabled: false }),
  Render: SwitchRender,
  exporters: switchExporters,
  svg: switchSvg,
});
