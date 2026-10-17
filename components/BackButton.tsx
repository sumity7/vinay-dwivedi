"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { Icon } from "./Icon";

/** "← Back" on inner pages: goes back in history when the visitor came from this site,
    otherwise (opened from WhatsApp, Google, a shared link) to the parent page. */
export function BackButton({ fallback, label }: { fallback: string; label: string }) {
  const router = useRouter();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let "open in new tab" work
    let fromHere = false;
    try { fromHere = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch {}
    if (fromHere && window.history.length > 1) { e.preventDefault(); router.back(); }
  };
  return (
    <Link href={fallback} className="ph-back" onClick={onClick}>
      <Icon name="arrow" className="ph-back-ic" />
      {label}
    </Link>
  );
}
