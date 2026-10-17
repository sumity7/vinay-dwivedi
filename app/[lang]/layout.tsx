import type { Metadata, Viewport } from "next";
import { Noto_Serif, Noto_Serif_Devanagari, Tiro_Devanagari_Hindi } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Assistant } from "@/components/Assistant";
import { Footer } from "@/components/Chrome";
import { SideRail } from "@/components/Floating";
import { ScrollTop } from "@/components/ScrollTop";
import { Header } from "@/components/Header";
import { SiteProvider } from "@/components/SiteProvider";
import { isLang, LANGS, type Lang } from "@/lib/i18n";
import { img } from "@/lib/images";
import { defaultDescription, defaultTitle, keywords, siteBase } from "@/lib/seo";
import { site } from "@/lib/site";
import "../globals.css";

const tiro = Tiro_Devanagari_Hindi({ weight: "400", subsets: ["devanagari", "latin"], variable: "--font-display", display: "swap" });
/* body text is serif too: Noto Serif for English, Noto Serif Devanagari for Hindi */
const serifLatin = Noto_Serif({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-body", display: "swap" });
const serifHindi = Noto_Serif_Devanagari({ weight: ["400", "500", "600", "700"], subsets: ["devanagari"], variable: "--font-body-hi", display: "swap" });

export const dynamicParams = false;
export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : "hi";
  const name = site.name[l];
  /* canonical and hreflang are set per page (see lib/seo.ts), so sub-pages don't inherit the home page's */
  return {
    metadataBase: new URL(siteBase),
    title: { default: defaultTitle[l], template: `%s | ${name}` },
    description: defaultDescription[l],
    keywords: keywords[l],
    authors: [{ name: site.name[l], url: siteBase }],
    creator: site.credit.name,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    /* Google Search Console "HTML tag" token, optional (see .env.example) */
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } } : {}),
    openGraph: { siteName: name, locale: l === "hi" ? "hi_IN" : "en_IN", images: [{ url: img.hero.src, width: img.hero.width, height: img.hero.height }] },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = { themeColor: "#f29933" };

export default async function LangLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} className={`${tiro.variable} ${serifLatin.variable} ${serifHindi.variable}`}>
      <body>
        <SiteProvider lang={lang}>
          <Header />
          <main id="main">{children}</main>
          <Footer lang={lang} />
          <ScrollTop />
          <SideRail />
          {/* the "Ask assistant" button only appears once the AI key is set (see .env.example) */}
          {process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN || process.env.GROQ_API_KEY ? <Assistant /> : null}
        </SiteProvider>
      </body>
    </html>
  );
}
