import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { SpinnerProps } from "./schema";

const PX = { sm: 16, md: 24, lg: 36 } as const;

export const spinnerExporters: ComponentExporters<SpinnerProps> = {
  shadcn: ({ props: p }) => ({
    jsx: `<div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="animate-spin" size={${PX[p.size]}} />${text(p.label)}</div>`,
    imports: [{ from: "lucide-react", names: ["Loader2"] }],
  }),
  mui: ({ props: p }) => ({
    jsx: `<Stack direction="row" spacing={1.5} alignItems="center"><CircularProgress size={${PX[p.size]}} />${p.label ? `<Typography variant="body2" color="text.secondary">${text(p.label)}</Typography>` : ""}</Stack>`,
    imports: [{ from: "@mui/material", names: ["CircularProgress", "Stack", ...(p.label ? ["Typography"] : [])] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<Group gap="sm"><Loader size={${PX[p.size]}} />${p.label ? `<Text size="sm" c="dimmed">${text(p.label)}</Text>` : ""}</Group>`,
    imports: [{ from: "@mantine/core", names: ["Group", "Loader", ...(p.label ? ["Text"] : [])] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Flex align="center" gap={12}><Spin size="${{ sm: "small", md: "default", lg: "large" }[p.size]}" />${p.label ? `<Typography.Text type="secondary">${text(p.label)}</Typography.Text>` : ""}</Flex>`,
    imports: [{ from: "antd", names: ["Flex", "Spin", ...(p.label ? ["Typography"] : [])] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: `<div className="d-flex align-items-center gap-2"><Spinner animation="border"${p.size === "sm" ? ' size="sm"' : ""} variant="primary" />${p.label ? `<span className="text-secondary">${text(p.label)}</span>` : ""}</div>`,
    imports: [{ from: "react-bootstrap", names: ["Spinner"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: `<HStack gap="3"><Spinner size="${p.size}" />${p.label ? `<Text color="fg.muted">${text(p.label)}</Text>` : ""}</HStack>`,
    imports: [{ from: "@chakra-ui/react", names: ["HStack", "Spinner", ...(p.label ? ["Text"] : [])] }],
  }),
};
