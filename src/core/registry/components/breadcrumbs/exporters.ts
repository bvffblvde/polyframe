import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { BreadcrumbsProps } from "./schema";

const last = (p: BreadcrumbsProps, i: number) => i === p.items.length - 1;

export const breadcrumbsExporters: ComponentExporters<BreadcrumbsProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      "<Breadcrumb>",
      "<BreadcrumbList>",
      ...p.items.flatMap((item, i) => [
        i > 0 ? (p.separator === "slash" ? "<BreadcrumbSeparator>/</BreadcrumbSeparator>" : "<BreadcrumbSeparator />") : "",
        `<BreadcrumbItem>${last(p, i) ? `<BreadcrumbPage>${text(item)}</BreadcrumbPage>` : `<BreadcrumbLink href="#">${text(item)}</BreadcrumbLink>`}</BreadcrumbItem>`,
      ]),
      "</BreadcrumbList>",
      "</Breadcrumb>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      { from: "@/components/ui/breadcrumb", names: ["Breadcrumb", "BreadcrumbItem", "BreadcrumbLink", "BreadcrumbList", "BreadcrumbPage", "BreadcrumbSeparator"] },
    ],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      `<Breadcrumbs separator=${p.separator === "slash" ? '"/"' : "{<NavigateNextIcon fontSize=\"small\" />}"}>`,
      ...p.items.map((item, i) =>
        last(p, i) ? `<Typography color="text.primary">${text(item)}</Typography>` : `<Link underline="hover" color="inherit" href="#">${text(item)}</Link>`,
      ),
      "</Breadcrumbs>",
    ].join("\n"),
    imports: [
      { from: "@mui/material", names: ["Breadcrumbs", "Link", "Typography"] },
      ...(p.separator === "chevron" ? [{ from: "@mui/icons-material", names: ["NavigateNext as NavigateNextIcon"] }] : []),
    ],
  }),
  mantine: ({ props: p }) => ({
    jsx: [
      `<Breadcrumbs separator="${p.separator === "slash" ? "/" : "›"}">`,
      ...p.items.map((item, i) => (last(p, i) ? `<Text size="sm">${text(item)}</Text>` : `<Anchor href="#" size="sm">${text(item)}</Anchor>`)),
      "</Breadcrumbs>",
    ].join("\n"),
    imports: [{ from: "@mantine/core", names: ["Anchor", "Breadcrumbs", "Text"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Breadcrumb separator="${p.separator === "slash" ? "/" : ">"}" items={[${p.items.map((item, i) => `{ title: ${JSON.stringify(item)}${last(p, i) ? "" : ', href: "#"'} }`).join(", ")}]} />`,
    imports: [{ from: "antd", names: ["Breadcrumb"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      '<Breadcrumb className="mb-0">',
      ...p.items.map((item, i) => (last(p, i) ? `<Breadcrumb.Item active>${text(item)}</Breadcrumb.Item>` : `<Breadcrumb.Item href="#">${text(item)}</Breadcrumb.Item>`)),
      "</Breadcrumb>",
    ].join("\n"),
    imports: [{ from: "react-bootstrap", names: ["Breadcrumb"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      "<Breadcrumb.Root>",
      "<Breadcrumb.List>",
      ...p.items.flatMap((item, i) => [
        i > 0 ? (p.separator === "slash" ? "<Breadcrumb.Separator>/</Breadcrumb.Separator>" : "<Breadcrumb.Separator />") : "",
        `<Breadcrumb.Item>${last(p, i) ? `<Breadcrumb.CurrentLink>${text(item)}</Breadcrumb.CurrentLink>` : `<Breadcrumb.Link href="#">${text(item)}</Breadcrumb.Link>`}</Breadcrumb.Item>`,
      ]),
      "</Breadcrumb.List>",
      "</Breadcrumb.Root>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["Breadcrumb"] }],
  }),
};
