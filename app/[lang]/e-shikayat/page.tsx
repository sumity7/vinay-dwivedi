import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/Chrome";
import { ComplaintCounts, ComplaintForm } from "@/components/Complaint";
import { Icon } from "@/components/Icon";
import { href, type Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "hi" ? "ई-शिकायत: शिकायत दर्ज करें" : "e-Shikayat: register a complaint" };
}

const HELP = [["112", "पुलिस / आपातकाल", "Police / emergency"], ["108", "एम्बुलेंस", "Ambulance"], ["1090", "वुमेन पावर लाइन", "Women Power Line"], ["1076", "मुख्यमंत्री हेल्पलाइन", "CM helpline"], ["1912", "बिजली शिकायत", "Electricity"], ["102", "जननी एम्बुलेंस", "Mother & child"]] as const;

export default async function Shikayat({ params }: Props) {
  const lang = (await params).lang as Lang;
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);
  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "ई-शिकायत: शिकायत दर्ज करें", en: "e-Shikayat: register a complaint" } }]}
        title={{ hi: "ई-शिकायत: अपनी समस्या दर्ज करें", en: "e-Shikayat: register a complaint" }}
        lead={{ hi: "अपने गाँव या वार्ड की समस्या विधायक कार्यालय को बताएं। आपको तुरंत एक टिकट संख्या मिलेगी, जिससे आप कभी भी देख सकते हैं कि उस पर क्या कार्यवाही हो रही है।", en: "Tell the MLA’s office about a problem in your village or ward. You get a ticket number at once, and can check what is being done with it at any time." }}
        aside={
          <div className="steps-card">
            <dl>
              <dt>{t("फ़ॉर्म भरें", "Fill the form")}</dt><dd>{t("अपना नाम, मोबाइल, गाँव और समस्या।", "Your name, mobile, village and the problem.")}</dd>
              <dt>{t("टिकट संख्या पाएँ", "Get a ticket number")}</dt><dd>{t("इसे संभालकर रखें या WhatsApp पर साझा करें।", "Keep it, or share it on WhatsApp.")}</dd>
              <dt>{t("कार्यवाही देखें", "Track the action")}</dt><dd style={{ marginBottom: 0 }}>{t("प्राप्त, जाँच में, कार्यवाही में, निस्तारित।", "Received, under review, action taken, resolved.")}</dd>
            </dl>
          </div>
        }
      />
      <section>
        <h2 className="sr-only">{lang === "hi" ? "शिकायत फ़ॉर्म और जानकारी" : "Complaint form and information"}</h2>
        <div className="wrap svc-grid">
          <ComplaintForm />
          <aside className="note-card">
            <ComplaintCounts />
            <h3><Icon name="info" />{t("लिखने से पहले", "Before you write")}</h3>
            <ul>
              <li>{t("हर समस्या के लिए अलग शिकायत करें, इससे कार्यवाही जल्दी होती है।", "One complaint per problem makes it faster to act on.")}</li>
              <li>{t("न्यायालय में लंबित मामले, RTI आवेदन, नौकरी की माँग और तबादले यहाँ दर्ज न करें।", "Cases in court, RTI applications, job requests and transfers are not handled here.")}</li>
              <li>{t("प्रदेश स्तर की शिकायतें IGRS पोर्टल jansunwai.up.nic.in पर भी दर्ज की जा सकती हैं।", "State-level grievances can also be filed on the IGRS portal, jansunwai.up.nic.in.")}</li>
            </ul>
            <p style={{ fontWeight: 600, margin: "0 0 10px" }}>{t("आपात स्थिति में तुरंत कॉल करें", "In an emergency, call at once")}</p>
            <div className="help-nums">
              {HELP.map(([n, hi, en]) => <a key={n} href={`tel:${n}`}><b>{n}</b>{t(hi, en)}</a>)}
            </div>
            <Link className="btn btn-ghost" href={href(lang, "/e-shikayat/track")}><Icon name="search" />{t("शिकायत की स्थिति देखें", "Track your complaint")}</Link>
          </aside>
        </div>
      </section>
    </>
  );
}
