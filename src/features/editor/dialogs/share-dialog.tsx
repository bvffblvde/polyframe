"use client";

import { Copy } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useId, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { encodeShare, SHARE_PREFIX, SHARE_WARN_LENGTH } from "@/core/serialization/share";
import { announce } from "@/lib/announce";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";
import { useProjectIO } from "../project-io";

export function ShareDialog() {
  const t = useTranslations("share");
  const locale = useLocale();
  const open = useEditorStore((s) => s.dialog === "share");
  const project = useDocumentStore((s) => s.project);
  const io = useProjectIO();
  const id = useId();
  const url = useMemo(
    () => (open && project ? `${window.location.origin}/${locale}/view${SHARE_PREFIX}${encodeShare(project)}` : ""),
    [open, project, locale],
  );
  const close = () => useEditorStore.getState().set({ dialog: null });
  const copy = async () => {
    await navigator.clipboard.writeText(url);
    toast.success(t("copied"));
    announce(t("copied"));
  };
  const tooLarge = url.length > SHARE_WARN_LENGTH;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor={id}>{t("link")}</Label>
          <Input id={id} readOnly value={url} onFocus={(e) => e.currentTarget.select()} data-testid="share-url" />
          <p className="text-xs text-muted-foreground">{t("size", { size: Math.ceil(url.length / 1024) })}</p>
          {tooLarge && (
            <p role="alert" className="text-sm text-amber-700 dark:text-amber-400">
              {t("tooLarge")}
            </p>
          )}
        </div>
        <DialogFooter>
          {tooLarge && (
            <Button variant="outline" onClick={io.exportJson}>
              {t("exportJson")}
            </Button>
          )}
          <Button onClick={copy}>
            <Copy aria-hidden /> {t("copy")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
