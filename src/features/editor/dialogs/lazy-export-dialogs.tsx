"use client";

import { lazy, Suspense, useState, type ComponentType } from "react";
import { useEditorStore, type DialogId } from "@/stores/editor-store";

function lazyDialog(id: DialogId, load: () => Promise<ComponentType>) {
  const Dialog = lazy(() => load().then((C) => ({ default: C })));
  return function LazyDialog() {
    const open = useEditorStore((s) => s.dialog === id);
    const [mounted, setMounted] = useState(false);
    if (open && !mounted) setMounted(true);
    if (!mounted && !open) return null;
    return (
      <Suspense fallback={null}>
        <Dialog />
      </Suspense>
    );
  };
}

export const ExportPngDialog = lazyDialog("exportPng", () =>
  import("./export-png-dialog").then((m) => m.ExportPngDialog),
);
export const ExportCodeDialog = lazyDialog("exportCode", () =>
  import("./export-code-dialog").then((m) => m.ExportCodeDialog),
);
