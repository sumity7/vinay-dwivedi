/* Server-rendered cards shared across pages. */
import Link from "next/link";
import type { Article } from "@/lib/content/articles";
import { articleCats } from "@/lib/content/articles";
import type { EventPost } from "@/lib/content/events";
import { dateParts, href, tr, type Lang } from "@/lib/i18n";
import { Icon } from "./Icon";

export function EventCard({ e, lang, wide }: { e: EventPost; lang: Lang; wide?: boolean }) {
  const { d, month, y } = dateParts(e.date, lang);
  return (
    <Link className="ev-card" href={href(lang, `/updates/${e.slug}`)}>
      <time className="cal" dateTime={e.date.slice(0, 10)}><b>{d}</b><span>{month}</span><small>{y}</small></time>
      <div className="body">
        <div className="ev-meta">
          {e.featured && <span className="tag-pill">{lang === "hi" ? "विशेष" : "Featured"}</span>}
          <span className="tag">{tr(e.category, lang)}</span>
          {wide && <span>· {tr(e.place, lang)}</span>}
          <span className="count" title={lang === "hi" ? "फोटो" : "Photos"}><Icon name="images" />{e.photos.length}</span>
        </div>
        <h3>{tr(e.title, lang)}</h3>
        <p>{tr(e.summary, lang)}</p>
        <span className="link-arrow">{lang === "hi" ? "पूरा पढ़ें" : "Read More"} <Icon name="arrow" /></span>
      </div>
    </Link>
  );
}

export function ArticleCard({ a, lang }: { a: Article; lang: Lang }) {
  const cat = articleCats.find((c) => c.id === a.cat)!;
  return (
    <Link className="card art-card" href={href(lang, `/vichar/${a.slug}`)}>
      <div className={`art-cover cov-${a.icon}`}>
        <span className="cat">{tr(cat.label, lang)}</span>
        <Icon name={a.icon} className="big-ic" />
        {a.figure ? <><b>{tr(a.figure.value, lang)}</b><small>{tr(a.figure.label, lang)}</small></> : <Icon name={a.icon} className="cov-ic" />}
      </div>
      <div className="body">
        <span className="muted">{a.readMin} {lang === "hi" ? "मिनट में पढ़ें" : "min read"}</span>
        <h3>{tr(a.title, lang)}</h3>
        <p>{tr(a.summary, lang)}</p>
        <span className="link-arrow">{lang === "hi" ? "विस्तार से पढ़ें" : "Read about"} <Icon name="arrow" /></span>
      </div>
    </Link>
  );
}
