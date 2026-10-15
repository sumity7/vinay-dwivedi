import type { Metadata } from "next";
import { EventCard } from "@/components/Cards";
import { PageHero } from "@/components/Chrome";
import { sortedEvents } from "@/lib/content/events";
import type { Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "hi" ? "कार्यक्रम" : "Events" };
}

export default async function Updates({ params }: Props) {
  const lang = (await params).lang as Lang;
  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "कार्यक्रम", en: "Events" } }]}
        title={{ hi: "कार्यक्रम", en: "Events" }}
        lead={{ hi: "मेहनौन और गोंडा से ताज़ा गतिविधियाँ, जनसंपर्क, राहत कार्य और सार्वजनिक कार्यक्रम।", en: "Latest activities, outreach, relief work and public programmes from Mehnaun and Gonda." }}
      />
      <section>
        <div className="wrap ev-list">
          {sortedEvents.map((e) => <EventCard key={e.slug} e={e} lang={lang} wide />)}
        </div>
      </section>
    </>
  );
}
