import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/Chrome";
import { Icon } from "@/components/Icon";
import { IdealsBrowser } from "@/components/IdealsBrowser";
import { thoughtOfTheDay } from "@/lib/content/ideals";
import { tr, type Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export const revalidate = 21600; // refresh the thought of the day

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "hi" ? "हमारे आदर्श" : "Our Ideals" };
}

export default async function Ideals({ params }: Props) {
  const lang = (await params).lang as Lang;
  const q = thoughtOfTheDay();
  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "हमारे आदर्श", en: "Our Ideals" } }]}
        title={{ hi: "हमारे आदर्श", en: "Our Ideals" }}
        lead={{ hi: "राष्ट्र प्रथम, अंत्योदय और संगठन: जिन विचारों पर हम चलते हैं, वे संघ और भाजपा के इन्हीं प्रेरक व्यक्तित्वों से आते हैं।", en: "Nation first, Antyodaya and organisation: the ideas we work by come from these leaders of the Sangh and the BJP." }}
        aside={
          <div className="quote-card">
            <Icon name="quote" className="q" />
            <span className="eyebrow" style={{ color: "var(--marigold)", marginTop: 8 }}>{lang === "hi" ? "आज का विचार" : "Thought of the day"}</span>
            <blockquote>“{tr(q.line.text, lang)}”</blockquote>
            <div className="who">
              <Image className="who-img" src={q.img} alt="" width={52} height={65} />
              <span><b>{tr(q.name, lang)}</b><br />{tr(q.role, lang)}</span>
            </div>
          </div>
        }
      />
      <section>
        <div className="wrap"><IdealsBrowser /></div>
      </section>
    </>
  );
}
