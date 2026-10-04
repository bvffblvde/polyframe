import { bool, str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { CheckboxProps } from "./schema";

export const checkboxExporters: ComponentExporters<CheckboxProps> = {
  shadcn: ({ props: p }, ctx) => ({
    jsx: `<div className="flex h-full items-center gap-2"><Checkbox id="${ctx.uid}"${bool("defaultChecked", p.checked)}${bool("disabled", p.disabled)} /><Label htmlFor="${ctx.uid}">${text(p.label)}</Label></div>`,
    imports: [
      { from: "@/components/ui/checkbox", names: ["Checkbox"] },
      { from: "@/components/ui/label", names: ["Label"] },
    ],
  }),
  mui: ({ props: p }) => ({
    jsx: `<FormControlLabel control={<Checkbox${bool("defaultChecked", p.checked)} />} label=${str(p.label)}${bool("disabled", p.disabled)} />`,
    imports: [{ from: "@mui/material", names: ["Checkbox", "FormControlLabel"] }],
  }),
};
