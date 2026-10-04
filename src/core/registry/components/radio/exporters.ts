import { bool, str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { RadioProps } from "./schema";

export const radioExporters: ComponentExporters<RadioProps> = {
  shadcn: ({ props: p }, ctx) => ({
    jsx: [
      '<div className="grid gap-3">',
      p.label && `<Label>${text(p.label)}</Label>`,
      `<RadioGroup defaultValue="option-${p.activeIndex}" className="${p.orientation === "horizontal" ? "flex gap-4" : "grid gap-2"}"${bool("disabled", p.disabled)}>`,
      ...p.options.map(
        (o, i) =>
          `<div className="flex items-center gap-2"><RadioGroupItem value="option-${i}" id="${ctx.uid}-${i}" /><Label htmlFor="${ctx.uid}-${i}">${text(o)}</Label></div>`,
      ),
      "</RadioGroup>",
      "</div>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      { from: "@/components/ui/radio-group", names: ["RadioGroup", "RadioGroupItem"] },
      { from: "@/components/ui/label", names: ["Label"] },
    ],
  }),
  mui: ({ props: p }, ctx) => ({
    jsx: [
      `<FormControl${bool("disabled", p.disabled)}>`,
      p.label && `<FormLabel id="${ctx.uid}-label">${text(p.label)}</FormLabel>`,
      `<RadioGroup${p.orientation === "horizontal" ? " row" : ""} defaultValue="option-${p.activeIndex}"${p.label ? ` aria-labelledby="${ctx.uid}-label"` : ""}>`,
      ...p.options.map((o, i) => `<FormControlLabel value="option-${i}" control={<Radio />} label=${str(o)} />`),
      "</RadioGroup>",
      "</FormControl>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@mui/material", names: ["FormControl", "FormControlLabel", "Radio", "RadioGroup", ...(p.label ? ["FormLabel"] : [])] }],
  }),
};
