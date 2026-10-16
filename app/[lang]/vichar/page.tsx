import type { Metadata } from "next";
import { ArticleFilter } from "@/components/ArticleFilter";
import { ArticleCard } from "@/components/Cards";
import { PageHero } from "@/components/Chrome";
import { articles } from "@/lib/content/articles";
import type { Lang } from "@/lib/i18n";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "hi" ? "विचार व लेख" : "Ideas & Articles" };
}

export default async function Vichar({ params }: Props) {
  const lang = (await params).lang as Lang;
  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "विकास व विचार", en: "Development & Ideas" }, path: "/vimarsh" }, { label: { hi: "विचार व लेख", en: "Ideas & Articles" } }]}
        title={{ hi: "विचार: योजनाओं और मुद्दों पर लेख", en: "Vichar: articles on schemes and issues" }}
        lead={{ hi: "हर योजना क्या है, किसके लिए है, आवेदन कैसे करें, और हम उसके साथ क्यों खड़े हैं।", en: "What each scheme is, who it is for, how to apply, and why we stand behind it." }}
      />
      <section>
        <h2 className="sr-only">{lang === "hi" ? "योजनाओं पर लेख" : "Articles on schemes"}</h2>
        <div className="wrap">
          <ArticleFilter items={articles.map((a) => ({ cat: a.cat, node: <ArticleCard key={a.slug} a={a} lang={lang} /> }))} />
        </div>
      </section>
    </>
  );
}
