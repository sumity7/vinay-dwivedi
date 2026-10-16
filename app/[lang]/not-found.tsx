"use client";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { useSite } from "@/components/SiteProvider";
import { href } from "@/lib/i18n";

/* Shown for any unknown address under /hi or /en, inside the normal header and footer. */
export default function NotFound() {
  const { lang, t } = useSite();
  return (
    <section className="nf">
      <div className="wrap">
        <p className="nf-code" aria-hidden="true">404</p>
        <h1>{t("यह पन्ना नहीं मिला", "We couldn’t find that page")}</h1>
        <p className="lead">{t("लिंक पुराना हो सकता है या पता गलत लिखा गया है। नीचे से सही जगह चुनें।", "The link may be old or the address mistyped. Pick where to go from here.")}</p>
        <h2 className="sr-only">{t("आगे कहाँ जाएँ", "Where to go next")}</h2>
        <div className="nf-actions">
          <Link className="btn btn-orange" href={href(lang)}>{t("होम पर जाएँ", "Go to Home")} <Icon name="arrow" /></Link>
          <Link className="btn btn-outline" href={href(lang, "/e-shikayat")}>{t("शिकायत दर्ज करें", "Register a complaint")}</Link>
          <Link className="btn btn-outline" href={href(lang, "/contact")}>{t("संपर्क करें", "Contact")}</Link>
        </div>
      </div>
    </section>
  );
}
