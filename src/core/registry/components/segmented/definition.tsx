import { SquareSplitHorizontal } from "lucide-react";
import { defineComponent, list } from "../../types";
import { SegmentedRender } from "./render";
import { segmentedSchema } from "./schema";

export const segmentedDefinition = defineComponent(segmentedSchema)({
  type: "segmented",
  category: "inputs",
  labelKey: "components.segmented",
  keywords: ["segmented control", "toggle group", "switcher", "tabs", "сегменти", "перемикач", "група кнопок"],
  icon: SquareSplitHorizontal,
  defaultSize: { w: 280, h: 36 },
  minSize: { w: 60, h: 24 },
  defaultProps: (t) => ({ options: list(t, "segmented.options"), activeIndex: 0 }),
  Render: SegmentedRender,
});
