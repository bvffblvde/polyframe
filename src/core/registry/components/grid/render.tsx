import type { RenderProps } from "../../types";
import type { GridProps } from "./schema";

export function GridRender({ props }: RenderProps<GridProps>) {
  return <div className="pf-stack" data-background={props.background} />;
}
