import { setRequestLocale } from "next-intl/server";
import { EditorLoader } from "@/features/editor/editor-loader";

export default async function EditorPage({ params }: PageProps<"/[locale]/editor">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EditorLoader />;
}
