import type { RenderProps } from "../../types";
import type { MenuProps } from "./schema";

export function MenuRender({ props }: RenderProps<MenuProps>) {
  return (
    <div className="pf-menu">
      {props.items.map((item, i) => (
        <span
          key={i}
          className="pf-menu__item"
          data-active={i === props.activeIndex || undefined}
          data-danger={(props.destructiveLast && i === props.items.length - 1) || undefined}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
