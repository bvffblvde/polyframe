import { at } from "../../shared/text";
import type { RenderProps } from "../../types";
import type { TimelineProps } from "./schema";

export function TimelineRender({ props }: RenderProps<TimelineProps>) {
  return (
    <div className="pf-timeline">
      {props.events.map((e, i) => (
        <div key={i} className="pf-timeline__item" data-done={i <= props.activeIndex || undefined}>
          <span className="pf-timeline__dot" />
          <span className="pf-timeline__title">{e}</span>
          <span className="pf-timeline__date">{at(props.dates, i, "")}</span>
        </div>
      ))}
    </div>
  );
}
