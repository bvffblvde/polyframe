import { PanelLeft } from "lucide-react";
import { sidebarExporters } from "./exporters";
import { sidebarSvg } from "./svg";
import { defineComponent, list } from "../../types";
import { SidebarRender } from "./render";
import { sidebarSchema } from "./schema";

export const sidebarDefinition = defineComponent(sidebarSchema)({
  type: "sidebar",
  category: "layout",
  labelKey: "components.sidebar",
  keywords: ["sidebar", "side menu", "navigation", "drawer", "бічна панель", "сайдбар", "меню"],
  icon: PanelLeft,
  defaultSize: { w: 240, h: 480 },
  minSize: { w: 80, h: 80 },
  defaultProps: (t) => ({ title: t("sidebar.title"), items: list(t, "sidebar.items"), activeIndex: 0 }),
  Render: SidebarRender,
  exporters: sidebarExporters,
  svg: sidebarSvg,
});
