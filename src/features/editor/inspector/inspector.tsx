"use client";

import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignStartHorizontal,
  AlignStartVertical,
  AlignVerticalDistributeCenter,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as ops from "@/core/document/ops";
import {
  ARTBOARD_PRESETS,
  COLOR_ROLES,
  GRID_SIZES,
  PRESET_SIZES,
  type ColorRole,
  type GridSize,
  type ID,
  type Mode,
  type Node,
  type NodeStyle,
  type SkinChoice,
} from "@/core/document/types";
import { registry } from "@/core/registry";
import { layoutParent } from "@/core/document/autolayout";
import { applyOp as apply, useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";
import * as commands from "../commands";
import { NumberField, Section, SelectField, SwitchField, TextField } from "./fields";
import { SchemaForm } from "./schema-form";
import { skinOptions } from "../skin-options";

export function Inspector() {
  const selection = useEditorStore((s) => s.selection);
  return (
    <ScrollArea className="h-full">
      {selection.length === 0 && <ProjectInspector />}
      {selection.length === 1 && <NodeInspector id={selection[0]} />}
      {selection.length > 1 && <MultiInspector ids={selection} />}
    </ScrollArea>
  );
}

function NodeInspector({ id }: { id: ID }) {
  const t = useTranslations("inspector");
  const node = useDocumentStore((s) => s.project?.nodes[id]);
  const inStack = useDocumentStore((s) =>
    Boolean(s.project && node && layoutParent(s.project, node)),
  );
  if (!node) return null;
  const def = registry[node.type];
  const set = (patch: Parameters<typeof ops.updateNode>[2]) =>
    apply((p) => ops.updateNode(p, id, patch));
  return (
    <>
      <Section title={t("common")}>
        <TextField
          label={t("name")}
          value={node.name}
          onCommit={(name) => name.trim() && set({ name: name.trim() })}
        />
        {inStack && (
          <div className="flex items-center justify-between gap-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            <span>{t("inLayout")}</span>
            <Button variant="outline" size="sm" onClick={commands.removeFromStack}>
              {t("removeFromLayout")}
            </Button>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <NumberField
            inline
            label={t("x")}
            value={node.x}
            onCommit={(x) => x !== undefined && set({ x })}
          />
          <NumberField
            inline
            label={t("y")}
            value={node.y}
            onCommit={(y) => y !== undefined && set({ y })}
          />
          <NumberField
            inline
            label={t("w")}
            min={def.minSize.w}
            value={node.w}
            onCommit={(w) => w !== undefined && set({ w })}
          />
          <NumberField
            inline
            label={t("h")}
            min={def.minSize.h}
            value={node.h}
            onCommit={(h) => h !== undefined && set({ h })}
          />
        </div>
        <SharedLayerFields nodes={[node]} />
      </Section>
      <Section title={t("component")}>
        <SchemaForm
          schema={def.propsSchema}
          values={node.props}
          onChange={(key, value) => apply((p) => ops.updateNodeProps(p, id, { [key]: value }))}
        />
      </Section>
      <StyleSection nodes={[node]} />
      <AlignSection count={1} />
    </>
  );
}

function MultiInspector({ ids }: { ids: ID[] }) {
  const t = useTranslations("inspector");
  const nodes = useDocumentStore(
    useShallow((s) => ids.map((id) => s.project?.nodes[id]).filter((n): n is Node => Boolean(n))),
  );
  return (
    <>
      <Section title={t("common")}>
        <p className="text-sm">{t("selectedCount", { count: nodes.length })}</p>
        <SharedLayerFields nodes={nodes} />
      </Section>
      <StyleSection nodes={nodes} />
      <AlignSection count={nodes.length} />
    </>
  );
}

function shared<T>(values: T[]): T | undefined {
  return values.every((v) => v === values[0]) ? values[0] : undefined;
}

function SharedLayerFields({ nodes }: { nodes: Node[] }) {
  const t = useTranslations("inspector");
  const ids = nodes.map((n) => n.id);
  const opacity = shared(nodes.map((n) => n.opacity));
  return (
    <>
      <SwitchField
        label={t("locked")}
        checked={nodes.every((n) => n.locked)}
        onChange={(locked) => apply((p) => ops.updateNodes(p, ids, { locked }))}
      />
      <SwitchField
        label={t("hidden")}
        checked={nodes.every((n) => n.hidden)}
        onChange={(hidden) => apply((p) => ops.updateNodes(p, ids, { hidden }))}
      />
      <NumberField
        label={`${t("opacity")} %`}
        min={0}
        max={100}
        value={opacity === undefined ? undefined : Math.round(opacity * 100)}
        onCommit={(v) =>
          v !== undefined && apply((p) => ops.updateNodes(p, ids, { opacity: v / 100 }))
        }
      />
    </>
  );
}

function StyleSection({ nodes }: { nodes: Node[] }) {
  const t = useTranslations();
  const mode = useDocumentStore((s) => s.project?.settings.mode);
  if (mode !== "styled") return null;
  const ids = nodes.map((n) => n.id);
  const setStyle = (style: NodeStyle) => apply((p) => ops.updateNodeStyle(p, ids, style));
  const role = shared(nodes.map((n) => n.style?.colorRole));
  const radius = shared(nodes.map((n) => n.style?.radius));
  const shadow = shared(nodes.map((n) => n.style?.shadow));
  return (
    <Section title={t("inspector.style")}>
      <SelectField
        label={t("inspector.colorRole")}
        value={role ?? "default"}
        options={[
          { value: "default", label: t("roles.default") },
          ...COLOR_ROLES.map((r) => ({ value: r, label: t(`roles.${r}`) })),
        ]}
        onChange={(v) => setStyle({ colorRole: v === "default" ? undefined : (v as ColorRole) })}
      />
      <NumberField
        label={t("inspector.radius")}
        min={0}
        max={999}
        allowEmpty
        placeholder={t("inspector.auto")}
        value={radius}
        onCommit={(r) => setStyle({ radius: r })}
      />
      <SelectField
        label={t("inspector.shadow")}
        value={shadow === undefined ? "auto" : String(shadow)}
        options={[
          { value: "auto", label: t("inspector.auto") },
          { value: "0", label: t("inspector.none") },
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
        ]}
        onChange={(v) =>
          setStyle({ shadow: v === "auto" ? undefined : (Number(v) as 0 | 1 | 2 | 3) })
        }
      />
    </Section>
  );
}

function AlignSection({ count }: { count: number }) {
  const t = useTranslations("inspector");
  const aligns = [
    { label: t("alignLeft"), icon: AlignStartVertical, run: () => commands.align("left") },
    { label: t("alignCenter"), icon: AlignCenterVertical, run: () => commands.align("center") },
    { label: t("alignRight"), icon: AlignEndVertical, run: () => commands.align("right") },
    { label: t("alignTop"), icon: AlignStartHorizontal, run: () => commands.align("top") },
    { label: t("alignMiddle"), icon: AlignCenterHorizontal, run: () => commands.align("middle") },
    { label: t("alignBottom"), icon: AlignEndHorizontal, run: () => commands.align("bottom") },
  ];
  const distributes = [
    {
      label: t("distributeX"),
      icon: AlignHorizontalDistributeCenter,
      run: () => commands.distribute("x"),
    },
    {
      label: t("distributeY"),
      icon: AlignVerticalDistributeCenter,
      run: () => commands.distribute("y"),
    },
  ];
  return (
    <Section title={t("align")}>
      <div className="flex flex-wrap gap-1">
        {aligns.map((a) => (
          <Button
            key={a.label}
            variant="outline"
            size="icon"
            aria-label={a.label}
            title={a.label}
            onClick={a.run}
          >
            <a.icon aria-hidden />
          </Button>
        ))}
        {count >= 3 &&
          distributes.map((a) => (
            <Button
              key={a.label}
              variant="outline"
              size="icon"
              aria-label={a.label}
              title={a.label}
              onClick={a.run}
            >
              <a.icon aria-hidden />
            </Button>
          ))}
      </div>
    </Section>
  );
}

function ProjectInspector() {
  const t = useTranslations();
  const project = useDocumentStore((s) => s.project);
  const activeId = useEditorStore((s) => s.activeArtboardId);
  if (!project) return null;
  const s = project.settings;
  const a = activeId ? project.artboards[activeId] : undefined;
  const setArtboard = (patch: Parameters<typeof ops.updateArtboard>[2]) =>
    a && apply((p) => ops.updateArtboard(p, a.id, patch));
  return (
    <>
      <Section title={t("inspector.project")}>
        <TextField
          label={t("inspector.projectName")}
          value={project.name}
          onCommit={(name) => name.trim() && apply((p) => ops.renameProject(p, name.trim()))}
        />
        <SelectField
          label={t("inspector.mode")}
          value={s.mode}
          options={(["wireframe", "styled"] as Mode[]).map((m) => ({
            value: m,
            label: t(`modes.${m}`),
          }))}
          onChange={(mode) => commands.updateSettings({ mode: mode as Mode })}
        />
        <SelectField
          label={t("inspector.skin")}
          value={s.skin}
          options={skinOptions(s.customSkin, (name) => t("skinEditor.custom", { name }))}
          onChange={(skin) => commands.updateSettings({ skin: skin as SkinChoice })}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => useEditorStore.getState().set({ dialog: "customSkin" })}
        >
          {t("skinEditor.open")}
        </Button>
        <SwitchField
          label={t("inspector.sketchFont")}
          checked={s.sketchFont}
          onChange={(sketchFont) => commands.updateSettings({ sketchFont })}
        />
        <SwitchField
          label={t("inspector.snap")}
          checked={s.grid.enabled}
          onChange={(enabled) => commands.updateSettings({ grid: { ...s.grid, enabled } })}
        />
        <SwitchField
          label={t("inspector.showGrid")}
          checked={s.grid.visible}
          onChange={(visible) => commands.updateSettings({ grid: { ...s.grid, visible } })}
        />
        <SelectField
          label={t("inspector.gridSize")}
          value={String(s.grid.size)}
          options={GRID_SIZES.map((g) => ({ value: String(g), label: `${g}px` }))}
          onChange={(v) =>
            commands.updateSettings({ grid: { ...s.grid, size: Number(v) as GridSize } })
          }
        />
      </Section>
      {a && (
        <Section title={t("inspector.artboard")}>
          <TextField
            label={t("inspector.artboardName")}
            value={a.name}
            onCommit={(name) => name.trim() && setArtboard({ name: name.trim() })}
          />
          <SelectField
            label={t("inspector.preset")}
            value={a.preset}
            options={ARTBOARD_PRESETS.map((p) => ({ value: p, label: t(`presets.${p}`) }))}
            onChange={(v) => {
              const preset = v as (typeof ARTBOARD_PRESETS)[number];
              setArtboard(preset === "custom" ? { preset } : { preset, ...PRESET_SIZES[preset] });
            }}
          />
          <div className="grid grid-cols-2 gap-2">
            <NumberField
              label={t("inspector.width")}
              min={1}
              max={10000}
              value={a.width}
              onCommit={(width) => width && setArtboard({ width, preset: "custom" })}
            />
            <NumberField
              label={t("inspector.height")}
              min={1}
              max={10000}
              value={a.height}
              onCommit={(height) => height && setArtboard({ height, preset: "custom" })}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            disabled={project.artboardOrder.length <= 1}
            onClick={() => commands.removeArtboard(a.id)}
          >
            <Trash2 aria-hidden /> {t("inspector.deleteArtboard")}
          </Button>
        </Section>
      )}
    </>
  );
}
