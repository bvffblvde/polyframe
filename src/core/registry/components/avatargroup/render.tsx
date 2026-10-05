import type { RenderProps } from "../../types";
import type { AvatargroupProps } from "./schema";

export function AvatargroupRender({ props }: RenderProps<AvatargroupProps>) {
  const shown = props.initials.slice(0, props.max);
  const rest = props.initials.length - shown.length;
  return (
    <div className="pf-avatars">
      {shown.map((a, i) => (
        <span key={i} className="pf-avatar pf-avatars__item" data-shape="circle">
          <span className="pf-avatar__initials">{a}</span>
        </span>
      ))}
      {rest > 0 && (
        <span className="pf-avatar pf-avatars__item" data-shape="circle" data-more>
          <span className="pf-avatar__initials">+{rest}</span>
        </span>
      )}
    </div>
  );
}
