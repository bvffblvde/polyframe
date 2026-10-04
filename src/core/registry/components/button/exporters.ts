import { bool, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { ButtonProps } from "./schema";

const MUI_VARIANT = { solid: "contained", outline: "outlined", ghost: "text" } as const;
const MUI_SIZE = { sm: "small", md: "medium", lg: "large" } as const;
const MUI_COLOR = { primary: "primary", secondary: "secondary", neutral: "inherit", danger: "error", success: "success" } as const;

export const buttonExporters: ComponentExporters<ButtonProps> = {
  shadcn: ({ props: p, style }) => {
    const role = style?.colorRole;
    let variant: string = p.variant === "solid" ? "default" : p.variant;
    if (p.variant === "solid" && role === "danger") variant = "destructive";
    if (p.variant === "solid" && (role === "secondary" || role === "neutral")) variant = "secondary";
    const size = p.size === "md" ? "" : ` size="${p.size}"`;
    return {
      jsx: `<Button className="h-full w-full"${variant === "default" ? "" : ` variant="${variant}"`}${size}${bool("disabled", p.disabled)}>${text(p.label)}</Button>`,
      imports: [{ from: "@/components/ui/button", names: ["Button"] }],
    };
  },
  mui: ({ props: p, style }) => {
    const color = style?.colorRole ? ` color="${MUI_COLOR[style.colorRole]}"` : "";
    return {
      jsx: `<Button variant="${MUI_VARIANT[p.variant]}" size="${MUI_SIZE[p.size]}"${color}${bool("disabled", p.disabled)} fullWidth sx={{ height: "100%" }}>${text(p.label)}</Button>`,
      imports: [{ from: "@mui/material", names: ["Button"] }],
    };
  },
};
