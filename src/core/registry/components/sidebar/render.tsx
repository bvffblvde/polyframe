import type { RenderProps } from "../../types";
import type { SidebarProps } from "./schema";

export function SidebarRender({ props }: RenderProps<SidebarProps>) {
  return (
    <div className="pf-sidebar">
      {props.title && <div className="pf-sidebar__title">{props.title}</div>}
      {props.items.map((item, i) => (
        <div key={i} className="pf-sidebar__item" data-active={i === props.activeIndex || undefined}>
          {item}
        </div>
      ))}
    </div>
  );
}
