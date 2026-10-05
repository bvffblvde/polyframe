import { Fragment } from "react";
import type { RenderProps } from "../../types";
import type { BreadcrumbsProps } from "./schema";

export function BreadcrumbsRender({ props }: RenderProps<BreadcrumbsProps>) {
  return (
    <div className="pf-crumbs">
      {props.items.map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="pf-crumbs__sep">{props.separator === "slash" ? "/" : "›"}</span>}
          <span className="pf-crumbs__item" data-current={i === props.items.length - 1 || undefined}>
            {item}
          </span>
        </Fragment>
      ))}
    </div>
  );
}
