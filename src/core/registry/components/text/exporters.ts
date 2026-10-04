import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { TextProps } from "./schema";

const SIZE = { sm: "text-sm", md: "text-base", lg: "text-lg" } as const;
const ALIGN = { left: "", center: " text-center", right: " text-right" } as const;
const MUI = { sm: "body2", md: "body1", lg: "subtitle1" } as const;

export const textExporters: ComponentExporters<TextProps> = {
  shadcn: ({ props: p }) => ({
    jsx: `<p className="whitespace-pre-line leading-7 ${SIZE[p.size]}${p.muted ? " text-muted-foreground" : ""}${ALIGN[p.align]}">${text(p.text)}</p>`,
  }),
  mui: ({ props: p }) => ({
    jsx: `<Typography variant="${MUI[p.size]}"${p.muted ? ' color="text.secondary"' : ""}${p.align === "left" ? "" : ` align="${p.align}"`} sx={{ whiteSpace: "pre-line" }}>${text(p.text)}</Typography>`,
    imports: [{ from: "@mui/material", names: ["Typography"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<Text size="${p.size}"${p.muted ? ' c="dimmed"' : ""}${p.align === "left" ? "" : ` ta="${p.align}"`} style={{ whiteSpace: "pre-line" }}>${text(p.text)}</Text>`,
    imports: [{ from: "@mantine/core", names: ["Text"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Typography.Paragraph${p.muted ? ' type="secondary"' : ""} style={{ margin: 0, whiteSpace: "pre-line", fontSize: ${{ sm: 12, md: 14, lg: 16 }[p.size]}${p.align === "left" ? "" : `, textAlign: "${p.align}"`} }}>${text(p.text)}</Typography.Paragraph>`,
    imports: [{ from: "antd", names: ["Typography"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: `<p className="mb-0${{ sm: " small", md: "", lg: " fs-5" }[p.size]}${p.muted ? " text-secondary" : ""}${{ left: "", center: " text-center", right: " text-end" }[p.align]}" style={{ whiteSpace: "pre-line" }}>${text(p.text)}</p>`,
  }),
  chakra: ({ props: p }) => ({
    jsx: `<Text textStyle="${p.size}"${p.muted ? ' color="fg.muted"' : ""}${p.align === "left" ? "" : ` textAlign="${p.align}"`} whiteSpace="pre-line">${text(p.text)}</Text>`,
    imports: [{ from: "@chakra-ui/react", names: ["Text"] }],
  }),
};
