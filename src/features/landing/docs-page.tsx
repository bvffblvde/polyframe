import { getTranslations } from "next-intl/server";
import { GITHUB_URL, SiteFooter, SiteHeader } from "@/components/site-header";
import { DOC_PAGES, type DocSlug } from "@/content/docs";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const SOURCES: Record<DocSlug, string> = {
  "getting-started": "docs/developer/getting-started.md",
  architecture: "docs/developer/architecture.md",
  "add-component": "docs/contributing/add-component.md",
  "add-skin": "docs/contributing/add-skin.md",
  "add-exporter": "docs/contributing/add-exporter.md",
};

export async function DocsPage({ slug }: { slug: DocSlug }) {
  const t = await getTranslations("docs");
  const page = DOC_PAGES.find((p) => p.slug === slug) ?? DOC_PAGES[0];
  const Content = page.Content;
  const note = t("englishOnly");
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader section={t("title")} />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[220px_1fr]">
        <nav aria-label={t("nav")} className="text-sm">
          <ul className="space-y-1 lg:sticky lg:top-24">
            {DOC_PAGES.map((p) => (
              <li key={p.slug}>
                <Link
                  href={p.slug === "getting-started" ? "/docs" : `/docs/${p.slug}`}
                  aria-current={p.slug === page.slug ? "page" : undefined}
                  className={cn(
                    "block rounded px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground",
                    p.slug === page.slug && "bg-accent font-medium text-foreground",
                  )}
                >
                  {t(`pages.${p.slug}`)}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/guide" className="block rounded px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground">
                {t("userGuide")}
              </Link>
            </li>
          </ul>
        </nav>
        <article className="guide-prose min-w-0">
          {note && (
            <p role="note" className="rounded-md border bg-muted/50 px-4 py-3 text-sm">
              {note}
            </p>
          )}
          <Content />
          <p className="mt-10 text-sm">
            <a href={`${GITHUB_URL}/edit/main/${SOURCES[page.slug]}`}>{t("edit")}</a>
          </p>
        </article>
      </div>
      <SiteFooter />
    </div>
  );
}
