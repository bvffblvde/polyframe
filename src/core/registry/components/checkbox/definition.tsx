import { SquareCheck } from "lucide-react";
import { checkboxExporters } from "./exporters";
import { defineComponent } from "../../types";
import { CheckboxRender } from "./render";
import { checkboxSchema } from "./schema";

export const checkboxDefinition = defineComponent(checkboxSchema)({
  type: "checkbox",
  category: "inputs",
  labelKey: "components.checkbox",
  keywords: ["checkbox", "check", "tick", "agree", "прапорець", "чекбокс", "галочка"],
  icon: SquareCheck,
  defaultSize: { w: 200, h: 24 },
  minSize: { w: 20, h: 16 },
  defaultProps: (t) => ({ label: t("checkbox.label"), checked: true, disabled: false }),
  Render: CheckboxRender,
  exporters: checkboxExporters,
});
