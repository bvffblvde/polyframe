import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { ImageProps } from "./schema";

export const imageExporters: ComponentExporters<ImageProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      `<div className="relative flex h-full w-full items-center justify-center bg-muted text-muted-foreground${p.rounded ? " rounded-lg" : ""}">`,
      '<ImageIcon className="size-8" />',
      p.caption && `<span className="absolute bottom-2 left-2 text-xs">${text(p.caption)}</span>`,
      "</div>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "lucide-react", names: ["ImageIcon"] }],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      `<Box sx={{ position: "relative", width: "100%", height: "100%", bgcolor: "grey.200", color: "text.secondary", display: "flex", alignItems: "center", justifyContent: "center"${p.rounded ? ", borderRadius: 2" : ""} }}>`,
      '<ImageIcon fontSize="large" />',
      p.caption && `<Typography variant="caption" sx={{ position: "absolute", left: 8, bottom: 4 }}>${text(p.caption)}</Typography>`,
      "</Box>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      { from: "@mui/material", names: ["Box", ...(p.caption ? ["Typography"] : [])] },
      { from: "@mui/icons-material", names: ["Image as ImageIcon"] },
    ],
  }),
};
