import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { AccordionProps } from "./schema";

export const accordionExporters: ComponentExporters<AccordionProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      `<Accordion type="single" collapsible${p.openIndex >= 0 ? ` defaultValue="item-${p.openIndex}"` : ""} className="w-full">`,
      ...p.items.map((item, i) => `<AccordionItem value="item-${i}"><AccordionTrigger>${text(item)}</AccordionTrigger><AccordionContent>${text(p.content)}</AccordionContent></AccordionItem>`),
      "</Accordion>",
    ].join("\n"),
    imports: [{ from: "@/components/ui/accordion", names: ["Accordion", "AccordionContent", "AccordionItem", "AccordionTrigger"] }],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      "<div>",
      ...p.items.map(
        (item, i) =>
          `<Accordion${i === p.openIndex ? " defaultExpanded" : ""}><AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography>${text(item)}</Typography></AccordionSummary><AccordionDetails><Typography color="text.secondary">${text(p.content)}</Typography></AccordionDetails></Accordion>`,
      ),
      "</div>",
    ].join("\n"),
    imports: [
      { from: "@mui/material", names: ["Accordion", "AccordionDetails", "AccordionSummary", "Typography"] },
      { from: "@mui/icons-material", names: ["ExpandMore as ExpandMoreIcon"] },
    ],
  }),
  mantine: ({ props: p }) => ({
    jsx: [
      `<Accordion${p.openIndex >= 0 ? ` defaultValue="item-${p.openIndex}"` : ""}>`,
      ...p.items.map((item, i) => `<Accordion.Item value="item-${i}"><Accordion.Control>${text(item)}</Accordion.Control><Accordion.Panel>${text(p.content)}</Accordion.Panel></Accordion.Item>`),
      "</Accordion>",
    ].join("\n"),
    imports: [{ from: "@mantine/core", names: ["Accordion"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Collapse${p.openIndex >= 0 ? ` defaultActiveKey={["item-${p.openIndex}"]}` : ""} items={[${p.items.map((item, i) => `{ key: "item-${i}", label: ${JSON.stringify(item)}, children: ${JSON.stringify(p.content)} }`).join(", ")}]} />`,
    imports: [{ from: "antd", names: ["Collapse"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      `<Accordion${p.openIndex >= 0 ? ` defaultActiveKey="item-${p.openIndex}"` : ""}>`,
      ...p.items.map((item, i) => `<Accordion.Item eventKey="item-${i}"><Accordion.Header>${text(item)}</Accordion.Header><Accordion.Body>${text(p.content)}</Accordion.Body></Accordion.Item>`),
      "</Accordion>",
    ].join("\n"),
    imports: [{ from: "react-bootstrap", names: ["Accordion"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      `<Accordion.Root collapsible${p.openIndex >= 0 ? ` defaultValue={["item-${p.openIndex}"]}` : ""}>`,
      ...p.items.map(
        (item, i) =>
          `<Accordion.Item value="item-${i}"><Accordion.ItemTrigger><Span flex="1">${text(item)}</Span><Accordion.ItemIndicator /></Accordion.ItemTrigger><Accordion.ItemContent><Accordion.ItemBody>${text(p.content)}</Accordion.ItemBody></Accordion.ItemContent></Accordion.Item>`,
      ),
      "</Accordion.Root>",
    ].join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["Accordion", "Span"] }],
  }),
};
