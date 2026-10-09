import { ChevronsUpDown } from "lucide-react";
import { defineComponent, list } from "../../types";
import { AccordionRender } from "./render";
import { accordionSchema } from "./schema";

export const accordionDefinition = defineComponent(accordionSchema)({
  type: "accordion",
  category: "data",
  labelKey: "components.accordion",
  keywords: ["accordion", "collapse", "faq", "expand", "акордеон", "розгортання", "питання"],
  icon: ChevronsUpDown,
  defaultSize: { w: 400, h: 200 },
  minSize: { w: 120, h: 48 },
  defaultProps: (t) => ({ items: list(t, "accordion.items"), content: t("accordion.content"), openIndex: 0 }),
  Render: AccordionRender,
});
