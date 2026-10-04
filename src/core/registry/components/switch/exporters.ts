import { bool, str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { SwitchProps } from "./schema";

export const switchExporters: ComponentExporters<SwitchProps> = {
  shadcn: ({ props: p }, ctx) => ({
    jsx: `<div className="flex h-full items-center gap-2"><Switch id="${ctx.uid}"${bool("defaultChecked", p.checked)}${bool("disabled", p.disabled)} /><Label htmlFor="${ctx.uid}">${text(p.label)}</Label></div>`,
    imports: [
      { from: "@/components/ui/switch", names: ["Switch"] },
      { from: "@/components/ui/label", names: ["Label"] },
    ],
  }),
  mui: ({ props: p }) => ({
    jsx: `<FormControlLabel control={<Switch${bool("defaultChecked", p.checked)} />} label=${str(p.label)}${bool("disabled", p.disabled)} />`,
    imports: [{ from: "@mui/material", names: ["FormControlLabel", "Switch"] }],
  }),
};
