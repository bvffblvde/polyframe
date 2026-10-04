"use client";

import { Copy, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { ProjectMeta } from "@/lib/persistence/idb";
import { cn } from "@/lib/utils";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";
import {
  createAndOpenProject,
  duplicateProject,
  flushSave,
  openProject,
  removeProject,
  renameProjectById,
  useProjectsStore,
} from "@/stores/projects-store";
import { useNewProjectNames } from "../use-commands";

export function ProjectsDialog() {
  const t = useTranslations("projects");
  const open = useEditorStore((s) => s.dialog === "projects");
  const list = useProjectsStore((s) => s.list);
  const currentId = useDocumentStore((s) => s.project?.id);
  const names = useNewProjectNames();
  const [confirm, setConfirm] = useState<ProjectMeta | null>(null);
  const close = () => useEditorStore.getState().set({ dialog: null });

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>
          <Button
            variant="outline"
            className="justify-start"
            onClick={async () => {
              await flushSave();
              await createAndOpenProject(names);
              close();
            }}
          >
            <Plus aria-hidden /> {t("new")}
          </Button>
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
          ) : (
            <ul className="max-h-80 space-y-1 overflow-auto">
              {list.map((m) => (
                <ProjectRow
                  key={m.id}
                  meta={m}
                  current={m.id === currentId}
                  onOpen={async () => {
                    await flushSave();
                    await openProject(m.id);
                    close();
                  }}
                  onDelete={() => setConfirm(m)}
                />
              ))}
            </ul>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog open={confirm !== null} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("confirmDescription", { name: confirm?.name ?? "" })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={async () => {
                if (confirm) await removeProject(confirm.id, names);
                setConfirm(null);
              }}
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function ProjectRow({ meta, current, onOpen, onDelete }: { meta: ProjectMeta; current: boolean; onOpen: () => void; onDelete: () => void }) {
  const t = useTranslations("projects");
  const format = useFormatter();
  const [editing, setEditing] = useState(false);
  const commit = async (name: string) => {
    setEditing(false);
    if (name.trim() && name.trim() !== meta.name) await renameProjectById(meta.id, name.trim());
  };
  return (
    <li className={cn("flex items-center gap-2 rounded-md border p-2", current && "border-primary/40 bg-accent/50")}>
      {editing ? (
        <Input
          autoFocus
          defaultValue={meta.name}
          aria-label={t("nameLabel", { name: meta.name })}
          className="h-8 flex-1"
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void commit(e.currentTarget.value);
            if (e.key === "Escape") setEditing(false);
          }}
        />
      ) : (
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="block truncate text-sm font-medium">
            {meta.name}
            {current && <span className="ml-2 text-xs font-normal text-muted-foreground">{t("current")}</span>}
          </span>
          <span className="block text-xs text-muted-foreground">
            {t("updated", { date: format.dateTime(new Date(meta.updatedAt), { dateStyle: "medium", timeStyle: "short" }) })}
          </span>
        </button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={t("actions", { name: meta.name })}>
            <MoreHorizontal aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onOpen}>{t("open")}</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setEditing(true)}>
            <Pencil aria-hidden /> {t("rename")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => duplicateProject(meta.id, t("copyName", { name: meta.name }))}>
            <Copy aria-hidden /> {t("duplicate")}
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={onDelete}>
            <Trash2 aria-hidden /> {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}
