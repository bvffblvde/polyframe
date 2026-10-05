import { ChevronsRight } from "lucide-react";
import { breadcrumbsExporters } from "./exporters";
import { breadcrumbsSvg } from "./svg";
import { defineComponent, list } from "../../types";
import { BreadcrumbsRender } from "./render";
import { breadcrumbsSchema } from "./schema";

export const breadcrumbsDefinition = defineComponent(breadcrumbsSchema)({
  type: "breadcrumbs",
  category: "navigation",
  labelKey: "components.breadcrumbs",
  keywords: ["breadcrumbs", "path", "navigation", "trail", "хлібні крихти", "шлях", "навігація"],
  icon: ChevronsRight,
  defaultSize: { w: 320, h: 24 },
  minSize: { w: 40, h: 16 },
  defaultProps: (t) => ({ items: list(t, "breadcrumbs.items"), separator: "slash" }),
  Render: BreadcrumbsRender,
  exporters: breadcrumbsExporters,
  svg: breadcrumbsSvg,
});
