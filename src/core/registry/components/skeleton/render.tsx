import type { RenderProps } from "../../types";
import type { SkeletonProps } from "./schema";

export function SkeletonRender({ props }: RenderProps<SkeletonProps>) {
  return (
    <div className="pf-skeleton">
      {props.showAvatar && <span className="pf-skeleton__circle" />}
      <span className="pf-skeleton__lines">
        {Array.from({ length: props.lines }, (_, i) => (
          <span key={i} className="pf-skeleton__line" data-last={(i === props.lines - 1 && props.lines > 1) || undefined} />
        ))}
      </span>
    </div>
  );
}
