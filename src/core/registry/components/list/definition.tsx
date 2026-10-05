import { List } from "lucide-react";
import { listExporters } from "./exporters";
import { listSvg } from "./svg";
import { defineComponent, list } from "../../types";
import { ListRender } from "./render";
import { listSchema } from "./schema";

export const listDefinition = defineComponent(listSchema)({
  type: "list",
  category: "data",
  labelKey: "components.list",
  keywords: ["list", "items", "contacts", "users", "rows", "список", "елементи", "контакти"],
  icon: List,
  defaultSize: { w: 320, h: 180 },
  minSize: { w: 80, h: 40 },
  defaultProps: (t) => ({ items: list(t, "list.items"), secondary: list(t, "list.secondary"), showAvatar: true, dividers: true }),
  Render: ListRender,
  exporters: listExporters,
  svg: listSvg,
});
