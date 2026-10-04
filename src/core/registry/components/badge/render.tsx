import type { RenderProps } from "../../types";
import type { BadgeProps } from "./schema";

export function BadgeRender({ props }: RenderProps<BadgeProps>) {
  return (
    <div className="pf-badge" data-variant={props.variant}>
      {props.text}
    </div>
  );
}
