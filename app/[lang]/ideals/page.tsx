import type { Metadata } from "next";
import { PageHero } from "@/components/Chrome";
import { Icon } from "@/components/Icon";
import { IdealsBrowser } from "@/components/IdealsBrowser";
import { thoughtOfTheDay, yearsText } from "@/lib/content/ideals";
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
        lead={{ hi: "अंतिम व्यक्ति की सेवा, राष्ट्र की एकता और सांस्कृतिक गौरव: जिन विचारों पर हम चलते हैं, वे इन्हीं महान जीवनों से आते हैं।", en: "Service to the last person, national unity and cultural pride: the ideas we work by come from these lives." }}
        aside={
          <div className="quote-card">
            <Icon name="quote" className="q" />
            <span className="eyebrow" style={{ color: "var(--marigold)", marginTop: 8 }}>{lang === "hi" ? "आज का विचार" : "Thought of the day"}</span>
            <blockquote>{tr(q.quote, lang)}</blockquote>
            <div className="who"><span>{tr(q.name, lang)} ({yearsText(q.years, lang)})</span></div>
          </div>
        }
      />
      <section>
        <div className="wrap"><IdealsBrowser /></div>
      </section>
    </>
  );
}
