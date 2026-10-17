import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
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
  const hi = lang === "hi";
  return pageMeta(lang as Lang, "/ideals", {
    title: hi ? "हमारे आदर्श" : "Our Ideals",
    description: hi ? "वे महापुरुष और विचार जिनसे विधायक विनय कुमार द्विवेदी जनसेवा की प्रेरणा लेते हैं।" : "The great figures and ideas that inspire MLA Vinay Kumar Dwivedi’s public service.",
  });
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
        lead={{ hi: "राष्ट्र प्रथम, अंत्योदय और संगठन: जिन विचारों पर हम चलते हैं, वे संघ, भाजपा और स्वामी विवेकानंद व डॉ. कलाम जैसे राष्ट्र-निर्माताओं के प्रेरक जीवन से आते हैं।", en: "Nation first, Antyodaya and organisation: the ideas we work by come from the leaders of the Sangh and the BJP, and from nation builders like Swami Vivekananda and Dr. Kalam." }}
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
        <h2 className="sr-only">{lang === "hi" ? "हमारे आदर्श: सूची" : "Our ideals: the list"}</h2>
        <div className="wrap"><IdealsBrowser /></div>
      </section>
    </>
  );
}
