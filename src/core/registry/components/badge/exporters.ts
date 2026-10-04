import { str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { BadgeProps } from "./schema";

const SHADCN = { solid: "default", soft: "secondary", outline: "outline" } as const;

export const badgeExporters: ComponentExporters<BadgeProps> = {
  shadcn: ({ props: p, style }) => {
    const variant = style?.colorRole === "danger" && p.variant === "solid" ? "destructive" : SHADCN[p.variant];
    return {
      jsx: `<Badge${variant === "default" ? "" : ` variant="${variant}"`}>${text(p.text)}</Badge>`,
      imports: [{ from: "@/components/ui/badge", names: ["Badge"] }],
    };
  },
  mui: ({ props: p }) => ({
    jsx: `<Chip label=${str(p.text)} size="small"${p.variant === "soft" ? "" : ' color="primary"'}${p.variant === "outline" ? ' variant="outlined"' : ""} />`,
    imports: [{ from: "@mui/material", names: ["Chip"] }],
  }),
};
