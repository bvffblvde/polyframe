import { LetterText } from "lucide-react";
import { textareaExporters } from "./exporters";
import { defineComponent } from "../../types";
import { TextareaRender } from "./render";
import { textareaSchema } from "./schema";

export const textareaDefinition = defineComponent(textareaSchema)({
  type: "textarea",
  category: "inputs",
  labelKey: "components.textarea",
  keywords: ["textarea", "multiline", "message", "comment", "текстове поле", "повідомлення", "коментар"],
  icon: LetterText,
  defaultSize: { w: 320, h: 140 },
  minSize: { w: 60, h: 48 },
  defaultProps: (t) => ({
    label: t("textarea.label"),
    placeholder: t("textarea.placeholder"),
    value: "",
    disabled: false,
  }),
  Render: TextareaRender,
  exporters: textareaExporters,
});
