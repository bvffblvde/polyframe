import { Minus } from "lucide-react";
import { dividerExporters } from "./exporters";
import { defineComponent } from "../../types";
import { DividerRender } from "./render";
import { dividerSchema } from "./schema";

export const dividerDefinition = defineComponent(dividerSchema)({
  type: "divider",
  category: "layout",
  labelKey: "components.divider",
  keywords: ["divider", "separator", "line", "hr", "розділювач", "лінія"],
  icon: Minus,
  defaultSize: { w: 320, h: 16 },
  minSize: { w: 4, h: 4 },
  defaultProps: () => ({ orientation: "horizontal", label: "" }),
  Render: DividerRender,
  exporters: dividerExporters,
});
