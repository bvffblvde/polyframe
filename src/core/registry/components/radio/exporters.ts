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
  mantine: ({ props: p }) => {
    const Wrap = p.orientation === "horizontal" ? "Group" : "Stack";
    return {
      jsx: [
        `<Radio.Group${p.label ? ` label=${str(p.label)}` : ""} defaultValue="option-${p.activeIndex}">`,
        `<${Wrap} mt="xs" gap="xs">`,
        ...p.options.map((o, i) => `<Radio value="option-${i}" label=${str(o)}${bool("disabled", p.disabled)} />`),
        `</${Wrap}>`,
        "</Radio.Group>",
      ].join("\n"),
      imports: [{ from: "@mantine/core", names: ["Radio", Wrap] }],
    };
  },
  antd: ({ props: p }) => ({
    jsx: [
      '<Flex vertical gap={8}>',
      p.label && `<Typography.Text>${text(p.label)}</Typography.Text>`,
      `<Radio.Group defaultValue="option-${p.activeIndex}"${p.orientation === "vertical" ? ' vertical' : ""}${bool("disabled", p.disabled)} options={[${p.options.map((o, i) => `{ value: "option-${i}", label: ${JSON.stringify(o)} }`).join(", ")}]} />`,
      "</Flex>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "antd", names: ["Flex", "Radio", ...(p.label ? ["Typography"] : [])] }],
  }),
  bootstrap: ({ props: p }, ctx) => ({
    jsx: [
      "<div>",
      p.label && `<Form.Label>${text(p.label)}</Form.Label>`,
      ...p.options.map(
        (o, i) =>
          `<Form.Check type="radio" id="${ctx.uid}-${i}" name="${ctx.uid}" label=${str(o)}${bool("inline", p.orientation === "horizontal")}${bool("defaultChecked", i === p.activeIndex)}${bool("disabled", p.disabled)} />`,
      ),
      "</div>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "react-bootstrap", names: ["Form"] }],
  }),
  chakra: ({ props: p }) => {
    const Wrap = p.orientation === "horizontal" ? "HStack" : "Stack";
    return {
      jsx: [
        '<Stack gap="2">',
        p.label && `<Text fontWeight="medium" textStyle="sm">${text(p.label)}</Text>`,
        `<RadioGroup.Root defaultValue="option-${p.activeIndex}"${bool("disabled", p.disabled)}>`,
        `<${Wrap} gap="3">`,
        ...p.options.map(
          (o, i) =>
            `<RadioGroup.Item value="option-${i}"><RadioGroup.ItemHiddenInput /><RadioGroup.ItemIndicator /><RadioGroup.ItemText>${text(o)}</RadioGroup.ItemText></RadioGroup.Item>`,
        ),
        `</${Wrap}>`,
        "</RadioGroup.Root>",
        "</Stack>",
      ]
        .filter(Boolean)
        .join("\n"),
      imports: [{ from: "@chakra-ui/react", names: ["RadioGroup", "Stack", Wrap, ...(p.label ? ["Text"] : [])] }],
    };
  },
};
