"use client";

import { FileUp, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { customSkinSchema } from "@/core/document/schema";
import { SKIN_IDS, type CustomSkin, type SkinId } from "@/core/document/types";
import { customSkinCss, SKIN_LABELS, skins } from "@/core/skins";
import { importTokens } from "@/core/skins/import";
import { COLOR_TOKENS, isSafeCssValue, NUMBER_LIMITS, NUMBER_TOKENS, type TokenOverrides } from "@/core/skins/tokens";
import { useDocumentStore } from "@/stores/document-store";
import { useEditorStore } from "@/stores/editor-store";
import * as commands from "../commands";
import { LoginPreview } from "../canvas/login-preview";
import { SelectField } from "../inspector/fields";

const PREVIEW_ATTR = "custom-preview";

function initialDraft(name: string): CustomSkin {
  const s = useDocumentStore.getState().project?.settings;
  if (s?.customSkin) return structuredClone(s.customSkin);
  const base: SkinId = s && s.skin !== "custom" ? s.skin : "shadcn";
  return { name, base, tokens: {} };
}

const HEX = /^#[0-9a-f]{6}$/i;

export function CustomSkinDialog() {
  const open = useEditorStore((s) => s.dialog === "customSkin");
  return open ? <SkinEditor /> : null;
}

function SkinEditor() {
  const t = useTranslations("skinEditor");
  const [draft, setDraft] = useState<CustomSkin>(() => initialDraft(t("defaultName")));
  const [source, setSource] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [invalid, setInvalid] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const importId = useId();
  const nameId = useId();
  const base = skins[draft.base].tokens;
  const close = () => useEditorStore.getState().set({ dialog: null });

  const setToken = (key: keyof TokenOverrides, value: string | number | undefined) =>
    setDraft((d) => {
      const tokens = { ...d.tokens };
      if (value === undefined || value === "") delete tokens[key];
      else (tokens as Record<string, string | number>)[key] = value;
      return { ...d, tokens };
    });

  const runImport = (text: string) => {
    const r = importTokens(text);
    if (!r) {
      setMessage(t("importFailed"));
      return;
    }
    setDraft((d) => ({ ...d, tokens: { ...d.tokens, ...r.tokens } }));
    setMessage(t("imported", { count: r.matched.length }));
  };

  const apply = () => {
    const parsed = customSkinSchema.safeParse(draft);
    if (!parsed.success) {
      setInvalid(true);
      return;
    }
    commands.updateSettings({ skin: "custom", mode: "styled", customSkin: parsed.data });
    close();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <style>{customSkinCss(sanitize(draft), PREVIEW_ATTR)}</style>
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor={nameId}>{t("name")}</Label>
                <Input id={nameId} value={draft.name} maxLength={60} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="h-8" />
              </div>
              <SelectField
                label={t("base")}
                value={draft.base}
                options={SKIN_IDS.map((id) => ({ value: id, label: SKIN_LABELS[id] }))}
                onChange={(v) => setDraft({ ...draft, base: v as SkinId })}
              />
            </div>
            <fieldset className="space-y-2">
              <legend className="mb-2 text-xs font-semibold text-muted-foreground uppercase">{t("colors")}</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {COLOR_TOKENS.map((key) => {
                  const value = draft.tokens[key];
                  const effective = value ?? base[key];
                  const bad = value !== undefined && !isSafeCssValue(value);
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <input
                        type="color"
                        aria-label={t("colorPicker", { name: t(`tokens.${key}`) })}
                        value={HEX.test(effective) ? effective : "#000000"}
                        onChange={(e) => setToken(key, e.target.value)}
                        className="size-8 shrink-0 cursor-pointer rounded border bg-transparent"
                      />
                      <div className="min-w-0 flex-1">
                        <Label htmlFor={`tok-${key}`} className="text-xs text-muted-foreground">
                          {t(`tokens.${key}`)}
                        </Label>
                        <Input
                          id={`tok-${key}`}
                          value={value ?? ""}
                          placeholder={base[key]}
                          aria-invalid={bad || undefined}
                          onChange={(e) => setToken(key, e.target.value)}
                          className="h-7 font-mono text-xs"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </fieldset>
            <fieldset className="space-y-2">
              <legend className="mb-2 text-xs font-semibold text-muted-foreground uppercase">{t("shape")}</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {NUMBER_TOKENS.map((key) => (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={`tok-${key}`} className="text-xs text-muted-foreground">
                      {t(`tokens.${key}`)}
                    </Label>
                    <Input
                      id={`tok-${key}`}
                      type="number"
                      min={NUMBER_LIMITS[key][0]}
                      max={NUMBER_LIMITS[key][1]}
                      value={draft.tokens[key] ?? ""}
                      placeholder={String(base[key])}
                      onChange={(e) => setToken(key, e.target.value === "" ? undefined : Number(e.target.value))}
                      className="h-7"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <Label htmlFor="tok-font" className="text-xs text-muted-foreground">
                  {t("tokens.font")}
                </Label>
                <Input
                  id="tok-font"
                  value={draft.tokens.font ?? ""}
                  placeholder={base.font}
                  onChange={(e) => setToken("font", e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
            </fieldset>
            <fieldset className="space-y-2">
              <legend className="mb-2 text-xs font-semibold text-muted-foreground uppercase">{t("import")}</legend>
              <Textarea
                id={importId}
                aria-label={t("import")}
                aria-describedby={`${importId}-hint`}
                value={source}
                onChange={(e) => setSource(e.target.value)}
                rows={4}
                className="font-mono text-xs"
                placeholder={"--primary: 222 47% 11%;\n--radius: 0.5rem;"}
              />
              <p id={`${importId}-hint`} className="text-xs text-muted-foreground">
                {t("importHint")}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => runImport(source)} disabled={!source.trim()}>
                  {t("importAction")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  <FileUp aria-hidden /> {t("importFile")}
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".json,.css,application/json,text/css"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = "";
                    if (file) runImport(await file.text());
                  }}
                />
                {message && (
                  <span role="status" className="text-sm text-muted-foreground">
                    {message}
                  </span>
                )}
              </div>
            </fieldset>
          </div>
          <div className="space-y-2 self-start lg:sticky lg:top-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase">{t("preview")}</p>
            <LoginPreview mode="styled" skin={PREVIEW_ATTR} structure={draft.base} label={t("preview")} maxWidth={380} />
          </div>
        </div>
        {invalid && (
          <p role="alert" className="text-sm text-destructive">
            {t("invalid")}
          </p>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => setDraft({ ...draft, tokens: {} })}>
            <RotateCcw aria-hidden /> {t("reset")}
          </Button>
          <Button onClick={apply}>{t("apply")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function sanitize(draft: CustomSkin): CustomSkin {
  const tokens: TokenOverrides = {};
  for (const [k, v] of Object.entries(draft.tokens)) {
    if (typeof v === "number" || (typeof v === "string" && isSafeCssValue(v))) (tokens as Record<string, string | number>)[k] = v;
  }
  return { ...draft, tokens };
}
