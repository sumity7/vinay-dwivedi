import type { Metadata } from "next";
import { Pic } from "@/components/Pic";
import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";
import { Carousel, FacebookProfile, GalleryTabs, HeroSlider, YouTubeLive, type GalTab, type Slide, type UpdateItem } from "@/components/Home";
import { Icon } from "@/components/Icon";
import { sortedEvents, type EventPost } from "@/lib/content/events";
import { proPhotos } from "@/lib/content/media";
import { bio, journey } from "@/lib/content/profile";
import { dateParts, href, tr, type Lang } from "@/lib/i18n";
import { img } from "@/lib/images";
import { jsonLdHtml, pageMeta, personJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { getVideos } from "@/lib/youtube";

/* Hero: three slides, one per service (photos enhanced from the originals) */
const heroSlides = (lang: Lang): Slide[] => [
  {
    flip: true,
    img: img.heroAchievements, alt: { hi: "जनसभा को संबोधित करते विनय कुमार द्विवेदी", en: "Vinay Kumar Dwivedi addressing a gathering" },
    tag: { hi: "विधायक, मेहनौन (295)", en: "MLA, Mehnaun (295)" },
    title: { hi: "मेहनौन की बुलंद आवाज़", en: "The strong voice of Mehnaun" },
    text: { hi: "दो दशकों से अधिक के जनसेवा अनुभव के साथ ‘मुन्ना भैया’ गाँव-गाँव की हर बात को विधानसभा तक पूरी ताक़त से पहुँचाते हैं। 2022 में जनता ने आधे से अधिक मत देकर इस भरोसे पर ऐतिहासिक मुहर लगाई।", en: "With over two decades in public service, ‘Munna Bhaiya’ carries every village’s voice to the Assembly with full force. In 2022 the people gave him more than half of all votes, a historic seal on that trust." },
    points: [
      { hi: "लगातार दूसरी बार विधायक", en: "MLA for a second straight term" },
      { hi: "1,07,327 मतों का जनादेश (50.05%)", en: "A mandate of 1,07,327 votes (50.05%)" },
      { hi: "23,218 मतों के अंतर से शानदार जीत", en: "A resounding 23,218-vote win" },
      { hi: "क्षेत्र पंचायत से विधानसभा तक का सफ़र", en: "From the panchayat to the Assembly" },
    ],
    cta: { href: href(lang, "/vikas-yatra"), label: { hi: "उपलब्धियाँ देखें", en: "See the achievements" } },
    cta2: { href: href(lang, "/about"), label: { hi: "पूरा परिचय", en: "Full biography" } },
  },
  {
    img: img.heroEcard, alt: { hi: "मुख्यमंत्री योगी आदित्यनाथ जी के साथ", en: "With Chief Minister Yogi Adityanath" },
    tag: { hi: "डबल इंजन का विकास", en: "Double-engine development" },
    title: { hi: "योगी जी के नेतृत्व में, नया मेहनौन", en: "A new Mehnaun under Yogi ji" },
    text: { hi: "प्रधानमंत्री श्री नरेन्द्र मोदी जी के विज़न और मुख्यमंत्री श्री योगी आदित्यनाथ जी के सुशासन को मेहनौन के हर घर तक पहुँचाना ही उनका संकल्प है। हर पर्व की खुशी अपनों के साथ बाँटें।", en: "Taking Prime Minister Shri Narendra Modi’s vision and Chief Minister Shri Yogi Adityanath’s good governance to every home in Mehnaun is his resolve. Share the joy of every festival with your own." },
    points: [
      { hi: "सड़क, बिजली, पानी, हर गाँव तक", en: "Roads, power and water to every village" },
      { hi: "किसान, युवा और महिलाओं का सम्मान", en: "Respect for farmers, youth and women" },
      { hi: "अपने नाम-फोटो के साथ शुभकामना कार्ड", en: "Greeting cards with your name and photo" },
      { hi: "16 त्योहारों और अवसरों के कार्ड", en: "Cards for 16 festivals and occasions" },
    ],
    cta: { href: href(lang, "/e-card"), label: { hi: "ई-कार्ड बनाएं", en: "Make an e-card" } },
    cta2: { href: href(lang, "/vikas-yatra"), label: { hi: "विकास यात्रा देखें", en: "See the development journey" } },
  },
  {
    img: img.heroComplaint, alt: { hi: "जन समस्याओं पर कार्य करते विधायक जी", en: "The MLA working through public grievances" },
    tag: { hi: "ई-शिकायत", en: "e-Complaint" },
    title: { hi: "हर शिकायत पर स्वयं ध्यान", en: "Every complaint, personally seen to" },
    text: { hi: "मुन्ना भैया के लिए क्षेत्र की हर समस्या व्यक्तिगत ज़िम्मेदारी है। अब घर बैठे अपनी बात सीधे विधायक कार्यालय तक पहुँचाएँ और कार्यवाही के हर कदम की जानकारी पाएँ।", en: "For Munna Bhaiya every problem in the area is a personal responsibility. Now send your concern straight to the MLA’s office from home and follow every step of the action taken." },
    points: [
      { hi: "मिनटों में ऑनलाइन शिकायत", en: "File online in minutes" },
      { hi: "टिकट संख्या से स्थिति जानें", en: "Track it with your ticket number" },
      { hi: "सीधे विधायक कार्यालय तक", en: "Straight to the MLA’s office" },
      { hi: "सड़क, पानी, बिजली, पेंशन की समस्याएँ", en: "Roads, water, power, pension problems" },
    ],
    cta: { href: href(lang, "/e-shikayat"), label: { hi: "शिकायत दर्ज करें", en: "Register a complaint" } },
    cta2: { href: href(lang, "/e-shikayat/track"), label: { hi: "शिकायत की स्थिति", en: "Track a complaint" } },
  },
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

      {/* HERO: three service slides, full width */}
      <section className="hero" aria-label={t("मुख्य स्लाइड", "Highlights")}>
        <HeroSlider slides={slides} />
      </section>

      {/* INTRODUCTION: plain strip under the hero, no card */}
      <section className="intro-strip" aria-labelledby="hero-name">
        <div className="wrap intro-row">
          <div className="intro-who">
            <span className="intro-role">{tr(site.roleLong, lang)}</span>
            <h1 id="hero-name">{tr(site.name, lang)}</h1>
            <p className="intro-nick">‘{tr(site.nickname, lang)}’</p>
          </div>
          <div className="intro-mid">
            <p>{t("गाँव की पगडंडियों से विधानसभा तक का सफ़र तय करने वाले मुन्ना भैया मेहनौन के सबसे भरोसेमंद जननायक हैं: सरल स्वभाव, हर गाँव से सीधा रिश्ता और हर ज़रूरतमंद के लिए हमेशा खुला द्वार।", "Having walked from village lanes to the Assembly, Munna Bhaiya is Mehnaun’s most trusted leader: a simple manner, a direct bond with every village and a door always open to anyone in need.")}</p>
            <dl className="intro-stats">
              <div><dt>{t("बार विधायक", "terms as MLA")}</dt><dd>2</dd></div>
              <div><dt>{t("मत, 2022", "vote share, 2022")}</dt><dd>50.05%</dd></div>
              <div><dt>{t("वर्ष जनसेवा", "years of service")}</dt><dd>20+</dd></div>
            </dl>
          </div>
          <div className="intro-actions">
            <Link className="btn btn-orange" href={href(lang, "/about")}>{t("पूरा परिचय", "Full biography")} <Icon name="arrow" /></Link>
            <Link className="btn btn-outline" href={href(lang, "/contact")}>{t("संपर्क करें", "Contact")}</Link>
          </div>
        </div>
      </section>

      {/* PERSONALITY */}
      <section className="persona">
        <div className="persona-photos" aria-hidden="true">
          <Pic className="p2" src={img.villageGreeting} alt={t("गाँव में लोगों का अभिवादन करते विनय कुमार द्विवेदी", "Vinay Kumar Dwivedi greeting people in a village")} placeholder="blur" sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
        <div className="persona-text">
          <h2>{t("व्यक्तित्व - ", "Personality - ")}{tr(site.name, lang)}</h2>
          {bio.slice(0, 2).map((p, i) => <p key={i}>{tr(p, lang)}</p>)}
          <Link className="btn btn-orange" href={href(lang, "/about")}>{t("अधिक पढ़ें", "Read more")} <Icon name="arrow" /></Link>
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
