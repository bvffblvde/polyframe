import { pageList } from "../../shared/pages";
import type { RenderProps } from "../../types";
import type { PaginationProps } from "./schema";

export function PaginationRender({ props }: RenderProps<PaginationProps>) {
  return (
    <div className="pf-pager">
      <span className="pf-pager__item">‹</span>
      {pageList(props.pages, props.current).map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e${i}`} className="pf-pager__gap">
            …
          </span>
        ) : (
          <span key={p} className="pf-pager__item" data-active={p === props.current || undefined}>
            {p}
          </span>
        ),
      )}
      <span className="pf-pager__item">›</span>
    </div>
  );
}
