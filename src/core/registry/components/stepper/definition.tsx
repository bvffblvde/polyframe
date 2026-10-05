import { ListOrdered } from "lucide-react";
import { stepperExporters } from "./exporters";
import { stepperSvg } from "./svg";
import { defineComponent, list } from "../../types";
import { StepperRender } from "./render";
import { stepperSchema } from "./schema";

export const stepperDefinition = defineComponent(stepperSchema)({
  type: "stepper",
  category: "navigation",
  labelKey: "components.stepper",
  keywords: ["stepper", "steps", "wizard", "progress", "checkout", "кроки", "майстер", "етапи"],
  icon: ListOrdered,
  defaultSize: { w: 480, h: 40 },
  minSize: { w: 120, h: 32 },
  defaultProps: (t) => ({ steps: list(t, "stepper.steps"), activeIndex: 1 }),
  Render: StepperRender,
  exporters: stepperExporters,
  svg: stepperSvg,
});
