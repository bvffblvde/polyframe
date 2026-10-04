import type { RenderProps } from "../../types";
import type { LinkProps } from "./schema";

export function LinkRender({ props }: RenderProps<LinkProps>) {
  return (
    <div className="pf-link" data-underline={props.underline || undefined}>
      {props.text}
    </div>
  );
}
