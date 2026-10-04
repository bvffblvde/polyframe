import { redirect } from "@/i18n/navigation";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  redirect({ href: "/editor", locale });
}
