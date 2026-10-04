import { PanelsTopLeft } from "lucide-react";
import { tabsExporters } from "./exporters";
import { defineComponent, list } from "../../types";
import { TabsRender } from "./render";
import { tabsSchema } from "./schema";

export const tabsDefinition = defineComponent(tabsSchema)({
  type: "tabs",
  category: "data",
  labelKey: "components.tabs",
  keywords: ["tabs", "tab bar", "segments", "вкладки", "таби"],
  icon: PanelsTopLeft,
  defaultSize: { w: 400, h: 160 },
  minSize: { w: 80, h: 40 },
  defaultProps: (t) => ({ tabs: list(t, "tabs.tabs"), activeIndex: 0, content: t("tabs.content") }),
  Render: TabsRender,
  exporters: tabsExporters,
});
