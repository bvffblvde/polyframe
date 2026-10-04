import { rect, text } from "../../../exporters/svg/primitives";
import type { SvgDrawer } from "../../../exporters/svg/types";
import type { AvatarProps } from "./schema";

export const avatarSvg: SvgDrawer<AvatarProps> = (n, c) => {
  const p = n.props;
  const wire = c.mode === "wireframe";
  const shape =
    p.shape === "square"
      ? rect(0, 0, n.w, n.h, {
          fill: wire ? c.t.mutedBg : c.t.neutral,
          stroke: wire ? c.t.border : undefined,
          r: c.radius,
        })
      : `<ellipse cx="${n.w / 2}" cy="${n.h / 2}" rx="${n.w / 2}" ry="${n.h / 2}" fill="${wire ? c.t.mutedBg : c.t.neutral}"${wire ? ` stroke="${c.t.border}"` : ""}/>`;
  return (
    shape +
    text(n.w / 2, n.h / 2, p.initials, {
      size: n.h * 0.4,
      weight: 600,
      fill: c.t.neutralFg,
      anchor: "middle",
      family: c.family,
    })
  );
};
