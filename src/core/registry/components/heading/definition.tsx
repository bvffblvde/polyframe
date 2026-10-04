import { Heading } from "lucide-react";
import { headingExporters } from "./exporters";
import { headingSvg } from "./svg";
import { defineComponent } from "../../types";
import { HeadingRender } from "./render";
import { headingSchema } from "./schema";

export const headingDefinition = defineComponent(headingSchema)({
  type: "heading",
  category: "typography",
  labelKey: "components.heading",
  keywords: ["heading", "title", "h1", "h2", "header", "заголовок", "назва"],
  icon: Heading,
  defaultSize: { w: 360, h: 48 },
  minSize: { w: 20, h: 16 },
  defaultProps: (t) => ({ text: t("heading.text"), level: "2", align: "left" }),
  Render: HeadingRender,
  exporters: headingExporters,
  svg: headingSvg,
});
