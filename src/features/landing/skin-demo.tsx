"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SKIN_IDS, type SkinId } from "@/core/document/types";
import { SKIN_LABELS } from "@/core/skins";

type Look = "wireframe" | SkinId;

const Placeholder = () => <div className="aspect-[56/54] w-full max-w-[560px] rounded-xl border bg-muted/40" />;

const LoginPreview = dynamic(() => import("../editor/canvas/login-preview").then((m) => m.LoginPreview), {
  ssr: false,
  loading: Placeholder,
});

function useNearViewport() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, near };
}

export function SkinDemo() {
  const t = useTranslations();
  const td = useTranslations("landing.demo");
  const [look, setLook] = useState<Look>("mui");
  const skin = look === "wireframe" ? "shadcn" : look;
  const { ref, near } = useNearViewport();
  return (
    <div ref={ref} className="flex flex-col items-center gap-6">
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
      {near ? (
        <LoginPreview mode={look === "wireframe" ? "wireframe" : "styled"} skin={skin} structure={skin} label={td("preview")} />
      ) : (
        <Placeholder />
      )}
    </div>
  );
}
