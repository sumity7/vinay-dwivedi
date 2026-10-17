import type { Metadata, Viewport } from "next";
import { Noto_Serif, Noto_Serif_Devanagari, Tiro_Devanagari_Hindi } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Assistant } from "@/components/Assistant";
import { Footer } from "@/components/Chrome";
import { SideRail } from "@/components/Floating";
import { Header } from "@/components/Header";
import { SiteProvider } from "@/components/SiteProvider";
import { isLang, LANGS } from "@/lib/i18n";
import { img } from "@/lib/images";
import { site } from "@/lib/site";
import "../globals.css";

const tiro = Tiro_Devanagari_Hindi({ weight: "400", subsets: ["devanagari", "latin"], variable: "--font-display", display: "swap" });
/* body text is serif too: Noto Serif for English, Noto Serif Devanagari for Hindi */
const serifLatin = Noto_Serif({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-body", display: "swap" });
const serifHindi = Noto_Serif_Devanagari({ weight: ["400", "500", "600", "700"], subsets: ["devanagari"], variable: "--font-body-hi", display: "swap" });

export const dynamicParams = false;
export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteBase = site.siteUrl || (vercelUrl ? `https://${vercelUrl}` : "");

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const hi = lang === "hi";
  const name = hi ? "विनय कुमार द्विवेदी" : "Vinay Kumar Dwivedi";
  return {
    metadataBase: siteBase ? new URL(siteBase) : undefined,
    title: { default: hi ? "विनय कुमार द्विवेदी | विधायक, मेहनौन (295), गोंडा" : "Vinay Kumar Dwivedi | MLA, Mehnaun (295), Gonda", template: `%s | ${name}` },
    description: hi
      ? "विधायक विनय कुमार द्विवेदी ‘मुन्ना भैया’ की आधिकारिक वेबसाइट: ई-शिकायत, ई-कार्ड, कार्यक्रम, योजनाओं की जानकारी और विकास यात्रा।"
      : "Official website of MLA Vinay Kumar Dwivedi ‘Munna Bhaiya’: e-Shikayat complaints, e-cards, events, scheme guides and development figures.",
    alternates: { languages: { hi: "/hi", en: "/en" } },
    openGraph: { siteName: name, locale: hi ? "hi_IN" : "en_IN", images: [{ url: img.hero.src, width: img.hero.width, height: img.hero.height }] },
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
          <SideRail />
          {/* the "Ask assistant" button only appears once the AI key is set (see .env.example) */}
          {process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN || process.env.GROQ_API_KEY ? <Assistant /> : null}
        </SiteProvider>
      </body>
    </html>
  );
}
