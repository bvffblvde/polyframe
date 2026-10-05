import { Users } from "lucide-react";
import { avatargroupExporters } from "./exporters";
import { avatargroupSvg } from "./svg";
import { defineComponent, list } from "../../types";
import { AvatargroupRender } from "./render";
import { avatargroupSchema } from "./schema";

export const avatargroupDefinition = defineComponent(avatargroupSchema)({
  type: "avatargroup",
  category: "media",
  labelKey: "components.avatargroup",
  keywords: ["avatar group", "avatars", "team", "people", "members", "група аватарів", "команда", "учасники"],
  icon: Users,
  defaultSize: { w: 160, h: 40 },
  minSize: { w: 24, h: 16 },
  defaultProps: (t) => ({ initials: list(t, "avatargroup.initials"), max: 3 }),
  Render: AvatargroupRender,
  exporters: avatargroupExporters,
  svg: avatargroupSvg,
});
