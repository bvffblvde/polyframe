import type { RenderProps } from "../../types";
import type { SliderProps } from "./schema";

export function SliderRender({ props }: RenderProps<SliderProps>) {
  const pct = `${Math.min(100, Math.max(0, props.value))}%`;
  return (
    <div className="pf-slider" data-disabled={props.disabled || undefined}>
      {(props.label || props.showValue) && (
        <span className="pf-meter__head">
          <span className="pf-field__label">{props.label}</span>
          {props.showValue && <span className="pf-meter__value">{props.value}</span>}
        </span>
      )}
      <span className="pf-slider__track">
        <span className="pf-slider__fill" style={{ width: pct }} />
        <span className="pf-slider__thumb" style={{ left: pct }} />
      </span>
    </div>
  );
}
