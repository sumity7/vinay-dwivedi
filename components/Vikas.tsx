/* Development figures: then/now comparison cards and single-figure cards. Server components. */
import type { Compare, Milestone, Single } from "@/lib/content/vikas";
import { fmtDate, tr, type Lang } from "@/lib/i18n";
import { Icon } from "./Icon";

export function CompareCard({ c, lang, i }: { c: Compare; lang: Lang; i: number }) {
  const ratio = c.now.value / c.then.value;
  const x = ratio >= 1.95 && ratio < 2.05 ? "2" : ratio.toFixed(1);
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);
  return (
    <div className="card cmp">
      <div className={`cmp-head h${i % 6}`}>
        <span className="round"><Icon name={c.icon} /></span>
        <span className="x">{t(`${x} गुना`, `${x}× more`)}</span>
        <h3>{tr(c.title, lang)}</h3>
      </div>
      <div className="cmp-body">
        <span className="when">{tr(c.now.when, lang)}</span>
        <span className="now">{tr(c.now.label, lang)}</span>
        <div className="bars" aria-hidden="true">
          <b style={{ fontWeight: 600 }}>{t("अब", "Now")}</b><span className="bar"><i style={{ width: "100%" }} /></span>
          <span className="muted">{t("तब", "Then")}</span><span className="bar then"><i style={{ width: `${Math.max(4, (c.then.value / c.now.value) * 100)}%` }} /></span>
        </div>
        <span className="then-txt">{tr(c.then.when, lang)}: <b>{tr(c.then.label, lang)}</b></span>
        {c.note && <span className="note">{tr(c.note, lang)}</span>}
        <span className="src">{tr(c.source, lang)}</span>
      </div>
    </div>
  );
}

export function SingleCard({ s, lang }: { s: Single; lang: Lang }) {
  return (
    <div className="card single">
      <span className="round"><Icon name={s.icon} /></span>
      <h3>{tr(s.title, lang)}</h3>
      <span className="muted" style={{ fontSize: 14 }}>{tr(s.when, lang)}</span>
      <b>{tr(s.value, lang)}</b>
      {s.note && <p style={{ margin: 0, fontSize: 15, color: "var(--ink-2)" }}>{tr(s.note, lang)}</p>}
      <div className="src">{tr(s.source, lang)}</div>
    </div>
  );
}

export function MilestoneList({ items, lang }: { items: Milestone[]; lang: Lang }) {
  return (
    <ol className="tl">
      {items.map((m) => (
        <li key={m.date}>
          <span className="step">{fmtDate(m.date, lang)}</span>
          <h3>{tr(m.title, lang)}</h3>
          <p>{tr(m.text, lang)}</p>
        </li>
      ))}
    </ol>
  );
}
