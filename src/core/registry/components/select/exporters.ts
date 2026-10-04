import { bool, str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { SelectProps } from "./schema";

export const selectExporters: ComponentExporters<SelectProps> = {
  shadcn: ({ props: p }, ctx) => {
    const options = p.options.filter(Boolean);
    const value = options.includes(p.value) ? p.value : "";
    return {
      jsx: [
        '<div className="grid w-full gap-2">',
        p.label && `<Label htmlFor="${ctx.uid}">${text(p.label)}</Label>`,
        `<Select${value ? ` defaultValue=${str(value)}` : ""}${bool("disabled", p.disabled)}>`,
        `<SelectTrigger id="${ctx.uid}" className="w-full"><SelectValue${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""} /></SelectTrigger>`,
        `<SelectContent>${options.map((o) => `<SelectItem value=${str(o)}>${text(o)}</SelectItem>`).join("")}</SelectContent>`,
        "</Select>",
        "</div>",
      ]
        .filter(Boolean)
        .join("\n"),
      imports: [
        { from: "@/components/ui/select", names: ["Select", "SelectContent", "SelectItem", "SelectTrigger", "SelectValue"] },
        ...(p.label ? [{ from: "@/components/ui/label", names: ["Label"] }] : []),
      ],
    };
  },
  mui: ({ props: p }, ctx) => {
    const options = p.options.filter(Boolean);
    const value = options.includes(p.value) ? p.value : "";
    return {
      jsx: [
        `<FormControl fullWidth${bool("disabled", p.disabled)}>`,
        `<InputLabel id="${ctx.uid}-label">${text(p.label)}</InputLabel>`,
        `<Select labelId="${ctx.uid}-label" label=${str(p.label)} defaultValue=${str(value)}>`,
        ...options.map((o) => `<MenuItem value=${str(o)}>${text(o)}</MenuItem>`),
        "</Select>",
        "</FormControl>",
      ].join("\n"),
      imports: [{ from: "@mui/material", names: ["FormControl", "InputLabel", "MenuItem", "Select"] }],
    };
  },
};
