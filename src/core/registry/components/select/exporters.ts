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
  mantine: ({ props: p }) => {
    const options = p.options.filter(Boolean);
    const value = options.includes(p.value) ? p.value : "";
    return {
      jsx: `<Select${p.label ? ` label=${str(p.label)}` : ""}${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""} data={${JSON.stringify(options)}}${value ? ` defaultValue=${str(value)}` : ""}${bool("disabled", p.disabled)} />`,
      imports: [{ from: "@mantine/core", names: ["Select"] }],
    };
  },
  antd: ({ props: p }) => {
    const options = p.options.filter(Boolean);
    const value = options.includes(p.value) ? p.value : "";
    return {
      jsx: [
        '<Flex vertical gap={8}>',
        p.label && `<Typography.Text>${text(p.label)}</Typography.Text>`,
        `<Select style={{ width: "100%" }}${p.label ? ` aria-label=${str(p.label)}` : ""}${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${value ? ` defaultValue=${str(value)}` : ""} options={[${options.map((o) => `{ value: ${JSON.stringify(o)}, label: ${JSON.stringify(o)} }`).join(", ")}]}${bool("disabled", p.disabled)} />`,
        "</Flex>",
      ]
        .filter(Boolean)
        .join("\n"),
      imports: [{ from: "antd", names: ["Flex", "Select", ...(p.label ? ["Typography"] : [])] }],
    };
  },
  bootstrap: ({ props: p }, ctx) => {
    const options = p.options.filter(Boolean);
    const value = options.includes(p.value) ? p.value : "";
    return {
      jsx: [
        `<Form.Group controlId="${ctx.uid}">`,
        p.label && `<Form.Label>${text(p.label)}</Form.Label>`,
        `<Form.Select defaultValue=${str(value)}${bool("disabled", p.disabled)}>`,
        p.placeholder && `<option value="">${text(p.placeholder)}</option>`,
        ...options.map((o) => `<option value=${str(o)}>${text(o)}</option>`),
        "</Form.Select>",
        "</Form.Group>",
      ]
        .filter(Boolean)
        .join("\n"),
      imports: [{ from: "react-bootstrap", names: ["Form"] }],
    };
  },
  chakra: ({ props: p }) => {
    const options = p.options.filter(Boolean);
    const value = options.includes(p.value) ? p.value : "";
    return {
      jsx: [
        `<Field.Root${bool("disabled", p.disabled)}>`,
        p.label && `<Field.Label>${text(p.label)}</Field.Label>`,
        "<NativeSelect.Root>",
        `<NativeSelect.Field${p.placeholder ? ` placeholder=${str(p.placeholder)}` : ""}${value ? ` defaultValue=${str(value)}` : ""}>`,
        ...options.map((o) => `<option value=${str(o)}>${text(o)}</option>`),
        "</NativeSelect.Field>",
        "<NativeSelect.Indicator />",
        "</NativeSelect.Root>",
        "</Field.Root>",
      ]
        .filter(Boolean)
        .join("\n"),
      imports: [{ from: "@chakra-ui/react", names: ["Field", "NativeSelect"] }],
    };
  },
};
