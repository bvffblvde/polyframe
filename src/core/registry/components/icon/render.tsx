import { Bell, Heart, House, Mail, Search, Settings, Star, User, type LucideIcon } from "lucide-react";
import type { RenderProps } from "../../types";
import type { IconProps } from "./schema";

const GLYPHS: Record<IconProps["glyph"], LucideIcon> = {
  star: Star,
  heart: Heart,
  home: House,
  user: User,
  settings: Settings,
  search: Search,
  bell: Bell,
  mail: Mail,
};

export function IconRender({ props }: RenderProps<IconProps>) {
  const Glyph = GLYPHS[props.glyph] ?? Star;
  return (
    <div className="pf-icon">
      <Glyph aria-hidden />
    </div>
  );
}
