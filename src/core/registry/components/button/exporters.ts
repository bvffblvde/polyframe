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
  mantine: ({ props: p, style }) => {
    const variant = { solid: "filled", outline: "outline", ghost: "subtle" }[p.variant];
    const color = { primary: "", secondary: "grape", neutral: "gray", danger: "red", success: "green" }[style?.colorRole ?? "primary"];
    return {
      jsx: `<Button variant="${variant}" size="${p.size}"${color ? ` color="${color}"` : ""}${bool("disabled", p.disabled)} fullWidth h="100%">${text(p.label)}</Button>`,
      imports: [{ from: "@mantine/core", names: ["Button"] }],
    };
  },
  antd: ({ props: p, style }) => {
    const type = { solid: "primary", outline: "default", ghost: "text" }[p.variant];
    const size = { sm: "small", md: "middle", lg: "large" }[p.size];
    return {
      jsx: `<Button type="${type}" size="${size}"${bool("danger", style?.colorRole === "danger")}${bool("disabled", p.disabled)} block style={{ height: "100%" }}>${text(p.label)}</Button>`,
      imports: [{ from: "antd", names: ["Button"] }],
    };
  },
  bootstrap: ({ props: p, style }) => {
    const color = { primary: "primary", secondary: "secondary", neutral: "light", danger: "danger", success: "success" }[style?.colorRole ?? "primary"];
    const variant = p.variant === "solid" ? color : p.variant === "outline" ? `outline-${color}` : "link";
    return {
      jsx: `<Button variant="${variant}"${p.size === "md" ? "" : ` size="${p.size}"`}${bool("disabled", p.disabled)} className="w-100 h-100">${text(p.label)}</Button>`,
      imports: [{ from: "react-bootstrap", names: ["Button"] }],
    };
  },
  chakra: ({ props: p, style }) => {
    const palette = { primary: "", secondary: "purple", neutral: "gray", danger: "red", success: "green" }[style?.colorRole ?? "primary"];
    return {
      jsx: `<Button variant="${p.variant}" size="${p.size}"${palette ? ` colorPalette="${palette}"` : ""}${bool("disabled", p.disabled)} w="full" h="full">${text(p.label)}</Button>`,
      imports: [{ from: "@chakra-ui/react", names: ["Button"] }],
    };
  },
};
