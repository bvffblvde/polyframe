import { buttonShape } from "../../../exporters/svg/shapes";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { ButtonProps } from "./schema";

export const buttonSvg: SvgDrawer<ButtonProps> = (n, c) =>
  buttonShape(0, 0, n.w, n.h, n.props.label, c, {
    variant: n.props.variant,
    size: { sm: 13, md: 14, lg: 16 }[n.props.size],
    disabled: n.props.disabled,
  });
