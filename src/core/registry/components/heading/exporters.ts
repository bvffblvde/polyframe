import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { HeadingProps } from "./schema";

const SHADCN = {
  "1": "text-4xl font-extrabold tracking-tight",
  "2": "text-3xl font-semibold tracking-tight",
  "3": "text-2xl font-semibold tracking-tight",
  "4": "text-xl font-semibold tracking-tight",
} as const;
const MUI = { "1": "h3", "2": "h4", "3": "h5", "4": "h6" } as const;
const ALIGN = { left: "", center: " text-center", right: " text-right" } as const;

export const headingExporters: ComponentExporters<HeadingProps> = {
  shadcn: ({ props: p }) => ({
    jsx: `<h${p.level} className="${SHADCN[p.level]}${ALIGN[p.align]}">${text(p.text)}</h${p.level}>`,
  }),
  mui: ({ props: p }) => ({
    jsx: `<Typography variant="${MUI[p.level]}" component="h${p.level}"${p.align === "left" ? "" : ` align="${p.align}"`}>${text(p.text)}</Typography>`,
    imports: [{ from: "@mui/material", names: ["Typography"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<Title order={${p.level}}${p.align === "left" ? "" : ` ta="${p.align}"`}>${text(p.text)}</Title>`,
    imports: [{ from: "@mantine/core", names: ["Title"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Typography.Title level={${p.level}} style={{ margin: 0${p.align === "left" ? "" : `, textAlign: "${p.align}"`} }}>${text(p.text)}</Typography.Title>`,
    imports: [{ from: "antd", names: ["Typography"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: `<h${p.level} className="mb-0${{ left: "", center: " text-center", right: " text-end" }[p.align]}">${text(p.text)}</h${p.level}>`,
  }),
  chakra: ({ props: p }) => ({
    jsx: `<Heading as="h${p.level}" size="${{ "1": "4xl", "2": "3xl", "3": "2xl", "4": "xl" }[p.level]}"${p.align === "left" ? "" : ` textAlign="${p.align}"`}>${text(p.text)}</Heading>`,
    imports: [{ from: "@chakra-ui/react", names: ["Heading"] }],
  }),
};
