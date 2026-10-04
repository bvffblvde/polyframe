"use client";

import { Copy, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  EXPORT_TARGETS,
  generateArtboardCode,
  generateProjectCode,
  LAYOUT_STRATEGIES,
  targets,
  type ExportTarget,
  type LayoutStrategy,
} from "@/core/exporters";
import { announce } from "@/lib/announce";
import { formatTsx, highlightTsx } from "@/lib/code-tools";
import { downloadBlob, slugify } from "@/lib/download";
import { zipBlobs } from "@/lib/zip";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";
import { SelectField } from "../inspector/fields";

interface Result {
  key: string;
  fileName: string;
  code: string;
  html: string;
  warnings: string[];
}

export function ExportCodeDialog() {
  const t = useTranslations("exportCode");
  const open = useEditorStore((s) => s.dialog === "exportCode");
  const project = useDocumentStore((s) => s.project);
  const activeId = useEditorStore((s) => s.activeArtboardId);
  const [target, setTarget] = useState<ExportTarget>("shadcn");
  const [strategy, setStrategy] = useState<LayoutStrategy>("absolute");
  const [picked, setPicked] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const artboardId = picked && project?.artboards[picked] ? picked : (activeId ?? project?.artboardOrder[0] ?? null);
  const key = `${project?.id}:${artboardId}:${target}:${strategy}`;

  useEffect(() => {
    if (!open || !project || !artboardId) return;
    let alive = true;
    const file = generateArtboardCode(project, artboardId, target, strategy);
    void (async () => {
      const code = await formatTsx(file.code).catch(() => file.code);
      const html = await highlightTsx(code).catch(() => "");
      if (alive) setResult({ key, fileName: file.fileName, code, html, warnings: file.warnings });
    })();
    return () => {
      alive = false;
    };
  }, [open, project, artboardId, target, strategy, key]);

  const ready = result?.key === key ? result : null;
  const close = () => useEditorStore.getState().set({ dialog: null });

  const copy = async () => {
    if (!ready) return;
    await navigator.clipboard.writeText(ready.code);
    toast.success(t("copied"));
    announce(t("copied"));
  };
  const download = () => ready && downloadBlob(new Blob([ready.code], { type: "text/plain" }), ready.fileName);
  const downloadAll = async () => {
    if (!project) return;
    const files = await Promise.all(
      generateProjectCode(project, target, strategy).map(async (f) => ({
        name: f.fileName,
        blob: new Blob([await formatTsx(f.code).catch(() => f.code)], { type: "text/plain" }),
      })),
    );
    downloadBlob(await zipBlobs(files), `${slugify(project.name)}-${target}.zip`);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-3">
          <SelectField
            label={t("target")}
            value={target}
            options={EXPORT_TARGETS.map((id) => ({ value: id, label: targets[id].label }))}
            onChange={(v) => setTarget(v as ExportTarget)}
          />
          <SelectField
            label={t("strategy")}
            value={strategy}
            options={LAYOUT_STRATEGIES.map((s) => ({ value: s, label: t(s) }))}
            onChange={(v) => setStrategy(v as LayoutStrategy)}
          />
          {project && artboardId && (
            <SelectField
              label={t("artboard")}
              value={artboardId}
              options={project.artboardOrder.map((id) => ({ value: id, label: project.artboards[id].name }))}
              onChange={setPicked}
            />
          )}
        </div>
        {ready && ready.warnings.length > 0 && (
          <p role="alert" className="text-sm text-amber-700">
            {t("warnings", { list: ready.warnings.join(", ") })}
          </p>
        )}
        <div
          className="max-h-[50vh] min-h-48 overflow-auto rounded-md border text-xs [&_pre]:p-4"
          role="region"
          aria-label={t("preview")}
          tabIndex={0}
          data-testid="code-preview"
        >
          {!ready ? (
            <p className="p-4 text-muted-foreground">{t("loading")}</p>
          ) : ready.html ? (
            <div dangerouslySetInnerHTML={{ __html: ready.html }} />
          ) : (
            <pre className="p-4">{ready.code}</pre>
          )}
        </div>
        <DialogFooter>
          {project && project.artboardOrder.length > 1 && (
            <Button variant="outline" onClick={downloadAll}>
              <Download aria-hidden /> {t("downloadAll")}
            </Button>
          )}
          <Button variant="outline" onClick={download} disabled={!ready}>
            <Download aria-hidden /> {t("download")}
          </Button>
          <Button onClick={copy} disabled={!ready}>
            <Copy aria-hidden /> {t("copy")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
