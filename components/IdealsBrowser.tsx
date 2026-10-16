"use client";
import Image from "next/image";
import { useState } from "react";
import { idealGroups, ideals, yearsText, type Ideal, type IdealGroup } from "@/lib/content/ideals";
import { useSite } from "./SiteProvider";

/** One portrait card. Used on the Ideals page and (server-side copy) on the home page. */
export function IdealCard({ i, lang }: { i: Ideal; lang: "hi" | "en" }) {
  const isQuote = i.line.kind === "quote";
  return (
    <figure className="ideal-card">
      <div className="ideal-photo">
        <Image src={i.img} alt={i.name[lang]} placeholder="blur" sizes="(max-width: 620px) 50vw, (max-width: 1000px) 33vw, 280px" />
        <span className="ideal-years">{yearsText(i.years, lang)}</span>
      </div>
      <figcaption>
        <h3>{i.name[lang]}</h3>
        <span className="ideal-role">{i.role[lang]}</span>
        {isQuote ? <blockquote>“{i.line.text[lang]}”</blockquote> : <p>{i.line.text[lang]}</p>}
      </figcaption>
    </figure>
  );
}

export function IdealsBrowser() {
  const { lang, t, pick } = useSite();
  const [group, setGroup] = useState<IdealGroup | "all">("all");
  const list = group === "all" ? ideals : ideals.filter((i) => i.group === group);
  return (
    <>
      <div className="ideals-filter" role="group" aria-label={t("श्रेणी", "Group")}>
        <button type="button" className="chip" aria-pressed={group === "all"} onClick={() => setGroup("all")}>
          {t("सभी", "All")} <small>{ideals.length}</small>
        </button>
        {idealGroups.map((g) => (
          <button key={g.id} type="button" className="chip" aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>
            {pick(g.label)} <small>{ideals.filter((i) => i.group === g.id).length}</small>
          </button>
        ))}
      </div>
      <div className="ideals-cards">
        {list.map((i) => <IdealCard key={i.id} i={i} lang={lang} />)}
      </div>
      <details className="credits">
        <summary>{t("चित्र स्रोत", "Photo credits")}</summary>
        <ul>
          {ideals.map((i) => (
            <li key={i.id}>
              {pick(i.name)}: <a href={i.credit.url} target="_blank" rel="noopener">{i.credit.by}</a>, {i.credit.license}
              {i.credit.license.startsWith("CC") ? t(" (चित्र को काटा गया है)", " (cropped)") : ""}
            </li>
          ))}
        </ul>
      </details>
    </>
  );
}
