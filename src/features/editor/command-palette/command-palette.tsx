"use client";

import { FileJson, FolderOpen, Grid3x3, ImageIcon, Keyboard, Languages, Layers, Palette, Plus, Share2, ZoomIn } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { SKIN_IDS, type Mode } from "@/core/document/types";
import { definitions } from "@/core/registry";
import { SKIN_LABELS } from "@/core/skins";
import { TEMPLATES } from "@/core/templates";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useEditorStore, type DialogId } from "@/stores/editor-store";
import { createAndOpenProject, flushSave, openProject, useProjectsStore } from "@/stores/projects-store";
import * as commands from "../commands";
import { useProjectIO } from "../project-io";
import { useCommands, useNewProjectNames, useTemplates } from "../use-commands";

const LOCALE_NAMES: Record<string, string> = { en: "English", uk: "Українська" };

export function CommandPalette() {
  const t = useTranslations();
  const open = useEditorStore((s) => s.dialog === "command");
  const list = useProjectsStore((s) => s.list);
  const cmd = useCommands();
  const io = useProjectIO();
  const names = useNewProjectNames();
  const templates = useTemplates();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const setDialog = (dialog: DialogId) => useEditorStore.getState().set({ dialog });
  const run = (fn: () => void) => () => {
    setDialog(null);
    fn();
  };

  const item = (key: string, label: string, fn: () => void, icon?: ReactNode, shortcut?: string, keywords?: string[]) => (
    <CommandItem key={key} value={`${key} ${label}`} keywords={keywords} onSelect={run(fn)}>
      {icon}
      <span>{label}</span>
      {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
    </CommandItem>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && setDialog(null)}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-xl" showCloseButton={false}>
        <DialogTitle className="sr-only">{t("command.title")}</DialogTitle>
        <DialogDescription className="sr-only">{t("command.placeholder")}</DialogDescription>
        <Command loop>
          <CommandInput placeholder={t("command.placeholder")} />
          <CommandList>
            <CommandEmpty>{t("command.empty")}</CommandEmpty>
            <CommandGroup heading={t("command.insert")}>
              {definitions.map((d) => {
                const Icon = d.icon;
                return item(`insert-${d.type}`, `${t("command.insert")}: ${t(d.labelKey)}`, () => cmd.insert(d.type), <Icon aria-hidden />, undefined, d.keywords);
              })}
            </CommandGroup>
            <CommandGroup heading={t("command.view")}>
              {(["wireframe", "styled"] as Mode[]).map((m) =>
                item(`mode-${m}`, t("command.mode", { name: t(`modes.${m}`) }), () => commands.updateSettings({ mode: m }), <Layers aria-hidden />, "M"),
              )}
              {SKIN_IDS.map((s) =>
                item(`skin-${s}`, t("command.skin", { name: SKIN_LABELS[s] }), () => commands.updateSettings({ skin: s, mode: "styled" }), <Palette aria-hidden />),
              )}
              {item("snap", t("toolbar.snapToGrid"), cmd.toggleSnap, <Grid3x3 aria-hidden />, "G")}
              {item("fit", t("toolbar.zoomFit"), commands.fitAll, <ZoomIn aria-hidden />, "⌘0")}
              {item("zoom100", t("toolbar.zoom100"), () => commands.zoomTo(1), <ZoomIn aria-hidden />, "⌘1")}
              {item("zoomIn", t("toolbar.zoomIn"), () => commands.zoomStep(1), <ZoomIn aria-hidden />, "⌘=")}
              {item("zoomOut", t("toolbar.zoomOut"), () => commands.zoomStep(-1), <ZoomIn aria-hidden />, "⌘−")}
            </CommandGroup>
            <CommandGroup heading={t("command.export")}>
              {item("exportPng", t("command.exportPng"), () => setDialog("exportPng"), <ImageIcon aria-hidden />)}
              {item("exportCode", t("command.exportCode"), () => setDialog("exportCode"), <FileJson aria-hidden />)}
              {item("exportJson", t("command.exportJson"), io.exportJson, <FileJson aria-hidden />)}
              {item("share", t("toolbar.share"), () => setDialog("share"), <Share2 aria-hidden />)}
            </CommandGroup>
            <CommandGroup heading={t("command.project")}>
              {item("new", t("toolbar.newProject"), () => void createAndOpenProject(names), <Plus aria-hidden />)}
              {TEMPLATES.map((tpl) =>
                item(`tpl-${tpl.id}`, t("command.template", { name: t(`templates.names.${tpl.id}`) }), () => void templates.create(tpl.id), <Plus aria-hidden />),
              )}
              {item("projects", t("command.open"), () => setDialog("projects"), <FolderOpen aria-hidden />)}
              {list.map((m) =>
                item(`open-${m.id}`, t("command.openProject", { name: m.name }), async () => {
                  await flushSave();
                  await openProject(m.id);
                }, <FolderOpen aria-hidden />),
              )}
            </CommandGroup>
            <CommandGroup heading={t("command.language")}>
              {routing.locales
                .filter((l) => l !== locale)
                .map((l) =>
                  item(`lang-${l}`, LOCALE_NAMES[l], async () => {
                    await flushSave();
                    router.replace(pathname, { locale: l });
                  }, <Languages aria-hidden />),
                )}
            </CommandGroup>
            <CommandGroup heading={t("command.help")}>
              {item("shortcuts", t("toolbar.shortcuts"), () => setDialog("shortcuts"), <Keyboard aria-hidden />, "?")}
              {item("tour", t("toolbar.tour"), () => useEditorStore.getState().set({ tour: 0 }), <Keyboard aria-hidden />)}
              {item("guide", t("toolbar.guide"), () => window.open(`/${locale}/guide`, "_blank"), <Keyboard aria-hidden />)}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
