import { bool, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { SliderProps } from "./schema";

export const sliderExporters: ComponentExporters<SliderProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      '<div className="grid h-full content-center gap-3">',
      (p.label || p.showValue) &&
        `<div className="flex justify-between text-sm"><span className="font-medium">${text(p.label)}</span>${p.showValue ? `<span className="text-muted-foreground">${p.value}</span>` : ""}</div>`,
      `<Slider defaultValue={[${p.value}]} max={100} step={1}${bool("disabled", p.disabled)} />`,
      "</div>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@/components/ui/slider", names: ["Slider"] }],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      '<Box sx={{ width: "100%" }}>',
      p.label && `<Typography gutterBottom>${text(p.label)}</Typography>`,
      `<Slider defaultValue={${p.value}} valueLabelDisplay="${p.showValue ? "auto" : "off"}"${bool("disabled", p.disabled)} />`,
      "</Box>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@mui/material", names: ["Box", "Slider", ...(p.label ? ["Typography"] : [])] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: [
      '<Stack gap={6} justify="center" h="100%">',
      (p.label || p.showValue) &&
        `<Group justify="space-between"><Text size="sm" fw={500}>${text(p.label)}</Text>${p.showValue ? `<Text size="sm" c="dimmed">${p.value}</Text>` : ""}</Group>`,
      `<Slider defaultValue={${p.value}}${bool("disabled", p.disabled)} />`,
      "</Stack>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@mantine/core", names: ["Slider", "Stack", ...(p.label || p.showValue ? ["Group", "Text"] : [])] }],
  }),
  antd: ({ props: p }) => ({
    jsx: [
      '<Flex vertical justify="center" style={{ height: "100%" }}>',
      (p.label || p.showValue) &&
        `<Flex justify="space-between"><Typography.Text>${text(p.label)}</Typography.Text>${p.showValue ? `<Typography.Text type="secondary">${p.value}</Typography.Text>` : ""}</Flex>`,
      `<Slider defaultValue={${p.value}}${bool("disabled", p.disabled)} />`,
      "</Flex>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "antd", names: ["Flex", "Slider", ...(p.label || p.showValue ? ["Typography"] : [])] }],
  }),
  bootstrap: ({ props: p }, ctx) => ({
    jsx: [
      '<div className="d-flex flex-column justify-content-center h-100">',
      (p.label || p.showValue) &&
        `<div className="d-flex justify-content-between"><Form.Label htmlFor="${ctx.uid}" className="mb-1">${text(p.label)}</Form.Label>${p.showValue ? `<span className="small text-secondary">${p.value}</span>` : ""}</div>`,
      `<Form.Range id="${ctx.uid}" defaultValue={${p.value}}${bool("disabled", p.disabled)} />`,
      "</div>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "react-bootstrap", names: ["Form"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      '<Flex direction="column" justify="center" h="full">',
      `<Slider.Root defaultValue={[${p.value}]}${bool("disabled", p.disabled)} w="full">`,
      (p.label || p.showValue) && `<HStack justify="space-between"><Slider.Label>${text(p.label)}</Slider.Label>${p.showValue ? "<Slider.ValueText />" : ""}</HStack>`,
      "<Slider.Control><Slider.Track><Slider.Range /></Slider.Track><Slider.Thumbs /></Slider.Control>",
      "</Slider.Root>",
      "</Flex>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["Flex", "Slider", ...(p.label || p.showValue ? ["HStack"] : [])] }],
  }),
};
