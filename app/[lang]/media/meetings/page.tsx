import type { Metadata } from "next";
import { PageHero } from "@/components/Chrome";
import { Pic } from "@/components/Pic";
import { meetings } from "@/lib/content/media";
import { tr, type Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "hi" ? "भेंट व संवाद" : "Meetings & Interactions" };
}

export default async function Meetings({ params }: Props) {
  const lang = (await params).lang as Lang;
  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "फोटो गैलरी", en: "Gallery" }, path: "/media" }, { label: { hi: "भेंट व संवाद", en: "Meetings & Interactions" } }]}
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
