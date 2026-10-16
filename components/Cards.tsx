/* Server-rendered cards shared across pages (events and articles). */
import Image from "next/image";
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
      <div className="ev-img">
        <Image src={e.photos[0].img} alt="" placeholder="blur" sizes="(max-width: 760px) 100vw, 400px" />
        <span className="count" title={lang === "hi" ? "फोटो" : "Photos"}><Icon name="images" />{e.photos.length}</span>
      </div>
      <div className="body">
        <div className="ev-meta">
          {e.featured && <span className="tag-pill">{lang === "hi" ? "विशेष" : "Featured"}</span>}
          <span className="tag">{tr(e.category, lang)}</span>
          <time dateTime={e.date.slice(0, 10)}>{d} {month} {y}</time>
          {wide && <span>· {tr(e.place, lang)}</span>}
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
    <Link className="ev-card art-card" href={href(lang, `/vichar/${a.slug}`)}>
      <div className="art-cover">
        {a.figure ? <><b>{tr(a.figure.value, lang)}</b><small>{tr(a.figure.label, lang)}</small></> : <Icon name={a.icon} className="cov-ic" />}
      </div>
      <div className="body">
        <div className="ev-meta"><span className="tag">{tr(cat.label, lang)}</span><span>{a.readMin} {lang === "hi" ? "मिनट में पढ़ें" : "min read"}</span></div>
        <h3>{tr(a.title, lang)}</h3>
        <p>{tr(a.summary, lang)}</p>
        <span className="link-arrow">{lang === "hi" ? "विस्तार से पढ़ें" : "Read about"} <Icon name="arrow" /></span>
      </div>
    </Link>
  );
}
