import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { EventCard } from "@/components/Cards";
import { EventFilter } from "@/components/EventFilter";
import { PageHero } from "@/components/Chrome";
import { sortedEvents } from "@/lib/content/events";
import type { Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const hi = lang === "hi";
  return pageMeta(lang as Lang, "/updates", {
    title: hi ? "अपडेट्स" : "Updates",
    description: hi ? "मेहनौन विधायक विनय कुमार द्विवेदी के ताज़ा कार्यक्रम, राहत कार्य, जनसंपर्क और क्षेत्र की ख़बरें।" : "Latest programmes, relief work, outreach and constituency news from Mehnaun MLA Vinay Kumar Dwivedi.",
  });
}

export default async function Updates({ params }: Props) {
  const lang = (await params).lang as Lang;
  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "अपडेट्स", en: "Updates" } }]}
        title={{ hi: "अपडेट्स", en: "Updates" }}
        lead={{ hi: "मेहनौन और गोंडा से ताज़ा गतिविधियाँ, जनसंपर्क, राहत कार्य और सार्वजनिक कार्यक्रम।", en: "Latest activities, outreach, relief work and public programmes from Mehnaun and Gonda." }}
      />
      <section>
        <h2 className="sr-only">{lang === "hi" ? "सभी अपडेट्स" : "All updates"}</h2>
        <div className="wrap">
          <EventFilter items={sortedEvents.map((e) => ({ cat: e.category, node: <EventCard key={e.slug} e={e} lang={lang} wide /> }))} />
        </div>
      </section>
    </>
  );
}
