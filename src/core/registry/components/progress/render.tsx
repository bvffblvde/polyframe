import type { RenderProps } from "../../types";
import type { ProgressProps } from "./schema";

export function ProgressRender({ props }: RenderProps<ProgressProps>) {
  const pct = Math.min(100, Math.max(0, props.value));
  return (
    <div className="pf-progress">
      {(props.label || props.showValue) && (
        <span className="pf-meter__head">
          <span className="pf-field__label">{props.label}</span>
          {props.showValue && <span className="pf-meter__value">{pct}%</span>}
        </span>
      )}
      <span className="pf-progress__track">
        <span className="pf-progress__fill" style={{ width: `${pct}%` }} />
      </span>
    </div>
  );
}
