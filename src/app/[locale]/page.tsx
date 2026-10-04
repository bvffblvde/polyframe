import { Code2, Keyboard, LayoutTemplate, Lock, Palette, PenLine } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { GITHUB_URL, SiteFooter, SiteHeader } from "@/components/site-header";
import { SkinDemo } from "@/features/landing/skin-demo";
import { Link } from "@/i18n/navigation";

const FEATURES = [
  { id: "wireframe", icon: PenLine },
  { id: "skins", icon: Palette },
  { id: "code", icon: Code2 },
  { id: "local", icon: Lock },
  { id: "keyboard", icon: Keyboard },
  { id: "templates", icon: LayoutTemplate },
] as const;

const STEPS = ["sketch", "style", "ship"] as const;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-4xl px-4 pt-20 pb-12 text-center">
          <p className="text-sm font-medium text-muted-foreground">{t("eyebrow")}</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance sm:text-6xl">{t("title")}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-pretty text-muted-foreground">{t("subtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/editor" className={buttonVariants({ size: "lg" })}>
              {t("cta")}
            </Link>
            <Link href="/guide" className={buttonVariants({ size: "lg", variant: "outline" })}>
              {t("ctaGuide")}
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{t("privacy")}</p>
        </section>

        <section aria-labelledby="demo-title" className="mx-auto max-w-5xl px-4 py-12">
          <h2 id="demo-title" className="text-center text-3xl font-semibold tracking-tight">
            {t("demo.title")}
          </h2>
          <p className="mx-auto mt-3 mb-8 max-w-xl text-center text-muted-foreground">{t("demo.subtitle")}</p>
          <SkinDemo />
        </section>

        <section aria-labelledby="features-title" className="mx-auto max-w-6xl px-4 py-16">
          <h2 id="features-title" className="text-center text-3xl font-semibold tracking-tight">
            {t("features.title")}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ id, icon: Icon }) => (
              <div key={id} className="rounded-xl border p-6">
                <Icon className="size-6 text-primary" aria-hidden />
                <h3 className="mt-4 font-semibold">{t(`features.${id}.title`)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(`features.${id}.body`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="steps-title" className="border-y bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <h2 id="steps-title" className="text-center text-3xl font-semibold tracking-tight">
              {t("steps.title")}
            </h2>
            <ol className="mt-10 grid gap-6 sm:grid-cols-3">
              {STEPS.map((id, i) => (
                <li key={id} className="rounded-xl bg-background p-6 shadow-sm">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-semibold">{t(`steps.${id}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t(`steps.${id}.body`)}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="export-title" className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <h2 id="export-title" className="text-3xl font-semibold tracking-tight">
              {t("export.title")}
            </h2>
            <p className="mt-4 text-muted-foreground">{t("export.body")}</p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm">
              {["shadcn/ui + Tailwind", "MUI", "Mantine", "Ant Design", "React Bootstrap", "Chakra UI"].map((lib) => (
                <li key={lib} className="rounded-full border px-3 py-1">
                  {lib}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Image src="/landing/demo-canvas.gif" alt={t("export.canvasAlt")} width={560} height={403} unoptimized className="h-auto w-full rounded-lg border" />
            <Image src="/landing/demo-export.gif" alt={t("export.codeAlt")} width={560} height={510} unoptimized className="h-auto w-full rounded-lg border" />
          </div>
        </section>

        <section aria-labelledby="oss-title" className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 id="oss-title" className="text-3xl font-semibold tracking-tight">
            {t("oss.title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("oss.body")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={GITHUB_URL} className={buttonVariants({ size: "lg" })}>
              {t("oss.star")}
            </a>
            <a href={`${GITHUB_URL}/blob/main/CONTRIBUTING.md`} className={buttonVariants({ size: "lg", variant: "outline" })}>
              {t("oss.contribute")}
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
