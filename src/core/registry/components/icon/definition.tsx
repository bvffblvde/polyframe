import { Shapes } from "lucide-react";
import { defineComponent } from "../../types";
import { IconRender } from "./render";
import { iconSchema } from "./schema";

export const iconDefinition = defineComponent(iconSchema)({
  type: "icon",
  category: "media",
  labelKey: "components.icon",
  keywords: ["icon", "glyph", "symbol", "іконка", "значок", "символ"],
  icon: Shapes,
  defaultSize: { w: 32, h: 32 },
  minSize: { w: 8, h: 8 },
  defaultProps: () => ({ glyph: "star" }),
  Render: IconRender,
});
