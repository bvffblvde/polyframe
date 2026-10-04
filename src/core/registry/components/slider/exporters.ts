import { bool, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { SliderProps } from "./schema";

export const sliderExporters: ComponentExporters<SliderProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      '<div className="grid h-full content-center gap-3">',
      (p.label || p.showValue) &&
        `<div className="flex justify-between text-sm"><span className="font-medium">${text(p.label)}</span>${p.showValue ? `<span className="text-muted-foreground">${p.value}</span>` : ""}</div>`,
      `<Slider defaultValue={[${p.value}]} max={100} step={1}${bool("disabled", p.disabled)} />`,
      "</div>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@/components/ui/slider", names: ["Slider"] }],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      '<Box sx={{ width: "100%" }}>',
      p.label && `<Typography gutterBottom>${text(p.label)}</Typography>`,
      `<Slider defaultValue={${p.value}} valueLabelDisplay="${p.showValue ? "auto" : "off"}"${bool("disabled", p.disabled)} />`,
      "</Box>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@mui/material", names: ["Box", "Slider", ...(p.label ? ["Typography"] : [])] }],
  }),
};
