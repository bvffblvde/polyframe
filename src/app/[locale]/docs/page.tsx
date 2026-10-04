import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/site";
import { DocsPage } from "@/features/landing/docs-page";

export async function generateMetadata({ params }: PageProps<"/[locale]/docs">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "docs" });
  return { title: `${t("title")} · Polyframe`, description: t("description"), alternates: localeAlternates(locale, "/docs") };
}

export default async function DocsIndex({ params }: PageProps<"/[locale]/docs">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DocsPage slug="getting-started" />;
}
