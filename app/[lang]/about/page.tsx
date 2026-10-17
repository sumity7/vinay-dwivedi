import type { Metadata } from "next";
import { Pic } from "@/components/Pic";
import Link from "next/link";
import { PageHero } from "@/components/Chrome";
import { Icon, type IconName } from "@/components/Icon";
import { bio, facts, journey, milestones, priorities, roles, vision } from "@/lib/content/profile";
import { href, tr, type Lang } from "@/lib/i18n";
import { img } from "@/lib/images";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "hi" ? "जीवन परिचय व सफर" : "About & Journey" };
}

export default async function About({ params }: Props) {
  const lang = (await params).lang as Lang;
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);

  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "जीवन परिचय व सफर", en: "About & Journey" } }]}
        eyebrow={{ hi: "जीवन परिचय व सफर", en: "About & Journey" }}
        title={{ hi: "विनय कुमार द्विवेदी", en: "Vinay Kumar Dwivedi" }}
        lead={{ hi: "विनय कुमार द्विवेदी ‘मुन्ना भैया’ गोंडा जनपद की मेहनौन विधानसभा से लगातार दूसरी बार विधायक हैं, जो जनसेवा, संगठन और विकास के लिए कार्यरत हैं।", en: "Vinay Kumar Dwivedi ‘Munna Bhaiya’ is serving a second consecutive term as MLA from Mehnaun in Gonda district, working in public service, organisation and development." }}
        meta={<p className="meta">{t("विधायक, मेहनौन विधानसभा (295) · गोंडा, उत्तर प्रदेश", "MLA, Mehnaun Assembly (295) · Gonda, Uttar Pradesh")}</p>}
        aside={<div className="soft-photo" style={{ maxWidth: 420, justifySelf: "center", width: "100%" }}><Pic src={img.hero} alt={t("विनय कुमार द्विवेदी", "Vinay Kumar Dwivedi")} placeholder="blur" sizes="420px" preload /></div>}
      />

      <section>
        <div className="wrap about-grid">
          <div>
            <h2>{t("व्यक्तिगत परिचय", "Personal profile")}</h2>
            {bio.map((p, i) => <p key={i} className="justify">{tr(p, lang)}</p>)}
            <h2 style={{ marginTop: 48 }}>{t("दृष्टि और संकल्प", "Vision and resolve")}</h2>
            {vision.map((p, i) => <p key={i} className="justify">{tr(p, lang)}</p>)}
          </div>
          <aside className="card fact-card">
            {facts.map((f) => <div key={f.label.en}><span>{tr(f.label, lang)}</span>{tr(f.value, lang)}</div>)}
          </aside>
        </div>
      </section>

      <section className="sec-sand" id="journey">
        <div className="wrap">
          <h2>{t("राजनीतिक सफर", "Political journey")}</h2>
          <p className="lead" style={{ margin: "20px 0 40px", maxWidth: "52ch" }}>{t("2004 में भाजपा की सदस्यता से लेकर क्षेत्र पंचायत, जिला पंचायत और फिर दो बार विधानसभा तक: जनता के भरोसे से संगठन में कदम-दर-कदम आगे बढ़ना।", "From joining the BJP in 2004 to the Kshetra Panchayat, the Zila Panchayat and then the Assembly twice: a step-by-step climb, carried by people’s trust.")}</p>
          <div className="two-col">
            <div>
              <span className="eyebrow">{t("दायित्व", "Responsibilities")}</span>
              <h3 style={{ marginBottom: 18 }}>{t("अब तक के दायित्व", "Roles he has held")}</h3>
              <div className="roles-tbl">
                {roles.map((r) => <div key={r.title.en}><b>{tr(r.title, lang)}</b><span>{tr(r.text, lang)}</span></div>)}
              </div>
            </div>
            <div className="card" style={{ padding: 30 }}>
              <span className="eyebrow">{t("अहम पड़ाव", "Turning points")}</span>
              <h3 style={{ marginBottom: 22 }}>{t("सफर के चार कदम", "Four steps in his journey")}</h3>
              <ol className="tl">
                {journey.map((j, i) => (
                  <li key={i}>
                    <span className="serif" style={{ color: "var(--saffron-deep)", fontSize: 20 }}>{tr(j.tag, lang)}</span>
                    <h3 className="serif" style={{ fontWeight: 400 }}>{tr(j.title, lang)}</h3>
                    <p style={{ fontSize: 15 }}>{tr(j.text, lang)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap ms-grid">
          <div>
            <h2>{t("उपलब्धियों के पड़ाव", "Milestones")}</h2>
            <p className="lead" style={{ marginTop: 20 }}>{t("किसान परिवार से विधानसभा तक, कदम दर कदम।", "From a farming family to the Assembly, step by step.")}</p>
          </div>
          <ol className="tl">
            {milestones.map((m, i) => (
              <li key={i} className={m.present ? "present" : ""}>
                <span className="step">{m.present ? t("वर्तमान दायित्व", "Present role") : `${t("चरण", "Step")} ${i + 1}`}</span>
                <h3>{tr(m.title, lang)}{m.badge && <span className="tag-pill">{tr(m.badge, lang)}</span>}</h3>
                <p>{tr(m.text, lang)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec-sand">
        <div className="wrap">
          <h2 style={{ marginBottom: 28 }}>{t("क्षेत्र के प्रमुख विषय", "Key issues for the area")}</h2>
          <div className="prio">
            {priorities.map((p) => (
              <div className="card" key={p.title.en}><Icon name={p.icon as IconName} /><h3>{tr(p.title, lang)}</h3><p>{tr(p.text, lang)}</p></div>
            ))}
          </div>
          <div className="foot-links">
            <Link className="link-arrow" href={href(lang, "/media")}>{t("मीडिया", "Media")} <Icon name="arrow" /></Link>
            <Link className="link-arrow" href={href(lang, "/updates")}>{t("अपडेट्स", "Updates")} <Icon name="arrow" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
