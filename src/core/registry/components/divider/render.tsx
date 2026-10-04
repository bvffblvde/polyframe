import type { RenderProps } from "../../types";
import type { DividerProps } from "./schema";

export function DividerRender({ props }: RenderProps<DividerProps>) {
  const labeled = props.orientation === "horizontal" && props.label;
  return (
    <div className="pf-divider" data-orientation={props.orientation}>
      <span className="pf-divider__line" />
      {labeled && <span className="pf-divider__label">{props.label}</span>}
      {labeled && <span className="pf-divider__line" />}
    </div>
  );
}
