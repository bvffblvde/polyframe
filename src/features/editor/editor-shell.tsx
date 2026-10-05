"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ComponentType } from "@/core/document/types";
import { containsPoint } from "@/core/geometry/rect";
import { screenToWorld } from "@/core/geometry/viewport";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";
import { initProjects, startAutosave, useProjectsStore } from "@/stores/projects-store";
import { Viewer } from "../viewer/viewer";
import { Viewport } from "./canvas/viewport";
import { ExportCodeDialog } from "./dialogs/export-code-dialog";
import { CustomSkinDialog } from "./dialogs/custom-skin-dialog";
import { ProjectSkinStyle } from "./canvas/project-skin-style";
import { ExportPngDialog } from "./dialogs/export-png-dialog";
import { ProjectsDialog } from "./dialogs/projects-dialog";
import { ShareDialog } from "./dialogs/share-dialog";
import { CommandPalette } from "./command-palette/command-palette";
import { EditorContextMenu } from "./context-menu/editor-context-menu";
import { Tour } from "./tour/tour";
import { tourDone } from "./tour/steps";
import { ShortcutsDialog } from "./dialogs/shortcuts-dialog";
import { Inspector } from "./inspector/inspector";
import { LayersPanel } from "./layers/layers-panel";
import { Palette, PaletteDragPreview } from "./palette/palette";
import { useShortcuts } from "./shortcuts";
import { Toolbar } from "./toolbar/toolbar";
import { useCommands, useNewProjectNames } from "./use-commands";

export function EditorApp() {
  const wide = useMediaQuery("(min-width: 1024px)");
  return wide ? <Editor /> : <Viewer compact />;
}

function Editor() {
  const t = useTranslations();
  const names = useNewProjectNames();
  const ready = useProjectsStore((s) => s.ready);
  const leftTab = useEditorStore((s) => s.leftTab);
  const cmd = useCommands();
  const [dragType, setDragType] = useState<ComponentType | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  useShortcuts(cmd);

  useEffect(() => {
    useEditorStore.getState().set({ viewOverride: null });
    const stop = startAutosave();
    void initProjects(names);
    return stop;
  }, [names]);

  useEffect(() => {
    if (ready && !tourDone()) useEditorStore.getState().set({ tour: 0 });
  }, [ready]);

  const onDragStart = (e: DragStartEvent) => setDragType((e.active.data.current?.type as ComponentType) ?? null);
  const onDragEnd = (e: DragEndEvent) => {
    setDragType(null);
    const type = e.active.data.current?.type as ComponentType | undefined;
    const start = e.activatorEvent as PointerEvent;
    const canvas = document.querySelector<HTMLElement>("[data-testid=canvas]");
    const p = useDocumentStore.getState().project;
    if (!type || e.over?.id !== "canvas" || !canvas || !p || !("clientX" in start)) return;
    const r = canvas.getBoundingClientRect();
    const world = screenToWorld(
      { x: start.clientX + e.delta.x - r.left, y: start.clientY + e.delta.y - r.top },
      useEditorStore.getState().viewport,
    );
    const artboardId = p.artboardOrder.find((id) => {
      const a = p.artboards[id];
      return containsPoint({ x: a.x, y: a.y, w: a.width, h: a.height }, world);
    });
    if (!artboardId) return;
    const a = p.artboards[artboardId];
    cmd.insert(type, { artboardId, x: world.x - a.x, y: world.y - a.y });
  };

  if (!ready) {
    return <div className="grid h-dvh place-items-center text-sm text-muted-foreground">{t("common.loading")}</div>;
  }

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setDragType(null)}>
      <div className="flex h-dvh flex-col overflow-hidden">
        <Toolbar />
        <div className="flex min-h-0 flex-1">
          <aside className="flex w-64 shrink-0 flex-col border-r bg-background" aria-label={t("panels.components")} data-tour="palette">
            <Tabs
              value={leftTab}
              onValueChange={(v) => useEditorStore.getState().set({ leftTab: v as "components" | "layers" })}
              className="flex min-h-0 flex-1 flex-col gap-0"
            >
              <TabsList className="m-2 grid w-auto grid-cols-2">
                <TabsTrigger value="components">{t("panels.components")}</TabsTrigger>
                <TabsTrigger value="layers" data-tour="layers-tab">
                  {t("panels.layers")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="components" className="min-h-0 flex-1">
                <Palette />
              </TabsContent>
              <TabsContent value="layers" className="min-h-0 flex-1">
                <LayersPanel />
              </TabsContent>
            </Tabs>
          </aside>
          <main className="min-w-0 flex-1" data-tour="canvas">
            <EditorContextMenu>
              <div className="size-full">
                <CanvasDropZone />
              </div>
            </EditorContextMenu>
          </main>
          <aside className="w-72 shrink-0 border-l bg-background" aria-label={t("panels.inspector")} data-tour="inspector">
            <Inspector />
          </aside>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>{dragType && <PaletteDragPreview type={dragType} />}</DragOverlay>
      <ProjectsDialog />
      <ExportPngDialog />
      <ExportCodeDialog />
      <CustomSkinDialog />
      <ProjectSkinStyle />
      <ShortcutsDialog />
      <ShareDialog />
      <CommandPalette />
      <Tour />
    </DndContext>
  );
}

function CanvasDropZone() {
  const { setNodeRef } = useDroppable({ id: "canvas" });
  return <Viewport dropRef={setNodeRef} />;
}
