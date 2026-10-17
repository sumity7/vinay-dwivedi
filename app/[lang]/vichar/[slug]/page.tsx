import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/Cards";
import { PageHero } from "@/components/Chrome";
import { Icon } from "@/components/Icon";
import { ShareWhatsApp } from "@/components/Share";
import { articleCats, articles, getArticle } from "@/lib/content/articles";
import { fmtDate, href, LANGS, tr, type Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => LANGS.flatMap((lang) => articles.map((a) => ({ lang, slug: a.slug })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const a = getArticle(slug);
  return a ? pageMeta(lang as Lang, `/vichar/${slug}`, { title: tr(a.title, lang as Lang), description: tr(a.summary, lang as Lang), type: "article" }) : {};
}

export default async function ArticlePage({ params }: Props) {
  const { lang: l, slug } = await params;
  const lang = l as Lang;
  const a = getArticle(slug);
  if (!a) notFound();
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);
  const cat = articleCats.find((c) => c.id === a.cat)!;
  const next = articles.filter((x) => x.slug !== a.slug).sort((x, y) => Number(y.cat === a.cat) - Number(x.cat === a.cat)).slice(0, 3);

  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "विकास व विचार", en: "Development & Ideas" }, path: "/vimarsh" }, { label: { hi: "विचार व लेख", en: "Ideas & Articles" }, path: "/vichar" }, { label: a.title }]}
        eyebrow={cat.label}
        title={a.title}
        lead={a.summary}
        meta={<p className="meta">{t("प्रकाशित", "Published")}: {fmtDate(a.published, lang)} · {a.readMin} {t("मिनट में पढ़ें", "min read")}</p>}
        aside={a.figure && <div className={`fig-card cov-${a.icon}`}><b>{tr(a.figure.value, lang)}</b><span>{tr(a.figure.label, lang)}</span></div>}
      />
      <section>
        <div className="wrap art-detail">
          <article>
            <h2>{t("यह क्या है", "What it is")}</h2>
            <p>{tr(a.what, lang)}</p>
            <h2>{t("किसे लाभ मिलेगा", "Who can benefit")}</h2>
            <p>{tr(a.who, lang)}</p>
            <h2>{t("आवेदन कैसे करें", "How to apply")}</h2>
            <ol className="ol-steps">{a.steps.map((s, i) => <li key={i}>{tr(s, lang)}</li>)}</ol>
            <h2>{t("हमारा पक्ष", "Our position")}</h2>
            <p className="position">{tr(a.position, lang)}</p>
            <div className="hero-actions" style={{ marginTop: 28 }}>
              <ShareWhatsApp text={tr(a.title, lang)} path={href(lang, `/vichar/${a.slug}`)} />
            </div>
          </article>
          <aside className="aside-stack">
            {a.site && (
              <div className="card">
                <h3>{t("आधिकारिक वेबसाइट", "Official website")}</h3>
                <a className="link-arrow" href={a.site.url} target="_blank" rel="noopener">{a.site.label} <Icon name="arrowUpRight" /></a>
              </div>
            )}
            <div className="card">
              <h3>{t("स्रोत", "Sources")}</h3>
              <ul className="src-list">{a.sources.map((s) => <li key={s.url + s.label.en}><a href={s.url} target="_blank" rel="noopener">{tr(s.label, lang)}</a></li>)}</ul>
            </div>
            <div className="card">
              <h3>{t("कोई समस्या?", "Facing a problem?")}</h3>
              <p style={{ fontSize: 15, color: "var(--ink-2)" }}>{t("योजना का लाभ अटका है? ई-शिकायत पर दर्ज करें, विधायक कार्यालय मदद करेगा।", "Is a benefit stuck? Register it on e-Shikayat and the MLA’s office will help.")}</p>
              <Link className="btn btn-primary btn-sm" href={href(lang, "/e-shikayat")}>{t("शिकायत दर्ज करें", "Register a complaint")}</Link>
            </div>
          </aside>
        </div>
      </section>
      <section className="sec-sand">
        <div className="wrap">
          <h2 style={{ marginBottom: 28 }}>{t("आगे पढ़ें", "Read next")}</h2>
          <div className="art-grid">{next.map((x) => <ArticleCard key={x.slug} a={x} lang={lang} />)}</div>
        </div>
      </section>
    </>
  );
}
