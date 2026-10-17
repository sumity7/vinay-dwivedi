"use client";
import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/** Every page opens at the top: on route change and on refresh (browser would otherwise
    restore the old scroll position). Hash links (#section) keep working. */
export function ScrollTop() {
  const path = usePathname();
  useEffect(() => {
    try { history.scrollRestoration = "manual"; } catch {}
    const on = () => document.documentElement.classList.add("smooth-anchor");
    on();
  }, []);
  useLayoutEffect(() => {
    if (location.hash) return;
    const el = document.documentElement;
    el.classList.remove("smooth-anchor");
    window.scrollTo(0, 0);
    requestAnimationFrame(() => { window.scrollTo(0, 0); el.classList.add("smooth-anchor"); });
  }, [path]);
  return null;
}
