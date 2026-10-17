"use client";
import { useState, type ReactNode } from "react";
import type { Bi } from "@/lib/i18n";
import { useSite } from "./SiteProvider";

/* Event-type chips (Events, Outreach, Relief, Faith & culture) over a server-rendered list of cards. */
export function EventFilter({ items }: { items: { cat: Bi; node: ReactNode }[] }) {
  const { t, pick } = useSite();
  const [cat, setCat] = useState("all");
  const cats = items.map((i) => i.cat).filter((c, n, all) => all.findIndex((x) => x.en === c.en) === n);
  const count = (en: string) => items.filter((i) => i.cat.en === en).length;
  return (
    <>
      <div className="occ" role="group" aria-label={t("कार्यक्रम का प्रकार", "Type of update")} style={{ marginTop: 0, marginBottom: 28 }}>
        <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")}>{t("सभी", "All")} <small>{items.length}</small></button>
        {cats.map((c) => (
          <button key={c.en} type="button" aria-pressed={cat === c.en} onClick={() => setCat(c.en)}>{pick(c)} <small>{count(c.en)}</small></button>
        ))}
      </div>
      <div className="ev-list">
        {items.filter((i) => cat === "all" || i.cat.en === cat).map((i) => i.node)}
      </div>
    </>
  );
}
