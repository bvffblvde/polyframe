"use client";

import { CopyPlus, Download, FileJson, Maximize, Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type Mode, type Project, type SkinChoice } from "@/core/document/types";
import { decodeShare } from "@/core/serialization/share";
import { Link, useRouter } from "@/i18n/navigation";
import { listProjects, loadProject, getLastProjectId } from "@/lib/persistence/idb";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";
import { importProject, useProjectsStore } from "@/stores/projects-store";
import { useProjectIO } from "../editor/project-io";
import { Viewport } from "../editor/canvas/viewport";
import * as commands from "../editor/commands";
import { ExportPngDialog } from "../editor/dialogs/export-png-dialog";
import { ProjectSkinStyle } from "../editor/canvas/project-skin-style";
import { skinOptions } from "../editor/skin-options";
import { LanguageSwitch } from "../editor/toolbar/language-switch";

function present(p: Project) {
  useDocumentStore.getState().load(p);
  useEditorStore.getState().set({
    selection: [],
    activeArtboardId: p.artboardOrder[0] ?? null,
    viewOverride: { mode: p.settings.mode, skin: p.settings.skin },
    fitRequest: Date.now(),
  });
}

async function show(id: string) {
  const p = await loadProject(id);
  if (p) present(p);
}

export function Viewer({ compact = false }: { compact?: boolean }) {
  const t = useTranslations();
  const list = useProjectsStore((s) => s.list);
  const ready = useProjectsStore((s) => s.ready);
  const projectId = useDocumentStore((s) => s.project?.id);
  const artboards = useDocumentStore((s) => s.project?.artboardOrder);
  const allArtboards = useDocumentStore((s) => s.project?.artboards);
  const activeId = useEditorStore((s) => s.activeArtboardId);
  const view = useEditorStore((s) => s.viewOverride);
  const custom = useDocumentStore((s) => s.project?.settings.customSkin);
  const [shared, setShared] = useState<"none" | "ok" | "invalid">("none");
  const io = useProjectIO();
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    const fromLink = decodeShare(window.location.hash);
    if (fromLink) {
      if (fromLink.ok) present(fromLink.project);
      useProjectsStore.setState({ ready: true });
      queueMicrotask(() => setShared(fromLink.ok ? "ok" : "invalid"));
      return () => {
        useEditorStore.getState().set({ viewOverride: null });
      };
    }
    void (async () => {
      const items = await listProjects();
      if (!alive) return;
      useProjectsStore.setState({ list: items, ready: true });
      const last = await getLastProjectId();
      const id = items.find((m) => m.id === last)?.id ?? items[0]?.id;
      if (id) await show(id);
    })();
    return () => {
      alive = false;
      useEditorStore.getState().set({ viewOverride: null });
    };
  }, []);

  const setView = (patch: Partial<{ mode: Mode; skin: SkinChoice }>) =>
    view && useEditorStore.getState().set({ viewOverride: { ...view, ...patch } });

  return (
    <div className="flex h-dvh flex-col">
      {compact && (
        <div role="note" className="border-b bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-50">
          <p className="font-medium">{t("mobile.title")}</p>
          <p>{t("mobile.description")}</p>
        </div>
      )}
      <header className="flex flex-wrap items-center gap-2 border-b px-3 py-2">
        <span className="font-semibold">{shared === "none" ? t("viewer.title") : t("viewer.shared")}</span>
        <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{t("viewer.readOnly")}</span>
        {shared === "none" && list.length > 0 && (
          <Select value={projectId} onValueChange={(id) => void show(id)}>
            <SelectTrigger size="sm" aria-label={t("viewer.project")} className="max-w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {list.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {view && (
          <>
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={view.mode}
              aria-label={t("toolbar.mode")}
              onValueChange={(v) => v && setView({ mode: v as Mode })}
            >
              <ToggleGroupItem value="wireframe">{t("modes.wireframe")}</ToggleGroupItem>
              <ToggleGroupItem value="styled">{t("modes.styled")}</ToggleGroupItem>
            </ToggleGroup>
            <Select value={view.skin} onValueChange={(v) => setView({ skin: v as SkinChoice })}>
              <SelectTrigger size="sm" aria-label={t("toolbar.skin")} className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {skinOptions(custom, (name) => t("skinEditor.custom", { name })).map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}
        {artboards && artboards.length > 1 && allArtboards && (
          <Select value={activeId ?? undefined} onValueChange={(id) => useEditorStore.getState().set({ activeArtboardId: id })}>
            <SelectTrigger size="sm" aria-label={t("inspector.artboard")} className="max-w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {artboards.map((id) => (
                <SelectItem key={id} value={id}>
                  {allArtboards[id].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label={t("toolbar.zoomOut")} onClick={() => commands.zoomStep(-1)}>
            <Minus aria-hidden />
          </Button>
          <Button variant="ghost" size="icon" aria-label={t("toolbar.zoomFit")} onClick={commands.fitAll}>
            <Maximize aria-hidden />
          </Button>
          <Button variant="ghost" size="icon" aria-label={t("toolbar.zoomIn")} onClick={() => commands.zoomStep(1)}>
            <Plus aria-hidden />
          </Button>
          {shared === "ok" && (
            <>
              <Button
                size="sm"
                onClick={async () => {
                  const p = useDocumentStore.getState().project;
                  if (!p) return;
                  await importProject(p);
                  router.push("/editor");
                }}
              >
                <CopyPlus aria-hidden /> {t("viewer.duplicate")}
              </Button>
              <Button variant="outline" size="sm" onClick={io.exportJson}>
                <FileJson aria-hidden /> {t("viewer.exportJson")}
              </Button>
            </>
          )}
          {projectId && (
            <Button variant="outline" size="sm" onClick={() => useEditorStore.getState().set({ dialog: "exportPng" })}>
              <Download aria-hidden /> PNG
            </Button>
          )}
          {!compact && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/editor">{t("viewer.openEditor")}</Link>
            </Button>
          )}
          <LanguageSwitch />
        </div>
      </header>
      <main className="min-h-0 flex-1">
        {shared === "invalid" ? (
          <p role="alert" className="p-6 text-sm text-destructive">
            {t("viewer.invalidLink")}
          </p>
        ) : shared === "none" && ready && list.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">{t("viewer.noProjects")}</p>
        ) : (
          <Viewport readOnly />
        )}
      </main>
      <ExportPngDialog />
      <ProjectSkinStyle />
    </div>
  );
}
