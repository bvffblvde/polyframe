"use client";

import { useLocale, useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { flushSave } from "@/stores/projects-store";

const NAMES: Record<Locale, string> = { en: "English", uk: "Українська" };

export function LanguageSwitch() {
  const t = useTranslations("toolbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Select
      value={locale}
      onValueChange={async (next) => {
        await flushSave();
        router.replace(pathname, { locale: next as Locale });
      }}
    >
      <SelectTrigger size="sm" aria-label={t("language")} className="w-[72px]">
        <SelectValue>{locale.toUpperCase()}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end">
        {routing.locales.map((l) => (
          <SelectItem key={l} value={l} lang={l}>
            {NAMES[l]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
