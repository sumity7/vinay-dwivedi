"use client";
import Image from "next/image";
import type { Photo } from "@/lib/content/events";
import { useSite } from "./SiteProvider";

export function PhotoGrid({ photos, feature, sizes = "(max-width: 860px) 50vw, 25vw" }: { photos: Photo[]; feature?: boolean; sizes?: string }) {
  const { pick, openLightbox, t } = useSite();
  const list = photos.map((p) => ({ img: p.img, cap: pick(p.cap) }));
  return (
    <div className={`pgrid${feature ? " feature" : ""}`}>
      {photos.map((p, i) => (
        <button key={i} type="button" onClick={() => openLightbox(list, i)} aria-label={`${t("बड़ा देखें", "View larger")}: ${pick(p.cap)}`}>
          <Image src={p.img} alt={pick(p.cap)} placeholder="blur" sizes={i === 0 && feature ? "(max-width: 860px) 100vw, 50vw" : sizes} />
        </button>
      ))}
    </div>
  );
}
