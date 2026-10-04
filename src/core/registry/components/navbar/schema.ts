import { z } from "zod";

export const navbarSchema = z.object({
  brand: z.string(),
  links: z.array(z.string()),
  actionLabel: z.string(),
  showAvatar: z.boolean(),
});
export type NavbarProps = z.infer<typeof navbarSchema>;
