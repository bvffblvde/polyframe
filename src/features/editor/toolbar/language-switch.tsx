"use client";

import { LocaleSwitch } from "@/components/locale-switch";
import { flushSave } from "@/stores/projects-store";

export function LanguageSwitch() {
  return <LocaleSwitch beforeChange={flushSave} />;
}
