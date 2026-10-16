/* Footer, breadcrumbs/page hero and social links. Server components. */
import Link from "next/link";
import type { ReactNode } from "react";
import { href, tr, type Bi, type Lang } from "@/lib/i18n";
import { phoneLabel, site } from "@/lib/site";
import { Icon, type IconName } from "./Icon";
import { FOOTER_PERSONA, FOOTER_QUICK } from "./nav";

export const SOCIALS: { key: "facebook" | "instagram" | "youtube"; label: string; icon: IconName }[] = [
  { key: "facebook", label: "Facebook", icon: "facebook" },
  { key: "instagram", label: "Instagram", icon: "instagram" },
  { key: "youtube", label: "YouTube", icon: "youtube" },
];

export function SocialRow({ className = "soc-row" }: { className?: string }) {
  return (
    <div className={className}>
      {SOCIALS.map((s) => (
        <a key={s.key} href={site.social[s.key].url} target="_blank" rel="noopener" aria-label={s.label}><Icon name={s.icon} /></a>
      ))}
    </div>
  );
}


export function Footer({ lang }: { lang: Lang }) {
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);
  return (
    <footer>
      <div className="wrap top">
        <div>
          <h3>{t("व्यक्तित्व", "Personality")}</h3>
          <ul>
            {FOOTER_PERSONA.map((l) => (
              <li key={l.path}><Link href={href(lang, l.path)}><Icon name="chevRight" />{tr(l.label, lang)}</Link></li>
            ))}
          </ul>
          <SocialRow />
        </div>
        <div>
          <h3>{t("क्विक लिंक्स", "Quick Links")}</h3>
          <ul>
            {FOOTER_QUICK.map((l) => (
              <li key={l.path}><Link href={href(lang, l.path)}><Icon name="chevRight" />{tr(l.label, lang)}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{t("संपर्क करें", "Contact")}</h3>
          <p className="f-line"><Icon name="pin" />{tr(site.office, lang)}</p>
          {site.phones.map((p) => <p key={p} className="f-line"><Icon name="phone" /><a href={`tel:${p}`}>{phoneLabel(p)}</a></p>)}
          <p className="f-line"><Icon name="mail" /><a href={`mailto:${site.email}`}>{site.email}</a></p>
        </div>
      </div>
      <div className="bottom">
        <div className="wrap">Copyright © {new Date().getFullYear()} {tr(site.name, lang)}. {t("सर्वाधिकार सुरक्षित।", "All rights reserved.")}</div>
      </div>
    </footer>
  );
}

export type Crumb = { label: Bi; path?: string };

export function PageHero({ lang, crumbs, eyebrow, title, lead, meta, aside }: {
  lang: Lang;
  crumbs: Crumb[];
  eyebrow?: Bi;
  title: Bi;
  lead?: Bi;
  meta?: ReactNode;
  aside?: ReactNode;
}) {
  const all: Crumb[] = [{ label: { hi: "होम", en: "Home" }, path: "" }, ...crumbs];
  return (
    <div className="page-hero">
      <div className="wrap">
        <div className={`ph-grid${aside ? " has-aside" : ""}`}>
          <div className="ph-main">
            {eyebrow && <span className="eyebrow">{tr(eyebrow, lang)}</span>}
            <h1>{tr(title, lang)}</h1>
            {lead && <p className="lead">{tr(lead, lang)}</p>}
            {meta}
            <nav className="crumbs" aria-label={lang === "hi" ? "आप यहाँ हैं" : "Breadcrumb"}>
              {all.map((c, i) => (
                <span key={i} style={{ display: "contents" }}>
                  {i > 0 && <Icon name="chevRight" />}
                  {i < all.length - 1 && c.path !== undefined
                    ? <Link href={href(lang, c.path)}>{tr(c.label, lang)}</Link>
                    : <span aria-current="page">{tr(c.label, lang)}</span>}
                </span>
              ))}
            </nav>
          </div>
          {aside}
        </div>
      </div>
    </div>
  );
}
