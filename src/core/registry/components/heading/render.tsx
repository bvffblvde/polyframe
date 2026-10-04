import type { RenderProps } from "../../types";
import type { HeadingProps } from "./schema";

export function HeadingRender({ props }: RenderProps<HeadingProps>) {
  return (
    <div className="pf-heading" data-level={props.level} data-align={props.align}>
      {props.text}
    </div>
  );
}
