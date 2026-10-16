import { Pic } from "@/components/Pic";
import Link from "next/link";
import { Carousel, FacebookFull, GalleryTabs, HeroSlider, UpdatesLive, VideoGrid, YouTubeLive, type GalTab, type Slide, type UpdateItem } from "@/components/Home";
import { Icon } from "@/components/Icon";
import { getEvent, sortedEvents, type EventPost } from "@/lib/content/events";
import { morePhotos } from "@/lib/content/media";
import { bio, intro, journey } from "@/lib/content/profile";
import { dateParts, href, tr, type Lang } from "@/lib/i18n";
import { img } from "@/lib/images";
import { phoneLabel, site } from "@/lib/site";
import { getVideos } from "@/lib/youtube";

const BASE_SLIDES: Slide[] = [
  { img: img.hero },
  { img: img.farmerField, alt: { hi: "खेत-खलिहान तक", en: "Out in the fields" } },
  { img: img.villageGreeting, alt: { hi: "गाँव-गाँव जनसंपर्क", en: "Village to village" } },
];

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);
  const videos = await getVideos(12);
  /* the two events highlighted on the home page; the rest are on the Events page */
  const homeEvents = ["kisan-rahat-vitaran", "gaon-gaon-jansampark"].map(getEvent).filter((e): e is EventPost => !!e);

  const slides: Slide[] = [...BASE_SLIDES, ...sortedEvents.filter((e) => e.photos[0].img.width >= 900).slice(0, 4).map((e) => ({ img: e.photos[0].img, alt: e.title }))];
  const news = sortedEvents.slice(0, 3);
  const updates: UpdateItem[] = [...sortedEvents].sort((a, b) => b.date.localeCompare(a.date))
    .map((e) => ({ slug: e.slug, date: e.date, category: e.category, title: e.title, summary: e.summary, img: e.photos[0].img, source: e.source }));
  const tiles = [
    { path: "/vikas-yatra", img: img.addressing, label: t("उपलब्धियाँ", "Achievements"), tone: "orange" },
    { path: "/e-shikayat", img: img.atWork, label: t("ई-शिकायत", "e-Complaint"), tone: "green" },
    { path: "/e-card", img: img.meetingGreeting, label: t("ई-कार्ड", "e-Card"), tone: "orange" },
  ];
  const galTabs: GalTab[] = [
    /* one tab per category, newest event first */
    ...sortedEvents.filter((e, n, all) => all.findIndex((x) => x.category.en === e.category.en) === n).slice(0, 3)
      .map((e, n): GalTab => ({ key: e.slug, label: e.category, icon: (["bolt", "people", "calendar"] as const)[n], photos: e.photos })),
    { key: "more", label: { hi: "भेंट व संवाद", en: "Meetings" }, icon: "images", photos: morePhotos },
  ];

  return (
    <>
      {/* HERO: slider + latest updates */}
      <section className="hero" aria-label={t("मुख्य", "Main")}>
        <HeroSlider slides={slides} />
        <aside className="news">
          <h2>{t("नवीनतम समाचार और अपडेट", "Latest news & updates")}</h2>
          <ul>
            {news.map((e) => (
              <li key={e.slug}>
                <Link href={href(lang, `/updates/${e.slug}`)}>
                  <Pic src={e.photos[0].img} alt="" placeholder="blur" sizes="200px" />
                  <span>{tr(e.title, lang)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* THREE TILES */}
      <section className="tiles-sec">
        <div className="wrap tiles">
          {tiles.map((x) => (
            <Link key={x.path} href={href(lang, x.path)} className="tile">
              <Pic src={x.img} alt="" placeholder="blur" sizes="(max-width: 760px) 100vw, 360px" />
              <span className={`tile-bar ${x.tone}`}>{x.label} <Icon name="arrow" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* PERSONALITY */}
      <section className="persona">
        <div className="persona-photos" aria-hidden="true">
          <Pic className="p1" src={img.hero} alt="" placeholder="blur" sizes="(max-width: 900px) 60vw, 30vw" />
          <Pic className="p2" src={img.villageGreeting} alt="" placeholder="blur" sizes="(max-width: 900px) 45vw, 20vw" />
        </div>
        <div className="persona-text">
          <h2>{t("व्यक्तित्व - ", "Personality - ")}{tr(site.name, lang)}</h2>
          <blockquote>{tr(intro, lang)}</blockquote>
          <blockquote>{tr(journey[journey.length - 1].text, lang)}</blockquote>
          {bio.slice(0, 2).map((p, i) => <p key={i}>{tr(p, lang)}</p>)}
          <Link className="btn btn-orange" href={href(lang, "/about")}>{t("अधिक पढ़ें", "Read more")} <Icon name="arrow" /></Link>
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

      {/* EVENTS (media coverage slot) */}
      <section>
        <div className="wrap">
          <div className="sec-row">
            <h2 className="sec-title">{t("कार्यक्रम", "Events")}</h2>
            <Link className="btn btn-outline" href={href(lang, "/updates")}>{t("और देखें", "View more")} <Icon name="arrow" /></Link>
          </div>
          <div className="cover-grid two">
            {homeEvents.map((e) => {
              const { d, month, y } = dateParts(e.date, lang);
              return (
                <Link key={e.slug} href={href(lang, `/updates/${e.slug}`)} className="cover big">
                  <Pic src={e.photos[0].img} alt="" placeholder="blur" sizes="(max-width: 860px) 100vw, 600px" />
                  <span className="cover-meta"><span className="tag">{tr(e.category, lang)}</span><span className="cover-date">{d} {month} {y}</span></span>
                  <b>{tr(e.title, lang)}</b>
                  <span className="link-arrow">{t("पूरा पढ़ें", "Read more")} <Icon name="arrow" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* LATEST VIDEOS */}
      <section>
        <div className="wrap">
          <div className="sec-row">
            <h2 className="sec-title">{t("नवीनतम वीडियो", "Latest videos")}</h2>
            <a className="btn btn-outline" href={site.social.youtube.url} target="_blank" rel="noopener">{t("सभी को देखें", "View all")} <Icon name="arrow" /></a>
          </div>
          <VideoGrid videos={videos} />
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
              {site.social.facebook.pageUrl
                ? <FacebookFull url={site.social.facebook.pageUrl} items={updates} />
                : <UpdatesLive items={updates} />}
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

      {/* CONTACT STRIP */}
      <section className="contact-strip">
        <div className="wrap contact-3">
          <div><span className="ic"><Icon name="pin" /></span><b>{t("कार्यालय", "Office")}</b><p>{tr(site.office, lang)}</p></div>
          <div><span className="ic"><Icon name="phone" /></span><b>{t("फ़ोन", "Phone")}</b>{site.phones.map((p) => <p key={p}><a href={`tel:${p}`}>{phoneLabel(p)}</a></p>)}</div>
          <div><span className="ic"><Icon name="mail" /></span><b>{t("ईमेल", "Email")}</b><p><a href={`mailto:${site.email}`}>{site.email}</a></p><Link className="btn btn-orange btn-sm" href={href(lang, "/contact")}>{t("संदेश भेजें", "Send a message")} <Icon name="arrow" /></Link></div>
        </div>
      </section>
    </>
  );
}
