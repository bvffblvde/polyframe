import { CircleUser } from "lucide-react";
import { avatarExporters } from "./exporters";
import { defineComponent } from "../../types";
import { AvatarRender } from "./render";
import { avatarSchema } from "./schema";

export const avatarDefinition = defineComponent(avatarSchema)({
  type: "avatar",
  category: "media",
  labelKey: "components.avatar",
  keywords: ["avatar", "user", "profile", "photo", "аватар", "користувач", "профіль"],
  icon: CircleUser,
  defaultSize: { w: 48, h: 48 },
  minSize: { w: 16, h: 16 },
  defaultProps: (t) => ({ initials: t("avatar.initials"), shape: "circle" }),
  Render: AvatarRender,
  exporters: avatarExporters,
});
