"use client";

import { FilePlus2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TEMPLATES } from "@/core/templates";
import { TemplatePreview } from "../canvas/template-preview";
import { useViewSettings } from "../canvas/use-view-settings";
import { useTemplates } from "../use-commands";

export function TemplatesPanel() {
  const t = useTranslations("templates");
  const tp = useTranslations("presets");
  const templates = useTemplates();
  const { mode, skin, structure } = useViewSettings();
  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 px-3 pb-4">
        <p className="text-xs text-muted-foreground">{t("intro")}</p>
        {TEMPLATES.map((tpl) => {
          const name = t(`names.${tpl.id}`);
          return (
            <section key={tpl.id} aria-labelledby={`tpl-${tpl.id}`} className="space-y-2 rounded-lg border p-2" data-testid={`template-${tpl.id}`}>
              <TemplatePreview templateId={tpl.id} width={210} mode={mode} skin={skin} structure={structure} label={t("preview", { name })} />
              <div className="flex items-baseline justify-between gap-2 px-0.5">
                <h3 id={`tpl-${tpl.id}`} className="text-sm font-medium">
                  {name}
                </h3>
                <span className="text-xs text-muted-foreground">{tp(tpl.preset)}</span>
              </div>
              <div className="flex gap-1.5">
                <Button size="sm" className="flex-1" onClick={() => templates.addToProject(tpl.id)}>
                  <Plus aria-hidden /> {t("addToProject")}
                </Button>
                <Button size="sm" variant="outline" onClick={() => templates.create(tpl.id)} aria-label={`${t("newProject")}: ${name}`} title={t("newProject")}>
                  <FilePlus2 aria-hidden />
                </Button>
              </div>
            </section>
          );
        })}
      </div>
    </ScrollArea>
  );
}
