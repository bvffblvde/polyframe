import { paragraph } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { HeadingProps } from "./schema";

export const headingSvg: SvgDrawer<HeadingProps> = (n, c) => {
  const p = n.props;
  const size = { "1": 36, "2": 30, "3": 24, "4": 20 }[p.level];
  const anchor = { left: "start", center: "middle", right: "end" }[p.align] as
    "start" | "middle" | "end";
  return paragraph(
    0,
    0,
    p.text,
    n.w,
    n.h,
    { size, weight: c.t.headingWeight, fill: c.t.text, anchor, family: c.family },
    1.2,
  );
};
