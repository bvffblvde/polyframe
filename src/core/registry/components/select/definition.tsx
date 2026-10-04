import { ChevronsUpDown } from "lucide-react";
import { selectExporters } from "./exporters";
import { selectSvg } from "./svg";
import { defineComponent, list } from "../../types";
import { SelectRender } from "./render";
import { selectSchema } from "./schema";

export const selectDefinition = defineComponent(selectSchema)({
  type: "select",
  category: "inputs",
  labelKey: "components.select",
  keywords: ["select", "dropdown", "combobox", "picker", "список", "вибір", "випадаючий"],
  icon: ChevronsUpDown,
  defaultSize: { w: 280, h: 72 },
  minSize: { w: 60, h: 24 },
  defaultProps: (t) => ({
    label: t("select.label"),
    placeholder: t("select.placeholder"),
    options: list(t, "select.options"),
    value: "",
    disabled: false,
  }),
  Render: SelectRender,
  exporters: selectExporters,
  svg: selectSvg,
});
