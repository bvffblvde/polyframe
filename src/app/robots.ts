import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/en/view", "/uk/view"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
