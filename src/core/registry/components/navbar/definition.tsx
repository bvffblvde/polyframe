import { PanelTop } from "lucide-react";
import { defineComponent, list } from "../../types";
import { NavbarRender } from "./render";
import { navbarSchema } from "./schema";

export const navbarDefinition = defineComponent(navbarSchema)({
  type: "navbar",
  category: "layout",
  labelKey: "components.navbar",
  keywords: ["navbar", "header", "navigation", "menu", "topbar", "шапка", "навігація", "меню"],
  icon: PanelTop,
  defaultSize: { w: 960, h: 64 },
  minSize: { w: 120, h: 32 },
  defaultProps: (t) => ({
    brand: t("navbar.brand"),
    links: list(t, "navbar.links"),
    actionLabel: t("navbar.action"),
    showAvatar: false,
  }),
  Render: NavbarRender,
});
