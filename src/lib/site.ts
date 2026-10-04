import { routing } from "@/i18n/routing";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://polyframe.vercel.app").replace(/\/$/, "");

export function localeAlternates(locale: string, path = "") {
  const languages: Record<string, string> = Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`]));
  languages["x-default"] = `/${routing.defaultLocale}${path}`;
  return { canonical: `/${locale}${path}`, languages };
}
