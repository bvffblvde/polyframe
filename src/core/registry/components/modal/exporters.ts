import { str, text } from "../../../exporters/jsx";
import type { ComponentExporters } from "../../../exporters/types";
import type { ModalProps } from "./schema";

export const modalExporters: ComponentExporters<ModalProps> = {
  shadcn: ({ props: p }) => ({
    jsx: [
      "<Dialog defaultOpen>",
      "<DialogContent>",
      `<DialogHeader><DialogTitle>${text(p.title)}</DialogTitle><DialogDescription>${text(p.body)}</DialogDescription></DialogHeader>`,
      `<DialogFooter>${p.cancelLabel ? `<Button variant="outline">${text(p.cancelLabel)}</Button>` : ""}${p.confirmLabel ? `<Button>${text(p.confirmLabel)}</Button>` : ""}</DialogFooter>`,
      "</DialogContent>",
      "</Dialog>",
    ].join("\n"),
    imports: [
      { from: "@/components/ui/dialog", names: ["Dialog", "DialogContent", "DialogDescription", "DialogFooter", "DialogHeader", "DialogTitle"] },
      { from: "@/components/ui/button", names: ["Button"] },
    ],
  }),
  mui: ({ props: p }) => ({
    jsx: [
      "<Dialog open>",
      `<DialogTitle>${text(p.title)}</DialogTitle>`,
      `<DialogContent><DialogContentText>${text(p.body)}</DialogContentText></DialogContent>`,
      `<DialogActions>${p.cancelLabel ? `<Button>${text(p.cancelLabel)}</Button>` : ""}${p.confirmLabel ? `<Button variant="contained">${text(p.confirmLabel)}</Button>` : ""}</DialogActions>`,
      "</Dialog>",
    ].join("\n"),
    imports: [{ from: "@mui/material", names: ["Button", "Dialog", "DialogActions", "DialogContent", "DialogContentText", "DialogTitle"] }],
  }),
  mantine: ({ props: p }) => ({
    jsx: [
      `<Modal opened onClose={() => undefined} title=${str(p.title)} centered>`,
      `<Text size="sm">${text(p.body)}</Text>`,
      `<Group justify="flex-end" mt="md">${p.cancelLabel ? `<Button variant="default">${text(p.cancelLabel)}</Button>` : ""}${p.confirmLabel ? `<Button>${text(p.confirmLabel)}</Button>` : ""}</Group>`,
      "</Modal>",
    ].join("\n"),
    imports: [{ from: "@mantine/core", names: ["Button", "Group", "Modal", "Text"] }],
  }),
  antd: ({ props: p }) => ({
    jsx: `<Modal open title=${str(p.title)} okText=${str(p.confirmLabel)} cancelText=${str(p.cancelLabel)}><p>${text(p.body)}</p></Modal>`,
    imports: [{ from: "antd", names: ["Modal"] }],
  }),
  bootstrap: ({ props: p }) => ({
    jsx: [
      "<Modal show centered>",
      `<Modal.Header closeButton><Modal.Title>${text(p.title)}</Modal.Title></Modal.Header>`,
      `<Modal.Body>${text(p.body)}</Modal.Body>`,
      `<Modal.Footer>${p.cancelLabel ? `<Button variant="secondary">${text(p.cancelLabel)}</Button>` : ""}${p.confirmLabel ? `<Button variant="primary">${text(p.confirmLabel)}</Button>` : ""}</Modal.Footer>`,
      "</Modal>",
    ].join("\n"),
    imports: [{ from: "react-bootstrap", names: ["Button", "Modal"] }],
  }),
  chakra: ({ props: p }) => ({
    jsx: [
      "<Dialog.Root defaultOpen>",
      "<Portal>",
      "<Dialog.Backdrop />",
      "<Dialog.Positioner>",
      "<Dialog.Content>",
      `<Dialog.Header><Dialog.Title>${text(p.title)}</Dialog.Title></Dialog.Header>`,
      `<Dialog.Body>${text(p.body)}</Dialog.Body>`,
      `<Dialog.Footer>${p.cancelLabel ? `<Button variant="outline">${text(p.cancelLabel)}</Button>` : ""}${p.confirmLabel ? `<Button>${text(p.confirmLabel)}</Button>` : ""}</Dialog.Footer>`,
      '<Dialog.CloseTrigger asChild><CloseButton size="sm" /></Dialog.CloseTrigger>',
      "</Dialog.Content>",
      "</Dialog.Positioner>",
      "</Portal>",
      "</Dialog.Root>",
    ].join("\n"),
    imports: [{ from: "@chakra-ui/react", names: ["Button", "CloseButton", "Dialog", "Portal"] }],
  }),
};
