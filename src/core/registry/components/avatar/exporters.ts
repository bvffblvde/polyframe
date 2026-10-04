import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { AvatarProps } from "./schema";

export const avatarExporters: ComponentExporters<AvatarProps> = {
  shadcn: ({ props: p }) => {
    const r = p.shape === "square" ? " rounded-md" : "";
    return {
      jsx: `<Avatar className="size-full${r}"><AvatarFallback className="${r.trim() || "rounded-full"}">${text(p.initials)}</AvatarFallback></Avatar>`,
      imports: [{ from: "@/components/ui/avatar", names: ["Avatar", "AvatarFallback"] }],
    };
  },
  mui: ({ props: p }) => ({
    jsx: `<Avatar${p.shape === "square" ? ' variant="rounded"' : ""} sx={{ width: "100%", height: "100%" }}>${text(p.initials)}</Avatar>`,
    imports: [{ from: "@mui/material", names: ["Avatar"] }],
  }),
};
