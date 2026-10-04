"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SKIN_IDS, type SkinId } from "@/core/document/types";
import { SKIN_LABELS } from "@/core/skins";
import { LoginPreview } from "../editor/canvas/login-preview";

type Look = "wireframe" | SkinId;

export function SkinDemo() {
  const t = useTranslations();
  const td = useTranslations("landing.demo");
  const [look, setLook] = useState<Look>("mui");
  const skin = look === "wireframe" ? "shadcn" : look;
  return (
    <div className="flex flex-col items-center gap-6">
      <ToggleGroup
        type="single"
        variant="outline"
        value={look}
        onValueChange={(v) => v && setLook(v as Look)}
        aria-label={td("label")}
        className="flex-wrap justify-center"
      >
        <ToggleGroupItem value="wireframe">{t("modes.wireframe")}</ToggleGroupItem>
        {SKIN_IDS.map((s) => (
          <ToggleGroupItem key={s} value={s}>
            {SKIN_LABELS[s]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <LoginPreview mode={look === "wireframe" ? "wireframe" : "styled"} skin={skin} structure={skin} label={td("preview")} />
    </div>
  );
}
