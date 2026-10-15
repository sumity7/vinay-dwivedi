"use client";
import { useState } from "react";
import { idealCats, ideals, yearsText, type IdealCat } from "@/lib/content/ideals";
import { useSite } from "./SiteProvider";

const initial = (name: string) => name.replace(/^(श्री|डॉ\.|पं\.|Shri|Dr\.|Pt\.|Bharat Ratna|भारत रत्न|Netaji|नेताजी|Sardar|सरदार|Lokmanya|लोकमान्य|Shaheed|शहीद|Rani|रानी|Swami|स्वामी|Goswami|गोस्वामी|Sant|संत|Guru|गुरु|Maharshi|महर्षि|Mahatma|महात्मा)\s+/, "").charAt(0);

export function IdealsBrowser() {
  const { lang, t, pick } = useSite();
  const [cat, setCat] = useState<IdealCat>("sangh");
  const list = ideals.filter((i) => i.cat === cat);
  const label = pick(idealCats.find((c) => c.id === cat)!.label);
  return (
    <div className="ideals-grid">
      <div className="card cat-card">
        <h3>{t("श्रेणियाँ", "Categories")}</h3>
        {idealCats.map((c) => (
          <button key={c.id} type="button" aria-pressed={c.id === cat} onClick={() => setCat(c.id)}>
            {pick(c.label)}<small>{ideals.filter((i) => i.cat === c.id).length}</small>
          </button>
        ))}
      </div>
      <div>
        <div className="ideals-head">
          <h2>{t("हमारे आदर्श", "Our Ideals")}</h2>
          <span className="tag">{label}</span>
        </div>
        {list.map((i) => (
          <figure key={i.id} className="card ideal" style={{ margin: "0 0 18px" }}>
            <span className="mono" aria-hidden="true">{initial(pick(i.name))}</span>
            <div>
              <blockquote>{pick(i.quote)}</blockquote>
              <figcaption className="who">{pick(i.name)} ({yearsText(i.years, lang)})</figcaption>
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}
