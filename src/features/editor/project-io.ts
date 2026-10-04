"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { toast } from "sonner";
import { FILE_EXTENSION, parseProjectJson, serializeProject } from "@/core/serialization/json";
import { announce } from "@/lib/announce";
import { downloadBlob, slugify } from "@/lib/download";
import { useDocumentStore } from "@/stores/document-store";
import { importProject } from "@/stores/projects-store";

export function useProjectIO() {
  const t = useTranslations();
  const exportJson = useCallback(() => {
    const p = useDocumentStore.getState().project;
    if (!p) return;
    downloadBlob(new Blob([serializeProject(p)], { type: "application/json" }), `${slugify(p.name)}${FILE_EXTENSION}`);
    announce(t("announce.exported"));
  }, [t]);

  const importFile = useCallback(
    async (file: File) => {
      const r = parseProjectJson(await file.text());
      if (!r.ok) {
        toast.error(t(`import.${r.error.code}`, r.error.params));
        return;
      }
      await importProject(r.project);
      toast.success(t("import.success"));
      announce(t("import.success"));
    },
    [t],
  );

  return { exportJson, importFile };
}
