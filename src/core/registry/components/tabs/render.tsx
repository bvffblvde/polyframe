import { skinStructure } from "../../../skins";
import type { RenderProps } from "../../types";
import type { TabsProps } from "./schema";

export function TabsRender({ props, mode, skin }: RenderProps<TabsProps>) {
  return (
    <div className="pf-tabs" data-style={skinStructure(mode, skin).tabs}>
      <div className="pf-tabs__list">
        {props.tabs.map((tab, i) => (
          <span key={i} className="pf-tabs__tab" data-active={i === props.activeIndex || undefined}>
            {tab}
          </span>
        ))}
      </div>
      <div className="pf-tabs__panel">{props.content}</div>
    </div>
  );
}
