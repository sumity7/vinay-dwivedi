/* Footer, breadcrumbs/page hero and social links. Server components. */
import Link from "next/link";
import type { ReactNode } from "react";
import { href, tr, type Bi, type Lang } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Icon, type IconName } from "./Icon";
import { FOOTER_LINKS } from "./nav";

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
          <div className="brand">{tr(site.name, lang)}</div>
          <p style={{ margin: "0 0 14px", fontWeight: 600 }}>{tr(site.roleLong, lang)}</p>
          <p>{t("विधायक विनय कुमार द्विवेदी ‘मुन्ना भैया’ की आधिकारिक वेबसाइट।", "Official website of MLA Vinay Kumar Dwivedi ‘Munna Bhaiya’.")}</p>
        </div>
        <div>
          <h3>{t("महत्वपूर्ण लिंक", "Quick Links")}</h3>
          <ul>
            {FOOTER_LINKS.map((l) => (
              <li key={l.path}><Link href={href(lang, l.path)}><Icon name="chevRight" />{tr(l.label, lang)}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>{t("जुड़े रहें", "Stay Connected")}</h3>
          <SocialRow />
          <p style={{ margin: "0 0 6px" }}>{tr(site.office, lang)}</p>
          <p style={{ margin: 0 }}><a href={`mailto:${site.email}`} style={{ color: "#fff" }}>{site.email}</a></p>
        </div>
      </div>
      <div className="wrap bottom">
        <span>© {new Date().getFullYear()} {tr(site.name, lang)}. {t("सर्वाधिकार सुरक्षित।", "All rights reserved.")}</span>
        <span>{tr(site.area, lang)}</span>
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
        <div className={`grid${aside ? "" : " solo"}`}>
          <div>
            {eyebrow && <span className="eyebrow">{tr(eyebrow, lang)}</span>}
            <h1>{tr(title, lang)}</h1>
            {lead && <p className="lead">{tr(lead, lang)}</p>}
            {meta}
          </div>
          {aside}
        </div>
      </div>
    </div>
  );
}
