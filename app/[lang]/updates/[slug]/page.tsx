import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/Chrome";
import { Icon } from "@/components/Icon";
import { PhotoGrid } from "@/components/PhotoGrid";
import { ShareWhatsApp } from "@/components/Share";
import { events, getEvent } from "@/lib/content/events";
import { fmtDate, href, LANGS, tr, type Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => LANGS.flatMap((lang) => events.map((e) => ({ lang, slug: e.slug })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const e = getEvent(slug);
  if (!e) return {};
  const l = lang as Lang;
  return { title: tr(e.title, l), description: tr(e.summary, l), openGraph: { images: [{ url: e.photos[0].img.src }] } };
}

export default async function EventPage({ params }: Props) {
  const { lang: l, slug } = await params;
  const lang = l as Lang;
  const e = getEvent(slug);
  if (!e) notFound();
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);

  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "कार्यक्रम", en: "Events" }, path: "/updates" }, { label: e.title }]}
        eyebrow={{ hi: `${e.category.hi} · ${e.place.hi}`, en: `${e.category.en} · ${e.place.en}` }}
        title={e.title}
        lead={e.lead}
        meta={<p className="meta"><Icon name="calendar" /> {fmtDate(e.date, lang)}</p>}
      />
      <section>
        <h2 className="sr-only">{lang === "hi" ? "कार्यक्रम का विवरण" : "Event details"}</h2>
        <div className="wrap ev-detail">
          <PhotoGrid photos={e.photos} sizes="(max-width: 900px) 50vw, 330px" />
          <article>
            {e.body.map((p, i) => <p key={i} className="justify">{tr(p, lang)}</p>)}
            <div className="hero-actions" style={{ marginTop: 24 }}>
              <ShareWhatsApp text={tr(e.title, lang)} path={href(lang, `/updates/${e.slug}`)} />
              {e.source && <a className="btn btn-ghost" href={e.source} target="_blank" rel="noopener">{t("मूल पोस्ट देखें", "View the original post")}</a>}
            </div>
          </article>
        </div>
        <div className="wrap foot-links">
          <Link className="link-arrow" href={href(lang, "/updates")}>{t("सभी कार्यक्रम", "All events")} <Icon name="arrow" /></Link>
          <Link className="link-arrow" href={href(lang, "/media")}>{t("फोटो गैलरी", "Gallery")} <Icon name="arrow" /></Link>
        </div>
      </section>
    </>
  );
}
