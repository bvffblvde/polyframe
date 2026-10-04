import { skinStructure } from "../../../skins";
import type { RenderProps } from "../../types";
import type { SwitchProps } from "./schema";

export function SwitchRender({ props, mode, skin }: RenderProps<SwitchProps>) {
  return (
    <div className="pf-choice" data-disabled={props.disabled || undefined}>
      <span
        className="pf-switch"
        data-style={skinStructure(mode, skin).switch}
        data-checked={props.checked || undefined}
      >
        <span className="pf-switch__thumb" />
      </span>
      <span>{props.label}</span>
    </div>
  );
}
