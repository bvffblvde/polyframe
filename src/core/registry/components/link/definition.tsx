import { Link } from "lucide-react";
import { defineComponent } from "../../types";
import { LinkRender } from "./render";
import { linkSchema } from "./schema";

export const linkDefinition = defineComponent(linkSchema)({
  type: "link",
  category: "typography",
  labelKey: "components.link",
  keywords: ["link", "anchor", "url", "href", "посилання", "лінк"],
  icon: Link,
  defaultSize: { w: 120, h: 24 },
  minSize: { w: 16, h: 12 },
  defaultProps: (t) => ({ text: t("link.text"), underline: true }),
  Render: LinkRender,
});
