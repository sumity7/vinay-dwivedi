import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { ArticleCard } from "@/components/Cards";
import { PageHero } from "@/components/Chrome";
import { Icon, type IconName } from "@/components/Icon";
import { CompareCard } from "@/components/Vikas";
import { articles } from "@/lib/content/articles";
import { priorities, vision } from "@/lib/content/profile";
import { indiaCompare } from "@/lib/content/vikas";
import { href, tr, type Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const hi = lang === "hi";
  return pageMeta(lang as Lang, "/vimarsh", {
    title: hi ? "विकास व विचार" : "Development & Ideas",
    description: hi ? "मेहनौन के विकास, योजनाओं और जनसेवा पर विधायक विनय कुमार द्विवेदी के विचार।" : "MLA Vinay Kumar Dwivedi on development, government schemes and public service in Mehnaun.",
  });
}

export default async function Vimarsh({ params }: Props) {
  const lang = (await params).lang as Lang;
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);
  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "विकास व विचार", en: "Development & Ideas" } }]}
        title={{ hi: "विकास व विचार: दृष्टि और आँकड़े", en: "Development & Ideas: views and figures" }}
        lead={{ hi: "सरकार क्या कर रही है, हम उसके बारे में क्या सोचते हैं, और आँकड़े क्या कहते हैं।", en: "What the government is doing, what we think about it, and what the numbers say." }}
      />
      <section>
        <div className="wrap two-col">
          <div>
            <h2>{t("हमारी सोच", "Our approach")}</h2>
            <p className="lead" style={{ marginTop: 16 }}>{t("विकास का मतलब हमारे लिए आँकड़ों से पहले गाँव की सड़क, खेत का पानी, बच्चे का विद्यालय और बीमार के लिए पास का अस्पताल है।", "For us, development begins with the village road, water for the field, the child’s school and a hospital near the sick, before it becomes a number.")}</p>
          </div>
          <div>
            {vision.map((p, i) => <p key={i} className="justify">{tr(p, lang)}</p>)}
          </div>
        </div>
      </section>
      <section className="sec-sand">
        <div className="wrap">
          <h2 style={{ marginBottom: 12 }}>{t("क्षेत्र की प्राथमिकताएँ", "Priorities for the area")}</h2>
          <p className="lead" style={{ marginBottom: 28 }}>{t("मेहनौन के लिए पाँच विषय, जिन पर सबसे अधिक ध्यान है।", "Five themes for Mehnaun that get the most attention.")}</p>
          <div className="prio">
            {priorities.map((p) => (
              <div className="card" key={p.title.en}><Icon name={p.icon as IconName} /><h3>{tr(p.title, lang)}</h3><p>{tr(p.text, lang)}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-icon">
              <span className="ic"><Icon name="book" /></span>
              <div>
                <h2>{t("विचार व लेख", "Ideas & Articles")}</h2>
                <p>{t("योजनाएँ, महिला सुरक्षा, शिक्षा, रोज़गार और विकास: किसे लाभ मिलेगा, आवेदन कैसे करें, और हमारा पक्ष।", "Schemes, women’s safety, education, employment and development, explained with who can benefit, how to apply and where we stand.")}</p>
              </div>
            </div>
            <Link className="btn btn-ghost" href={href(lang, "/vichar")}>{t("सभी लेख", "All articles")} <Icon name="arrow" /></Link>
          </div>
          <div className="art-grid">
            {articles.slice(0, 3).map((a) => <ArticleCard key={a.slug} a={a} lang={lang} />)}
          </div>
        </div>
      </section>
      <section className="dark-sec">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-icon">
              <span className="ic"><Icon name="trend" /></span>
              <div>
                <h2>{t("उपलब्धियाँ", "Achievements")}</h2>
                <p>{t("राजमार्ग, हवाई अड्डे, मेडिकल कॉलेज, बैंक खाते: तब और अब, हर आँकड़ा सरकारी स्रोत के साथ।", "Highways, airports, medical colleges and bank accounts, then and now, each with its official source.")}</p>
              </div>
            </div>
            <Link className="btn btn-ghost" href={href(lang, "/vikas-yatra")}>{t("खोलें", "Open")} <Icon name="arrow" /></Link>
          </div>
          <div className="cmp-grid" style={{ color: "var(--ink)" }}>
            {indiaCompare.slice(0, 3).map((c, i) => <CompareCard key={c.title.en} c={c} lang={lang} i={i} />)}
          </div>
        </div>
      </section>
      <section>
        <div className="wrap">
          <h2 style={{ marginBottom: 12 }}>{t("आपकी बात, कार्यालय तक कैसे पहुँचती है", "How your concern reaches the office")}</h2>
          <p className="lead" style={{ marginBottom: 28 }}>{t("विकास तभी असली है जब आपकी अपनी समस्या का हल निकले। इसके लिए चार आसान कदम हैं।", "Development is real only when your own problem gets solved. There are four simple steps.")}</p>
          <ol className="vm-steps">
            <li><b>1</b><h3>{t("शिकायत दर्ज करें", "Register it")}</h3><p>{t("नाम, मोबाइल, गाँव और विषय भरें। चाहें तो फोटो भी जोड़ें। सड़क, पानी, बिजली, पेंशन, राशन कार्ड जैसे 12 विषय उपलब्ध हैं।", "Fill in your name, mobile, village and subject, and add a photo if you wish. Twelve subjects are available, such as roads, water, power, pension and ration card.")}</p></li>
            <li><b>2</b><h3>{t("टिकट संख्या पाएँ", "Get a ticket number")}</h3><p>{t("हर शिकायत को MHN-… जैसी एक टिकट संख्या मिलती है। इसे संभालकर रखें।", "Every complaint gets a ticket number like MHN-…. Keep it safe.")}</p></li>
            <li><b>3</b><h3>{t("स्थिति देखें", "Follow the status")}</h3><p>{t("टिकट संख्या और मोबाइल के अंतिम 4 अंक से देखें कि शिकायत ‘प्राप्त’, ‘जाँच में’, ‘कार्यवाही में’ या ‘निस्तारित’ में से किस चरण में है, और कार्यालय का उत्तर भी पढ़ें।", "With the ticket number and the last 4 digits of your mobile, see whether it is ‘Received’, ‘Under review’, ‘Action taken’ or ‘Resolved’, and read the office’s reply.")}</p></li>
            <li><b>4</b><h3>{t("अपनी राय दें", "Rate the service")}</h3><p>{t("निस्तारण के बाद सितारों से रेटिंग दें, ताकि सेवा बेहतर हो सके। सात दिन में उत्तर न मिले तो याद दिलाने की सुविधा भी है।", "After it is resolved, rate it with stars so the service can improve. If there is no reply within seven days, you can send a reminder.")}</p></li>
          </ol>
          <div className="hero-actions">
            <Link className="btn btn-primary" href={href(lang, "/e-shikayat")}>{t("शिकायत दर्ज करें", "Register a complaint")} <Icon name="arrow" /></Link>
            <Link className="btn btn-ghost" href={href(lang, "/e-shikayat/track")}>{t("शिकायत की स्थिति", "Track a complaint")}</Link>
            <Link className="btn btn-ghost" href={href(lang, "/contact")}>{t("मुलाकात या आमंत्रण", "Meeting or invitation")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
