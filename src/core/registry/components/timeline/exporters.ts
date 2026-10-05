import { str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import { at } from "../../shared/text";
import type { TimelineProps } from "./schema";

const items = (p: TimelineProps) => p.events.map((title, i) => ({ title, date: at(p.dates, i, ""), done: i <= p.activeIndex }));

export const timelineExporters: ComponentExporters<TimelineProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      '<ol className="relative ml-2 border-l">',
      ...items(p).map(
        (it) =>
          `<li className="mb-6 ml-6"><span className="absolute -left-1.5 mt-1.5 size-3 rounded-full ${it.done ? "bg-primary" : "border bg-background"}" /><p className="text-sm font-medium">${text(it.title)}</p>${it.date ? `<time className="text-sm text-muted-foreground">${text(it.date)}</time>` : ""}</li>`,
      ),
      "</ol>",
    ].join("\n"),
  }),
  mui: ({ props: p }) => ({
    jsx: [
      '<Stack spacing={2} sx={{ borderLeft: 2, borderColor: "divider", pl: 3, ml: 1 }}>',
      ...items(p).map(
        (it) =>
          `<Box sx={{ position: "relative" }}><Box sx={{ position: "absolute", left: -31, top: 4, width: 12, height: 12, borderRadius: "50%", bgcolor: "${it.done ? "primary.main" : "grey.300"}" }} /><Typography variant="subtitle2">${text(it.title)}</Typography>${it.date ? `<Typography variant="body2" color="text.secondary">${text(it.date)}</Typography>` : ""}</Box>`,
      ),
      "</Stack>",
    ].join("\n"),
    imports: [{ from: "@mui/material", names: ["Box", "Stack", "Typography"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: [
      `<Timeline active={${p.activeIndex}} bulletSize={16} lineWidth={2}>`,
      ...items(p).map((it) => `<Timeline.Item title=${str(it.title)}>${it.date ? `<Text c="dimmed" size="sm">${text(it.date)}</Text>` : ""}</Timeline.Item>`),
      "</Timeline>",
    ].join("\n"),
    imports: [{ from: "@mantine/core", names: ["Text", "Timeline"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Timeline items={[${items(p).map((it) => `{ color: "${it.done ? "blue" : "gray"}", content: ${JSON.stringify(it.date ? `${it.title} · ${it.date}` : it.title)} }`).join(", ")}]} />`,
    imports: [{ from: "antd", names: ["Timeline"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      '<ul className="list-unstyled border-start border-2 ms-2 ps-4 mb-0">',
      ...items(p).map(
        (it) =>
          `<li className="position-relative mb-3"><span className="position-absolute rounded-circle ${it.done ? "bg-primary" : "bg-secondary-subtle"}" style={{ width: 12, height: 12, left: -31, top: 6 }} /><div className="fw-semibold">${text(it.title)}</div>${it.date ? `<small className="text-secondary">${text(it.date)}</small>` : ""}</li>`,
      ),
      "</ul>",
    ].join("\n"),
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      "<Timeline.Root>",
      ...items(p).map(
        (it) =>
          `<Timeline.Item><Timeline.Connector><Timeline.Separator /><Timeline.Indicator${it.done ? "" : ' bg="bg.muted"'} /></Timeline.Connector><Timeline.Content><Timeline.Title>${text(it.title)}</Timeline.Title>${it.date ? `<Timeline.Description>${text(it.date)}</Timeline.Description>` : ""}</Timeline.Content></Timeline.Item>`,
      ),
      "</Timeline.Root>",
    ].join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["Timeline"] }],
  }),
};
