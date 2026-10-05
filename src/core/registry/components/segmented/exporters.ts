import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { SegmentedProps } from "./schema";

const value = (p: SegmentedProps) => `option-${Math.min(p.activeIndex, Math.max(0, p.options.length - 1))}`;

export const segmentedExporters: ComponentExporters<SegmentedProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      `<ToggleGroup type="single" variant="outline" defaultValue="${value(p)}" className="w-full">`,
      ...p.options.map((o, i) => `<ToggleGroupItem value="option-${i}" className="flex-1">${text(o)}</ToggleGroupItem>`),
      "</ToggleGroup>",
    ].join("\n"),
    imports: [{ from: "@/components/ui/toggle-group", names: ["ToggleGroup", "ToggleGroupItem"] }],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      `<ToggleButtonGroup exclusive value="${value(p)}" size="small" fullWidth>`,
      ...p.options.map((o, i) => `<ToggleButton value="option-${i}">${text(o)}</ToggleButton>`),
      "</ToggleButtonGroup>",
    ].join("\n"),
    imports: [{ from: "@mui/material", names: ["ToggleButton", "ToggleButtonGroup"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<SegmentedControl fullWidth defaultValue="${value(p)}" data={[${p.options.map((o, i) => `{ value: "option-${i}", label: ${JSON.stringify(o)} }`).join(", ")}]} />`,
    imports: [{ from: "@mantine/core", names: ["SegmentedControl"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Segmented block defaultValue="${value(p)}" options={[${p.options.map((o, i) => `{ value: "option-${i}", label: ${JSON.stringify(o)} }`).join(", ")}]} />`,
    imports: [{ from: "antd", names: ["Segmented"] }],
  }),
  bootstrap: ({ props: p }, ctx) => ({
    jsx: [
      `<ToggleButtonGroup type="radio" name="${ctx.uid}" defaultValue="${value(p)}" className="w-100">`,
      ...p.options.map((o, i) => `<ToggleButton id="${ctx.uid}-${i}" value="option-${i}" variant="outline-primary">${text(o)}</ToggleButton>`),
      "</ToggleButtonGroup>",
    ].join("\n"),
    imports: [{ from: "react-bootstrap", names: ["ToggleButton", "ToggleButtonGroup"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      `<SegmentGroup.Root defaultValue="${value(p)}">`,
      "<SegmentGroup.Indicator />",
      ...p.options.map((o, i) => `<SegmentGroup.Item value="option-${i}"><SegmentGroup.ItemText>${text(o)}</SegmentGroup.ItemText><SegmentGroup.ItemHiddenInput /></SegmentGroup.Item>`),
      "</SegmentGroup.Root>",
    ].join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["SegmentGroup"] }],
  }),
};
