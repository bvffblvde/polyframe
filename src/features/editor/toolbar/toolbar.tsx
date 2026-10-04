"use client";

import { ChevronDown, Download, Grid3x3, Keyboard, Minus, MonitorSmartphone, Plus, Redo2, Share2, Undo2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GRID_SIZES, SKIN_IDS, type GridSize, type Mode, type SkinId } from "@/core/document/types";
import { ZOOM_STEPS } from "@/core/geometry/viewport";
import { SKIN_LABELS } from "@/core/skins";
import { FILE_EXTENSION } from "@/core/serialization/json";
import { Link } from "@/i18n/navigation";
import { useDocumentStore, useHistory } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";
import { createAndOpenProject, useProjectsStore } from "@/stores/projects-store";
import * as commands from "../commands";
import { useProjectIO } from "../project-io";
import { useCommands, useNewProjectNames } from "../use-commands";
import { IconButton } from "./icon-button";
import { LanguageSwitch } from "./language-switch";

export function Toolbar() {
  const t = useTranslations("toolbar");
  const tm = useTranslations("modes");
  const tMeta = useTranslations("meta");
  const settings = useDocumentStore((s) => s.project?.settings);
  const name = useDocumentStore((s) => s.project?.name);
  const zoom = useEditorStore((s) => s.viewport.zoom);
  const status = useProjectsStore((s) => s.status);
  const { canUndo, canRedo } = useHistory();
  const cmd = useCommands();
  const names = useNewProjectNames();
  const io = useProjectIO();
  const fileRef = useRef<HTMLInputElement>(null);
  const openDialog = (dialog: "projects" | "exportPng" | "shortcuts" | "share") => useEditorStore.getState().set({ dialog });
  if (!settings) return null;

  return (
    <header className="flex h-12 shrink-0 items-center gap-1 border-b bg-background px-2" aria-label={tMeta("title")}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="max-w-48 font-semibold">
            <span className="truncate">{name}</span>
            <ChevronDown aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>{t("project")}</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => createAndOpenProject(names)}>{t("newProject")}</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => openDialog("projects")}>{t("openProjects")}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => fileRef.current?.click()}>{t("importJson")}</DropdownMenuItem>
          <DropdownMenuItem onSelect={io.exportJson}>{t("exportJson")}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        ref={fileRef}
        type="file"
        accept={`${FILE_EXTENSION},.json,application/json`}
        className="hidden"
        data-testid="import-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void io.importFile(file);
        }}
      />
      <Separator orientation="vertical" className="mx-1 h-6!" />
      <IconButton label={t("undo")} shortcut="⌘Z" onClick={cmd.undo} disabled={!canUndo}>
        <Undo2 aria-hidden />
      </IconButton>
      <IconButton label={t("redo")} shortcut="⌘⇧Z" onClick={cmd.redo} disabled={!canRedo}>
        <Redo2 aria-hidden />
      </IconButton>
      <Separator orientation="vertical" className="mx-1 h-6!" />
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={settings.mode}
        aria-label={t("mode")}
        onValueChange={(v) => v && commands.updateSettings({ mode: v as Mode })}
      >
        <ToggleGroupItem value="wireframe">{tm("wireframe")}</ToggleGroupItem>
        <ToggleGroupItem value="styled">{tm("styled")}</ToggleGroupItem>
      </ToggleGroup>
      <Select value={settings.skin} onValueChange={(v) => commands.updateSettings({ skin: v as SkinId })}>
        <SelectTrigger size="sm" aria-label={t("skin")} className="w-[130px]" data-testid="skin-select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SKIN_IDS.map((id) => (
            <SelectItem key={id} value={id}>
              {SKIN_LABELS[id]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" aria-label={t("grid")}>
            <Grid3x3 aria-hidden />
            <ChevronDown aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={settings.grid.enabled} onCheckedChange={cmd.toggleSnap}>
            {t("snapToGrid")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={settings.grid.visible}
            onCheckedChange={(visible) => commands.updateSettings({ grid: { ...settings.grid, visible } })}
          >
            {t("showGrid")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>{t("gridSize")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={String(settings.grid.size)}
            onValueChange={(v) => commands.updateSettings({ grid: { ...settings.grid, size: Number(v) as GridSize } })}
          >
            {GRID_SIZES.map((g) => (
              <DropdownMenuRadioItem key={g} value={String(g)}>
                {g}px
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Separator orientation="vertical" className="mx-1 h-6!" />
      <IconButton label={t("zoomOut")} shortcut="⌘−" onClick={() => commands.zoomStep(-1)}>
        <Minus aria-hidden />
      </IconButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="w-16 tabular-nums" aria-label={t("zoomMenu")} data-testid="zoom-level">
            {Math.round(zoom * 100)}%
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={commands.fitAll}>{t("zoomFit")}</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => commands.zoomTo(1)}>{t("zoom100")}</DropdownMenuItem>
          <DropdownMenuSeparator />
          {ZOOM_STEPS.map((z) => (
            <DropdownMenuItem key={z} onSelect={() => commands.zoomTo(z)}>
              {Math.round(z * 100)}%
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <IconButton label={t("zoomIn")} shortcut="⌘=" onClick={() => commands.zoomStep(1)}>
        <Plus aria-hidden />
      </IconButton>
      <div className="ml-auto flex items-center gap-1">
        <span className="px-2 text-xs text-muted-foreground" role="status" data-testid="save-status">
          {status === "saved" ? t("saved") : status === "error" ? t("saveError") : status === "idle" ? "" : t("saving")}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download aria-hidden /> {t("export")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => openDialog("exportPng")}>{t("exportPng")}</DropdownMenuItem>
            <DropdownMenuItem onSelect={io.exportJson}>JSON</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" onClick={() => openDialog("share")}>
          <Share2 aria-hidden /> {t("share")}
        </Button>
        <IconButton label={t("viewer")} asChild>
          <Link href="/view">
            <MonitorSmartphone aria-hidden />
          </Link>
        </IconButton>
        <IconButton label={t("shortcuts")} shortcut="?" onClick={() => openDialog("shortcuts")}>
          <Keyboard aria-hidden />
        </IconButton>
        <LanguageSwitch />
      </div>
    </header>
  );
}
