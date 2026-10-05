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
  ArrowDownToLine,
  ArrowUpToLine,
  ChevronDown,
  ChevronUp,
  ClipboardPaste,
  Copy,
  CopyPlus,
  Eye,
  EyeOff,
  Frame,
  Group,
  LayoutGrid,
  Lock,
  LockOpen,
  Maximize,
  Rows3,
  Scissors,
  SquareDashed,
  SquareDashedMousePointer,
  Trash2,
  Ungroup,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { isLayout, layoutParent } from "@/core/document/autolayout";
import { groupMembers, isGroupId } from "@/core/document/ops";
import { ARTBOARD_PRESETS } from "@/core/document/types";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";
import * as commands from "../commands";
import { useCommands } from "../use-commands";

export function selectForContextMenu(target: EventTarget | null) {
  const el = target instanceof Element ? target : null;
  const p = useDocumentStore.getState().project;
  const ed = useEditorStore.getState();
  if (!p || !el) return;
  const layerRow = el.closest<HTMLElement>("[data-layer-id]");
  const nodeId = layerRow?.dataset.layerId ?? el.closest<HTMLElement>("[data-node-id]")?.dataset.nodeId;
  if (nodeId && p.nodes[nodeId]) {
    if (!ed.selection.includes(nodeId)) {
      ed.set({ selection: layerRow ? [nodeId] : groupMembers(p, [nodeId]), activeArtboardId: p.nodes[nodeId].artboardId });
    }
    return;
  }
  if (el.closest("[data-testid=canvas]")) {
    const artboardId = el.closest<HTMLElement>("[data-artboard-id]")?.dataset.artboardId;
    ed.set({ selection: [], ...(artboardId ? { activeArtboardId: artboardId } : {}) });
  }
}

export function EditorContextMenu({ children }: { children: ReactNode }) {
  const t = useTranslations("contextMenu");
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild onContextMenuCapture={(e) => selectForContextMenu(e.target)}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent aria-label={t("label")} data-testid="context-menu">
        <MenuBody />
      </ContextMenuContent>
    </ContextMenu>
  );
}

