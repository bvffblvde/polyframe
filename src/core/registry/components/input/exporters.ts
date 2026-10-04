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
  mantine: ({ props: p }) => {
    const help = p.helperText ? (p.invalid ? ` error=${str(p.helperText)}` : ` description=${str(p.helperText)}`) : p.invalid ? " error" : "";
    return {
      jsx: `<TextInput${p.label ? ` label=${str(p.label)}` : ""}${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${p.value ? ` defaultValue=${str(p.value)}` : ""}${help} size="${p.size}"${bool("disabled", p.disabled)} />`,
      imports: [{ from: "@mantine/core", names: ["TextInput"] }],
    };
  },
  antd: ({ props: p }) => {
    const size = { sm: "small", md: "middle", lg: "large" }[p.size];
    return {
      jsx: [
        '<Flex vertical gap={8}>',
        p.label && `<Typography.Text>${text(p.label)}</Typography.Text>`,
        `<Input size="${size}"${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${p.value ? ` defaultValue=${str(p.value)}` : ""}${p.invalid ? ' status="error"' : ""}${bool("disabled", p.disabled)} />`,
        p.helperText && `<Typography.Text type="${p.invalid ? "danger" : "secondary"}">${text(p.helperText)}</Typography.Text>`,
        "</Flex>",
      ]
        .filter(Boolean)
        .join("\n"),
      imports: [{ from: "antd", names: ["Flex", "Input", ...(p.label || p.helperText ? ["Typography"] : [])] }],
    };
  },
  bootstrap: ({ props: p }, ctx) => ({
    jsx: [
      `<Form.Group controlId="${ctx.uid}">`,
      p.label && `<Form.Label>${text(p.label)}</Form.Label>`,
      `<Form.Control${p.size === "md" ? "" : ` size="${p.size}"`}${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${p.value ? ` defaultValue=${str(p.value)}` : ""}${bool("isInvalid", p.invalid)}${bool("disabled", p.disabled)} />`,
      p.helperText && (p.invalid ? `<Form.Control.Feedback type="invalid">${text(p.helperText)}</Form.Control.Feedback>` : `<Form.Text muted>${text(p.helperText)}</Form.Text>`),
      "</Form.Group>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "react-bootstrap", names: ["Form"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      `<Field.Root${bool("invalid", p.invalid)}${bool("disabled", p.disabled)}>`,
      p.label && `<Field.Label>${text(p.label)}</Field.Label>`,
      `<Input size="${p.size}"${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${p.value ? ` defaultValue=${str(p.value)}` : ""} />`,
      p.helperText && (p.invalid ? `<Field.ErrorText>${text(p.helperText)}</Field.ErrorText>` : `<Field.HelperText>${text(p.helperText)}</Field.HelperText>`),
      "</Field.Root>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["Field", "Input"] }],
  }),
};
