import { Square } from "lucide-react";
import { boxExporters } from "./exporters";
import { defineComponent } from "../../types";
import { BoxRender } from "./render";
import { boxSchema } from "./schema";

export const boxDefinition = defineComponent(boxSchema)({
  type: "box",
  category: "layout",
  labelKey: "components.box",
  keywords: ["box", "rectangle", "container", "shape", "блок", "прямокутник", "контейнер"],
  icon: Square,
  defaultSize: { w: 240, h: 160 },
  minSize: { w: 8, h: 8 },
  defaultProps: () => ({ label: "", variant: "outline" }),
  Render: BoxRender,
  exporters: boxExporters,
});
