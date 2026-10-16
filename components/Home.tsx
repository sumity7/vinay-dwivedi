"use client";
/* Interactive pieces of the home page: hero slider, carousels, gallery tabs, video grid, counters, social feeds. */
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Photo } from "@/lib/content/events";
import { fmtDate, type Bi } from "@/lib/i18n";
import { site } from "@/lib/site";
import { fmtIN, prefersReducedMotion } from "@/lib/utils";
import type { Video } from "@/lib/youtube";
import { Icon, type IconName } from "./Icon";
import { useSite } from "./SiteProvider";

export type Slide = { img: StaticImageData; alt?: Bi; pos?: string };

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
          <div key={k} className="slide" aria-hidden={k !== i}>
            <Image src={s.img} alt={s.alt ? pick(s.alt) : t("विनय कुमार द्विवेदी", "Vinay Kumar Dwivedi")} fill sizes="(max-width: 900px) 100vw, 66vw"
              preload={k === 0} style={{ objectFit: "cover", objectPosition: s.pos ?? "center 25%" }} />
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
  const go = (d: number) => ref.current?.scrollBy({ left: d * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className={`carousel ${className}`}>
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
  const shown = tab.photos.slice(0, 4);
  const list = tab.photos.map((p) => ({ img: p.img, cap: pick(p.cap) }));
  return (
    <div className="gal">
      <div className="gal-tabs" role="tablist" aria-label={t("श्रेणी", "Category")}>
        {tabs.map((x, n) => (
          <button key={x.key} type="button" role="tab" aria-selected={n === k} className={n === k ? "on" : ""} onClick={() => setK(n)}>
            <Icon name={x.icon} />{pick(x.label)}
          </button>
        ))}
      </div>
      <div className="gal-grid" key={tab.key}>
        {shown.map((p, n) => (
          <button key={n} type="button" className={`g${n}`} onClick={() => openLightbox(list, n)} aria-label={`${t("बड़ा देखें", "View larger")}: ${pick(p.cap)}`}>
            <Image src={p.img} alt={pick(p.cap)} placeholder="blur" sizes={n === 0 ? "(max-width: 860px) 100vw, 40vw" : "(max-width: 860px) 50vw, 22vw"} />
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

export function FacebookFeed() {
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
  const fb = site.social.facebook.url;
  return (
    <div className="card fb-box" ref={box}>
      <div className="fb-fallback">
        <span className="round"><Icon name="facebook" /></span>
        <b>{t("विनय कुमार द्विवेदी", "Vinay Kumar Dwivedi")}</b>
        <p className="muted" style={{ margin: 0 }}>{t("ताज़ा पोस्ट और घोषणाओं के लिए आधिकारिक पेज फॉलो करें।", "Follow the official page for the latest posts and announcements.")}</p>
        <a className="btn btn-primary btn-sm" href={fb} target="_blank" rel="noopener">{t("Facebook पेज खोलें", "Open the Facebook page")}</a>
      </div>
      {w > 0 && (
        <iframe
          title={t("Facebook पर ताज़ा पोस्ट", "Latest posts on Facebook")}
          src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(fb)}&tabs=timeline&width=${w}&height=620&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`}
          width={w} height={620} loading="lazy" allow="encrypted-media" style={{ margin: "0 auto", display: "block", width: w }}
        />
      )}
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
        <h4>{v.title}</h4>
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

