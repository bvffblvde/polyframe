import { path } from "../../../exporters/svg/primitives";
import { fieldShape } from "../../../exporters/svg/shapes";
import type { SvgDrawer } from "../../../exporters/svg/types";
import { formatDate } from "../../shared/calendar";
import type { DatepickerProps } from "./schema";

export const datepickerSvg: SvgDrawer<DatepickerProps> = (n, c) => {
  const p = n.props;
  const field = fieldShape(n.w, n.h, c, { label: p.label, value: formatDate(p.locale, p.value), placeholder: p.placeholder, disabled: p.disabled });
  const floating = c.structure.inputLabel === "floating";
  const cy = (p.label && !floating ? 26 : floating ? 8 : 0) + (c.t.controlH - (floating ? 8 : 0)) / 2;
  const x = n.w - 28;
  return field + path(`M${x} ${cy - 6} h16 v13 h-16 z M${x} ${cy - 2} h16 M${x + 4} ${cy - 8} v4 M${x + 12} ${cy - 8} v4`, { stroke: c.t.textMuted, sw: 1.5 });
};
