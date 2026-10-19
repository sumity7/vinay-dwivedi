"use client";
/* Quick-action side rail and the upcoming-occasion ribbon. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nextOccurrence, occasions } from "@/lib/content/ecard";
import { ideals } from "@/lib/content/ideals";
import { href, type Bi } from "@/lib/i18n";
import { Icon, type IconName } from "./Icon";
import { useSite } from "./SiteProvider";

const RAIL: { path: string; icon: IconName; hi: string; en: string }[] = [
  { path: "/e-shikayat", icon: "complaint", hi: "शिकायत दर्ज करें", en: "Register a complaint" },
  { path: "/e-shikayat/track", icon: "search", hi: "शिकायत की स्थिति", en: "Track your complaint" },
  { path: "/e-card", icon: "card", hi: "शुभकामनाएँ", en: "Greetings" },
  { path: "/vikas-yatra", icon: "trend", hi: "उपलब्धियाँ", en: "Achievements" },
];

/* Stays out of the way while the first screen (hero, page title) is in view; slides in once the visitor scrolls,
   or straight away on pages too short to scroll much. */
export function SideRail() {
  const { lang, t } = useSite();
  const rest = usePathname().replace(/^\/(hi|en)/, "");
  const [shown, setShown] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  /* publish the bar's real height (it grows when labels wrap or the phone's text size is large),
     so the assistant button can sit just above it instead of on top of the links */
  useEffect(() => {
    const el = navRef.current; if (!el || typeof ResizeObserver === "undefined") return;
    const root = document.documentElement;
    const ro = new ResizeObserver(() => root.style.setProperty("--rail-h", `${Math.ceil(el.getBoundingClientRect().height)}px`));
    ro.observe(el);
    return () => { ro.disconnect(); root.style.removeProperty("--rail-h"); };
  }, []);
  useEffect(() => {
    let raf = 0, room = 0;
    const measure = () => { room = document.documentElement.scrollHeight - innerHeight; };
    const check = () => { raf = 0; setShown(scrollY > 240 || room < 600); };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    const onResize = () => { measure(); onScroll(); };
    measure(); check();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    const ro = new ResizeObserver(measure); ro.observe(document.body);
    return () => { removeEventListener("scroll", onScroll); removeEventListener("resize", onResize); ro.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [rest]);
  return (
    <nav ref={navRef} className={`rail${shown ? "" : " is-hidden"}`} aria-label={t("त्वरित सेवाएँ", "Quick services")}>
      {RAIL.map((r) => (
        <Link key={r.path} href={href(lang, r.path)} className={rest === r.path ? "active" : ""} aria-label={t(r.hi, r.en)}>
          <Icon name={r.icon} /><span>{t(r.hi, r.en)}</span>
        </Link>
      ))}
    </nav>
  );
}

/* Top ribbon: the next upcoming occasion (festival, national day, his birthday, or an anniversary of one of our ideals)
   within the next 30 days, with a link to make a greeting card for it. Hidden when nothing is that close. */
const RIBBON_DAYS = 30;

type Upcoming = { id: string; label: Bi; iso: string; days: number };

function nextUpcoming(now = new Date()): Upcoming | null {
  const list: Upcoming[] = [];
  for (const o of occasions) {
    const n = nextOccurrence(o, now);
    if (n && o.id !== "supporter") list.push({ id: o.id, label: o.label, ...n });
  }
  for (const i of ideals) {
    for (const kind of ["birth", "death"] as const) {
      const mmdd = kind === "birth" ? i.birth : i.death;
      if (!mmdd) continue;
      const n = nextOccurrence({ date: mmdd }, now)!;
      list.push({
        id: `${i.id}-${kind}`, ...n,
        label: { hi: `${i.name.hi} ${kind === "birth" ? "जयंती" : "पुण्यतिथि"}`, en: `${i.name.en}: ${kind === "birth" ? "birth anniversary" : "death anniversary"}` },
      });
    }
  }
  const next = list.sort((a, b) => a.days - b.days)[0];
  return next && next.days <= RIBBON_DAYS ? next : null;
}

export function UpcomingRibbon() {
  const { lang, t, pick } = useSite();
  const [next, setNext] = useState<Upcoming | null>(null);
  useEffect(() => { setNext(nextUpcoming()); }, []);
  if (!next) return null;
  const day = new Intl.DateTimeFormat(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "long" }).format(new Date(`${next.iso}T00:00:00`));
  const when = next.days === 0 ? t("आज", "Today") : next.days === 1 ? t("कल", "Tomorrow") : t(`${next.days} दिन बाद`, `in ${next.days} days`);
  return (
    <div className="ribbon">
      <div className="wrap">
        <span>{day}: {pick(next.label)} <small className="ribbon-when">({when})</small></span>
        <Link href={href(lang, `/e-card?occasion=${next.id}`)}>{t("अपना शुभकामना कार्ड बनाएं", "Make your greeting card")}</Link>
      </div>
    </div>
  );
}
