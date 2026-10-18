import { SOCIALS } from "./Chrome";
import { ContactForm } from "./ContactForm";
import { Icon } from "./Icon";
import { tr, type Lang } from "@/lib/i18n";
import { site } from "@/lib/site";

/* Enquiry form + office details. Used on the Contact page and on the home page, so both always match. */
export function ContactSection({ lang, visibleTitle }: { lang: Lang; visibleTitle?: boolean }) {
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);
  return (
    <section id="contact">
      <div className="wrap">
        <h2 className={visibleTitle ? "sec-title center" : "sr-only"}>
          {visibleTitle ? t("संपर्क करें", "Get in touch") : lang === "hi" ? "संपर्क फ़ॉर्म और जानकारी" : "Contact form and details"}
        </h2>
      </div>
      <div className="wrap contact-page">
        <ContactForm />
        <aside className="card" style={{ padding: "8px 24px 20px" }}>
          <ul className="side-list" style={{ borderTop: 0, marginTop: 0 }}>
            <li style={{ display: "block", paddingBottom: 6 }}><span className="eyebrow" style={{ margin: 0 }}>{t("सोशल मीडिया", "Social media")}</span></li>
            {SOCIALS.map((s) => (
              <li key={s.key}><span className="ic"><Icon name={s.icon} /></span><a href={site.social[s.key].url} target="_blank" rel="noopener">{s.label}<small>{site.social[s.key].handle}</small></a></li>
            ))}
            <li><span className="ic"><Icon name="mail" /></span><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li style={{ borderBottom: 0 }}><span className="ic"><Icon name="pin" /></span><span>{tr(site.office, lang)}</span></li>
          </ul>
          <p className="hint" style={{ margin: 0 }}>{t("हर संदेश सीधे विधायक कार्यालय को ईमेल से पहुँचता है।", "Every message reaches the MLA’s office directly by e-mail.")}</p>
        </aside>
      </div>
    </section>
  );
}
