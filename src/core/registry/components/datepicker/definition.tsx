import { CalendarClock } from "lucide-react";
import { datepickerExporters } from "./exporters";
import { datepickerSvg } from "./svg";
import { defineComponent } from "../../types";
import { DatepickerRender } from "./render";
import { datepickerSchema } from "./schema";

export const datepickerDefinition = defineComponent(datepickerSchema)({
  type: "datepicker",
  category: "inputs",
  labelKey: "components.datepicker",
  keywords: ["date picker", "date", "calendar input", "birthday", "deadline", "вибір дати", "дата", "календар"],
  icon: CalendarClock,
  defaultSize: { w: 280, h: 64 },
  minSize: { w: 100, h: 24 },
  defaultProps: (t) => ({
    label: t("datepicker.label"),
    value: "2026-10-15",
    placeholder: t("datepicker.placeholder"),
    locale: t("calendar.locale") === "uk" ? "uk" : "en",
    disabled: false,
  }),
  Render: DatepickerRender,
  exporters: datepickerExporters,
  svg: datepickerSvg,
});
