import type { RenderProps } from "../../types";
import type { BoxProps } from "./schema";

export function BoxRender({ props }: RenderProps<BoxProps>) {
  return (
    <div className="pf-box" data-variant={props.variant}>
      {props.label && <span className="pf-box__label">{props.label}</span>}
    </div>
  );
}
