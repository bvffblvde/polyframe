import { z } from "zod";

export const ICON_GLYPHS = ["star", "heart", "home", "user", "settings", "search", "bell", "mail"] as const;

export const iconSchema = z.object({
  glyph: z.enum(ICON_GLYPHS),
});
export type IconProps = z.infer<typeof iconSchema>;
