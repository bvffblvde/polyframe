import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LiveRegion } from "@/components/live-region";
import { ServiceWorkerRegister } from "@/components/sw-register";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { buildSkinCss } from "@/core/skins";
import { routing } from "@/i18n/routing";
import { localeAlternates, SITE_URL } from "@/lib/site";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "cyrillic"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "cyrillic"] });
const caveat = Caveat({ variable: "--font-sketch", subsets: ["latin", "cyrillic"] });

const skinCss = buildSkinCss();

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: "%s" },
    description: t("description"),
    applicationName: "Polyframe",
    alternates: localeAlternates(locale),
    openGraph: {
      type: "website",
      siteName: "Polyframe",
      locale: locale === "uk" ? "uk_UA" : "en_US",
      url: `/${locale}`,
    },
    twitter: { card: "summary_large_image" },
    appleWebApp: { capable: true, title: "Polyframe", statusBarStyle: "default" },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} antialiased`}
    >
      <head>
        <style id="pf-skins" dangerouslySetInnerHTML={{ __html: skinCss }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <TooltipProvider delayDuration={400}>
            {children}
            <Toaster position="bottom-center" />
            <LiveRegion />
            <ServiceWorkerRegister />
          </TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
