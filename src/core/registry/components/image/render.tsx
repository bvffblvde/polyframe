import { ImageIcon } from "lucide-react";
import type { RenderProps } from "../../types";
import type { ImageProps } from "./schema";

export function ImageRender({ props }: RenderProps<ImageProps>) {
  return (
    <div className="pf-image" data-rounded={props.rounded || undefined}>
      <svg className="pf-image__cross" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <line x1="0" y1="0" x2="100" y2="100" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" vectorEffect="non-scaling-stroke" />
      </svg>
      <ImageIcon className="pf-image__icon" aria-hidden />
      {props.caption && <span className="pf-image__caption">{props.caption}</span>}
    </div>
  );
}
