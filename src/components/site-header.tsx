import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LocaleSwitch } from "./locale-switch";

export const GITHUB_URL = "https://github.com/bvffblvde/polyframe";

export async function SiteHeader({ section }: { section?: string }) {
  const t = await getTranslations("site");
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold">
          <Image src="/logo.svg" alt="" width={24} height={24} unoptimized />
          Polyframe
        </Link>
        {section && <span className="hidden text-sm text-muted-foreground sm:inline">{section}</span>}
        <nav aria-label={t("nav")} className="ml-auto flex items-center gap-1 text-sm">
          <Link href="/guide" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden md:inline-flex")}>
            {t("guide")}
          </Link>
          <Link href="/docs" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden md:inline-flex")}>
            {t("docs")}
          </Link>
          <a href={GITHUB_URL} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden md:inline-flex")}>
            {t("github")}
          </a>
          <Link href="/editor" className={buttonVariants({ size: "sm" })}>
            {t("openEditor")}
          </Link>
          <LocaleSwitch />
        </nav>
      </div>
    </header>
  );
}

export async function SiteFooter() {
  const t = await getTranslations("site");
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground">
        <div className="flex flex-wrap gap-4">
          <Link href="/guide" className="hover:text-foreground">
            {t("guide")}
          </Link>
          <Link href="/docs" className="hover:text-foreground">
            {t("docs")}
          </Link>
          <a href={GITHUB_URL} className="hover:text-foreground">
            {t("github")}
          </a>
          <a href={`${GITHUB_URL}/blob/main/LICENSE`} className="hover:text-foreground">
            {t("license")}
          </a>
          <span className="ml-auto">{t("madeIn")}</span>
        </div>
        <p className="text-xs">{t("disclaimer")}</p>
      </div>
    </footer>
  );
}
