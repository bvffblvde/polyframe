import { str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { ToastProps } from "./schema";

const SEVERITY = { info: "info", success: "success", warning: "warning", danger: "error" } as const;

export const toastExporters: ComponentExporters<ToastProps> = {
  shadcn: ({ props: p }) => ({
    jsx: `<div className="flex w-full items-center gap-3 rounded-lg border bg-background p-4 shadow-lg"><div className="flex-1"><p className="text-sm font-semibold">${text(p.title)}</p>${p.description ? `<p className="text-sm text-muted-foreground">${text(p.description)}</p>` : ""}</div>${p.actionLabel ? `<Button size="sm" variant="outline">${text(p.actionLabel)}</Button>` : ""}</div>`,
    imports: p.actionLabel ? [{ from: "@/components/ui/button", names: ["Button"] }] : [],
  }),
  mui: ({ props: p }) => ({
    jsx: `<Alert severity="${SEVERITY[p.variant]}" variant="filled" sx={{ width: "100%" }}${p.actionLabel ? ` action={<Button color="inherit" size="small">${text(p.actionLabel)}</Button>}` : ""}><AlertTitle>${text(p.title)}</AlertTitle>${text(p.description)}</Alert>`,
    imports: [{ from: "@mui/material", names: ["Alert", "AlertTitle", ...(p.actionLabel ? ["Button"] : [])] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<Notification title=${str(p.title)} color="${{ info: "blue", success: "teal", warning: "yellow", danger: "red" }[p.variant]}">${text(p.description)}</Notification>`,
    imports: [{ from: "@mantine/core", names: ["Notification"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Alert type="${SEVERITY[p.variant]}" showIcon closable title=${str(p.title)}${p.description ? ` description=${str(p.description)}` : ""}${p.actionLabel ? ` action={<Button size="small" type="text">${text(p.actionLabel)}</Button>}` : ""} />`,
    imports: [{ from: "antd", names: ["Alert", ...(p.actionLabel ? ["Button"] : [])] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: `<Toast className="w-100"><Toast.Header><strong className="me-auto">${text(p.title)}</strong></Toast.Header>${p.description ? `<Toast.Body>${text(p.description)}</Toast.Body>` : ""}</Toast>`,
    imports: [{ from: "react-bootstrap", names: ["Toast"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: `<Alert.Root status="${SEVERITY[p.variant]}" variant="surface" boxShadow="lg"><Alert.Indicator /><Alert.Content><Alert.Title>${text(p.title)}</Alert.Title>${p.description ? `<Alert.Description>${text(p.description)}</Alert.Description>` : ""}</Alert.Content>${p.actionLabel ? `<Button size="xs" variant="outline">${text(p.actionLabel)}</Button>` : ""}</Alert.Root>`,
    imports: [{ from: "@chakra-ui/react", names: ["Alert", ...(p.actionLabel ? ["Button"] : [])] }],
  }),
};
