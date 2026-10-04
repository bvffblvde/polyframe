"use client";

import { useShallow } from "zustand/react/shallow";
import type { Mode, SkinChoice, SkinId } from "@/core/document/types";
import { structureSkin } from "@/core/skins";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";

export interface ViewSettings {
  mode: Mode;
  skin: SkinChoice;
  structure: SkinId;
  sketch: boolean;
}

export function useViewSettings(): ViewSettings {
  const override = useEditorStore((s) => s.viewOverride);
  const base = useDocumentStore(
    useShallow((s) => ({
      mode: s.project?.settings.mode ?? "wireframe",
      skin: s.project?.settings.skin ?? "shadcn",
      custom: s.project?.settings.customSkin,
      sketch: s.project?.settings.sketchFont ?? false,
    })),
  );
  const mode = override?.mode ?? base.mode;
  const skin = override?.skin ?? base.skin;
  return { mode, skin, structure: structureSkin(skin, base.custom), sketch: base.sketch };
}
