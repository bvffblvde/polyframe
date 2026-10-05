import { str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { StepperProps } from "./schema";

export const stepperExporters: ComponentExporters<StepperProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      '<ol className="flex w-full items-center gap-2">',
      ...p.steps.map((step, i) => {
        const done = i < p.activeIndex;
        const active = i === p.activeIndex;
        const dot = done || active ? "bg-primary text-primary-foreground" : "border text-muted-foreground";
        return `<li className="flex flex-1 items-center gap-2"><span className="flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${dot}">${done ? "<Check className=\"size-4\" />" : i + 1}</span><span className="text-sm${active ? " font-medium" : " text-muted-foreground"}">${text(step)}</span>${i < p.steps.length - 1 ? '<span className="h-px flex-1 bg-border" />' : ""}</li>`;
      }),
      "</ol>",
    ].join("\n"),
    imports: p.activeIndex > 0 ? [{ from: "lucide-react", names: ["Check"] }] : [],
  }),
  mui: ({ props: p }) => ({
    jsx: [`<Stepper activeStep={${p.activeIndex}}>`, ...p.steps.map((s) => `<Step><StepLabel>${text(s)}</StepLabel></Step>`), "</Stepper>"].join("\n"),
    imports: [{ from: "@mui/material", names: ["Step", "StepLabel", "Stepper"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: [`<Stepper active={${p.activeIndex}} size="sm">`, ...p.steps.map((s) => `<Stepper.Step label=${str(s)} />`), "</Stepper>"].join("\n"),
    imports: [{ from: "@mantine/core", names: ["Stepper"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Steps current={${p.activeIndex}} items={[${p.steps.map((s) => `{ title: ${JSON.stringify(s)} }`).join(", ")}]} />`,
    imports: [{ from: "antd", names: ["Steps"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      '<ol className="d-flex align-items-center gap-2 list-unstyled mb-0 w-100">',
      ...p.steps.map((step, i) => {
        const on = i <= p.activeIndex;
        return `<li className="d-flex align-items-center gap-2 flex-grow-1"><span className="d-inline-flex align-items-center justify-content-center rounded-circle ${on ? "bg-primary text-white" : "border text-secondary"}" style={{ width: 32, height: 32 }}>${i < p.activeIndex ? "✓" : i + 1}</span><span className="${i === p.activeIndex ? "fw-semibold" : "text-secondary"}">${text(step)}</span>${i < p.steps.length - 1 ? '<span className="flex-grow-1 border-top" />' : ""}</li>`;
      }),
      "</ol>",
    ].join("\n"),
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      `<Steps.Root defaultStep={${p.activeIndex}} count={${p.steps.length}} size="sm">`,
      "<Steps.List>",
      ...p.steps.map((s, i) => `<Steps.Item index={${i}}><Steps.Indicator /><Steps.Title>${text(s)}</Steps.Title><Steps.Separator /></Steps.Item>`),
      "</Steps.List>",
      "</Steps.Root>",
    ].join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["Steps"] }],
  }),
};
