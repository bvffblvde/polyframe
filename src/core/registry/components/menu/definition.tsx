import { Menu } from "lucide-react";
import { defineComponent, list } from "../../types";
import { MenuRender } from "./render";
import { menuSchema } from "./schema";

export const menuDefinition = defineComponent(menuSchema)({
  type: "menu",
  category: "navigation",
  labelKey: "components.menu",
  keywords: ["menu", "dropdown", "context menu", "options", "actions", "меню", "випадаюче", "дії"],
  icon: Menu,
  defaultSize: { w: 220, h: 156 },
  minSize: { w: 80, h: 40 },
  defaultProps: (t) => ({ items: list(t, "menu.items"), activeIndex: 0, destructiveLast: true }),
  Render: MenuRender,
});
