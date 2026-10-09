import { CalendarDays } from "lucide-react";
import { defineComponent } from "../../types";
import { CalendarRender } from "./render";
import { calendarSchema } from "./schema";

export const calendarDefinition = defineComponent(calendarSchema)({
  type: "calendar",
  category: "inputs",
  labelKey: "components.calendar",
  keywords: ["calendar", "month", "date", "schedule", "календар", "місяць", "дата", "розклад"],
  icon: CalendarDays,
  defaultSize: { w: 280, h: 300 },
  minSize: { w: 180, h: 200 },
  defaultProps: (t) => ({
    year: 2026,
    month: 10,
    selected: 15,
    weekStart: t("calendar.weekStart") === "sunday" ? "sunday" : "monday",
    locale: t("calendar.locale") === "uk" ? "uk" : "en",
  }),
  Render: CalendarRender,
});
