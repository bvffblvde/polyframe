import { text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { DropzoneProps } from "./schema";

export const dropzoneExporters: ComponentExporters<DropzoneProps> = {
  shadcn: ({ props: p }) => ({
    jsx: `<div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center"><Upload className="size-8 text-muted-foreground" /><p className="text-sm font-medium">${text(p.title)}</p>${p.hint ? `<p className="text-xs text-muted-foreground">${text(p.hint)}</p>` : ""}${p.actionLabel ? `<Button variant="outline" size="sm">${text(p.actionLabel)}</Button>` : ""}</div>`,
    imports: [
      { from: "lucide-react", names: ["Upload"] },
      ...(p.actionLabel ? [{ from: "@/components/ui/button", names: ["Button"] }] : []),
    ],
  }),
  mui: ({ props: p }) => ({
    jsx: `<Box sx={{ height: "100%", border: 2, borderStyle: "dashed", borderColor: "divider", borderRadius: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, p: 3, textAlign: "center" }}><CloudUploadIcon color="action" fontSize="large" /><Typography variant="subtitle2">${text(p.title)}</Typography>${p.hint ? `<Typography variant="caption" color="text.secondary">${text(p.hint)}</Typography>` : ""}${p.actionLabel ? `<Button variant="outlined" size="small" component="label">${text(p.actionLabel)}<input hidden type="file" /></Button>` : ""}</Box>`,
    imports: [
      { from: "@mui/material", names: ["Box", "Typography", ...(p.actionLabel ? ["Button"] : [])] },
      { from: "@mui/icons-material", names: ["CloudUpload as CloudUploadIcon"] },
    ],
  }),
  mantine: ({ props: p }) => ({
    jsx: `<Stack align="center" justify="center" gap="xs" h="100%" p="lg" bd="2px dashed var(--mantine-color-gray-4)" bdrs="md"><Upload size={32} /><Text fw={500}>${text(p.title)}</Text>${p.hint ? `<Text size="xs" c="dimmed">${text(p.hint)}</Text>` : ""}${p.actionLabel ? `<Button variant="default" size="xs">${text(p.actionLabel)}</Button>` : ""}</Stack>`,
    imports: [
      { from: "@mantine/core", names: ["Stack", "Text", ...(p.actionLabel ? ["Button"] : [])] },
      { from: "lucide-react", names: ["Upload"] },
    ],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Upload.Dragger style={{ height: "100%" }}><p className="ant-upload-drag-icon"><InboxOutlined /></p><p className="ant-upload-text">${text(p.title)}</p>${p.hint ? `<p className="ant-upload-hint">${text(p.hint)}</p>` : ""}</Upload.Dragger>`,
    imports: [
      { from: "antd", names: ["Upload"] },
      { from: "@ant-design/icons", names: ["InboxOutlined"] },
    ],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: `<div className="d-flex flex-column align-items-center justify-content-center gap-2 h-100 p-4 text-center border border-2 rounded-3" style={{ borderStyle: "dashed" }}><Upload size={32} className="text-secondary" /><div className="fw-semibold">${text(p.title)}</div>${p.hint ? `<small className="text-secondary">${text(p.hint)}</small>` : ""}${p.actionLabel ? `<Button variant="outline-secondary" size="sm">${text(p.actionLabel)}</Button>` : ""}</div>`,
    imports: [
      { from: "lucide-react", names: ["Upload"] },
      ...(p.actionLabel ? [{ from: "react-bootstrap", names: ["Button"] }] : []),
    ],
  }),
  chakra: ({ props: p }) => ({
    jsx: `<FileUpload.Root alignItems="stretch" h="full"><FileUpload.HiddenInput /><FileUpload.Dropzone h="full"><Icon size="lg" color="fg.muted"><Upload /></Icon><FileUpload.DropzoneContent><Box>${text(p.title)}</Box>${p.hint ? `<Box color="fg.muted">${text(p.hint)}</Box>` : ""}</FileUpload.DropzoneContent></FileUpload.Dropzone></FileUpload.Root>`,
    imports: [
      { from: "@chakra-ui/react", names: ["Box", "FileUpload", "Icon"] },
      { from: "lucide-react", names: ["Upload"] },
    ],
  }),
};
