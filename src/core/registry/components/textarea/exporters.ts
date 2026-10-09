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
  mantine: ({ props: p }) => ({
    jsx: `<Textarea${p.label ? ` label=${str(p.label)}` : ""}${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${p.value ? ` defaultValue=${str(p.value)}` : ""} minRows={4} autosize${bool("disabled", p.disabled)} />`,
    imports: [{ from: "@mantine/core", names: ["Textarea"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: [
      '<Flex vertical gap={8} style={{ height: "100%" }}>',
      p.label && `<Typography.Text>${text(p.label)}</Typography.Text>`,
      `<Input.TextArea style={{ flex: 1 }}${p.label ? ` aria-label=${str(p.label)}` : ""}${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${p.value ? ` defaultValue=${str(p.value)}` : ""}${bool("disabled", p.disabled)} />`,
      "</Flex>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "antd", names: ["Flex", "Input", ...(p.label ? ["Typography"] : [])] }],
  }),
  bootstrap: ({ props: p }, ctx) => ({
    jsx: [
      `<Form.Group controlId="${ctx.uid}" className="d-flex flex-column h-100">`,
      p.label && `<Form.Label>${text(p.label)}</Form.Label>`,
      `<Form.Control as="textarea" className="flex-grow-1"${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${p.value ? ` defaultValue=${str(p.value)}` : ""}${bool("disabled", p.disabled)} />`,
      "</Form.Group>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "react-bootstrap", names: ["Form"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      `<Field.Root h="full"${bool("disabled", p.disabled)}>`,
      p.label && `<Field.Label>${text(p.label)}</Field.Label>`,
      `<Textarea flex="1"${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${p.value ? ` defaultValue=${str(p.value)}` : ""} />`,
      "</Field.Root>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["Field", "Textarea"] }],
  }),
};
