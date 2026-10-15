import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/Cards";
import { PageHero } from "@/components/Chrome";
import { Icon } from "@/components/Icon";
import { CompareCard } from "@/components/Vikas";
import { articles } from "@/lib/content/articles";
import { indiaCompare } from "@/lib/content/vikas";
import { href, type Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "hi" ? "विकास व विचार" : "Development & Ideas" };
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
                <h2>{t("विकास यात्रा", "Development Journey")}</h2>
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
    </>
  );
}