interface ItemProps {
  icon: ReactNode;
  label: string;
  shortcut?: string;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

function Item({ icon, label, shortcut, onSelect, destructive, disabled }: ItemProps) {
  return (
    <ContextMenuItem onSelect={onSelect} variant={destructive ? "destructive" : "default"} disabled={disabled}>
      {icon}
      {label}
      {shortcut && <ContextMenuShortcut>{shortcut}</ContextMenuShortcut>}
    </ContextMenuItem>
  );
}

function MenuBody() {
  const t = useTranslations();
  const cmd = useCommands();
  const selection = useEditorStore((s) => s.selection);
  const hasClipboard = useEditorStore((s) => s.clipboard.length > 0);
  const project = useDocumentStore((s) => s.project);
  if (!project) return null;
  const nodes = selection.map((id) => project.nodes[id]).filter(Boolean);

  if (!nodes.length) {
    return (
      <>
        <Item icon={<ClipboardPaste aria-hidden />} label={t("contextMenu.paste")} shortcut="⌘V" onSelect={cmd.paste} disabled={!hasClipboard} />
        <Item icon={<SquareDashedMousePointer aria-hidden />} label={t("contextMenu.selectAll")} shortcut="⌘A" onSelect={cmd.selectAll} />
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Frame aria-hidden />
            {t("layers.addArtboard")}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {ARTBOARD_PRESETS.filter((p) => p !== "custom").map((p) => (
              <ContextMenuItem key={p} onSelect={() => cmd.addArtboard(p)}>
                {t(`presets.${p}`)}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
        <Item icon={<Maximize aria-hidden />} label={t("toolbar.zoomFit")} shortcut="⌘0" onSelect={commands.fitAll} />
      </>
    );
  }

  const allLocked = nodes.every((n) => n.locked);
  const allHidden = nodes.every((n) => n.hidden);
  const grouped = nodes.some((n) => isGroupId(project, n.parentId));
  const containers = nodes.some((n) => isLayout(n));
  const inLayout = nodes.some((n) => layoutParent(project, n));
  const ti = (k: string) => t(`inspector.${k}`);

  return (
    <>
      <Item icon={<Scissors aria-hidden />} label={t("contextMenu.cut")} shortcut="⌘X" onSelect={cmd.cut} />
      <Item icon={<Copy aria-hidden />} label={t("contextMenu.copy")} shortcut="⌘C" onSelect={cmd.copy} />
      <Item icon={<ClipboardPaste aria-hidden />} label={t("contextMenu.paste")} shortcut="⌘V" onSelect={cmd.paste} disabled={!hasClipboard} />
      <Item icon={<CopyPlus aria-hidden />} label={ti("duplicate")} shortcut="⌘D" onSelect={cmd.duplicate} />
      <ContextMenuSeparator />
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <ArrowUpToLine aria-hidden />
          {t("contextMenu.order")}
        </ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <Item icon={<ArrowUpToLine aria-hidden />} label={ti("bringToFront")} shortcut="⌘⇧]" onSelect={() => commands.reorder("front")} />
          <Item icon={<ChevronUp aria-hidden />} label={ti("bringForward")} shortcut="⌘]" onSelect={() => commands.reorder("forward")} />
          <Item icon={<ChevronDown aria-hidden />} label={ti("sendBackward")} shortcut="⌘[" onSelect={() => commands.reorder("backward")} />
          <Item icon={<ArrowDownToLine aria-hidden />} label={ti("sendToBack")} shortcut="⌘⇧[" onSelect={() => commands.reorder("back")} />
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <AlignStartVertical aria-hidden />
          {t("contextMenu.align")}
        </ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <Item icon={<AlignStartVertical aria-hidden />} label={ti("alignLeft")} onSelect={() => commands.align("left")} />
          <Item icon={<AlignCenterVertical aria-hidden />} label={ti("alignCenter")} onSelect={() => commands.align("center")} />
          <Item icon={<AlignEndVertical aria-hidden />} label={ti("alignRight")} onSelect={() => commands.align("right")} />
          <Item icon={<AlignStartHorizontal aria-hidden />} label={ti("alignTop")} onSelect={() => commands.align("top")} />
          <Item icon={<AlignCenterHorizontal aria-hidden />} label={ti("alignMiddle")} onSelect={() => commands.align("middle")} />
          <Item icon={<AlignEndHorizontal aria-hidden />} label={ti("alignBottom")} onSelect={() => commands.align("bottom")} />
          {nodes.length >= 3 && (
            <>
              <ContextMenuSeparator />
              <Item icon={<AlignHorizontalDistributeCenter aria-hidden />} label={ti("distributeX")} onSelect={() => commands.distribute("x")} />
              <Item icon={<AlignVerticalDistributeCenter aria-hidden />} label={ti("distributeY")} onSelect={() => commands.distribute("y")} />
            </>
          )}
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <Rows3 aria-hidden />
          {t("contextMenu.layout")}
        </ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <Item icon={<Rows3 aria-hidden />} label={ti("wrapInStack")} shortcut="⇧A" onSelect={cmd.wrap} />
          <Item icon={<LayoutGrid aria-hidden />} label={ti("wrapInGrid")} onSelect={cmd.wrapGrid} />
          {containers && <Item icon={<SquareDashed aria-hidden />} label={ti("unwrapLayout")} onSelect={cmd.ungroup} />}
          {inLayout && <Item icon={<SquareDashed aria-hidden />} label={ti("removeFromLayout")} onSelect={commands.removeFromStack} />}
        </ContextMenuSubContent>
      </ContextMenuSub>
      {nodes.length >= 2 && <Item icon={<Group aria-hidden />} label={ti("group")} shortcut="⌘G" onSelect={cmd.group} />}
      {grouped && <Item icon={<Ungroup aria-hidden />} label={ti("ungroup")} shortcut="⌘⇧G" onSelect={cmd.ungroup} />}
      <ContextMenuSeparator />
      <Item
        icon={allLocked ? <LockOpen aria-hidden /> : <Lock aria-hidden />}
        label={t(allLocked ? "contextMenu.unlock" : "contextMenu.lock")}
        onSelect={() => commands.setLocked(!allLocked)}
      />
      <Item
        icon={allHidden ? <Eye aria-hidden /> : <EyeOff aria-hidden />}
        label={t(allHidden ? "contextMenu.show" : "contextMenu.hide")}
        onSelect={() => commands.setHidden(!allHidden)}
      />
      <ContextMenuSeparator />
      <Item icon={<Trash2 aria-hidden />} label={ti("delete")} shortcut="⌫" onSelect={cmd.remove} destructive />
    </>
  );
}
