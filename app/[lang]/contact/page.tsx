import type { Metadata } from "next";
import { PageHero, SOCIALS } from "@/components/Chrome";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { tr, type Lang } from "@/lib/i18n";
import { phoneLabel, site } from "@/lib/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "hi" ? "संपर्क करें" : "Contact" };
}

export default async function Contact({ params }: Props) {
  const lang = (await params).lang as Lang;
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);
  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "संपर्क", en: "Contact" } }]}
        title={{ hi: "संपर्क करें", en: "Get in touch" }}
        lead={{ hi: "जनहित के विषय, मुलाकात का अनुरोध, कार्यक्रम में आमंत्रण, सुझाव या अभियान से जुड़ने के लिए संपर्क करें।", en: "Get in touch about public matters, to request a meeting, invite the MLA to a programme, share a suggestion or volunteer." }}
      />
      <section>
        <div className="wrap contact-page">
          <ContactForm />
          <aside className="card" style={{ padding: "8px 24px 20px" }}>
            <ul className="side-list" style={{ borderTop: 0, marginTop: 0 }}>
              <li style={{ display: "block", paddingBottom: 6 }}><span className="eyebrow" style={{ margin: 0 }}>{t("सोशल मीडिया", "Social media")}</span></li>
              {SOCIALS.map((s) => (
                <li key={s.key}><span className="ic"><Icon name={s.icon} /></span><a href={site.social[s.key].url} target="_blank" rel="noopener">{s.label}<small>{site.social[s.key].handle}</small></a></li>
              ))}
              {site.phones.map((p) => <li key={p}><span className="ic"><Icon name="phone" /></span><a href={`tel:${p}`}>{phoneLabel(p)}</a></li>)}
              <li><span className="ic"><Icon name="mail" /></span><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li style={{ borderBottom: 0 }}><span className="ic"><Icon name="pin" /></span><span>{tr(site.office, lang)}<small>{t("पूरा पता जल्द जोड़ा जाएगा", "Full address to be added")}</small></span></li>
            </ul>
            <p className="hint" style={{ margin: 0 }}>{t("हर संदेश WhatsApp के माध्यम से सीधे विधायक कार्यालय पहुँचता है।", "Every message reaches the MLA’s office directly on WhatsApp.")}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
