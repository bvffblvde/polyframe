import { Tag } from "lucide-react";
import { defineComponent } from "../../types";
import { BadgeRender } from "./render";
import { badgeSchema } from "./schema";

export const badgeDefinition = defineComponent(badgeSchema)({
  type: "badge",
  category: "typography",
  labelKey: "components.badge",
  keywords: ["badge", "tag", "chip", "label", "status", "бейдж", "мітка", "тег", "статус"],
  icon: Tag,
  defaultSize: { w: 64, h: 24 },
  minSize: { w: 16, h: 12 },
  defaultProps: (t) => ({ text: t("badge.text"), variant: "solid" }),
  Render: BadgeRender,
});
