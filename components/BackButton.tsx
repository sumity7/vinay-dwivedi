"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type MouseEvent } from "react";
import { Icon } from "./Icon";

/** "← Back" on inner pages: goes back in history when the visitor came from this site,
    otherwise (opened from WhatsApp, Google, a shared link) to the parent page. */
export function BackButton({ fallback, label }: { fallback: string; label: string }) {
  const router = useRouter();
  // keep the pill just under the sticky top bar, whatever its height is at this width
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".topbar");
    if (!bar) return;
    const set = () => document.documentElement.style.setProperty("--tb-h", `${bar.getBoundingClientRect().height}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // let "open in new tab" work
    let fromHere = false;
    try { fromHere = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch {}
    if (fromHere && window.history.length > 1) { e.preventDefault(); router.back(); }
  };
  return (
    <div className="ph-back-slot">
      <Link href={fallback} className="ph-back" onClick={onClick}>
        <Icon name="arrow" className="ph-back-ic" />
        {label}
      </Link>
    </div>
  );
}
