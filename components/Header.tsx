"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { href, type Lang } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Icon, type IconName } from "./Icon";
import { NAV } from "./nav";
import { useSite } from "./SiteProvider";

const SOC: { key: "facebook" | "instagram" | "youtube"; label: string; icon: IconName }[] = [
  { key: "facebook", label: "Facebook", icon: "facebook" },
  { key: "instagram", label: "Instagram", icon: "instagram" },
  { key: "youtube", label: "YouTube", icon: "youtube" },
];

export function Logo({ lang }: { lang: Lang }) {
  return (
    <Link className="logo-block" href={href(lang)} aria-label={lang === "hi" ? "होम" : "Home"}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <g fill="#fff">
          <path d="M24 8c4 5 5 11 0 22-5-11-4-17 0-22z" />
          <path d="M24 30c-7-3-11-8-12-15 6 1 10 6 12 15z" opacity=".9" />
          <path d="M24 30c7-3 11-8 12-15-6 1-10 6-12 15z" opacity=".9" />
          <path d="M24 31c-8 0-14-3-17-8 6-1 12 2 17 8z" opacity=".75" />
          <path d="M24 31c8 0 14-3 17-8-6-1-12 2-17 8z" opacity=".75" />
        </g>
        <path d="M14 36h20M18 40h12" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className="sep" aria-hidden="true" />
      <span className="name">{lang === "hi" ? <>विनय कुमार<br />द्विवेदी</> : <>Vinay Kumar<br />Dwivedi</>}</span>
    </Link>
  );
}

/** "/hi/about" -> "/about" */
const stripLang = (p: string) => p.replace(/^\/(hi|en)(?=\/|$)/, "") || "";

export function Header() {
  const { lang, pick, t } = useSite();
  const pathname = usePathname();
  const rest = stripLang(pathname);
  const [openDd, setOpenDd] = useState<number | null>(null);
  const [drawer, setDrawer] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => { setOpenDd(null); setDrawer(false); }, [pathname]);
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
            "children" in item ? (
              <div key={i} className={`dd${openDd === i ? " open" : ""}`} onMouseEnter={() => setOpenDd(i)} onMouseLeave={() => setOpenDd(null)}>
                <button type="button" aria-expanded={openDd === i} className={groupActive(item.base, item.children) ? "active" : ""}
                  onClick={() => setOpenDd(openDd === i ? null : i)}>
                  {pick(item.label)} <Icon name="chevDown" />
                </button>
                <div className="dd-menu">
                  {item.children.map((c) => (
                    <Link key={c.path} href={href(lang, c.path)} className={isActive(c.path) && rest === c.path ? "active" : ""}>
                      {pick(c.label)}{c.desc && <small>{pick(c.desc)}</small>}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={i} href={href(lang, item.path)} className={isActive(item.path) ? "active" : ""} aria-current={isActive(item.path) ? "page" : undefined}>
                {pick(item.label)}
              </Link>
            ),
          )}
        </nav>
        <div className="bar-right">
          <div className="soc-mini">
            {SOC.map((s) => <a key={s.key} href={site.social[s.key].url} target="_blank" rel="noopener" aria-label={s.label}><Icon name={s.icon} /></a>)}
          </div>
          <div className="lang-switch" role="group" aria-label={t("भाषा", "Language")}>
            <Link href={`/en${rest}`} aria-current={lang === "en"} lang="en">EN</Link>
            <Link href={`/hi${rest}`} aria-current={lang === "hi"} lang="hi">हिन्दी</Link>
          </div>
        </div>
        <button className="menu-btn" aria-label={t("मेनू", "Menu")} aria-expanded={drawer} aria-controls="drawer" onClick={() => setDrawer(!drawer)}>
          <Icon name={drawer ? "close" : "menu"} />
        </button>
      </div>
      <nav id="drawer" className={`drawer${drawer ? " open" : ""}`} aria-label={t("मेनू", "Menu")}>
        {NAV.map((item, i) =>
          "children" in item ? (
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
