import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/Chrome";
import { Icon } from "@/components/Icon";
import { CompareCard, MilestoneList, SingleCard } from "@/components/Vikas";
import { indiaCompare, indiaSingle, regionMilestones, upMilestones } from "@/lib/content/vikas";
import { href, tr, type Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "hi" ? "विकास यात्रा" : "Development Journey" };
}

export default async function VikasYatra({ params }: Props) {
  const lang = (await params).lang as Lang;
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);
  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "विकास व विचार", en: "Development & Ideas" }, path: "/vimarsh" }, { label: { hi: "विकास यात्रा", en: "Development Journey" } }]}
        title={{ hi: "विकास यात्रा: बदलाव, आँकड़ों में", en: "Vikas Yatra: the change, in figures" }}
        lead={{ hi: "नारे नहीं, आँकड़े। नीचे दिया हर आँकड़ा सरकारी स्रोत से है, जिसका नाम उसके साथ लिखा है।", en: "Figures, not slogans. Each number below comes from a government source, named under it." }}
        meta={
          <nav className="anchors" aria-label={t("इस पृष्ठ पर", "On this page")}>
            <a href="#india">{t("भारत: 2014 से पहले और बाद", "India: before and after 2014")}</a>
            <a href="#up">{t("उत्तर प्रदेश: 2017 से", "Uttar Pradesh: since 2017")}</a>
            <a href="#region">{t("हमारा क्षेत्र: अवध व देवीपाटन", "Our region: Awadh & Devipatan")}</a>
          </nav>
        }
        aside={
          <div className="vk-panel">
            {indiaCompare.slice(0, 3).map((c) => (
              <div key={c.title.en}><span>{tr(c.title, lang)}</span><b>{(c.now.value / c.then.value).toFixed(1)}×</b></div>
            ))}
            <div><span>{tr(indiaSingle[0].title, lang)}</span><b>{tr(indiaSingle[0].value, lang)}</b></div>
          </div>
        }
      />
      <section id="india" style={{ scrollMarginTop: 80 }}>
        <div className="wrap">
          <h2>{t("भारत: 2014 से पहले और बाद", "India: before and after 2014")}</h2>
          <p className="lead" style={{ margin: "16px 0 36px" }}>{t("सड़कें, हवाई अड्डे, स्वास्थ्य और गरीबों के लिए बैंकिंग, दस साल के अंतर पर।", "Roads, airports, healthcare and banking for the poor, ten years apart.")}</p>
          <div className="cmp-grid">{indiaCompare.map((c, i) => <CompareCard key={c.title.en} c={c} lang={lang} i={i} />)}</div>
          <div className="single-grid">{indiaSingle.map((s) => <SingleCard key={s.title.en} s={s} lang={lang} />)}</div>
        </div>
      </section>
      <section id="up" className="sec-sand" style={{ scrollMarginTop: 80 }}>
        <div className="wrap two-col">
          <div>
            <h2>{t("उत्तर प्रदेश: 2017 से", "Uttar Pradesh: since 2017")}</h2>
            <p className="lead" style={{ marginTop: 16 }}>{t("एक्सप्रेसवे, आस्था के धाम और हर जनपद का उद्यम: प्रदेश की पहचान बदली है।", "Expressways, renewed places of faith and every district’s own enterprise: the state’s image has changed.")}</p>
          </div>
          <MilestoneList items={upMilestones} lang={lang} />
        </div>
      </section>
      <section id="region" style={{ scrollMarginTop: 80 }}>
        <div className="wrap two-col">
          <div>
            <h2>{t("हमारा क्षेत्र: अवध व देवीपाटन", "Our region: Awadh & Devipatan")}</h2>
            <p className="lead" style={{ marginTop: 16 }}>{t("सरयू के उस पार अयोध्या में हुआ बदलाव गोंडा और मेहनौन के लिए भी नए अवसर लेकर आया है।", "The change across the Saryu at Ayodhya brings new opportunities to Gonda and Mehnaun as well.")}</p>
          </div>
          <MilestoneList items={regionMilestones} lang={lang} />
        </div>
        <div className="wrap">
          <p className="hint" style={{ marginTop: 32 }}>{t("आँकड़े स्रोत द्वारा बताई गई तिथि के अनुसार हैं। जहाँ योजना पहले नहीं थी, वहाँ आँकड़ा शुरुआत से अब तक की उपलब्धि दिखाता है।", "Figures are as published by the source on the date shown. Where a scheme did not exist before, the figure shows what it has reached since launch.")}</p>
          <div className="foot-links">
            <Link className="link-arrow" href={href(lang, "/vichar/bharat-2014-ke-baad")}>{t("पढ़ें: 2014 के बाद का भारत", "Read: India after 2014")} <Icon name="arrow" /></Link>
            <Link className="link-arrow" href={href(lang, "/vichar/uttar-pradesh-2017-ke-baad")}>{t("पढ़ें: 2017 के बाद उत्तर प्रदेश", "Read: UP after 2017")} <Icon name="arrow" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
