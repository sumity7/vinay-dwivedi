import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/Chrome";
import { Pic } from "@/components/Pic";
import { meetings } from "@/lib/content/media";
import { tr, type Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const hi = lang === "hi";
  return pageMeta(lang as Lang, "/media/meetings", {
    title: hi ? "भेंट व संवाद" : "Meetings & Interactions",
    description: hi ? "विधायक विनय कुमार द्विवेदी की वरिष्ठ नेताओं, अधिकारियों और क्षेत्रवासियों से भेंट व संवाद की तस्वीरें।" : "Photos of MLA Vinay Kumar Dwivedi meeting senior leaders, officials and people of the constituency.",
  });
}

export default async function Meetings({ params }: Props) {
  const lang = (await params).lang as Lang;
  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "मीडिया", en: "Media" }, path: "/media" }, { label: { hi: "भेंट व संवाद", en: "Meetings & Interactions" } }]}
        title={{ hi: "भेंट व संवाद", en: "Meetings & Interactions" }}
        lead={{ hi: "सार्वजनिक जीवन की चुनिंदा मुलाकातें, बैठकें और संवाद।", en: "Selected meetings and interactions from public life." }}
      />
      <section>
        <h2 className="sr-only">{lang === "hi" ? "भेंट व संवाद की सूची" : "List of meetings and interactions"}</h2>
        <div className="wrap meet-grid">
          {meetings.map((m) => (
            <div className="card" key={m.title.en}>
              <div className="meet-img"><Pic src={m.img} alt={tr(m.title, lang)} placeholder="blur" sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 380px" /></div>
              <div className="body"><h3>{tr(m.title, lang)}</h3><p>{tr(m.text, lang)}</p></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
