import { setRequestLocale } from "next-intl/server";
import { ViewerLoader } from "@/features/editor/editor-loader";

export const metadata = { robots: { index: false } };

export default async function ViewPage({ params }: PageProps<"/[locale]/view">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ViewerLoader />;
}
