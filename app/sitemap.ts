import type { MetadataRoute } from "next";
import { articles } from "@/lib/content/articles";
import { events } from "@/lib/content/events";
import { LANGS } from "@/lib/i18n";
import { siteBase } from "@/lib/seo";

export { siteBase };

const PAGES = ["", "/about", "/updates", "/media", "/media/meetings", "/vimarsh", "/vichar", "/vikas-yatra", "/ideals", "/e-shikayat", "/e-shikayat/track", "/e-card", "/contact"];

/* Every public page in both languages, each pointing at its other-language twin. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...PAGES.map((p) => ({ path: p, priority: p === "" ? 1 : 0.7, date: undefined as string | undefined })),
    ...events.map((e) => ({ path: `/updates/${e.slug}`, priority: 0.6, date: e.date })),
    ...articles.map((a) => ({ path: `/vichar/${a.slug}`, priority: 0.5, date: a.published })),
  ];
  return paths.flatMap(({ path, priority, date }) =>
    LANGS.map((lang) => ({
      url: `${siteBase}/${lang}${path}`,
      lastModified: date ? new Date(date) : undefined,
      priority,
      alternates: { languages: { ...Object.fromEntries(LANGS.map((l) => [l, `${siteBase}/${l}${path}`])), "x-default": `${siteBase}/hi${path}` } },
    })),
  );
}
