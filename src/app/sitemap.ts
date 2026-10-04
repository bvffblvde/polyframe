import type { MetadataRoute } from "next";
import { DOC_PAGES } from "@/content/docs";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

const PATHS = ["", "/editor", "/guide", "/docs", ...DOC_PAGES.filter((p) => p.slug !== "getting-started").map((p) => `/docs/${p.slug}`)];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
    })),
  );
}
