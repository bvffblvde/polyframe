import { Ellipsis } from "lucide-react";
import { paginationExporters } from "./exporters";
import { paginationSvg } from "./svg";
import { defineComponent } from "../../types";
import { PaginationRender } from "./render";
import { paginationSchema } from "./schema";

export const paginationDefinition = defineComponent(paginationSchema)({
  type: "pagination",
  category: "navigation",
  labelKey: "components.pagination",
  keywords: ["pagination", "pages", "pager", "next", "previous", "пагінація", "сторінки", "гортання"],
  icon: Ellipsis,
  defaultSize: { w: 320, h: 36 },
  minSize: { w: 80, h: 20 },
  defaultProps: () => ({ pages: 10, current: 2 }),
  Render: PaginationRender,
  exporters: paginationExporters,
  svg: paginationSvg,
});
