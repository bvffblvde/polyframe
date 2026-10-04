import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withMDX = createMDX({ extension: /\.(md|mdx)$/, options: { remarkPlugins: ["remark-gfm"] } });

const nextConfig: NextConfig = {
  devIndicators: false,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async headers() {
    return [{ source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache" }] }];
  },
};

export default withNextIntl(withMDX(nextConfig));
