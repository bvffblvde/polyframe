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
};
