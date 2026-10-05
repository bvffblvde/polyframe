import type { RenderProps } from "../../types";
import type { StackProps } from "./schema";

export function StackRender({ props }: RenderProps<StackProps>) {
  return <div className="pf-stack" data-background={props.background} />;
}
