import type { RenderProps } from "../../types";
import type { SpinnerProps } from "./schema";

export function SpinnerRender({ props }: RenderProps<SpinnerProps>) {
  return (
    <div className="pf-spinner" data-size={props.size}>
      <span className="pf-spinner__ring" />
      {props.label && <span className="pf-spinner__label">{props.label}</span>}
    </div>
  );
}
