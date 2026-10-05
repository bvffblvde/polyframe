import type { RenderProps } from "../../types";
import type { SegmentedProps } from "./schema";

export function SegmentedRender({ props }: RenderProps<SegmentedProps>) {
  return (
    <div className="pf-seg">
      {props.options.map((o, i) => (
        <span key={i} className="pf-seg__item" data-active={i === props.activeIndex || undefined}>
          {o}
        </span>
      ))}
    </div>
  );
}
