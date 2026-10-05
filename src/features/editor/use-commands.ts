"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import type { ArtboardPreset, ComponentType, ID } from "@/core/document/types";
import { registry } from "@/core/registry";
import { addTemplateArtboard, getTemplate, instantiateTemplate } from "@/core/templates";
import { centerOn } from "@/core/geometry/viewport";
import { applyOp, useDocumentStore as docStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";
import { newId } from "@/lib/ids";
import { saveAndOpen } from "@/stores/projects-store";
import { announce } from "@/lib/announce";
import { useDocumentStore } from "@/stores/document-store";
import * as commands from "./commands";

export function useCommands() {
  const t = useTranslations();
  return useMemo(() => {
    const defaults = (key: string) => t(`defaults.${key}`);
    const count = (key: string, n: number) => {
      if (n) announce(t(key, { count: n }));
    };
    return {
      insert(type: ComponentType, at?: { artboardId: ID; x: number; y: number }) {
        const name = t(registry[type].labelKey);
        if (commands.insertNode(type, defaults, name, at)) announce(t("announce.added", { name }));
      },
      remove: () => count("announce.deleted", commands.deleteSelection()),
      duplicate: () => count("announce.duplicated", commands.duplicateSelection()),
      copy: () => count("announce.copied", commands.copySelection()),
      cut() {
        const n = commands.copySelection();
        commands.deleteSelection();
        count("announce.cut", n);
      },
      paste: () => count("announce.pasted", commands.paste()),
      selectAll: () => count("announce.selected", commands.selectAll()),
      undo() {
        commands.undo();
        announce(t("announce.undo"));
      },
      redo() {
        commands.redo();
        announce(t("announce.redo"));
      },
      group() {
        if (commands.group()) announce(t("announce.grouped"));
      },
      ungroup() {
        if (commands.ungroup()) announce(t("announce.ungrouped"));
      },
      wrap() {
        if (commands.wrapSelection("stack", defaults, t("components.stack")))
          announce(t("announce.wrapped"));
      },
      wrapGrid() {
        if (commands.wrapSelection("grid", defaults, t("components.grid")))
          announce(t("announce.wrappedGrid"));
      },
      toggleMode() {
        const mode = commands.toggleMode();
        if (mode) announce(t("announce.mode", { mode: t(`modes.${mode}`) }));
      },
      toggleSnap() {
        const on = commands.toggleSnap();
        if (on !== null) announce(t(on ? "announce.snapOn" : "announce.snapOff"));
      },
      addArtboard(preset: ArtboardPreset) {
        const p = useDocumentStore.getState().project;
        const index =
          (p?.artboardOrder.filter((id) => p.artboards[id].preset === preset).length ?? 0) + 1;
        commands.addArtboard(
          preset,
          t("defaults.artboard.name", { preset: t(`presets.${preset}`), index }),
        );
      },
    };
  }, [t]);
}

export function useNewProjectNames() {
  const t = useTranslations();
  return useMemo(
    () => ({
      project: t("defaults.project.name"),
      artboard: (preset: ArtboardPreset, index: number) =>
        t("defaults.artboard.name", { preset: t(`presets.${preset}`), index }),
    }),
    [t],
  );
}

export function useTemplates() {
  const t = useTranslations();
  return useMemo(
    () => ({
      async create(id: string) {
        const tpl = getTemplate(id);
        if (!tpl) return;
        const p = instantiateTemplate(tpl, {
          t: (k) => t(k),
          genId: newId,
          now: new Date().toISOString(),
          projectName: t(`templates.names.${id}`),
          artboardName: t("defaults.artboard.name", {
            preset: t(`presets.${tpl.preset}`),
            index: 1,
          }),
        });
        await saveAndOpen(p);
      },
      addToProject(id: string) {
        const tpl = getTemplate(id);
        const current = docStore.getState().project;
        if (!tpl || !current) return;
        const name = t(`templates.names.${id}`);
        let added = "";
        applyOp((p) => {
          const r = addTemplateArtboard(p, tpl, {
            t: (k) => t(k),
            genId: newId,
            artboardName: name,
          });
          added = r.artboardId;
          return r.project;
        });
        const a = docStore.getState().project?.artboards[added];
        if (!a) return;
        const ed = useEditorStore.getState();
        ed.set({
          activeArtboardId: a.id,
          selection: [],
          viewport: centerOn(
            { x: a.x + a.width / 2, y: a.y + a.height / 2 },
            Math.min(ed.viewport.zoom, 0.5),
            ed.viewSize,
          ),
        });
        announce(t("templates.added", { name }));
      },
    }),
    [t],
  );
}
