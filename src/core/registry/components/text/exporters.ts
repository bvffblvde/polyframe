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
};
