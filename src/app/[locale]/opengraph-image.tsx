import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const alt = "Polyframe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SKINS = ["Wireframe", "shadcn/ui", "MUI", "Mantine", "Ant Design", "Bootstrap"];

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });
  const font = (w: number) => readFile(path.join(process.cwd(), `src/assets/fonts/Geist-${w}.ttf`));
  const [medium, bold] = await Promise.all([font(500), font(700)]);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#0a0a0a",
        color: "#fafafa",
        fontFamily: "Geist",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", width: 64, height: 64, display: "flex" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 40,
              height: 40,
              borderRadius: 8,
              border: "3px dashed #a3a3a3",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 12,
              top: 12,
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "#1677ff",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 24,
              top: 24,
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "#fafafa",
            }}
          />
        </div>
        <div style={{ fontSize: 44, fontWeight: 700 }}>Polyframe</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {t("title")}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {SKINS.map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                padding: "8px 18px",
                borderRadius: 999,
                border: "2px solid #404040",
                fontSize: 26,
                fontWeight: 500,
                color: "#d4d4d4",
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: medium, weight: 500, style: "normal" },
        { name: "Geist", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
