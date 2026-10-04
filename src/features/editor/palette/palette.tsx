"use client";

import { useDraggable } from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import { memo, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ComponentType, Mode, SkinChoice, SkinId } from "@/core/document/types";
import { CATEGORIES, registry, searchDefinitions, type AnyDefinition } from "@/core/registry";
import { ArtboardRoot } from "../canvas/artboard-root";
import { useViewSettings } from "../canvas/use-view-settings";
import { useCommands } from "../use-commands";

const THUMB = { w: 88, h: 52 };

export function Palette() {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchDefinitions(query, (d) => t(d.labelKey)), [query, t]);
  const { mode, skin, structure } = useViewSettings();
  const cmd = useCommands();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="p-3">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("panels.search")}
          aria-label={t("panels.search")}
        />
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 px-3 pb-4">
          {results.length === 0 && <p className="text-sm text-muted-foreground">{t("panels.noResults")}</p>}
          {CATEGORIES.map((cat) => {
            const items = results.filter((d) => d.category === cat);
            if (!items.length) return null;
            return (
              <section key={cat} aria-labelledby={`cat-${cat}`}>
                <h3 id={`cat-${cat}`} className="mb-2 text-xs font-medium text-muted-foreground uppercase">
                  {t(`categories.${cat}`)}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {items.map((d) => (
                    <PaletteItem
                      key={d.type}
                      def={d}
                      label={t(d.labelKey)}
                      insertLabel={t("panels.insert", { name: t(d.labelKey) })}
                      mode={mode}
                      skin={skin}
                      structure={structure}
                      onInsert={() => cmd.insert(d.type)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ItemProps {
  def: AnyDefinition;
  label: string;
  insertLabel: string;
  mode: Mode;
  skin: SkinChoice;
  structure: SkinId;
  onInsert: () => void;
}

function PaletteItem({ def, label, insertLabel, mode, skin, structure, onInsert }: ItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${def.type}`,
    data: { type: def.type },
  });
  return (
    <button
      ref={setNodeRef}
      type="button"
      {...attributes}
      {...listeners}
      onClick={onInsert}
      aria-label={insertLabel}
      title={label}
      className="group flex cursor-grab flex-col items-stretch gap-1 rounded-md border bg-background p-1.5 text-left text-xs outline-none hover:border-foreground/30 focus-visible:ring-2 focus-visible:ring-ring data-[dragging=true]:opacity-50"
      data-dragging={isDragging}
      data-testid={`palette-${def.type}`}
    >
      <Thumb type={def.type} mode={mode} skin={skin} structure={structure} />
      <span className="truncate px-0.5">{label}</span>
    </button>
  );
}

export const Thumb = memo(function Thumb({ type, mode, skin, structure }: { type: ComponentType; mode: Mode; skin: SkinChoice; structure: SkinId }) {
  const t = useTranslations("defaults");
  const def = registry[type];
  const props = useMemo(() => def.defaultProps((k) => t(k)), [def, t]);
  const { w, h } = def.defaultSize;
  const scale = Math.min(THUMB.w / w, THUMB.h / h, 1);
  const Render = def.Render;
  const node = useMemo(
    () => ({ id: "thumb", type, artboardId: "", name: "", x: 0, y: 0, w, h, locked: false, hidden: false, opacity: 1, props }),
    [type, w, h, props],
  );
  return (
    <span className="pointer-events-none flex h-14 items-center justify-center overflow-hidden rounded-sm bg-muted/50" aria-hidden>
      <span style={{ width: w * scale, height: h * scale }} className="relative block">
        <ArtboardRoot
          mode={mode}
          skin={skin}
          className="origin-top-left bg-transparent!"
          style={{ width: w, height: h, transform: `scale(${scale})` }}
        >
          <div className="pf-node" style={{ left: 0, top: 0, width: w, height: h }}>
            <Render props={props} node={node} mode={mode} skin={structure} />
          </div>
        </ArtboardRoot>
      </span>
    </span>
  );
});

export function PaletteDragPreview({ type }: { type: ComponentType }) {
  const t = useTranslations();
  const Icon = registry[type].icon;
  return (
    <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm shadow-lg">
      <Icon className="size-4" aria-hidden />
      {t(registry[type].labelKey)}
    </div>
  );
}
