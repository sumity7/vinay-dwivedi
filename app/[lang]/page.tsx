import type { Metadata } from "next";
import { Pic } from "@/components/Pic";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";
import { Carousel, FacebookProfile, GalleryTabs, HeroSlider, YouTubeLive, type GalTab, type Slide, type UpdateItem } from "@/components/Home";
import { Icon } from "@/components/Icon";
import { sortedEvents, type EventPost } from "@/lib/content/events";
import { proPhotos } from "@/lib/content/media";
import { facts, journey, profileRows } from "@/lib/content/profile";
import { dateParts, href, tr, type Bi, type Lang } from "@/lib/i18n";
import { img } from "@/lib/images";
import { jsonLdHtml, pageMeta, personJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import "@/components/persona.css";
import { getVideos } from "@/lib/youtube";

/* Hero: three slides. The first is the studio portrait, the second the wide desk scene, the third a candid photograph. */
const heroSlides = (lang: Lang): Slide[] => [
  {
    img: img.heroStudio, look: "studio", pos: "50% 12%", alt: { hi: "विधायक विनय कुमार द्विवेदी", en: "MLA Vinay Kumar Dwivedi" },
    eyebrow: { hi: "विधायक, मेहनौन (295)", en: "MLA, Mehnaun (295)" },
    title: site.name, sub: { hi: `(${site.nickname.hi})`, en: `(${site.nickname.en})` },
    text: { hi: "दो दशकों की जनसेवा। गाँव की पंचायत से विधानसभा तक का सफ़र।", en: "Two decades of public service, from the village panchayat to the Assembly." },
    cta: { href: href(lang, "/about"), label: { hi: "पूरा परिचय", en: "Full biography" } },
    cta2: { href: href(lang, "/vikas-yatra"), label: { hi: "उपलब्धियाँ", en: "Achievements" } },
    snapLabel: { hi: "संक्षिप्त परिचय", en: "Profile snapshot" },
    snap: [
      { k: { hi: "पद", en: "Role" }, v: { hi: "विधायक, मेहनौन (295)", en: "MLA, Mehnaun (295)" } },
      { k: { hi: "कार्यकाल", en: "Terms" }, v: { hi: "2 बार (2017, 2022)", en: "2 (2017, 2022)" } },
      { k: { hi: "मत, 2022", en: "Votes, 2022" }, v: { hi: "50.05%", en: "50.05%" } },
    ],
  },
  {
    img: img.heroDesk, look: "wide", pos: "100% 50%", alt: { hi: "जन समस्याओं के काग़ज़ात देखते विधायक जी", en: "The MLA going through public grievances at his desk" },
    eyebrow: { hi: "ई-शिकायत", en: "e-Shikayat" },
    title: { hi: "हर शिकायत पर स्वयं ध्यान", en: "Every complaint, personally seen to" },
    text: { hi: "अपनी बात सीधे विधायक कार्यालय तक पहुँचाएँ और कार्यवाही के हर कदम की जानकारी ऑनलाइन पाएँ।", en: "Send your concern straight to the MLA’s office and follow every step of the action online." },
    cta: { href: href(lang, "/e-shikayat"), label: { hi: "शिकायत दर्ज करें", en: "Register a complaint" } },
    cta2: { href: href(lang, "/e-shikayat/track"), label: { hi: "शिकायत की स्थिति", en: "Track a complaint" } },
    snapLabel: { hi: "कैसे काम करता है", en: "How it works" },
    snap: [
      { k: { hi: "दर्ज करें", en: "File" }, v: { hi: "ऑनलाइन, मिनटों में", en: "Online, in minutes" } },
      { k: { hi: "देखें", en: "Track" }, v: { hi: "टिकट संख्या से", en: "With your ticket number" } },
      { k: { hi: "पहुँचे", en: "Reaches" }, v: { hi: "सीधे कार्यालय तक", en: "The office directly" } },
    ],
  },
  {
    img: img.heroEcard, alt: { hi: "मुख्यमंत्री योगी आदित्यनाथ जी के साथ", en: "With Chief Minister Yogi Adityanath" }, pos: "50% 28%",
    eyebrow: { hi: "डबल इंजन का विकास", en: "Double-engine development" },
    title: { hi: "योगी जी के नेतृत्व में, नया मेहनौन", en: "A new Mehnaun under Yogi ji" },
    text: { hi: "प्रधानमंत्री श्री नरेन्द्र मोदी जी के विज़न और मुख्यमंत्री श्री योगी आदित्यनाथ जी के सुशासन को मेहनौन के हर घर तक पहुँचाना उनका संकल्प है।", en: "Taking Prime Minister Shri Narendra Modi’s vision and Chief Minister Shri Yogi Adityanath’s governance to every home in Mehnaun is his resolve." },
    cta: { href: href(lang, "/vikas-yatra"), label: { hi: "उपलब्धियाँ देखें", en: "See the achievements" } },
    cta2: { href: href(lang, "/e-card"), label: { hi: "ई-कार्ड बनाएं", en: "Make an e-card" } },
    snapLabel: { hi: "संकल्प", en: "The resolve" },
    snap: [
      { k: { hi: "हर गाँव में", en: "Every village" }, v: { hi: "सड़क, बिजली, पानी", en: "Roads, power, water" } },
      { k: { hi: "सम्मान", en: "Respect for" }, v: { hi: "किसान, युवा, महिलाएँ", en: "Farmers, youth, women" } },
      { k: { hi: "शुभकामना", en: "Greetings" }, v: { hi: "16 अवसरों के ई-कार्ड", en: "e-cards for 16 occasions" } },
    ],
  },
];

const heroTags: Bi[] = [
  { hi: "मेहनौन", en: "Mehnaun" }, { hi: "जनसेवा", en: "Public service" }, { hi: "विकास", en: "Development" }, { hi: "ई-शिकायत", en: "e-Shikayat" },
];

/* order of the event categories in the home gallery (anything not listed goes last) */
const GAL_ORDER = ["Relief", "Events", "Outreach", "Faith & culture"];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  return pageMeta(lang, "", { type: "profile" });
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);
  const videos = await getVideos(12);
  const slides = heroSlides(lang);
  const fact = (en: string) => facts.find((f) => f.label.en === en)!;
  const keyFacts4: { label: Bi; value: Bi }[] = [
    fact("Born"), fact("Education"),
    { label: { hi: "व्यवसाय", en: "Occupation" }, value: { hi: "किसान और व्यापारी", en: "Farmer and businessman" } },
    fact("Party"),
  ];
  /* the two stories shown on the home page; the rest are on the Updates page */
  const news = ["kisan-rahat-vitaran", "gaon-gaon-jansampark"].map((slug) => sortedEvents.find((e) => e.slug === slug)!);
  /* photos already shown higher on the page are left out of the gallery, so nothing repeats */
  const shown = new Set([img.hero, img.villageGreeting, img.addressing, img.atWork, img.meetingGreeting, ...news.map((e) => e.photos[0].img)].map((p) => p.src));
  /* Facebook card: each post shows a photo not used above (the cover is on the news card) */
  const updates: UpdateItem[] = [...sortedEvents].sort((a, b) => b.date.localeCompare(a.date)).map((e) => {
    const pic = (e.photos.slice(1).find((p) => !shown.has(p.img.src)) ?? e.photos[0]).img;
    shown.add(pic.src);
    return { slug: e.slug, date: e.date, category: e.category, title: e.title, summary: e.summary, img: pic, source: e.source };
  });
  const fresh = (ps: EventPost["photos"]) => ps.filter((p) => !shown.has(p.img.src));
  const catTabs: GalTab[] = [
    /* official photographs first; then relief, programmes and outreach; festival and village coverage comes last */
    { key: "more", label: { hi: "भेंट व संवाद", en: "Meetings" }, icon: "chat" as const, photos: proPhotos },
    ...sortedEvents.filter((e, n, all) => all.findIndex((x) => x.category.en === e.category.en) === n)
      .sort((x, y) => GAL_ORDER.indexOf(x.category.en) - GAL_ORDER.indexOf(y.category.en)).slice(0, 4)
      .map((e, n): GalTab => ({ key: e.slug, label: e.category, icon: (["bolt", "calendar", "people", "images"] as const)[n], photos: fresh(e.photos) })),
  ].filter((g) => g.photos.length > 0);
  /* "All" first, so the gallery always opens on a full grid */
  const allPhotos = catTabs.flatMap((g) => g.photos).filter((p, n, a) => a.findIndex((x) => x.img.src === p.img.src) === n);
  const galTabs: GalTab[] = [{ key: "all", label: { hi: "सभी", en: "All" }, icon: "images", photos: allPhotos }, ...catTabs];

  return (
    <>
      {/* structured data: who he is, for Google's knowledge panel and name searches */}
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(personJsonLd(lang))} />

      {/* HERO: three slides, full width (the first one carries the page's h1) */}
      <section className="rh-sec" aria-label={t("मुख्य स्लाइड", "Highlights")}>
        <HeroSlider slides={slides} tags={heroTags} />
      </section>

      {/* FACTS: four plain facts under the hero */}
      <section className="facts-strip" aria-label={t("संक्षिप्त तथ्य", "Key facts")}>
        <div className="wrap">
          <dl className="facts-grid">
            {keyFacts4.map((f, n) => <div key={n}><dt>{tr(f.label, lang)}</dt><dd>{tr(f.value, lang)}</dd></div>)}
          </dl>
        </div>
      </section>

      {/* PERSONALITY: one photograph, the biography as three labelled rows */}
      <section className="persona" aria-labelledby="persona-title">
        <div className="wrap persona-grid">
          <figure className="persona-fig">
            <Pic src={img.hero} alt={t("माइक पर जनसभा को संबोधित करते विनय कुमार द्विवेदी", "Vinay Kumar Dwivedi addressing a public gathering")} placeholder="blur" sizes="(max-width: 900px) 90vw, 480px" />
            <figcaption><b>{tr(site.nickname, lang)}</b>{t("विधायक, मेहनौन (295)", "MLA, Mehnaun (295)")}</figcaption>
          </figure>
          <div className="persona-body">
            <span className="eyebrow">{t("व्यक्तित्व", "Personality")}</span>
            <h2 id="persona-title">{tr(site.name, lang)}</h2>
            <dl className="persona-rows">
              {profileRows.map((r, n) => <div key={n}><dt><b>{String(n + 1).padStart(2, "0")}</b>{tr(r.label, lang)}</dt><dd>{tr(r.text, lang)}</dd></div>)}
            </dl>
            <div className="persona-actions">
              <Link className="btn btn-orange" href={href(lang, "/about")}>{t("पूरा परिचय", "Full biography")} <Icon name="arrow" /></Link>
              <Link className="link-arrow" href={href(lang, "/about#journey")}>{t("जीवन यात्रा", "Life journey")} <Icon name="arrow" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST NEWS & UPDATES */}
      <section className="news-sec" aria-labelledby="news-title">
        <div className="wrap">
          <div className="news-bar">
            <h2 id="news-title">{t("ताज़ा अपडेट्स", "Latest updates")}</h2>
            <Link href={href(lang, "/updates")}>{t("सभी देखें", "View all")} <Icon name="arrow" /></Link>
          </div>
          <div className="news-grid">
            {news.map((e) => {
              const { d, month, y } = dateParts(e.date, lang);
              return (
                <Link key={e.slug} href={href(lang, `/updates/${e.slug}`)} className="news-card">
                  <Pic src={e.photos[0].img} alt={tr(e.photos[0].cap, lang)} placeholder="blur" sizes="(max-width: 860px) 100vw, 380px" />
                  <span className="news-date">{tr(e.category, lang)} · {d} {month} {y}</span>
                  <b>{tr(e.title, lang)}</b>
                  <p>{tr(e.summary, lang)}</p>
                  <span className="link-arrow">{t("पूरा पढ़ें", "Read more")} <Icon name="arrow" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="journey-sec" id="journey">
        <div className="wrap">
          <h2 className="sec-title center">{t("यात्रा", "Journey")}</h2>
          <Carousel className="journey">
            {journey.map((j, i) => (
              <article key={i} className="jr-item">
                <span className="jr-year">{tr(j.tag, lang)}</span>
                <h3>{tr(j.title, lang)}</h3>
                <p>{tr(j.text, lang)}</p>
                <Link className="link-arrow" href={href(lang, "/about#journey")}>{t("और देखें", "View more")} <Icon name="arrow" /></Link>
              </article>
            ))}
          </Carousel>
        </div>
      </section>

      {/* PHOTO GALLERY */}
      <section className="gallery-sec">
        <div className="wrap">
          <h2 className="sec-title center">{t("फोटो गैलरी", "Photo Gallery")}</h2>
          <GalleryTabs tabs={galTabs} />
          <div className="center"><Link className="btn btn-orange" href={href(lang, "/media")}>{t("और देखें", "View more")} <Icon name="arrow" /></Link></div>
        </div>
      </section>

      {/* PUBLIC SERVICE: complaint portal and e-card, just above the social section */}
      <section className="service-sec" aria-labelledby="service-title">
        <div className="wrap">
          <h2 id="service-title" className="sr-only">{t("जन सेवा", "Public Service")}</h2>
          <div className="sv-grid">
            <article className="sv-card sv-complaint">
              <div className="sv-visual">
                <Pic src={img.farmerField} alt="" placeholder="blur" fill sizes="(max-width: 900px) 100vw, 50vw" />
              </div>
              <div className="sv-body">
                <span className="sv-ic"><Icon name="doc" /></span>
                <h3>{t("आपकी समस्या, हमारी ज़िम्मेदारी", "Your problem, our responsibility")}</h3>
                <p>{t("शिकायत कुछ ही मिनटों में ऑनलाइन दर्ज करें। टिकट संख्या के साथ वह सीधे विधायक कार्यालय पहुँचती है, और आप कभी भी उसकी प्रगति देख सकते हैं।", "File your complaint online in a few minutes. It reaches the MLA’s office with a ticket number, and you can check its progress at any time.")}</p>
                <ul className="sv-pills">
                  <li><Icon name="form" />{t("समस्या लिखें", "Describe the problem")}</li>
                  <li><Icon name="ticket" />{t("टिकट संख्या पाएँ", "Receive a ticket number")}</li>
                  <li><Icon name="checkCircle" />{t("प्रगति देखें", "Follow the progress")}</li>
                </ul>
                <div className="sv-btns">
                  <Link className="btn sv-btn-light" href={href(lang, "/e-shikayat")}>{t("शिकायत दर्ज करें", "Register a complaint")} <Icon name="arrow" /></Link>
                  <Link className="btn sv-btn-line" href={href(lang, "/e-shikayat/track")}><Icon name="search" />{t("स्थिति देखें", "Check status")}</Link>
                </div>
              </div>
            </article>
            <article className="sv-card sv-ecard">
              <div className="sv-visual" aria-hidden="true">
                <div className="mock-back" />
                <div className="mock-card">
                  <div className="mock-text">
                    <b>{t("शुभकामनाएँ", "Warm wishes")}</b>
                    <span className="mock-line" />
                    <span className="mock-name"><Icon name="photoAdd" /><em>{t("आपका नाम", "Your name")}<small>{t("आपका गाँव", "Your village")}</small></em></span>
                  </div>
                  <Pic className="mock-photo" src={img.portrait} alt="" sizes="260px" />
                </div>
              </div>
              <div className="sv-body">
                <span className="sv-ic"><Icon name="card" /></span>
                <h3>{t("आपके नाम से शुभकामना", "Greetings, in your own name")}</h3>
                <p>{t("त्योहार या अवसर चुनें, अपना नाम और फोटो जोड़ें, और कार्ड अपने परिवार व गाँव के साथ साझा करें।", "Pick a festival or occasion, add your name and photo, and share the card with your family and village.")}</p>
                <ul className="sv-pills sv-pills-light">
                  <li><Icon name="images" />{t("अवसर चुनें", "Choose an occasion")}</li>
                  <li><Icon name="pen" />{t("नाम व फोटो जोड़ें", "Add name and photo")}</li>
                  <li><Icon name="download" />{t("डाउनलोड या साझा करें", "Download or share")}</li>
                </ul>
                <div className="sv-btns">
                  <Link className="btn btn-orange" href={href(lang, "/e-card")}>{t("ई-कार्ड बनाएं", "Make an e-card")} <Icon name="arrow" /></Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* CONNECT */}
      <section className="connect-sec">
        <div className="wrap">
          <h2 className="sec-title center">{t("हमारे से जुड़िये", "Connect with us")}</h2>
          <div className="connect">
            <div className="connect-col">
              <div className="col-head">
                <h3>{t("ताज़ा पोस्ट", "Latest posts")}</h3>
                <a className="link-arrow" href={site.social.facebook.url} target="_blank" rel="noopener">{t("Facebook पेज खोलें", "Open the Facebook page")} <Icon name="arrowUpRight" /></a>
              </div>
              <FacebookProfile items={updates} photos={sortedEvents.flatMap((e) => e.photos)} />
            </div>
            <div className="connect-col">
              <div className="col-head">
                <h3>{t("वीडियो", "Videos")}</h3>
                <a className="link-arrow" href={site.social.youtube.url} target="_blank" rel="noopener">{t("YouTube चैनल खोलें", "Open the YouTube channel")} <Icon name="arrowUpRight" /></a>
              </div>
              <YouTubeLive videos={videos} />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT: the same enquiry form and details as the Contact page, right under the social section */}
      <ContactSection lang={lang} visibleTitle />
    </>
  );
}
