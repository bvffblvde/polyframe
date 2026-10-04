import type { RenderProps } from "../../types";
import type { ButtonProps } from "./schema";

export function ButtonShape({ label, variant = "solid", size = "md", disabled = false }: Partial<ButtonProps>) {
  return (
    <span className="pf-btn" data-variant={variant} data-size={size} data-disabled={disabled || undefined}>
      {label}
    </span>
  );
}

export function ButtonRender({ props }: RenderProps<ButtonProps>) {
  return (
    <div className="pf-fill pf-btn-wrap">
      <ButtonShape {...props} />
    </div>
  );
}
