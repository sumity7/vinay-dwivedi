"use client";
import { useState, type ReactNode } from "react";
import { articleCats, type ArticleCat } from "@/lib/content/articles";
import { useSite } from "./SiteProvider";

/* Category chips over a server-rendered grid: cards are passed in already rendered, keyed by category. */
export function ArticleFilter({ items }: { items: { cat: ArticleCat; node: ReactNode }[] }) {
  const { t, pick } = useSite();
  const [cat, setCat] = useState<ArticleCat | "all">("all");
  const count = (c: ArticleCat) => items.filter((i) => i.cat === c).length;
  return (
    <>
      <div className="occ" role="group" aria-label={t("श्रेणी", "Category")} style={{ marginTop: 0, marginBottom: 32 }}>
        <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")}>{t("सभी", "All")} <small>{items.length}</small></button>
        {articleCats.filter((c) => count(c.id)).map((c) => (
          <button key={c.id} type="button" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>{pick(c.label)} <small>{count(c.id)}</small></button>
        ))}
      </div>
      <div className="art-grid">
        {items.filter((i) => cat === "all" || i.cat === cat).map((i) => i.node)}
      </div>
    </>
  );
}
