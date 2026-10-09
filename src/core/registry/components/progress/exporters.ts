import { str, text } from "../../../exporters/jsx";

const name = (p: ProgressProps) => ` aria-label=${str(p.label || "Progress")}`;
import type { ComponentExporters } from "../../../exporters/types";
import type { ProgressProps } from "./schema";

export const progressExporters: ComponentExporters<ProgressProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      '<div className="grid h-full content-center gap-2">',
      (p.label || p.showValue) &&
        `<div className="flex justify-between text-sm"><span className="font-medium">${text(p.label)}</span>${p.showValue ? `<span className="text-muted-foreground">${p.value}%</span>` : ""}</div>`,
      `<Progress value={${p.value}}${name(p)} />`,
      "</div>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@/components/ui/progress", names: ["Progress"] }],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      '<Box sx={{ width: "100%" }}>',
      (p.label || p.showValue) &&
        `<Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}><Typography variant="body2">${text(p.label)}</Typography>${p.showValue ? `<Typography variant="body2" color="text.secondary">${p.value}%</Typography>` : ""}</Box>`,
      `<LinearProgress variant="determinate" value={${p.value}}${name(p)} />`,
      "</Box>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@mui/material", names: ["Box", "LinearProgress", ...(p.label || p.showValue ? ["Typography"] : [])] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: [
      '<Stack gap={6} justify="center" h="100%">',
      (p.label || p.showValue) &&
        `<Group justify="space-between"><Text size="sm" fw={500}>${text(p.label)}</Text>${p.showValue ? `<Text size="sm" c="dimmed">${p.value}%</Text>` : ""}</Group>`,
      `<Progress value={${p.value}}${name(p)} />`,
      "</Stack>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@mantine/core", names: ["Progress", "Stack", ...(p.label || p.showValue ? ["Group", "Text"] : [])] }],
  }),
  antd: ({ props: p }) => ({
    jsx: [
      '<Flex vertical justify="center" style={{ height: "100%" }}>',
      p.label && `<Typography.Text>${text(p.label)}</Typography.Text>`,
      `<Progress percent={${p.value}}${p.showValue ? "" : " showInfo={false}"}${name(p)} />`,
      "</Flex>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "antd", names: ["Flex", "Progress", ...(p.label ? ["Typography"] : [])] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      '<div className="d-flex flex-column justify-content-center h-100">',
      (p.label || p.showValue) &&
        `<div className="d-flex justify-content-between small mb-1"><span>${text(p.label)}</span>${p.showValue ? `<span className="text-secondary">${p.value}%</span>` : ""}</div>`,
      `<div className="progress" role="progressbar"${name(p)} aria-valuenow={${p.value}} aria-valuemin={0} aria-valuemax={100}><div className="progress-bar" style={{ width: "${p.value}%" }} /></div>`,
      "</div>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      '<Flex direction="column" justify="center" h="full">',
      `<Progress.Root value={${p.value}} w="full">`,
      (p.label || p.showValue) && `<HStack justify="space-between" mb="1">${p.label ? `<Progress.Label>${text(p.label)}</Progress.Label>` : ""}${p.showValue ? "<Progress.ValueText />" : ""}</HStack>`,
      "<Progress.Track><Progress.Range /></Progress.Track>",
      "</Progress.Root>",
      "</Flex>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["Flex", "Progress", ...(p.label || p.showValue ? ["HStack"] : [])] }],
  }),
};
