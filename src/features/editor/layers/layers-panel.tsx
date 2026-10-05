"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, Frame, GripVertical, Group, Lock, LockOpen, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment, memo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { descendants, layoutChildren, layoutParent } from "@/core/document/autolayout";
import { groupMembers, isGroupId, moveNodeToIndex, updateNode } from "@/core/document/ops";
import { ARTBOARD_PRESETS, type ID, type Project } from "@/core/document/types";
import { registry } from "@/core/registry";
import { cn } from "@/lib/utils";
import { applyOp as apply, useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";
import { EditorContextMenu } from "../context-menu/editor-context-menu";
import { useCommands } from "../use-commands";


export function LayersPanel() {
  const t = useTranslations();
  const order = useDocumentStore((s) => s.project?.artboardOrder);
  const cmd = useCommands();
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-end p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Plus aria-hidden /> {t("layers.addArtboard")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {ARTBOARD_PRESETS.filter((p) => p !== "custom").map((p) => (
              <DropdownMenuItem key={p} onSelect={() => cmd.addArtboard(p)}>
                {t(`presets.${p}`)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <EditorContextMenu>
          <div className="min-h-full space-y-3 px-2 pb-4">
            {order?.map((id) => <ArtboardLayers key={id} id={id} />)}
          </div>
        </EditorContextMenu>
      </ScrollArea>
    </div>
  );
}

interface Row {
  id: ID;
  depth: number;
  top: ID;
  group?: ID;
}

function layerRows(p: Project, artboardId: ID): Row[] {
  const a = p.artboards[artboardId];
  if (!a) return [];
  const rows: Row[] = [];
  const walk = (id: ID, depth: number, top: ID) => {
    const n = p.nodes[id];
    rows.push({ id, depth, top, group: isGroupId(p, n.parentId) ? n.parentId : undefined });
    for (const c of layoutChildren(p, id)) walk(c, depth + 1, top);
  };
  for (const id of [...a.childOrder].reverse()) {
    const n = p.nodes[id];
    if (n && !layoutParent(p, n)) walk(id, 0, id);
  }
  return rows;
}

function ArtboardLayers({ id }: { id: ID }) {
  const t = useTranslations("layers");
  const a = useDocumentStore((s) => s.project?.artboards[id]);
  const active = useEditorStore((s) => s.activeArtboardId === id);
  const encoded = useDocumentStore(
    useShallow((s) => (s.project ? layerRows(s.project, id).map((r) => `${r.id}|${r.depth}|${r.top}|${r.group ?? ""}`) : [])),
  );
  const rows: Row[] = encoded.map((e) => {
    const [rid, depth, top, group] = e.split("|");
    return { id: rid, depth: Number(depth), top, group: group || undefined };
  });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  if (!a) return null;
  const items = rows.map((r) => r.id);
  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    const from = rows.find((r) => r.id === e.active.id);
    const over = rows.find((r) => r.id === e.over?.id);
    if (!from || !over || from.depth > 0 || over.top === from.id) return;
    const up = rows.indexOf(over) < rows.indexOf(from);
    apply((p) => {
      const order = p.artboards[id].childOrder.filter((x) => x !== from.id);
      const start = order.indexOf(over.top);
      const end = start + 1 + descendants(p, over.top).length;
      return moveNodeToIndex(p, from.id, up ? end : start);
    });
  };
  return (
    <div>
      <button
        type="button"
        onClick={() => useEditorStore.getState().set({ activeArtboardId: id, selection: [] })}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
          active && "bg-accent",
        )}
      >
        <Frame className="size-4 shrink-0" aria-hidden />
        <span className="truncate">{a.name}</span>
      </button>
      {rows.length === 0 ? (
        <p className="px-8 py-1 text-xs text-muted-foreground">{t("empty")}</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ul className="mt-0.5 space-y-px">
              {rows.map((r, i) => (
                <Fragment key={r.id}>
                  {r.group && r.group !== rows[i - 1]?.group && <GroupHeader memberId={r.id} />}
                  <LayerRow id={r.id} grouped={Boolean(r.group)} depth={r.depth} />
                </Fragment>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function GroupHeader({ memberId }: { memberId: ID }) {
  const t = useTranslations("layers");
  const select = () => {
    const p = useDocumentStore.getState().project;
    if (p) useEditorStore.getState().set({ selection: groupMembers(p, [memberId]), activeArtboardId: p.nodes[memberId].artboardId });
  };
  return (
    <li>
      <button
        type="button"
        onClick={select}
        aria-label={t("selectGroup")}
        className="flex w-full items-center gap-2 rounded-md py-1 pl-6 text-left text-sm text-muted-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Group className="size-3.5" aria-hidden />
        {t("group")}
      </button>
    </li>
  );
}

const LayerRow = memo(function LayerRow({ id, grouped, depth }: { id: ID; grouped: boolean; depth: number }) {
  const t = useTranslations("layers");
  const node = useDocumentStore((s) => s.project?.nodes[id]);
  const selected = useEditorStore((s) => s.selection.includes(id));
  const [editing, setEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: depth > 0 });
  if (!node) return null;
  const Icon = registry[node.type].icon;
  const select = (shift: boolean) => {
    const ed = useEditorStore.getState();
    const sel = ed.selection;
    ed.set({
      activeArtboardId: node.artboardId,
      selection: shift ? (sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]) : [id],
    });
  };
  const commitName = (name: string) => {
    setEditing(false);
    if (name.trim() && name !== node.name) apply((p) => updateNode(p, id, { name: name.trim() }));
  };
  return (
    <li
      ref={setNodeRef}
      data-layer-id={id}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group flex items-center gap-1 rounded-md pr-1 pl-2 text-sm hover:bg-accent",
        grouped && "ml-4 border-l",
        ["", "ml-4", "ml-8", "ml-12"][Math.min(depth, 3)],
        selected && "bg-sky-100 hover:bg-sky-100 dark:bg-sky-950",
        isDragging && "relative z-10 opacity-80",
        node.hidden && "text-muted-foreground",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={t("dragHandle", { name: node.name })}
        className="cursor-grab rounded text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <GripVertical className="size-3.5" aria-hidden />
      </button>
      {editing ? (
        <Input
          autoFocus
          defaultValue={node.name}
          aria-label={t("rename")}
          className="h-7 flex-1"
          onBlur={(e) => commitName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitName(e.currentTarget.value);
            if (e.key === "Escape") setEditing(false);
          }}
        />
      ) : (
        <button
          type="button"
          onClick={(e) => select(e.shiftKey)}
          onDoubleClick={() => setEditing(true)}
          onKeyDown={(e) => {
            if (e.key === "F2") setEditing(true);
          }}
          aria-pressed={selected}
          className="flex min-w-0 flex-1 items-center gap-2 py-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{node.name}</span>
        </button>
      )}
      <IconToggle
        on={node.locked}
        label={t(node.locked ? "unlock" : "lock", { name: node.name })}
        onClick={() => apply((p) => updateNode(p, id, { locked: !node.locked }))}
        iconOn={<Lock aria-hidden />}
        iconOff={<LockOpen aria-hidden />}
      />
      <IconToggle
        on={node.hidden}
        label={t(node.hidden ? "show" : "hide", { name: node.name })}
        onClick={() => apply((p) => updateNode(p, id, { hidden: !node.hidden }))}
        iconOn={<EyeOff aria-hidden />}
        iconOff={<Eye aria-hidden />}
      />
    </li>
  );
});

function IconToggle(props: { on: boolean; label: string; onClick: () => void; iconOn: React.ReactNode; iconOff: React.ReactNode }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={props.label}
      aria-pressed={props.on}
      onClick={props.onClick}
      className={cn("size-6 [&_svg]:size-3.5", !props.on && "opacity-0 group-hover:opacity-100 focus-visible:opacity-100")}
    >
      {props.on ? props.iconOn : props.iconOff}
    </Button>
  );
}
