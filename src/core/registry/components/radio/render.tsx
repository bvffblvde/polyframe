import type { RenderProps } from "../../types";
import type { RadioProps } from "./schema";

export function RadioRender({ props }: RenderProps<RadioProps>) {
  return (
    <div className="pf-radio-group" data-disabled={props.disabled || undefined}>
      {props.label && <span className="pf-field__label">{props.label}</span>}
      <div className="pf-radio-group__options" data-orientation={props.orientation}>
        {props.options.map((o, i) => (
          <span key={i} className="pf-choice">
            <span className="pf-radio" data-checked={i === props.activeIndex || undefined} />
            <span>{o}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
