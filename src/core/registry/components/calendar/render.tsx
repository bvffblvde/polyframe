import { monthGrid, monthTitle, weekdayNames } from "../../shared/calendar";
import type { RenderProps } from "../../types";
import type { CalendarProps } from "./schema";

export function CalendarRender({ props: p }: RenderProps<CalendarProps>) {
  return (
    <div className="pf-calendar">
      <div className="pf-calendar__header">
        <span className="pf-calendar__nav">‹</span>
        <span className="pf-calendar__title">{monthTitle(p.locale, p.year, p.month)}</span>
        <span className="pf-calendar__nav">›</span>
      </div>
      <div className="pf-calendar__grid">
        {weekdayNames(p.locale, p.weekStart).map((d) => (
          <span key={d} className="pf-calendar__weekday">
            {d}
          </span>
        ))}
        {monthGrid(p.year, p.month, p.weekStart).map((c, i) => (
          <span key={i} className="pf-calendar__day" data-outside={!c.inMonth || undefined} data-selected={(c.inMonth && c.day === p.selected) || undefined}>
            {c.day}
          </span>
        ))}
      </div>
    </div>
  );
}
