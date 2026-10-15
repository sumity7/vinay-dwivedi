"use client";
/* Quick-action side rail and the birthday ribbon. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { href } from "@/lib/i18n";
import { Icon, type IconName } from "./Icon";
import { useSite } from "./SiteProvider";

const RAIL: { path: string; icon: IconName; hi: string; en: string }[] = [
  { path: "/e-shikayat", icon: "complaint", hi: "शिकायत दर्ज करें", en: "Register a complaint" },
  { path: "/e-shikayat/track", icon: "search", hi: "शिकायत की स्थिति", en: "Track your complaint" },
  { path: "/e-card", icon: "card", hi: "ई-कार्ड बनाएं", en: "Make an e-card" },
  { path: "/vikas-yatra", icon: "trend", hi: "विकास यात्रा", en: "Vikas Yatra" },
];

export function SideRail() {
  const { lang, t } = useSite();
  const rest = usePathname().replace(/^\/(hi|en)/, "");
  return (
    <nav className="rail" aria-label={t("त्वरित सेवाएँ", "Quick services")}>
      {RAIL.map((r) => (
        <Link key={r.path} href={href(lang, r.path)} className={rest === r.path ? "active" : ""} aria-label={t(r.hi, r.en)}>
          <Icon name={r.icon} /><span>{t(r.hi, r.en)}</span>
        </Link>
      ))}
    </nav>
  );
}

/* Shown 10–20 October, around his birthday (15 Oct). */
export function BirthdayRibbon() {
  const { lang, t } = useSite();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const d = new Date();
    setShow(d.getMonth() === 9 && d.getDate() >= 10 && d.getDate() <= 20);
  }, []);
  if (!show) return null;
  return (
    <div className="ribbon">
      <div className="wrap">
        <span>{t("15 अक्टूबर: मुन्ना भैया का जन्मदिन।", "15 October: Munna Bhaiya’s birthday.")}</span>
        <Link href={href(lang, "/e-card?occasion=birthday")}>{t("अपना शुभकामना कार्ड बनाएं", "Make your greeting card")}</Link>
      </div>
    </div>
  );
}
