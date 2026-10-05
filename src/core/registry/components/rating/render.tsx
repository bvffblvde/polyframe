import { Star } from "lucide-react";
import type { RenderProps } from "../../types";
import type { RatingProps } from "./schema";

export function RatingRender({ props }: RenderProps<RatingProps>) {
  return (
    <div className="pf-rating">
      {Array.from({ length: props.count }, (_, i) => (
        <Star key={i} className="pf-rating__star" data-on={i < Math.round(props.value) || undefined} aria-hidden />
      ))}
    </div>
  );
}
