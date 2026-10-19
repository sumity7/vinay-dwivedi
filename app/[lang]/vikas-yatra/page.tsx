import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/Chrome";
import { Icon } from "@/components/Icon";
import { CompareCard, MilestoneList, SingleCard } from "@/components/Vikas";
import { indiaCompare, indiaMilestones, indiaSingle, regionMilestones, upMilestones } from "@/lib/content/vikas";
import { href, tr, type Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const hi = lang === "hi";
  return pageMeta(lang as Lang, "/vikas-yatra", {
    title: hi ? "उपलब्धियाँ" : "Achievements",
    description: hi ? "मेहनौन विधानसभा, गोंडा में सड़क, बिजली, पानी, शिक्षा और स्वास्थ्य के विकास कार्यों का ब्योरा।" : "Development work in Mehnaun Assembly, Gonda: roads, power, water, education and health, in figures.",
  });
}

export default async function VikasYatra({ params }: Props) {
  const lang = (await params).lang as Lang;
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);
  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "विकास व विचार", en: "Development & Ideas" }, path: "/vimarsh" }, { label: { hi: "उपलब्धियाँ", en: "Achievements" } }]}
        title={{ hi: "उपलब्धियाँ: बदलाव, आँकड़ों में", en: "Achievements: the change, in figures" }}
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
          <h3 className="vk-sub" style={{ margin: "44px 0 20px" }}>{t("जन-कल्याण की प्रमुख योजनाएँ: कब शुरू हुईं", "Flagship welfare schemes: when they began")}</h3>
          <MilestoneList items={indiaMilestones} lang={lang} />
        </div>
      </section>
      <section id="up" className="sec-sand" style={{ scrollMarginTop: 80 }}>
        <div className="wrap two-col">
          <div>
            <h2>{t("उत्तर प्रदेश: 2017 से", "Uttar Pradesh: since 2017")}</h2>
            <p className="lead" style={{ marginTop: 16 }}>{t("एक्सप्रेसवे, आस्था के धाम और हर जनपद का उद्यम: प्रदेश की पहचान बदली है।", "Expressways, renewed places of faith and every district’s own enterprise: the state’s image has changed.")}</p>
            <div className="vk-glance">
              <div><b>2</b><span>{t("नए एक्सप्रेसवे: पूर्वांचल (341 किमी) और बुंदेलखंड (296 किमी)", "new expressways: Purvanchal (341 km) and Bundelkhand (296 km)")}</span></div>
              <div><b>637 {t("किमी", "km")}</b><span>{t("दोनों एक्सप्रेसवे की कुल लंबाई", "combined length of the two expressways")}</span></div>
              <div><b>2018</b><span>{t("में ‘एक जनपद एक उत्पाद’ की शुरुआत", "the year ‘One District One Product’ began")}</span></div>
            </div>
            <h3 className="vk-sub">{t("क्या बदला", "What changed")}</h3>
            <p>{t("सबसे बड़ा बदलाव आवागमन में दिखता है। पूर्वांचल एक्सप्रेसवे ने लखनऊ से गाज़ीपुर तक का सफ़र छोटा किया और बुंदेलखंड एक्सप्रेसवे ने बुंदेलखंड को आगरा-लखनऊ और यमुना एक्सप्रेसवे से जोड़ा। जहाँ सड़क अच्छी होती है, वहाँ किसान की उपज मंडी तक जल्दी पहुँचती है और उद्यम को बाज़ार मिलता है।", "The biggest change shows in travel. The Purvanchal Expressway shortened the journey from Lucknow to Ghazipur, and the Bundelkhand Expressway linked Bundelkhand to the Agra-Lucknow and Yamuna expressways. Where roads are good, a farmer’s produce reaches the market sooner and enterprise finds customers.")}</p>
            <p>{t("दूसरा बदलाव आस्था के केंद्रों का है। दिसंबर 2021 में श्री काशी विश्वनाथ धाम का लोकार्पण हुआ और अयोध्या में नया हवाई अड्डा शुरू हुआ। तीसरा, ‘एक जनपद एक उत्पाद’ ने हर जनपद के पारंपरिक उत्पाद को पहचान, ऋण और बाज़ार देने का रास्ता खोला।", "The second change is in places of faith: Shri Kashi Vishwanath Dham was dedicated in December 2021 and a new airport opened at Ayodhya. Third, ‘One District One Product’ opened a way for each district’s traditional product to get recognition, credit and markets.")}</p>
            <h3 className="vk-sub">{t("गोंडा और मेहनौन के लिए इसका अर्थ", "What it means for Gonda and Mehnaun")}</h3>
            <ul className="vk-list">
              <li>{t("अयोध्या का हवाई अड्डा और नया रेलवे स्टेशन गोंडा से कुछ ही दूरी पर हैं, इसलिए दूर के शहरों की यात्रा और व्यापार आसान होता है।", "Ayodhya’s airport and rebuilt railway station are a short distance from Gonda, which makes travel and trade with distant cities easier.")}</li>
              <li>{t("‘एक जनपद एक उत्पाद’ में अपने जनपद का उत्पाद, ऋण और प्रशिक्षण odopup.in पर देखा जा सकता है।", "Your district’s product, credit and training under ‘One District One Product’ can be seen on odopup.in.")}</li>
              <li>{t("यह प्रदेश स्तर की तस्वीर है। मेहनौन में बदलाव गाँव-गाँव की सड़क, बिजली और पानी से तय होगा, जिसके लिए ई-शिकायत पर अपनी समस्या दर्ज करें।", "This is the state-level picture. Change in Mehnaun will be decided by roads, power and water village by village, so register your own problem on e-Shikayat.")}</li>
            </ul>
            <Link className="link-arrow" href={href(lang, "/vichar/uttar-pradesh-2017-ke-baad")}>{t("पूरा लेख पढ़ें", "Read the full article")} <Icon name="arrow" /></Link>
          </div>
          <MilestoneList items={upMilestones} lang={lang} />
        </div>
      </section>
      <section id="region" style={{ scrollMarginTop: 80 }}>
        <div className="wrap two-col">
          <div>
            <h2>{t("हमारा क्षेत्र: अवध व देवीपाटन", "Our region: Awadh & Devipatan")}</h2>
            <p className="lead" style={{ marginTop: 16 }}>{t("सरयू के उस पार अयोध्या में हुआ बदलाव गोंडा और मेहनौन के लिए भी नए अवसर लेकर आया है।", "The change across the Saryu at Ayodhya brings new opportunities to Gonda and Mehnaun as well.")}</p>
            <p>{t("अयोध्या में नया हवाई अड्डा (30 दिसंबर 2023) और राम मंदिर में प्राण-प्रतिष्ठा (22 जनवरी 2024) के बाद देवीपाटन मंडल में आने वाले यात्रियों की संख्या बढ़ने की संभावना है। श्रद्धालु बढ़ते हैं तो ठहरने, खाने, परिवहन और स्थानीय सामान की माँग भी बढ़ती है।", "After the new airport at Ayodhya (30 December 2023) and the Pran Pratishtha at the Ram temple (22 January 2024), more visitors are likely to come through the Devipatan division. When pilgrims increase, so does the demand for lodging, food, transport and local goods.")}</p>
            <h3 className="vk-sub">{t("गाँव के लोग इसका लाभ कैसे लें", "How villagers can benefit")}</h3>
            <ul className="vk-list">
              <li>{t("छोटा व्यवसाय शुरू करने के लिए मुद्रा ऋण की जानकारी हमारे लेख में है।", "Our article explains Mudra loans for starting a small business.")}</li>
              <li>{t("हस्तशिल्प, खान-पान या सेवा का काम करने वाले युवा अपने जनपद के उत्पाद की योजना देखें।", "Young people in handicrafts, food or services can look at their district’s product scheme.")}</li>
              <li>{t("सड़क, बिजली या पानी की कमी विकास में बाधा न बने, इसलिए अपने गाँव की समस्या दर्ज कराएँ।", "So that a lack of roads, power or water does not hold growth back, register your village’s problem.")}</li>
            </ul>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-sm" href={href(lang, "/vichar/mudra-vishwakarma")}>{t("मुद्रा व विश्वकर्मा योजना", "Mudra & Vishwakarma")}</Link>
              <Link className="btn btn-ghost btn-sm" href={href(lang, "/e-shikayat")}>{t("शिकायत दर्ज करें", "Register a complaint")}</Link>
            </div>
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
