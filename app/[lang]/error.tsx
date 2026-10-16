"use client";
import { useSite } from "@/components/SiteProvider";

/* Safety net: if a page crashes while rendering, show a calm message and a retry button instead of a blank screen. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useSite();
  return (
    <section className="nf">
      <div className="wrap">
        <h1>{t("कुछ गड़बड़ हो गई", "Something went wrong")}</h1>
        <p className="lead">{t("पन्ना खुल नहीं पाया। कृपया दोबारा प्रयास करें। समस्या बनी रहे तो कार्यालय से संपर्क करें।", "This page didn’t load. Please try again; if it keeps happening, contact the office.")}</p>
        <div className="nf-actions">
          <button type="button" className="btn btn-orange" onClick={reset}>{t("दोबारा प्रयास करें", "Try again")}</button>
        </div>
      </div>
    </section>
  );
}
