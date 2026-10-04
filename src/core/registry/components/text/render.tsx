import type { RenderProps } from "../../types";
import type { TextProps } from "./schema";

export function TextRender({ props }: RenderProps<TextProps>) {
  return (
    <div className="pf-text" data-size={props.size} data-align={props.align} data-muted={props.muted || undefined}>
      {props.text}
    </div>
  );
}
