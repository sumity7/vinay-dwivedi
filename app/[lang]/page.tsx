import Image from "next/image";
import Link from "next/link";
import { EventCard } from "@/components/Cards";
import { SOCIALS } from "@/components/Chrome";
import { ContactForm } from "@/components/ContactForm";
import { Counter, FacebookFeed, HeroSlider, YouTubeFeed, type Slide } from "@/components/Home";
import { Icon } from "@/components/Icon";
import { sortedEvents } from "@/lib/content/events";
import { bio, electionStats, intro, journey, keyFacts } from "@/lib/content/profile";
import { href, tr, type Lang } from "@/lib/i18n";
import { img } from "@/lib/images";
import { phoneLabel, site } from "@/lib/site";
import { getVideos } from "@/lib/youtube";

const SLIDES: Slide[] = [
  { img: img.hero },
  { img: img.farmerField, pos: "center 30%", cap: { title: { hi: "खेत-खलिहान तक", en: "Out in the fields" }, text: { hi: "किसानों के बीच, उनकी बात सुनते हुए।", en: "Among farmers, listening to them." } } },
  { img: img.villageGreeting, pos: "center 40%", cap: { title: { hi: "गाँव-गाँव जनसंपर्क", en: "Village to village" }, text: { hi: "मेहनौन की गलियों में क्षेत्रवासियों के साथ।", en: "With residents in the lanes of Mehnaun." } } },
];

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);
  const videos = await getVideos();

  return (
    <>
      {/* HERO */}
      <section className="hero" aria-labelledby="hero-name" style={{ padding: 0 }}>
        <div className="wrap">
          <div className="hero-text">
            <span className="badge-soft">{t("आधिकारिक प्रोफ़ाइल", "Official profile")}</span>
            <h1 id="hero-name">{lang === "hi" ? <>विनय कुमार<br />द्विवेदी</> : <>Vinay Kumar<br />Dwivedi</>}</h1>
            <div className="role">{t("विधायक, मेहनौन", "MLA, Mehnaun")}<small>({t("विधानसभा 295, गोंडा", "Assembly 295, Gonda")})</small></div>
            <p className="intro">{tr(intro, lang)}</p>
            <div className="hero-actions">
              <Link className="btn btn-light" href={href(lang, "/about")}>{t("परिचय देखें", "Explore profile")} <Icon name="arrow" /></Link>
              <Link className="btn btn-outline-light" href={href(lang, "/contact")}>{t("संपर्क करें", "Contact")}</Link>
            </div>
            <div className="hero-facts">
              {keyFacts.map((f) => <div key={f.label.en}><span>{tr(f.label, lang)}</span><b>{tr(f.value, lang)}</b></div>)}
            </div>
          </div>
          <HeroSlider slides={SLIDES} />
        </div>
      </section>

      {/* ELECTION STATS */}
      <div className="stats" aria-label={t("2022 चुनाव परिणाम", "2022 election result")}>
        <div className="wrap">
          {electionStats.map((s) => <div className="stat" key={s.label.en}><Counter end={s.value} format={s.format} suffix={s.suffix} /><span>{tr(s.label, lang)}</span></div>)}
        </div>
      </div>

      {/* BIOGRAPHY */}
      <section className="sec-sand">
        <div className="wrap bio-grid">
          <div className="soft-photo"><Image src={img.addressing} alt={t("विनय कुमार द्विवेदी", "Vinay Kumar Dwivedi")} placeholder="blur" sizes="(max-width: 860px) 90vw, 440px" /></div>
          <div>
            <h2>{t("जीवन परिचय", "Biography")}</h2>
            {bio.map((p, i) => <p key={i} className="justify">{tr(p, lang)}</p>)}
            <Link className="btn btn-primary" href={href(lang, "/about")}>{t("और पढ़ें", "Read More")}</Link>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="eyebrow">{t("अहम पड़ाव", "Turning points")}</span>
              <h2>{t("राजनीतिक सफर", "Political journey")}</h2>
              <p>{t("गाँव की पंचायत से विधानसभा तक: जिम्मेदारियाँ और सार्वजनिक जीवन के अहम पड़ाव।", "From the village panchayat to the Assembly: his responsibilities and the turning points of his public life.")}</p>
            </div>
            <Link className="link-arrow" href={href(lang, "/about#journey")}>{t("पूरा सफर देखें", "See the full journey")} <Icon name="arrow" /></Link>
          </div>
          <div className="journey-line">
            {journey.map((j, i) => (
              <div key={i} className={`jcard${i === journey.length - 1 ? " now" : ""}`}>
                <span className="tag">{String(i + 1).padStart(2, "0")} · {tr(j.tag, lang)}</span>
                <h3>{tr(j.title, lang)}</h3>
                <p>{tr(j.text, lang)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="sec-sand">
        <div className="wrap">
          <div className="sec-head">
            <h2>{t("कार्यक्रम", "Events")}</h2>
            <Link className="btn btn-ghost" href={href(lang, "/updates")}>{t("सभी देखें", "View All")}</Link>
          </div>
          <div className="ev-grid">
            {sortedEvents.slice(0, 2).map((e) => <EventCard key={e.slug} e={e} lang={lang} />)}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section>
        <div className="wrap promo">
          <div className="tile tile-shikayat">
            <svg className="deco" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth=".6"><path d="M4 4h16v12H8l-4 4z" /></svg>
            <span className="ic"><Icon name="doc" /></span>
            <h2>{t("गाँव में कोई समस्या? हमें बताएं।", "A problem in your village? Tell us.")}</h2>
            <p>{t("हर शिकायत को एक टिकट संख्या मिलती है, वह सीधे विधायक कार्यालय पहुँचती है, और समाधान तक उसकी स्थिति देखी जा सकती है।", "Every complaint gets a ticket number, reaches the MLA’s office, and can be tracked until it is resolved.")}</p>
            <div className="steps">
              <span><Icon name="form" />{t("फ़ॉर्म भरें", "Fill the form")}</span>
              <span><Icon name="ticket" />{t("टिकट संख्या पाएँ", "Get a ticket number")}</span>
              <span><Icon name="checkCircle" />{t("कार्यवाही देखें", "Track the action")}</span>
            </div>
            <div className="actions">
              <Link className="btn btn-light" href={href(lang, "/e-shikayat")}>{t("शिकायत दर्ज करें", "Register a complaint")} <Icon name="arrow" /></Link>
              <Link className="btn btn-outline-light" href={href(lang, "/e-shikayat/track")}><Icon name="search" />{t("शिकायत की स्थिति", "Track your complaint")}</Link>
            </div>
          </div>
          <div className="tile tile-ecard">
            <div className="deco">
              <div className="mock">
                <div className="t"><b>{t("हार्दिक शुभकामनाएँ", "Warm greetings")}</b><small>{t("आपका नाम", "Your name")}</small><small>{t("आपका गाँव", "Your village")}</small></div>
                <span className="ph" aria-hidden="true"><Icon name="photoAdd" /></span>
              </div>
            </div>
            <span className="ic"><Icon name="card" /></span>
            <h2>{t("अपने नाम से शुभकामनाएँ भेजें", "Send greetings with your name")}</h2>
            <p>{t("आने वाले त्योहार के लिए विनय जी के साथ अपनी फोटो वाला शुभकामना कार्ड बनाएं और WhatsApp पर अपने गाँव के साथ साझा करें।", "Make a greeting card with your photo next to Vinay ji for the coming festival, and share it with your village on WhatsApp.")}</p>
            <div className="steps">
              <span><Icon name="photoAdd" />{t("अपनी फोटो जोड़ें", "Add your photo")}</span>
              <span><Icon name="pen" />{t("अपना नाम लिखें", "Write your name")}</span>
              <span><Icon name="send" />{t("WhatsApp पर भेजें", "Send on WhatsApp")}</span>
            </div>
            <div className="actions">
              <Link className="btn btn-primary" href={href(lang, "/e-card")}>{t("ई-कार्ड बनाएं", "Make an e-card")} <Icon name="arrow" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* STAY CONNECTED */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <h2>{t("जुड़े रहें", "Stay Connected")}</h2>
              <p>{t("आधिकारिक Facebook पेज और YouTube चैनल से ताज़ा पोस्ट और वीडियो।", "Recent posts and videos from the official Facebook page and YouTube channel.")}</p>
            </div>
          </div>
          <div className="connect">
            <div>
              <div className="col-head"><h3>{t("ताज़ा पोस्ट", "Latest posts")}</h3><a className="link-arrow" href={site.social.facebook.url} target="_blank" rel="noopener">{t("Facebook पेज खोलें", "Open the Facebook page")} <Icon name="arrowUpRight" /></a></div>
              <FacebookFeed />
            </div>
            <div>
              <div className="col-head"><h3>{t("वीडियो", "Videos")}</h3><a className="link-arrow" href={site.social.youtube.url} target="_blank" rel="noopener">{t("YouTube चैनल खोलें", "Open the YouTube channel")} <Icon name="arrowUpRight" /></a></div>
              <YouTubeFeed videos={videos} />
            </div>
          </div>
          <h3 style={{ margin: "40px 0 0" }}>{t("यहाँ भी जुड़ें", "Also find us on")}</h3>
          <div className="socials" style={{ marginTop: 14 }}>
            {SOCIALS.map((s) => (
              <a key={s.key} className="social-card" href={site.social[s.key].url} target="_blank" rel="noopener">
                <span className="ic"><Icon name={s.icon} /></span>
                <span><b>{s.label}</b><small>{site.social[s.key].handle}</small></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="sec-sand">
        <div className="wrap contact-grid">
          <div>
            <h2>{t("संपर्क करें", "Get in touch")}</h2>
            <p className="lead">{t("सामान्य जानकारी, मुलाकात का अनुरोध, कार्यक्रम में आमंत्रण या सुझाव के लिए नीचे दिया फ़ॉर्म भरें।", "For general enquiries, meeting requests, invitations to programmes or suggestions, please use the form.")}</p>
            <ul className="side-list">
              {site.phones.map((p) => <li key={p}><span className="ic"><Icon name="phone" /></span><a href={`tel:${p}`}>{phoneLabel(p)}</a></li>)}
              <li><span className="ic"><Icon name="mail" /></span><a href={`mailto:${site.email}`}>{site.email}</a></li>
              <li><span className="ic"><Icon name="pin" /></span><span>{tr(site.office, lang)}<small>{t("पूरा पता जल्द जोड़ा जाएगा", "Full address to be added")}</small></span></li>
            </ul>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
