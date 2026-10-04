import { Type } from "lucide-react";
import { textExporters } from "./exporters";
import { defineComponent } from "../../types";
import { TextRender } from "./render";
import { textSchema } from "./schema";

export const textDefinition = defineComponent(textSchema)({
  type: "text",
  category: "typography",
  labelKey: "components.text",
  keywords: ["text", "paragraph", "body", "copy", "label", "текст", "абзац", "підпис"],
  icon: Type,
  defaultSize: { w: 360, h: 60 },
  minSize: { w: 20, h: 12 },
  defaultProps: (t) => ({ text: t("text.text"), size: "md", align: "left", muted: false }),
  Render: TextRender,
  exporters: textExporters,
});
