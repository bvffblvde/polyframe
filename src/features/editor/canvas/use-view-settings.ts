"use client";

import { useShallow } from "zustand/react/shallow";
import type { Mode, SkinId } from "@/core/document/types";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";

export function useViewSettings(): { mode: Mode; skin: SkinId; sketch: boolean } {
  const override = useEditorStore((s) => s.viewOverride);
  const base = useDocumentStore(
    useShallow((s) => ({
      mode: s.project?.settings.mode ?? "wireframe",
      skin: s.project?.settings.skin ?? "shadcn",
      sketch: s.project?.settings.sketchFont ?? false,
    })),
  );
  return override ? { ...base, ...override } : base;
}
