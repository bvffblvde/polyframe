import { fieldShape } from "../../../exporters/svg/shapes";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { InputProps } from "./schema";

export const inputSvg: SvgDrawer<InputProps> = (n, c) =>
  fieldShape(n.w, n.h, c, {
    label: n.props.label,
    value: n.props.value,
    placeholder: n.props.placeholder,
    helper: n.props.helperText,
    invalid: n.props.invalid,
    disabled: n.props.disabled,
  });
