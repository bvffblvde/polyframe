"use client";

import { customSkinCss } from "@/core/skins";
import { useDocumentStore } from "@/stores/document-store";

export function ProjectSkinStyle() {
  const custom = useDocumentStore((s) => s.project?.settings.customSkin);
  if (!custom) return null;
  return <style data-custom-skin>{customSkinCss(custom)}</style>;
}
