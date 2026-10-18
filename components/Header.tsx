"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import logo from "@/images/logo.png";
import { href, type Lang } from "@/lib/i18n";
import { Icon } from "./Icon";
import { NAV } from "./nav";
import { useSite } from "./SiteProvider";

export function Logo({ lang }: { lang: Lang }) {
  return (
    <Link className="logo-block" href={href(lang)} aria-label={lang === "hi" ? "विनय कुमार द्विवेदी: होम" : "Vinay Kumar Dwivedi: Home"}>
      <Image src={logo} alt={lang === "hi" ? "विनय कुमार द्विवेदी" : "Vinay Kumar Dwivedi"} priority sizes="(max-width: 1100px) 240px, 330px" />
    </Link>
  );
}

/** "/hi/about" -> "/about" */
const stripLang = (p: string) => p.replace(/^\/(hi|en)(?=\/|$)/, "") || "";

/* the two languages are separate pages, so remember where the visitor was: the next page puts them back at the same spot (see the effect in Header) */
const keepScroll = () => { try { sessionStorage.setItem("langY", String(Math.round(window.scrollY))); } catch { /* private mode: they just start at the top */ } };

export function Header() {
  const { lang, pick, t } = useSite();
  const pathname = usePathname();
  const rest = stripLang(pathname);
  const [openDd, setOpenDd] = useState<number | null>(null);
  const [drawer, setDrawer] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pointer = useRef("mouse");
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  /* Hover (mouse only) opens a menu; leaving closes it after a short grace period so it never flickers. */
  const hoverOpen = (i: number) => { clearTimeout(closeTimer.current); setOpenDd(i); };
  const hoverClose = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setOpenDd(null), 140); };

  useEffect(() => { setOpenDd(null); setDrawer(false); }, [pathname]);
  /* after a language switch, put the visitor back where they were (the new page may still be growing, so keep trying for a moment) */
  useEffect(() => {
    let y: number | null = null;
    try { const v = sessionStorage.getItem("langY"); if (v !== null) { sessionStorage.removeItem("langY"); y = Number(v); } } catch { /* ignore */ }
    if (y === null || Number.isNaN(y)) return;
    const target = y, t0 = performance.now();
    let raf = 0;
    const step = () => {
      window.scrollTo({ top: target, behavior: "instant" });
      if (Math.abs(window.scrollY - target) > 2 && performance.now() - t0 < 1500) raf = requestAnimationFrame(step);
    };
    step();
    return () => cancelAnimationFrame(raf);
  }, [lang]);
  useEffect(() => {
    const close = (e: MouseEvent) => { if (!navRef.current?.contains(e.target as Node)) setOpenDd(null); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpenDd(null); setDrawer(false); } };
    document.addEventListener("click", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("click", close); document.removeEventListener("keydown", esc); };
  }, []);

  const isActive = (p: string) => (p === "" ? rest === "" : rest === p || rest.startsWith(p + "/"));
  const groupActive = (base: string, children: { path: string }[]) => children.some((c) => isActive(c.path) && !c.path.includes("#")) || rest.startsWith(base);

  return (
    <header className="topbar">
      <a className="skip" href="#main">{t("मुख्य सामग्री पर जाएँ", "Skip to content")}</a>
      <div className="hbar">
        <Logo lang={lang} />
        <nav className="nav" aria-label={t("मुख्य", "Main")} ref={navRef}>
          {NAV.map((item, i) =>
            "children" in item && item.children.length === 1 ? (
              /* a group with a single page needs no dropdown: it is just a link */
              <Link key={i} href={href(lang, item.children[0].path)} className={groupActive(item.base, item.children) ? "active" : ""}>
                {pick(item.label)}
              </Link>
            ) : "children" in item ? (
              <div key={i} className={`dd${openDd === i ? " open" : ""}`}
                onMouseEnter={() => { if (pointer.current === "mouse") hoverOpen(i); }}
                onMouseLeave={() => { if (pointer.current === "mouse") hoverClose(); }}
                onFocus={() => hoverOpen(i)}
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) hoverClose(); }}>
                {/* The label is a real link to the section's main page; on touch screens the first tap only opens the menu. */}
                <Link href={href(lang, item.children[0].path)} className={`dd-top${groupActive(item.base, item.children) ? " active" : ""}`}
                  aria-haspopup="true" aria-expanded={openDd === i}
                  onPointerDown={(e) => { pointer.current = e.pointerType; }}
                  onClick={(e) => { if (pointer.current !== "mouse" && openDd !== i) { e.preventDefault(); setOpenDd(i); } }}>
                  {pick(item.label)} <Icon name="chevDown" />
                </Link>
                <div className="dd-menu">
                  {item.children.map((c) => (
                    <Link key={c.path} href={href(lang, c.path)} className={isActive(c.path) && rest === c.path ? "active" : ""}>
                      {pick(c.label)}{c.desc && <small>{pick(c.desc)}</small>}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={i} href={href(lang, item.path)} className={`${isActive(item.path) ? "active" : ""}${item.path === "/contact" ? " nav-cta" : ""}`} aria-current={isActive(item.path) ? "page" : undefined}>
                {pick(item.label)}
              </Link>
            ),
          )}
        </nav>
        <div className="bar-right">
          <div className="lang-switch" role="group" aria-label={t("भाषा", "Language")}>
            <Link href={`/en${rest}`} scroll={false} onClick={keepScroll} aria-current={lang === "en"} lang="en" aria-label="English">EN</Link>
            <Link href={`/hi${rest}`} scroll={false} onClick={keepScroll} aria-current={lang === "hi"} lang="hi" aria-label="हिन्दी">हिं</Link>
          </div>
        </div>
        <button className={`menu-btn${drawer ? " is-open" : ""}`} aria-label={t("मेनू", "Menu")} aria-expanded={drawer} aria-controls="drawer" onClick={() => setDrawer(!drawer)}>
          <span className="menu-lines" aria-hidden="true"><i /><i /><i /></span>
        </button>
      </div>
      <nav id="drawer" className={`drawer${drawer ? " open" : ""}`} aria-label={t("मेनू", "Menu")}>
        {NAV.map((item, i) =>
          "children" in item && item.children.length === 1 ? (
            <Link key={i} className={groupActive(item.base, item.children) ? "active" : ""} href={href(lang, item.children[0].path)}>{pick(item.label)}</Link>
          ) : "children" in item ? (
            <div key={i}>
              <div className="group">{pick(item.label)}</div>
              {item.children.map((c) => <Link key={c.path} className={`sub${isActive(c.path) && rest === c.path ? " active" : ""}`} href={href(lang, c.path)}>{pick(c.label)}</Link>)}
            </div>
          ) : (
            <Link key={i} className={isActive(item.path) ? "active" : ""} href={href(lang, item.path)}>{pick(item.label)}</Link>
          ),
        )}
        <div className="drawer-lang">
          <Link href={`/hi${rest}`} aria-current={lang === "hi"}>हिन्दी</Link>
          <Link href={`/en${rest}`} aria-current={lang === "en"}>English</Link>
        </div>
      </nav>
    </header>
  );
}
