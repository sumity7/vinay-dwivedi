import type { MetadataRoute } from "next";
import { siteBase } from "./sitemap";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] }],
    sitemap: `${siteBase}/sitemap.xml`,
  };
}
