import type { RenderProps } from "../../types";
import type { AvatarProps } from "./schema";

export function AvatarShape({ initials, shape = "circle" }: Partial<AvatarProps>) {
  return (
    <span className="pf-avatar" data-shape={shape}>
      {initials && <span className="pf-avatar__initials">{initials}</span>}
    </span>
  );
}

export function AvatarRender({ props }: RenderProps<AvatarProps>) {
  return <AvatarShape {...props} />;
}
