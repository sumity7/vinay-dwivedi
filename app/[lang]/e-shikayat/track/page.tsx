import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Suspense } from "react";
import { PageHero } from "@/components/Chrome";
import { TrackForm } from "@/components/Complaint";
import type { Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const hi = lang === "hi";
  return pageMeta(lang as Lang, "/e-shikayat/track", {
    title: hi ? "शिकायत की स्थिति" : "Track your complaint",
    description: hi ? "टिकट संख्या से विधायक कार्यालय, मेहनौन में दर्ज अपनी ई-शिकायत की स्थिति और कार्यवाही देखें।" : "Use your ticket number to check the status of a complaint registered with the Mehnaun MLA’s office.",
  });
}

export default async function Track({ params }: Props) {
  const lang = (await params).lang as Lang;
  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "ई-शिकायत", en: "e-Shikayat: register a complaint" }, path: "/e-shikayat" }, { label: { hi: "शिकायत की स्थिति", en: "Track your complaint" } }]}
        title={{ hi: "अपनी शिकायत की स्थिति जानें", en: "Track your complaint" }}
        lead={{ hi: "शिकायत दर्ज करते समय मिली टिकट संख्या और अपने मोबाइल नंबर के अंतिम चार अंक डालें।", en: "Enter the ticket number you received and the last four digits of the mobile number you gave." }}
      />
      <section>
        <h2 className="sr-only">{lang === "hi" ? "शिकायत की स्थिति देखें" : "Check complaint status"}</h2>
        <div className="wrap">
          <Suspense><TrackForm /></Suspense>
        </div>
      </section>
    </>
  );
}
