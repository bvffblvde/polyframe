import type { ReactNode } from "react";
import type { Mode, SkinId } from "../../../document/types";
import { skinStructure } from "../../../skins";

interface FieldProps {
  mode: Mode;
  skin: SkinId;
  label: string;
  helperText?: string;
  invalid?: boolean;
  disabled?: boolean;
  size?: string;
  multiline?: boolean;
  children: ReactNode;
}

export function Field({ mode, skin, label, helperText, invalid, disabled, size, multiline, children }: FieldProps) {
  const floating = skinStructure(mode, skin).inputLabel === "floating";
  return (
    <div className="pf-field" data-label={floating ? "floating" : "above"} data-multiline={multiline || undefined}>
      {label && !floating && <span className="pf-field__label">{label}</span>}
      <div
        className="pf-input"
        data-size={size}
        data-invalid={invalid || undefined}
        data-disabled={disabled || undefined}
      >
        {label && floating && <span className="pf-input__notch">{label}</span>}
        {children}
      </div>
      {helperText && (
        <span className="pf-field__help" data-invalid={invalid || undefined}>
          {helperText}
        </span>
      )}
    </div>
  );
}

export function FieldValue({ value, placeholder }: { value: string; placeholder: string }) {
  return value ? (
    <span className="pf-input__value">{value}</span>
  ) : (
    <span className="pf-input__placeholder">{placeholder}</span>
  );
}
