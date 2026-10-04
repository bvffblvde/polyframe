import { TextCursorInput } from "lucide-react";
import { inputExporters } from "./exporters";
import { defineComponent } from "../../types";
import { InputRender } from "./render";
import { inputSchema } from "./schema";

export const inputDefinition = defineComponent(inputSchema)({
  type: "input",
  category: "inputs",
  labelKey: "components.input",
  keywords: ["input", "text field", "textbox", "form", "поле", "введення", "форма"],
  icon: TextCursorInput,
  defaultSize: { w: 280, h: 72 },
  minSize: { w: 60, h: 24 },
  defaultProps: (t) => ({
    label: t("input.label"),
    placeholder: t("input.placeholder"),
    value: "",
    helperText: "",
    size: "md",
    invalid: false,
    disabled: false,
  }),
  Render: InputRender,
  exporters: inputExporters,
});
