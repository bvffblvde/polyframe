import { Rows3 } from "lucide-react";
import { defineComponent } from "../../types";
import { StackRender } from "./render";
import { stackSchema } from "./schema";

export const stackDefinition = defineComponent(stackSchema)({
  type: "stack",
  category: "layout",
  labelKey: "components.stack",
  keywords: ["stack", "auto layout", "flex", "row", "column", "container", "стек", "автолейаут", "ряд", "колонка", "контейнер"],
  icon: Rows3,
  defaultSize: { w: 320, h: 120 },
  minSize: { w: 8, h: 8 },
  defaultProps: () => ({ direction: "row", gap: 8, padding: 8, align: "start", justify: "start", hug: false, background: "none" }),
  Render: StackRender,
});
