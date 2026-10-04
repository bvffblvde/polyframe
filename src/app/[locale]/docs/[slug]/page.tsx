import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DOC_PAGES, getDoc } from "@/content/docs";
import { DocsPage } from "@/features/landing/docs-page";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => DOC_PAGES.map((p) => ({ locale, slug: p.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[locale]/docs/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  const doc = getDoc(slug);
  return { title: `${doc ? t(`pages.${doc.slug}`) : t("title")} · Polyframe`, description: t("description") };
}

export default async function DocPage({ params }: PageProps<"/[locale]/docs/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const doc = getDoc(slug);
  if (!doc) notFound();
  return <DocsPage slug={doc.slug} />;
}
