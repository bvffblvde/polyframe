import { bool, str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { TextareaProps } from "./schema";

export const textareaExporters: ComponentExporters<TextareaProps> = {
  shadcn: ({ props: p }, ctx) => ({
    jsx: [
      '<div className="flex h-full w-full flex-col gap-2">',
      p.label && `<Label htmlFor="${ctx.uid}">${text(p.label)}</Label>`,
      `<Textarea id="${ctx.uid}" className="flex-1"${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${p.value ? ` defaultValue=${str(p.value)}` : ""}${bool("disabled", p.disabled)} />`,
      "</div>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      { from: "@/components/ui/textarea", names: ["Textarea"] },
      ...(p.label ? [{ from: "@/components/ui/label", names: ["Label"] }] : []),
    ],
  }),
  mui: ({ props: p }, ctx) => ({
    jsx: `<TextField id="${ctx.uid}"${p.label ? ` label=${str(p.label)}` : ""}${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${p.value ? ` defaultValue=${str(p.value)}` : ""} multiline rows={4}${bool("disabled", p.disabled)} fullWidth />`,
    imports: [{ from: "@mui/material", names: ["TextField"] }],
  }),
};
