import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Suspense } from "react";
import { PageHero } from "@/components/Chrome";
import { ECardMaker } from "@/components/ECardMaker";
import type { Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const hi = lang === "hi";
  return pageMeta(lang as Lang, "/e-card", {
    title: hi ? "ई-कार्ड: अपने नाम से शुभकामनाएँ" : "e-Card: send greetings with your name",
    description: hi ? "अपने नाम और फोटो के साथ त्योहारों व अवसरों के शुभकामना ई-कार्ड बनाएं और व्हाट्सऐप पर साझा करें, विधायक विनय कुमार द्विवेदी की ओर से।" : "Make festival and occasion greeting e-cards with your own name and photo, from MLA Vinay Kumar Dwivedi, and share them on WhatsApp.",
  });
}

export default async function ECard({ params }: Props) {
  const lang = (await params).lang as Lang;
  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "ई-कार्ड", en: "e-Card" } }]}
        title={{ hi: "ई-कार्ड: अपने नाम से शुभकामनाएँ भेजें", en: "e-Card: send greetings with your name" }}
        lead={{ hi: "अवसर चुनें, अपना नाम और फोटो जोड़ें, और कार्ड डाउनलोड करें या सीधे WhatsApp पर साझा करें।", en: "Choose an occasion, add your name and photo, and download the card or share it straight to WhatsApp." }}
      />
      <section>
        <h2 className="sr-only">{lang === "hi" ? "ई-कार्ड बनाएं" : "Make your card"}</h2>
        <div className="wrap">
          <Suspense><ECardMaker /></Suspense>
        </div>
      </section>
    </>
  );
}
