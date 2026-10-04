import type { RenderProps } from "../../types";
import { AvatarShape } from "../avatar/render";
import { ButtonShape } from "../button/render";
import type { NavbarProps } from "./schema";

export function NavbarRender({ props }: RenderProps<NavbarProps>) {
  return (
    <div className="pf-navbar">
      <span className="pf-navbar__brand">{props.brand}</span>
      <span className="pf-navbar__links">
        {props.links.map((l, i) => (
          <span key={i} className="pf-navbar__link" data-active={i === 0 || undefined}>
            {l}
          </span>
        ))}
      </span>
      <span className="pf-navbar__end">
        {props.actionLabel && <ButtonShape label={props.actionLabel} size="sm" />}
        {props.showAvatar && <AvatarShape initials="" />}
      </span>
    </div>
  );
}
