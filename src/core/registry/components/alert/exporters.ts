import { str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { AlertProps } from "./schema";

const ICON = { info: "Info", success: "CircleCheck", warning: "TriangleAlert", danger: "CircleAlert" } as const;
const SEVERITY = { info: "info", success: "success", warning: "warning", danger: "error" } as const;

export const alertExporters: ComponentExporters<AlertProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      `<Alert${p.variant === "danger" ? ' variant="destructive"' : ""} className="h-full">`,
      `<${ICON[p.variant]} />`,
      p.title && `<AlertTitle>${text(p.title)}</AlertTitle>`,
      p.description && `<AlertDescription>${text(p.description)}</AlertDescription>`,
      "</Alert>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [
      { from: "@/components/ui/alert", names: ["Alert", ...(p.title ? ["AlertTitle"] : []), ...(p.description ? ["AlertDescription"] : [])] },
      { from: "lucide-react", names: [ICON[p.variant]] },
    ],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      `<Alert severity="${SEVERITY[p.variant]}" sx={{ height: "100%" }}>`,
      p.title && `<AlertTitle>${text(p.title)}</AlertTitle>`,
      text(p.description),
      "</Alert>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@mui/material", names: ["Alert", ...(p.title ? ["AlertTitle"] : [])] }],
  }),
  mantine: ({ props: p }) => {
    const color = { info: "blue", success: "green", warning: "yellow", danger: "red" }[p.variant];
    const icon = { info: "Info", success: "CircleCheck", warning: "TriangleAlert", danger: "CircleAlert" }[p.variant];
    return {
      jsx: `<Alert variant="light" color="${color}"${p.title ? ` title=${str(p.title)}` : ""} icon={<${icon} />} h="100%">${text(p.description)}</Alert>`,
      imports: [
        { from: "@mantine/core", names: ["Alert"] },
        { from: "lucide-react", names: [icon] },
      ],
    };
  },
  antd: ({ props: p }) => ({
    jsx: `<Alert type="${{ info: "info", success: "success", warning: "warning", danger: "error" }[p.variant]}" showIcon${p.title ? ` title=${str(p.title)}` : ""}${p.description ? ` description=${str(p.description)}` : ""} style={{ height: "100%" }} />`,
    imports: [{ from: "antd", names: ["Alert"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      `<Alert variant="${p.variant}" className="h-100 mb-0">`,
      p.title && `<Alert.Heading className="fs-6">${text(p.title)}</Alert.Heading>`,
      p.description && `<p className="mb-0">${text(p.description)}</p>`,
      "</Alert>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "react-bootstrap", names: ["Alert"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      `<Alert.Root status="${{ info: "info", success: "success", warning: "warning", danger: "error" }[p.variant]}" h="full">`,
      "<Alert.Indicator />",
      "<Alert.Content>",
      p.title && `<Alert.Title>${text(p.title)}</Alert.Title>`,
      p.description && `<Alert.Description>${text(p.description)}</Alert.Description>`,
      "</Alert.Content>",
      "</Alert.Root>",
    ]
      .filter(Boolean)
      .join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["Alert"] }],
  }),
};
