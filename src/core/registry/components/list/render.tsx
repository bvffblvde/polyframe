import { at, initialsOf } from "../../shared/text";
import type { RenderProps } from "../../types";
import type { ListProps } from "./schema";

export function ListRender({ props }: RenderProps<ListProps>) {
  return (
    <div className="pf-list" data-dividers={props.dividers || undefined}>
      {props.items.map((item, i) => (
        <div key={i} className="pf-list__row">
          {props.showAvatar && (
            <span className="pf-avatar pf-list__avatar" data-shape="circle">
              <span className="pf-avatar__initials">{initialsOf(item)}</span>
            </span>
          )}
          <span className="pf-list__text">
            <span className="pf-list__primary">{item}</span>
            {at(props.secondary, i, "") && <span className="pf-list__secondary">{props.secondary[i]}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}
