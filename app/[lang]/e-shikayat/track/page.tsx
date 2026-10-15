import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/Chrome";
import { TrackForm } from "@/components/Complaint";
import type { Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "hi" ? "शिकायत की स्थिति" : "Track your complaint" };
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
        <div className="wrap">
          <Suspense><TrackForm /></Suspense>
        </div>
      </section>
    </>
  );
}
