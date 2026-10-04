import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { BoxProps } from "./schema";

export const boxExporters: ComponentExporters<BoxProps> = {
  shadcn: ({ props: p }) => {
    const variant = p.variant === "filled" ? " border-transparent bg-muted" : p.variant === "dashed" ? " border-dashed" : "";
    return {
      jsx: `<div className="flex h-full w-full items-center justify-center rounded-md border${variant} text-sm text-muted-foreground">${text(p.label)}</div>`,
    };
  },
  mui: ({ props: p }) => {
    const sx = [
      'width: "100%"',
      'height: "100%"',
      "borderRadius: 1",
      'display: "flex"',
      'alignItems: "center"',
      'justifyContent: "center"',
      'color: "text.secondary"',
      p.variant === "filled" ? 'bgcolor: "action.hover"' : 'border: 1, borderColor: "divider"',
      p.variant === "dashed" ? 'borderStyle: "dashed"' : "",
    ].filter(Boolean);
    return {
      jsx: `<Box sx={{ ${sx.join(", ")} }}>${text(p.label)}</Box>`,
      imports: [{ from: "@mui/material", names: ["Box"] }],
    };
  },
};
