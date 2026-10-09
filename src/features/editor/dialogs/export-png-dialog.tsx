"use client";

import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { announce } from "@/lib/announce";
import { downloadBlob, slugify } from "@/lib/download";
import { updateSettings } from "@/core/document/ops";
import { artboardToSvg } from "@/core/exporters/svg";
import { exportElementPng, findArtboardElement } from "@/lib/export-image";
import { zipBlobs } from "@/lib/zip";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";

type Scope = "active" | "all";

export function ExportPngDialog() {
  const t = useTranslations("exportPng");
  const ta = useTranslations("announce");
  const open = useEditorStore((s) => s.dialog === "exportPng");
  const format = useEditorStore((s) => s.imageFormat);
  const [scope, setScope] = useState<Scope>("active");
  const [scale, setScale] = useState<1 | 2 | 3>(2);
  const [transparent, setTransparent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const transparentId = useId();
  const close = () => useEditorStore.getState().set({ dialog: null });

  const run = async () => {
    const p = useDocumentStore.getState().project;
    if (!p) return;
    setBusy(true);
    setError(false);
    useEditorStore.getState().set({ renderAll: true });
    try {
      await nextFrame();
      const active = useEditorStore.getState().activeArtboardId ?? p.artboardOrder[0];
      const ids = scope === "all" ? p.artboardOrder : [active];
      const files = [];
      const override = useEditorStore.getState().viewOverride;
      const source = override ? updateSettings(p, override) : p;
      for (const id of ids) {
        if (format === "svg") {
          const svg = artboardToSvg(source, id, { transparent });
          files.push({
            name: `${slugify(p.artboards[id].name)}.svg`,
            blob: new Blob([svg], { type: "image/svg+xml" }),
          });
          continue;
        }
        const el = findArtboardElement(id);
        if (!el) continue;
        const blob = await exportElementPng(el, { scale, transparent });
        files.push({ name: `${slugify(p.artboards[id].name)}@${scale}x.png`, blob });
      }
      if (files.length === 1) downloadBlob(files[0].blob, files[0].name);
      else if (files.length > 1) downloadBlob(await zipBlobs(files), `${slugify(p.name)}.zip`);
      announce(ta("exported"));
      close();
    } catch {
      setError(true);
    } finally {
      useEditorStore.getState().set({ renderAll: false });
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label id="img-format">{t("format")}</Label>
            <ToggleGroup
              type="single"
              variant="outline"
              value={format}
              onValueChange={(v) =>
                v && useEditorStore.getState().set({ imageFormat: v as "png" | "svg" })
              }
              aria-labelledby="img-format"
            >
              <ToggleGroupItem value="png">PNG</ToggleGroupItem>
              <ToggleGroupItem value="svg">SVG</ToggleGroupItem>
            </ToggleGroup>
            {format === "svg" && <p className="text-xs text-muted-foreground">{t("svgHint")}</p>}
          </div>
          <div className="space-y-2">
            <Label id="png-scope">{t("scope")}</Label>
            <ToggleGroup
              type="single"
              variant="outline"
              value={scope}
              onValueChange={(v) => v && setScope(v as Scope)}
              aria-labelledby="png-scope"
            >
              <ToggleGroupItem value="active">{t("active")}</ToggleGroupItem>
              <ToggleGroupItem value="all">{t("all")}</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className={format === "svg" ? "hidden" : "space-y-2"}>
            <Label id="png-scale">{t("scale")}</Label>
            <ToggleGroup
              type="single"
              variant="outline"
              value={String(scale)}
              onValueChange={(v) => v && setScale(Number(v) as 1 | 2 | 3)}
              aria-labelledby="png-scale"
            >
              {[1, 2, 3].map((s) => (
                <ToggleGroupItem key={s} value={String(s)}>
                  {s}×
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id={transparentId}
              checked={transparent}
              onCheckedChange={(c) => setTransparent(c === true)}
            />
            <Label htmlFor={transparentId}>{t("transparent")}</Label>
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {t("failed")}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={run} disabled={busy}>
            {busy ? t("exporting") : t("download")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function nextFrame() {
  return new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
}
