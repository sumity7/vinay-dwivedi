import type { Metadata } from "next";
import { articleJsonLd, breadcrumbJsonLd, jsonLdHtml, pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/Cards";
import { PageHero } from "@/components/Chrome";
import { Icon } from "@/components/Icon";
import { PhotoGrid } from "@/components/PhotoGrid";
import { ShareWhatsApp } from "@/components/Share";
import { events, getEvent, sortedEvents } from "@/lib/content/events";
import { fmtDate, href, LANGS, tr, type Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => LANGS.flatMap((lang) => events.map((e) => ({ lang, slug: e.slug })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const e = getEvent(slug);
  if (!e) return {};
  const l = lang as Lang;
  return pageMeta(l, `/updates/${slug}`, { title: tr(e.title, l), description: tr(e.summary, l), image: e.photos[0].img, type: "article" });
}

export default async function EventPage({ params }: Props) {
  const { lang: l, slug } = await params;
  const lang = l as Lang;
  const e = getEvent(slug);
  if (!e) notFound();
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);
  /* three other updates, same category first */
  const more = sortedEvents.filter((x) => x.slug !== e.slug).sort((a, b) => Number(b.category.en === e.category.en) - Number(a.category.en === e.category.en)).slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml([
        articleJsonLd(lang, `/updates/${slug}`, { title: tr(e.title, lang), description: tr(e.summary, lang), date: e.date, image: e.photos[0].img }),
        breadcrumbJsonLd(lang, [{ name: t("अपडेट्स", "Updates"), path: "/updates" }, { name: tr(e.title, lang) }]),
      ])} />
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "अपडेट्स", en: "Updates" }, path: "/updates" }, { label: e.title }]}
        eyebrow={{ hi: `${e.category.hi} · ${e.place.hi}`, en: `${e.category.en} · ${e.place.en}` }}
        title={e.title}
        lead={e.lead}
        meta={<p className="meta"><Icon name="calendar" /> {fmtDate(e.date, lang)}</p>}
      />
      <section>
        <h2 className="sr-only">{lang === "hi" ? "कार्यक्रम का विवरण" : "Event details"}</h2>
        <div className="wrap ev-detail">
          <article>
            {e.body.map((p, i) => <p key={i} className="justify">{tr(p, lang)}</p>)}
            <h3 className="ev-h">{t("पृष्ठभूमि और महत्त्व", "Background and why it matters")}</h3>
            {e.context.map((p, i) => <p key={i} className="justify">{tr(p, lang)}</p>)}
            <div className="hero-actions" style={{ marginTop: 24 }}>
              <ShareWhatsApp text={tr(e.title, lang)} path={href(lang, `/updates/${e.slug}`)} />
              {e.source && <a className="btn btn-ghost" href={e.source} target="_blank" rel="noopener">{t("मूल पोस्ट देखें", "View the original post")}</a>}
            </div>
          </article>
          <aside className="ev-side">
            <div className="card ev-box">
              <h3>{t("मुख्य बातें", "Key points")}</h3>
              <ul className="ev-points">{e.points.map((p, i) => <li key={i}>{tr(p, lang)}</li>)}</ul>
            </div>
            <div className="card ev-box">
              <h3>{t("विवरण", "Details")}</h3>
              <dl className="ev-facts">
                <div><dt>{t("तिथि", "Date")}</dt><dd>{fmtDate(e.date, lang)}</dd></div>
                <div><dt>{t("स्थान", "Place")}</dt><dd>{tr(e.place, lang)}</dd></div>
                <div><dt>{t("श्रेणी", "Category")}</dt><dd>{tr(e.category, lang)}</dd></div>
              </dl>
            </div>
            <div className="card ev-box ev-help">
              <h3>{t("कोई समस्या या सुझाव?", "A problem or a suggestion?")}</h3>
              <p>{t("अपनी बात सीधे विधायक कार्यालय तक पहुँचाएँ और कार्यवाही की स्थिति स्वयं देखें।", "Send it straight to the MLA’s office and follow the progress yourself.")}</p>
              <div className="hero-actions">
                <Link className="btn btn-primary btn-sm" href={href(lang, "/e-shikayat")}>{t("शिकायत दर्ज करें", "Register a complaint")}</Link>
                <Link className="btn btn-ghost btn-sm" href={href(lang, "/contact")}>{t("संपर्क करें", "Contact")}</Link>
              </div>
            </div>
          </aside>
        </div>
        <div className="wrap album ev-photos" style={{ marginTop: 56, marginBottom: 0 }}>
          <h2>{t("तस्वीरें", "Photographs")}</h2>
          <PhotoGrid photos={e.photos} />
        </div>
        <div className="wrap ev-more">
          <h2>{t("और अपडेट्स", "More updates")}</h2>
          <div className="ev-grid">{more.map((m) => <EventCard key={m.slug} e={m} lang={lang} />)}</div>
        </div>
        <div className="wrap foot-links">
          <Link className="link-arrow" href={href(lang, "/updates")}>{t("सभी अपडेट्स", "All updates")} <Icon name="arrow" /></Link>
          <Link className="link-arrow" href={href(lang, "/media")}>{t("मीडिया", "Media")} <Icon name="arrow" /></Link>
        </div>
      </section>
    </>
  );
}
