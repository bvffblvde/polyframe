import { fieldShape } from "../../../exporters/svg/shapes";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { TextareaProps } from "./schema";

export const textareaSvg: SvgDrawer<TextareaProps> = (n, c) =>
  fieldShape(n.w, n.h, c, {
    label: n.props.label,
    value: n.props.value,
    placeholder: n.props.placeholder,
    disabled: n.props.disabled,
    multiline: true,
  });
