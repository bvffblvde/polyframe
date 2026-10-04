import { RectangleHorizontal } from "lucide-react";
import { defineComponent } from "../../types";
import { ButtonRender } from "./render";
import { buttonSchema } from "./schema";

export const buttonDefinition = defineComponent(buttonSchema)({
  type: "button",
  category: "inputs",
  labelKey: "components.button",
  keywords: ["button", "cta", "action", "кнопка", "дія"],
  icon: RectangleHorizontal,
  defaultSize: { w: 120, h: 40 },
  minSize: { w: 24, h: 20 },
  defaultProps: (t) => ({ label: t("button.label"), variant: "solid", size: "md", disabled: false }),
  Render: ButtonRender,
});
