import type { RenderProps } from "../../types";
import { ButtonShape } from "../button/render";
import type { TooltipProps } from "./schema";

export function TooltipRender({ props }: RenderProps<TooltipProps>) {
  return (
    <div className="pf-tooltip" data-placement={props.placement}>
      <span className="pf-tooltip__bubble">{props.text}</span>
      {props.trigger && <ButtonShape label={props.trigger} variant="outline" size="sm" />}
    </div>
  );
}
