/* Per-page SEO: canonical URL, hreflang twins, Open Graph, and the JSON-LD for the home page.
   Next.js merges metadata shallowly, so every page builds its full `alternates` and `openGraph` here
   (otherwise sub-pages would inherit the home page's hreflang links and lose the share image). */
import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import { LANGS, type Lang } from "./i18n";
import { img } from "./images";
import { site } from "./site";

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
/** Absolute site origin: NEXT_PUBLIC_SITE_URL, else the Vercel production URL, else localhost. */
export const siteBase = site.siteUrl || (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000");

export const defaultTitle = {
  hi: "विनय कुमार द्विवेदी | विधायक, मेहनौन (295), गोंडा",
  en: "Vinay Kumar Dwivedi | MLA, Mehnaun (295), Gonda",
};
export const defaultDescription = {
  hi: "मेहनौन (गोंडा) के विधायक विनय कुमार द्विवेदी ‘मुन्ना भैया’ की आधिकारिक वेबसाइट: ई-शिकायत, ई-कार्ड, कार्यक्रम, योजनाओं की जानकारी और विकास यात्रा।",
  en: "Official website of Vinay Kumar Dwivedi ‘Munna Bhaiya’, MLA from Mehnaun, Gonda: e-Shikayat complaints, e-cards, events, scheme guides and development figures.",
};

type PageOpts = { title?: string; description?: string; image?: StaticImageData | string; type?: "website" | "article" | "profile" };

/** Metadata for one page. `path` is the route without the language prefix: "" for home, "/about", "/updates/x". */
export function pageMeta(lang: Lang, path: string, { title, description, image, type = "website" }: PageOpts = {}): Metadata {
  const name = site.name[lang];
  const desc = description ?? defaultDescription[lang];
  const pic = image ?? img.hero;
  const og = typeof pic === "string" ? { url: pic } : { url: pic.src, width: pic.width, height: pic.height };
  return {
    ...(title ? { title } : {}),
    description: desc,
    alternates: {
      canonical: `/${lang}${path}`,
      languages: { ...Object.fromEntries(LANGS.map((l) => [l, `/${l}${path}`])), "x-default": `/hi${path}` },
    },
    openGraph: {
      type,
      url: `/${lang}${path}`,
      siteName: name,
      title: title ? `${title} | ${name}` : defaultTitle[lang],
      description: desc,
      locale: lang === "hi" ? "hi_IN" : "en_IN",
      alternateLocale: lang === "hi" ? "en_IN" : "hi_IN",
      images: [og],
    },
  };
}

/** schema.org Person + WebSite, rendered on the home page so Google can tie the site to him. */
export function personJsonLd(lang: Lang) {
  const url = `${siteBase}/${lang}`;
  const s = site.social;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteBase}/#person`,
        name: site.name[lang],
        alternateName: [site.name[lang === "hi" ? "en" : "hi"], site.nickname.hi, site.nickname.en],
        jobTitle: lang === "hi" ? "विधायक, मेहनौन विधानसभा (295), गोंडा" : "MLA, Mehnaun Assembly (295), Gonda",
        description: defaultDescription[lang],
        url,
        image: `${siteBase}${img.hero.src}`,
        birthDate: "1971-10-15",
        birthPlace: { "@type": "Place", name: "Gonda, Uttar Pradesh, India" },
        nationality: { "@type": "Country", name: "India" },
        affiliation: { "@type": "PoliticalParty", name: "Bharatiya Janata Party", alternateName: "BJP" },
        hasOccupation: { "@type": "Occupation", name: "Member of the Legislative Assembly", occupationLocation: { "@type": "AdministrativeArea", name: "Mehnaun, Gonda, Uttar Pradesh" } },
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "Lal Bahadur Shastri College, Gonda" },
          { "@type": "CollegeOrUniversity", name: "Dr. Ram Manohar Lohia Avadh University" },
        ],
        email: `mailto:${site.email}`,
        sameAs: [s.facebook.url, s.instagram.url, s.youtube.url],
      },
      {
        "@type": "WebSite",
        "@id": `${siteBase}/#website`,
        url: siteBase,
        name: site.name[lang],
        inLanguage: ["hi-IN", "en-IN"],
        publisher: { "@id": `${siteBase}/#person` },
      },
    ],
  };
}

/** Safe <script type="application/ld+json"> payload (escapes "<" as the Next.js guide recommends). */
export const jsonLdHtml = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
