import type { RenderProps } from "../../types";
import type { CheckboxProps } from "./schema";

export function CheckboxRender({ props }: RenderProps<CheckboxProps>) {
  return (
    <div className="pf-choice" data-disabled={props.disabled || undefined}>
      <span className="pf-check" data-checked={props.checked || undefined} />
      <span>{props.label}</span>
    </div>
  );
}
