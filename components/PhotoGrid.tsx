"use client";
import { Pic } from "./Pic";
import type { Photo } from "@/lib/content/events";
import { useSite } from "./SiteProvider";

export function PhotoGrid({ photos, feature, sizes = "(max-width: 860px) 50vw, 25vw" }: { photos: Photo[]; feature?: boolean; sizes?: string }) {
  const { pick, openLightbox, t } = useSite();
  const list = photos.map((p) => ({ img: p.img, cap: pick(p.cap) }));
  /* pick a layout that fills complete rows for this many photos (no empty holes) */
  const n = photos.length;
  const layout = n === 1 ? " one" : feature ? " feature" : n % 3 === 0 && n % 4 !== 0 ? " cols3" : n === 5 ? " feature" : n === 7 ? " feature n7" : n === 2 ? " cols2" : "";
  const big = feature || n === 5 || n === 7;
  return (
    <div className={`pgrid${layout}`}>
      {photos.map((p, i) => (
        <button key={i} type="button" onClick={() => openLightbox(list, i)} aria-label={`${t("बड़ा देखें", "View larger")}: ${pick(p.cap)}`}>
          <Pic src={p.img} alt={pick(p.cap)} placeholder="blur" sizes={i === 0 && big ? "(max-width: 860px) 100vw, 50vw" : sizes} />
        </button>
      ))}
    </div>
  );
}
