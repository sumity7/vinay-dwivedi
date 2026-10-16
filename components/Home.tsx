"use client";
/* Interactive pieces of the home page: hero slider, carousels, gallery tabs, video grid, counters, social feeds. */
import { type StaticImageData } from "next/image";
import Link from "next/link";
import { Pic } from "./Pic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Photo } from "@/lib/content/events";
import { fmtDate, type Bi } from "@/lib/i18n";
import { img } from "@/lib/images";
import { site } from "@/lib/site";
import { fmtIN, prefersReducedMotion } from "@/lib/utils";
import type { Video } from "@/lib/youtube";
import { Icon, type IconName } from "./Icon";
import { useSite } from "./SiteProvider";

export type Slide = { img: StaticImageData; alt?: Bi; pos?: string; tag?: Bi; title?: Bi; text?: Bi; points?: Bi[]; cta?: { href: string; label: Bi } };

/* Full-width banner: slides move sideways, white arrows, dots below */
export function HeroSlider({ slides }: { slides: Slide[] }) {
  const { t, pick } = useSite();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = setInterval(() => setI((x) => (x + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, [paused, slides.length]);
  const go = (d: number) => setI((x) => (x + d + slides.length) % slides.length);

  return (
    <div className="hero-slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel">
      <div className="slider" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, k) => (
          <div key={k} className={`slide${k === i ? " is-active" : ""}`} aria-hidden={k !== i}>
            {s.title && (
              <div className="slide-cap">
                {s.tag && <span className="slide-tag">{pick(s.tag)}</span>}
                <h2>{pick(s.title)}</h2>
                {s.text && <p>{pick(s.text)}</p>}
                {s.points && <ul className="slide-points">{s.points.map((x, n) => <li key={n}>{pick(x)}</li>)}</ul>}
                {s.cta && <Link className="btn btn-orange" href={s.cta.href} tabIndex={k === i ? 0 : -1}>{pick(s.cta.label)} <Icon name="arrow" /></Link>}
              </div>
            )}
            {/* photo panel takes the photo's own shape, so the whole picture shows with nothing cropped */}
            <div className="slide-media" style={{ aspectRatio: `${s.img.width} / ${s.img.height}` }}>
              {/* soft blurred copy fills the panel around the photo, so the photo itself is never cropped */}
              <Pic className="slide-bg" src={s.img} alt="" aria-hidden="true" fill sizes="(max-width: 900px) 50vw, 25vw" style={{ objectFit: "cover" }} />
              <Pic className="slide-img" src={s.img} alt={s.alt ? pick(s.alt) : t("विनय कुमार द्विवेदी", "Vinay Kumar Dwivedi")} fill sizes="(max-width: 900px) 100vw, 50vw"
                preload={k === 0} style={{ objectFit: "cover" }} />
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="sl-arrow prev" onClick={() => go(-1)} aria-label={t("पिछली", "Previous")}><Icon name="chevLeft" /></button>
      <button type="button" className="sl-arrow next" onClick={() => go(1)} aria-label={t("अगली", "Next")}><Icon name="chevRight" /></button>
      <div className="dots">
        {slides.map((_, k) => <button key={k} type="button" className={k === i ? "active" : ""} aria-current={k === i} aria-label={`${k + 1}`} onClick={() => setI(k)} />)}
      </div>
    </div>
  );
}

/* Horizontal scroll-snap row with arrow buttons */
export function Carousel({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { t } = useSite();
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, []);
  const go = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className={`carousel ${className}${edge.start ? " at-start" : ""}${edge.end ? " at-end" : ""}`}>
      <button type="button" className="car-btn prev" onClick={() => go(-1)} aria-label={t("पिछला", "Previous")}><Icon name="chevLeft" /></button>
      <div className="car-track" ref={ref}>{children}</div>
      <button type="button" className="car-btn next" onClick={() => go(1)} aria-label={t("अगला", "Next")}><Icon name="chevRight" /></button>
    </div>
  );
}

export type GalTab = { key: string; label: Bi; icon: IconName; photos: Photo[] };

/* Photo gallery with category tabs; photos open in the lightbox */
export function GalleryTabs({ tabs }: { tabs: GalTab[] }) {
  const { pick, openLightbox, t } = useSite();
  const [k, setK] = useState(0);
  const tab = tabs[k];
  const shown = tab.photos.slice(0, 8);
  const list = tab.photos.map((p) => ({ img: p.img, cap: pick(p.cap) }));
  /* equal tiles; with fewer than 4 photos keep them at normal size, centred, instead of stretching one across the row */
  const cols = Math.min(4, shown.length);
  return (
    <div className="gal">
      <div className="gal-tabs" role="tablist" aria-label={t("श्रेणी", "Category")}>
        {tabs.map((x, n) => (
          <button key={x.key} type="button" role="tab" aria-selected={n === k} className={n === k ? "on" : ""} onClick={() => setK(n)}>
            <Icon name={x.icon} />{pick(x.label)}
          </button>
        ))}
      </div>
      <div className="gal-grid" key={tab.key} style={{ ["--cols" as string]: cols }}>
        {shown.map((p, n) => (
          <button key={n} type="button" onClick={() => openLightbox(list, n)} aria-label={`${t("बड़ा देखें", "View larger")}: ${pick(p.cap)}`}>
            <Pic src={p.img} alt={pick(p.cap)} placeholder="blur" sizes="(max-width: 860px) 50vw, 300px" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* Latest videos: thumbnails that turn into the player when clicked */
export function VideoGrid({ videos }: { videos: Video[] }) {
  const { lang, t } = useSite();
  const [playing, setPlaying] = useState<string | null>(null);
  if (!videos.length) {
    return (
      <div className="vid-empty">
        <p>{t("वीडियो YouTube चैनल पर देखें।", "Watch the videos on the YouTube channel.")}</p>
        <a className="btn btn-primary" href={site.social.youtube.url} target="_blank" rel="noopener">{t("YouTube चैनल खोलें", "Open the YouTube channel")} <Icon name="arrowUpRight" /></a>
      </div>
    );
  }
  return (
    <div className="vid-grid">
      {videos.slice(0, 4).map((v) => (
        <figure key={v.id} className="vid">
          <div className="player">
            {playing === v.id ? (
              <iframe src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`} title={v.title}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : (
              <button type="button" onClick={() => setPlaying(v.id)} aria-label={`${t("चलाएँ", "Play")}: ${v.title}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
                <span className="play"><Icon name="play" /></span>
              </button>
            )}
          </div>
          <figcaption><b>{v.title}</b><small>{fmtDate(v.published, lang)}</small></figcaption>
        </figure>
      ))}
    </div>
  );
}

/* Number that counts up the first time it scrolls into view */
export function Counter({ end, format, suffix = "" }: { end: number; format?: "in"; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  const dec = String(end).includes(".") ? 2 : 0;
  const show = (v: number) => (format === "in" ? fmtIN(v) : v.toFixed(dec)) + suffix;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - t0) / 1400, 1);
        el.textContent = show(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [end, format, suffix]); // eslint-disable-line react-hooks/exhaustive-deps

  return <b ref={ref}>{show(end)}</b>;
}

/* Social card: reliable stand-in for the Facebook page plugin (which often renders half-empty). */
const SOCIAL_PHOTOS = [img.reliefCheque, img.villageGreeting, img.tribute, img.farmerField, img.meetingGreeting, img.villageElders];

export function FacebookFeed() {
  const { t, pick, openLightbox } = useSite();
  const s = site.social;
  const list = SOCIAL_PHOTOS.map((p) => ({ img: p, cap: t("विनय कुमार द्विवेदी", "Vinay Kumar Dwivedi") }));
  const rows: { key: "facebook" | "instagram" | "youtube"; icon: IconName; label: string; sub: string }[] = [
    { key: "facebook", icon: "facebook", label: "Facebook", sub: `${pick(s.facebook.followers)} ${t("फॉलोअर्स", "followers")}` },
    { key: "instagram", icon: "instagram", label: "Instagram", sub: `${pick(s.instagram.followers)} ${t("फॉलोअर्स", "followers")}` },
    { key: "youtube", icon: "youtube", label: "YouTube", sub: s.youtube.handle },
  ];
  return (
    <div className="card social-card">
      <div className="sc-head">
        <Pic className="sc-avatar" src={img.hero} alt="" width={84} height={84} />
        <div>
          <b>{t("विनय कुमार द्विवेदी", "Vinay Kumar Dwivedi")} <Icon name="check" className="sc-tick" /></b>
          <span>{pick(site.role)}</span>
        </div>
      </div>
      <div className="sc-grid">
        {SOCIAL_PHOTOS.map((p, n) => (
          <button key={n} type="button" onClick={() => openLightbox(list, n)} aria-label={t("फोटो बड़ा देखें", "View photo")}>
            <Pic src={p} alt="" placeholder="blur" sizes="(max-width: 860px) 33vw, 180px" />
          </button>
        ))}
      </div>
      <ul className="sc-links">
        {rows.map((r) => (
          <li key={r.key}>
            <span className={`sc-ic ${r.key}`}><Icon name={r.icon} /></span>
            <span className="sc-txt"><b>{r.label}</b><small>{r.sub}</small></span>
            <a className="btn btn-outline btn-sm" href={s[r.key].url} target="_blank" rel="noopener">{t("फॉलो करें", "Follow")}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function YouTubeFeed({ videos }: { videos: Video[] }) {
  const { lang, t } = useSite();
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  if (!videos.length) {
    return (
      <div className="card yt yt-empty">
        <p>{t("वीडियो YouTube चैनल पर देखें।", "Watch the videos on the YouTube channel.")}</p>
        <a className="btn btn-primary btn-sm" href={site.social.youtube.url} target="_blank" rel="noopener">{t("YouTube चैनल खोलें", "Open the YouTube channel")}</a>
      </div>
    );
  }
  const v = videos[cur];
  return (
    <div className="card yt">
      <div className="player">
        {playing ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`} title={v.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`${t("चलाएँ", "Play")}: ${v.title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className="play"><Icon name="play" /></span>
          </button>
        )}
      </div>
      <div className="now">
        <div className="row"><b>{t("अभी चल रहा है", "Now playing")}</b><span>{fmtDate(v.published, lang)}</span></div>
        <h3 className="yt-now-title">{v.title}</h3>
      </div>
      <div className="yt-list">
        {videos.map((x, k) => (
          <button key={x.id} type="button" aria-current={k === cur} onClick={() => { setCur(k); setPlaying(true); }}>
            <span className="ic" aria-hidden="true"><Icon name="play" /></span>
            <span>{x.title}<small>{fmtDate(x.published, lang)}</small></span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* Auto-scrolling lists: keeps nudging the list down, loops through a duplicated copy, pauses on hover/focus/touch. */
const LIVE_H = 600;

function useAutoScroll(on: boolean) {
  const list = useRef<HTMLDivElement>(null);
  const hold = useRef(false);
  useEffect(() => {
    const el = list.current;
    if (!el || !on || prefersReducedMotion()) return;
    const id = setInterval(() => {
      if (hold.current) return;
      el.scrollTop += 1;
      const half = el.scrollHeight / 2;
      if (el.scrollTop >= half) el.scrollTop -= half;
    }, 35);
    return () => clearInterval(id);
  }, [on]);
  const pause = {
    onMouseEnter: () => { hold.current = true; },
    onMouseLeave: () => { hold.current = false; },
    onFocus: () => { hold.current = true; },
    onBlur: () => { hold.current = false; },
    onTouchStart: () => { hold.current = true; },
    onTouchEnd: () => { setTimeout(() => { hold.current = false; }, 2500); },
  };
  return { list, pause };
}

export type UpdateItem = { slug: string; date: string; category: Bi; title: Bi; summary: Bi; img: StaticImageData; source?: string };

/* Latest updates from the Facebook page / events: a list that keeps scrolling by itself */
export function UpdatesLive({ items, pageUrl }: { items: UpdateItem[]; pageUrl?: string }) {
  const { lang, t, pick } = useSite();
  const [tab, setTab] = useState<"posts" | "live">("posts");
  const scrolls = items.length > 3;
  const { list, pause } = useAutoScroll(scrolls && tab === "posts");
  const rows = scrolls ? [...items, ...items] : items;
  const fb = site.social.facebook.url;
  return (
    <div className="card live-card">
      {pageUrl ? <FacebookPage url={pageUrl} /> : (
        <div className="live-head">
          <span className="live-dot" aria-hidden="true" />
          <b>Facebook</b><span>{t("ताज़ा अपडेट", "Latest updates")}</span>
          <a className="link-arrow" href={fb} target="_blank" rel="noopener">{t("पेज खोलें", "Open page")} <Icon name="arrowUpRight" /></a>
        </div>
      )}
      {pageUrl && (
        <div className="fb-tabs" role="tablist" aria-label={t("Facebook पोस्ट", "Facebook posts")}>
          <button type="button" role="tab" aria-selected={tab === "posts"} onClick={() => setTab("posts")}><span className="live-dot" aria-hidden="true" />{t("ताज़ा पोस्ट", "Latest posts")}</button>
          <button type="button" role="tab" aria-selected={tab === "live"} onClick={() => setTab("live")}><Icon name="facebook" />{t("Facebook लाइव", "Facebook live")}</button>
        </div>
      )}
      {pageUrl && tab === "live" && <FacebookTimeline url={pageUrl} height={LIVE_H - FB_HEAD_H - TABS_H} />}
      <div className="live-body upl" hidden={!!pageUrl && tab === "live"} style={{ height: pageUrl ? LIVE_H - FB_HEAD_H - TABS_H : LIVE_H }} ref={list} tabIndex={0} aria-label={t("ताज़ा अपडेट", "Latest updates")} {...pause}>
        {rows.map((e, n) => {
          const dup = scrolls && n >= items.length;
          return (
            <article key={`${e.slug}-${n}`} className="upl-item" aria-hidden={dup ? true : undefined}>
              <Link href={`/${lang}/updates/${e.slug}`} className="upl-img" tabIndex={dup ? -1 : 0} aria-label={pick(e.title)}>
                <Pic src={e.img} alt="" placeholder="blur" sizes="160px" />
              </Link>
              <div>
                <div className="upl-meta"><span className="tag">{pick(e.category)}</span><time dateTime={e.date}>{fmtDate(e.date, lang)}</time></div>
                <h4><Link href={`/${lang}/updates/${e.slug}`} tabIndex={dup ? -1 : 0}>{pick(e.title)}</Link></h4>
                <p>{pick(e.summary)}</p>
                <div className="upl-links">
                  <Link href={`/${lang}/updates/${e.slug}`} tabIndex={dup ? -1 : 0}>{t("पूरा पढ़ें", "Read more")}</Link>
                  {e.source && <a href={e.source} target="_blank" rel="noopener" tabIndex={dup ? -1 : 0}>{t("Facebook पोस्ट", "Facebook post")}</a>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {!pageUrl && <p className="live-note"><a className="btn btn-primary btn-sm" href={fb} target="_blank" rel="noopener"><Icon name="facebook" />{t("Facebook पर फॉलो करें", "Follow on Facebook")}</a></p>}
    </div>
  );
}

/* Latest YouTube uploads: a player on top and a list below that keeps scrolling by itself (pauses on hover or while a video plays). */
export function YouTubeLive({ videos }: { videos: Video[] }) {
  const { lang, t } = useSite();
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const scrolls = videos.length > 3;
  const { list, pause } = useAutoScroll(scrolls && !playing);

  const ch = site.social.youtube.url;
  if (!videos.length) {
    return (
      <div className="card live-card yt-empty">
        <p>{t("वीडियो YouTube चैनल पर देखें।", "Watch the videos on the YouTube channel.")}</p>
        <a className="btn btn-primary btn-sm" href={ch} target="_blank" rel="noopener">{t("YouTube चैनल खोलें", "Open the YouTube channel")}</a>
      </div>
    );
  }
  const v = videos[cur];
  const rows = scrolls ? [...videos, ...videos] : videos;
  return (
    <div className="card live-card">
      <div className="live-head">
        <span className="live-dot" aria-hidden="true" />
        <b>YouTube</b><span>{t("नवीनतम वीडियो", "Latest videos")}</span>
        <a className="link-arrow" href={ch} target="_blank" rel="noopener">{t("चैनल खोलें", "Open channel")} <Icon name="arrowUpRight" /></a>
      </div>
      <div className="live-body ytl" style={{ height: LIVE_H }}>
        <div className="ytl-player">
          {playing ? (
            <iframe src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`} title={v.title}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          ) : (
            <button type="button" onClick={() => setPlaying(true)} aria-label={`${t("चलाएँ", "Play")}: ${v.title}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" />
              <span className="play"><Icon name="play" /></span>
            </button>
          )}
        </div>
        <div className="ytl-now"><h4>{v.title}</h4><small>{fmtDate(v.published, lang)}</small></div>
        <div className="ytl-list" ref={list} tabIndex={0} aria-label={t("वीडियो सूची", "Video list")} {...pause}>
          {rows.map((x, n) => {
            const k = n % videos.length;
            return (
              <button key={`${x.id}-${n}`} type="button" className="ytl-item" aria-current={k === cur} aria-hidden={n >= videos.length && scrolls ? true : undefined}
                tabIndex={n >= videos.length && scrolls ? -1 : 0} onClick={() => { setCur(k); setPlaying(true); }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.ytimg.com/vi/${x.id}/mqdefault.jpg`} alt="" loading="lazy" />
                <span>{x.title}<small>{fmtDate(x.published, lang)}</small></span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* Facebook header: his photo, name, verified tick, followers and a Follow button.
   (Facebook's own Page plugin was dropped: for visitors who are not signed in to Facebook, or who block
   its cookies, it renders only a clipped avatar strip. Posts come from our own updates list below.) */
const FB_HEAD_H = 104;
const TABS_H = 50;

/* Facebook's own Page plugin, timeline only. Facebook shows the posts to visitors who are signed in to
   Facebook in this browser; everyone else sees a short note and a link (the "Latest posts" tab works for all). */
export function FacebookTimeline({ url, height }: { url: string; height: number }) {
  const { t } = useSite();
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(Math.min(500, Math.max(180, Math.floor(el.clientWidth)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(url)}&tabs=timeline&width=${w}&height=${height}&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false`;
  return (
    <div className="fb-live" ref={box} style={{ height }}>
      <div className="fb-live-note">
        <Icon name="facebook" />
        <p>{t("Facebook की लाइव पोस्ट यहाँ उन्हें दिखती हैं जो इस ब्राउज़र में Facebook पर लॉग-इन हैं।", "Facebook shows the live posts here to visitors signed in to Facebook in this browser.")}</p>
        <a className="btn btn-sm fb-own-btn" href={url} target="_blank" rel="noopener">{t("Facebook पर सभी पोस्ट देखें", "See all posts on Facebook")}</a>
      </div>
      {w > 0 && <iframe key={w} title={t("Facebook पर लाइव पोस्ट", "Live posts on Facebook")} src={src} width={w} height={height} loading="lazy" allow="encrypted-media; clipboard-write" />}
    </div>
  );
}

export function FacebookPage({ url }: { url: string }) {
  const { t, pick } = useSite();
  return (
    <div className="fb-head" style={{ height: FB_HEAD_H }}>
      <div className="fb-own">
        <Pic className="fb-own-avatar" src={img.hero} alt="" width={64} height={64} />
        <div className="fb-own-txt">
          <b>{pick(site.name)} MLA <Icon name="check" className="sc-tick" /></b>
          <small>{pick(site.social.facebook.followers)} {t("फ़ॉलोअर्स", "followers")}</small>
        </div>
        <a className="btn btn-sm fb-own-btn" href={url} target="_blank" rel="noopener"><Icon name="facebook" />{t("पेज फ़ॉलो करें", "Follow Page")}</a>
      </div>
    </div>
  );
}

/* Full Facebook Page box, like the reference site: cover, profile, followers, Follow button and the live posts.
   Facebook shows the posts only to visitors signed in to Facebook in that browser; for everyone else it shows
   just the top part, so a preview of our latest posts sits behind it and shows through below that part. */
export function FacebookFull({ url, items, height = 600 }: { url: string; items: UpdateItem[]; height?: number }) {
  const { lang, t, pick } = useSite();
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(Math.min(500, Math.max(180, Math.floor(el.clientWidth)))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const src = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(url)}&tabs=timeline&width=${w}&height=${height}&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false`;
  return (
    <div className="card fb-full" ref={box} style={{ height }}>
      <div className="fb-full-back" aria-hidden="true">
        {items.slice(0, 4).map((e) => (
          <div key={e.slug} className="fbb-item">
            <Pic src={e.img} alt="" placeholder="blur" sizes="120px" />
            <div><small>{fmtDate(e.date, lang)}</small><b>{pick(e.title)}</b></div>
          </div>
        ))}
      </div>
      {w > 0 && <iframe key={w} title={t("Facebook पर ताज़ा पोस्ट", "Latest posts on Facebook")} src={src} width={w} height={height} loading="lazy" allow="encrypted-media; clipboard-write" />}
    </div>
  );
}

/* Facebook-style page card (built by us, so every visitor sees it, signed in to Facebook or not):
   cover, profile photo, name, followers, bio, Follow / Message, tabs — and the posts scroll below,
   all inside one scrolling card, like his page in the Facebook app. */
export type FbPhoto = { img: StaticImageData; cap: Bi };

export function FacebookProfile({ items, photos }: { items: UpdateItem[]; photos: FbPhoto[] }) {
  const { lang, t, pick, openLightbox } = useSite();
  const [tab, setTab] = useState<"all" | "photos">("all");
  const fb = site.social.facebook;
  const lb = photos.map((p) => ({ img: p.img, cap: pick(p.cap) }));
  return (
    <div className="card fbp" tabIndex={0} aria-label={t("Facebook पेज", "Facebook page")}>
      <div className="fbp-cover">
        <Pic src={img.fbCover} alt="" placeholder="blur" sizes="(max-width: 860px) 100vw, 600px" />
        <a className="fbp-fb" href={fb.url} target="_blank" rel="noopener" aria-label="Facebook"><Icon name="facebook" /></a>
      </div>
      <div className="fbp-head">
        <div className="fbp-avatar"><Pic src={img.fbAvatar} alt={pick(site.name)} width={150} height={150} /></div>
        <h3>{t("विनय कुमार द्विवेदी MLA", "Vinay Kumar Dwivedi MLA")} <Icon name="check" className="sc-tick" /></h3>
        <p className="fbp-stats">
          <b>{pick(fb.followers)}</b> {t("फ़ॉलोअर्स", "followers")} · <b>{fb.stats.following}</b> {t("फ़ॉलोइंग", "following")} · <b>{pick(fb.stats.posts)}</b> {t("पोस्ट", "posts")}
        </p>
        <p className="fbp-bio">{pick(fb.bio)}</p>
        <p className="fbp-cat"><Icon name="card" /> {t("राजनेता", "Politician")}</p>
        <div className="fbp-btns">
          <a className="fbp-follow" href={fb.url} target="_blank" rel="noopener"><Icon name="facebook" />{t("फ़ॉलो करें", "Follow")}</a>
          <a className="fbp-msg" href={fb.message} target="_blank" rel="noopener"><Icon name="chat" />{t("मैसेज", "Message")}</a>
        </div>
        <div className="fbp-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "all"} onClick={() => setTab("all")}>{t("सभी", "All")}</button>
          <button type="button" role="tab" aria-selected={tab === "photos"} onClick={() => setTab("photos")}>{t("फ़ोटो", "Photos")}</button>
          <a href={`${fb.url}reels/`} target="_blank" rel="noopener">{t("रील्स", "Reels")}</a>
        </div>
      </div>
      {tab === "all" ? (
        <div className="fbp-feed">
          {items.map((e) => (
            <article key={e.slug} className="fbp-post">
              <header>
                <Pic className="fbp-mini" src={img.fbAvatar} alt="" width={40} height={40} />
                <div><b>{t("विनय कुमार द्विवेदी MLA", "Vinay Kumar Dwivedi MLA")} <Icon name="check" className="sc-tick" /></b><small>{fmtDate(e.date, lang)} · {pick(e.category)}</small></div>
              </header>
              <h4>{pick(e.title)}</h4>
              <p>{pick(e.summary)}</p>
              <Link href={`/${lang}/updates/${e.slug}`} className="fbp-img" aria-label={pick(e.title)}>
                <Pic src={e.img} alt="" placeholder="blur" sizes="(max-width: 860px) 100vw, 600px" />
              </Link>
              <footer>
                <Link href={`/${lang}/updates/${e.slug}`}>{t("पूरा पढ़ें", "Read more")}</Link>
                {e.source && <a href={e.source} target="_blank" rel="noopener"><Icon name="facebook" />{t("Facebook पर देखें", "View on Facebook")}</a>}
              </footer>
            </article>
          ))}
          <a className="fbp-more" href={fb.url} target="_blank" rel="noopener">{t("Facebook पर सभी पोस्ट देखें", "See all posts on Facebook")} <Icon name="arrowUpRight" /></a>
        </div>
      ) : (
        <div className="fbp-photos">
          {photos.map((p, n) => (
            <button key={n} type="button" onClick={() => openLightbox(lb, n)} aria-label={pick(p.cap)}>
              <Pic src={p.img} alt="" placeholder="blur" sizes="200px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

