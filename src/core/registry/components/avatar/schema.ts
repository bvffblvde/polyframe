import { z } from "zod";

export const avatarSchema = z.object({
  initials: z.string().max(3),
  shape: z.enum(["circle", "square"]),
});
export type AvatarProps = z.infer<typeof avatarSchema>;
