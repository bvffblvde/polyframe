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
  mantine: ({ props: p }) => ({
    jsx: `<Badge variant="${{ solid: "filled", soft: "light", outline: "outline" }[p.variant]}">${text(p.text)}</Badge>`,
    imports: [{ from: "@mantine/core", names: ["Badge"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Tag${p.variant === "solid" ? ' color="blue"' : p.variant === "soft" ? ' color="processing"' : ""}${p.variant === "outline" ? ' variant="outlined"' : ""}>${text(p.text)}</Tag>`,
    imports: [{ from: "antd", names: ["Tag"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx:
      p.variant === "solid"
        ? `<Badge bg="primary">${text(p.text)}</Badge>`
        : p.variant === "soft"
          ? `<Badge bg="primary-subtle" className="text-primary-emphasis">${text(p.text)}</Badge>`
          : `<Badge bg="light" text="dark" className="border">${text(p.text)}</Badge>`,
    imports: [{ from: "react-bootstrap", names: ["Badge"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: `<Badge variant="${{ solid: "solid", soft: "subtle", outline: "outline" }[p.variant]}" colorPalette="blue">${text(p.text)}</Badge>`,
    imports: [{ from: "@chakra-ui/react", names: ["Badge"] }],
  }),
};
