import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import GuideEn from "@/content/guide/en.mdx";
import GuideUk from "@/content/guide/uk.mdx";
import { Link } from "@/i18n/navigation";
import { LocaleSwitch } from "@/components/locale-switch";
import { GUIDE_SECTIONS } from "@/content/guide/sections";

const CONTENT = { en: GuideEn, uk: GuideUk } as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/guide">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "guide" });
  return { title: `${t("title")} · Polyframe`, description: t("description") };
}

export default async function GuidePage({ params }: PageProps<"/[locale]/guide">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("guide");
  const Content = CONTENT[locale as keyof typeof CONTENT] ?? GuideEn;
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <Link href="/" className="font-semibold">
            Polyframe
          </Link>
          <span className="text-sm text-muted-foreground">{t("title")}</span>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/editor" className={buttonVariants({ size: "sm" })}>
              {t("openEditor")}
            </Link>
            <LocaleSwitch />
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[220px_1fr]">
        <nav aria-label={t("contents")} className="hidden lg:block">
          <div className="sticky top-24 space-y-1 text-sm">
            <p className="mb-2 font-medium">{t("contents")}</p>
            {GUIDE_SECTIONS.map((id) => (
              <a key={id} href={`#${id}`} className="block rounded px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground">
                {t(`toc.${id}`)}
              </a>
            ))}
          </div>
        </nav>
        <article className="guide-prose min-w-0">
          <h1>{t("title")}</h1>
          <p className="lead">{t("description")}</p>
          <Content />
        </article>
      </div>
    </div>
  );
}
