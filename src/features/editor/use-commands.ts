"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import type { ArtboardPreset, ComponentType, ID } from "@/core/document/types";
import { registry } from "@/core/registry";
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
        const index = (p?.artboardOrder.filter((id) => p.artboards[id].preset === preset).length ?? 0) + 1;
        commands.addArtboard(preset, t("defaults.artboard.name", { preset: t(`presets.${preset}`), index }));
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
