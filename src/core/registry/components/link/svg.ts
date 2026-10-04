import { text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { LinkProps } from "./schema";

export const linkSvg: SvgDrawer<LinkProps> = (n, c) =>
  text(0, n.h / 2, n.props.text, {
    size: c.t.fontSize,
    fill: c.mode === "wireframe" ? c.t.text : c.accent,
    decoration: n.props.underline ? "underline" : undefined,
    family: c.family,
  });
