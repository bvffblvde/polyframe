"use client";

import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEditorStore } from "@/stores/editor-store";

const ROWS: [string, string][] = [
  ["undoRedo", "⌘Z / ⌘⇧Z"],
  ["duplicateDelete", "⌘D / Del"],
  ["copyPaste", "⌘C / ⌘V"],
  ["selectAll", "⌘A"],
  ["group", "⌘G / ⌘⇧G"],
  ["nudge", "↑↓←→ / ⇧ + ↑↓←→"],
  ["zOrder", "⌘] / ⌘["],
  ["zOrderEdge", "⌘⇧] / ⌘⇧["],
  ["toggleSnap", "G"],
  ["toggleMode", "M"],
  ["zoom", "⌘0 / ⌘1 / ⌘= / ⌘−"],
  ["pan", "Space + drag"],
  ["resize", "⇧ / ⌥"],
  ["noSnap", "⌥"],
  ["deselect", "Esc"],
  ["cheatsheet", "?"],
];

export function ShortcutsDialog() {
  const t = useTranslations("shortcuts");
  const open = useEditorStore((s) => s.dialog === "shortcuts");
  return (
    <Dialog open={open} onOpenChange={(o) => !o && useEditorStore.getState().set({ dialog: null })}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <table className="w-full text-sm">
          <tbody>
            {ROWS.map(([key, keys]) => (
              <tr key={key} className="border-b last:border-b-0">
                <td className="py-1.5 pr-4">{t(key)}</td>
                <td className="py-1.5 text-right">
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">{keys}</kbd>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
}
