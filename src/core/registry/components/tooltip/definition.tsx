import { MessageSquare } from "lucide-react";
import { defineComponent } from "../../types";
import { TooltipRender } from "./render";
import { tooltipSchema } from "./schema";

export const tooltipDefinition = defineComponent(tooltipSchema)({
  type: "tooltip",
  category: "overlays",
  labelKey: "components.tooltip",
  keywords: ["tooltip", "hint", "popover", "hover", "підказка", "тултіп", "наведення"],
  icon: MessageSquare,
  defaultSize: { w: 160, h: 76 },
  minSize: { w: 60, h: 40 },
  defaultProps: (t) => ({ text: t("tooltip.text"), trigger: t("tooltip.trigger"), placement: "top" }),
  Render: TooltipRender,
});
