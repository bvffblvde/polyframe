import { CalendarDays } from "lucide-react";
import { formatDate } from "../../shared/calendar";
import type { RenderProps } from "../../types";
import { Field, FieldValue } from "../input/field";
import type { DatepickerProps } from "./schema";

export function DatepickerRender({ props: p, mode, skin }: RenderProps<DatepickerProps>) {
  return (
    <Field mode={mode} skin={skin} label={p.label} disabled={p.disabled}>
      <FieldValue value={formatDate(p.locale, p.value)} placeholder={p.placeholder} />
      <CalendarDays className="pf-datepicker__icon" aria-hidden />
    </Field>
  );
}
