export async function formatTsx(code: string): Promise<string> {
  const [{ format }, typescript, estree] = await Promise.all([
    import("prettier/standalone"),
    import("prettier/plugins/typescript"),
    import("prettier/plugins/estree"),
  ]);
  return format(code, { parser: "typescript", plugins: [typescript, estree], printWidth: 100 });
}

export async function highlightTsx(code: string): Promise<string> {
  const { codeToHtml } = await import("shiki/bundle/web");
  return codeToHtml(code, { lang: "tsx", theme: "github-light" });
}
