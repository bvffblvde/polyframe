import { bool, str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { InputProps } from "./schema";

const HEIGHT = { sm: ' className="h-8"', md: "", lg: ' className="h-10"' } as const;

export const inputExporters: ComponentExporters<InputProps> = {
  shadcn: ({ props: p }, ctx) => ({
    jsx: [
      '<div className="grid w-full gap-2">',
      p.label && `<Label htmlFor="${ctx.uid}">${text(p.label)}</Label>`,
      `<Input id="${ctx.uid}"${HEIGHT[p.size]}${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${p.value ? ` defaultValue=${str(p.value)}` : ""}${bool("disabled", p.disabled)}${bool("aria-invalid", p.invalid)} />`,
      p.helperText && `<p className="text-sm ${p.invalid ? "text-destructive" : "text-muted-foreground"}">${text(p.helperText)}</p>`,
      "</div>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      { from: "@/components/ui/input", names: ["Input"] },
      ...(p.label ? [{ from: "@/components/ui/label", names: ["Label"] }] : []),
    ],
  }),
  mui: ({ props: p }, ctx) => ({
    jsx: `<TextField id="${ctx.uid}"${p.label ? ` label=${str(p.label)}` : ""}${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${p.value ? ` defaultValue=${str(p.value)}` : ""}${p.helperText ? ` helperText=${str(p.helperText)}` : ""}${p.size === "sm" ? ' size="small"' : ""}${bool("error", p.invalid)}${bool("disabled", p.disabled)} fullWidth />`,
    imports: [{ from: "@mui/material", names: ["TextField"] }],
  }),
};
