"use client";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type { Complaint } from "@/lib/complaints";
import { CATS, STATUSES, type Status } from "@/lib/utils";

type Row = Complaint & { photo_url?: string | null };
type Load = "ok" | "unauthorised" | "not_configured" | "error";

const API = "/api/admin/complaints";
const NOTE_MAX = 1000;
const statusLabel = (s: string) => STATUSES.find((x) => x[0] === s)?.[2] ?? s;
const catName = (c: string) => CATS.find((x) => x[0] === c)?.[2] ?? c;
const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-");
/* open complaints first when sorting by "pending": received, review, action, resolved */
const rank = (s: string) => STATUSES.findIndex((x) => x[0] === s);

export function AdminDashboard({ enabled }: { enabled: boolean }) {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = still checking
  const [rows, setRows] = useState<Row[]>([]);
  const [problem, setProblem] = useState<"" | "not_configured" | "error">("");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (): Promise<Load> => {
    try {
      const res = await fetch(API, { cache: "no-store" });
      if (res.status === 401) return "unauthorised";
      if (res.status === 503) return "not_configured";
      if (!res.ok) return "error";
      const data = (await res.json()) as { complaints: Row[] };
      setRows(data.complaints);
      return "ok";
    } catch {
      return "error";
    }
  }, []);

  const apply = useCallback((r: Load) => {
    setAuthed(r !== "unauthorised");
    setProblem(r === "not_configured" || r === "error" ? r : "");
  }, []);

  useEffect(() => {
    let live = true;
    load().then((r) => { if (live) apply(r); });
    return () => { live = false; };
  }, [load, apply]);

  const refresh = async () => { setRefreshing(true); apply(await load()); setRefreshing(false); };
  const logout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => {});
    setRows([]);
    setAuthed(false);
  };
  const onSaved = (c: Row) => setRows((all) => all.map((r) => (r.complaint_id === c.complaint_id ? { ...r, ...c } : r)));

  if (authed === null) return <main className="adm-center"><p className="muted" role="status">Checking sign-in…</p></main>;
  if (!authed) return <Login enabled={enabled} onDone={async () => { setAuthed(null); apply(await load()); }} />;

  return (
    <main className="adm">
      <div className="wrap">
        <header className="adm-top">
          <div>
            <span className="eyebrow">Admin</span>
            <h1 className="adm-title">Complaints</h1>
          </div>
          <div className="adm-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={refresh} disabled={refreshing}>{refreshing ? "Refreshing…" : "Refresh"}</button>
            <button type="button" className="btn btn-outline btn-sm" onClick={logout}>Log out</button>
          </div>
        </header>
        {problem === "not_configured" && (
          <p className="adm-note" role="alert">Complaints are not connected yet: set <b>NEXT_PUBLIC_SUPABASE_URL</b> and <b>SUPABASE_SERVICE_ROLE_KEY</b> on the server, then redeploy.</p>
        )}
        {problem === "error" && <p className="adm-note" role="alert">Could not load the complaints. Check your connection and press Refresh.</p>}
        {!problem && <ComplaintList rows={rows} onSaved={onSaved} />}
      </div>
    </main>
  );
}

function Login({ enabled, onDone }: { enabled: boolean; onDone: () => void }) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
      if (res.ok) { setPw(""); onDone(); return; }
      setErr(res.status === 401 ? "Wrong password." : res.status === 429 ? "Too many attempts. Try again in 15 minutes." : res.status === 503 ? "Admin is not configured on this server." : "Something went wrong. Please try again.");
    } catch {
      setErr("Could not reach the server. Check your connection.");
    }
    setBusy(false);
  };

  return (
    <main className="adm-center">
      <form className="card form-card adm-login" onSubmit={submit}>
        <span className="eyebrow">Admin</span>
        <h1 className="adm-title">Sign in</h1>
        {!enabled ? (
          <p className="adm-note" role="alert">Admin is switched off. Set <b>ADMIN_PASSWORD</b> (at least 6 characters) on the server to turn it on.</p>
        ) : (
          <>
            <div className={`field${err ? " invalid" : ""}`}>
              <label htmlFor="adm-pw">Password</label>
              <input id="adm-pw" type="password" autoComplete="current-password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} autoFocus required />
              <div className="err" role="alert">{err}</div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={busy || !pw.trim()}>{busy ? "Signing in…" : "Sign in"}</button>
          </>
        )}
      </form>
    </main>
  );
}

function ComplaintList({ rows, onSaved }: { rows: Row[]; onSaved: (c: Row) => void }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [cat, setCat] = useState("");
  const [days, setDays] = useState(0); // 0 = all time
  const [sort, setSort] = useState<"new" | "old" | "pending">("new");
  const [open, setOpen] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const since = days ? Date.now() - days * 86_400_000 : 0;
    const time = (r: Row) => (r.created_at ? Date.parse(r.created_at) : 0);
    const list = rows.filter((r) =>
      (!status || r.status === status) &&
      (!cat || r.category === cat) &&
      time(r) >= since &&
      (!needle || [r.complaint_id, r.name, r.mobile, r.village, r.subject, r.description].some((f) => f.toLowerCase().includes(needle))),
    );
    return list.sort((a, b) =>
      sort === "old" ? time(a) - time(b)
      : sort === "pending" ? rank(a.status) - rank(b.status) || time(b) - time(a)
      : time(b) - time(a));
  }, [rows, q, status, cat, days, sort]);

  return (
    <>
      <div className="adm-stats">
        <button type="button" className={`adm-stat${status === "" ? " on" : ""}`} onClick={() => setStatus("")}><b>{rows.length}</b><span>All</span></button>
        {STATUSES.map(([k, , en]) => (
          <button key={k} type="button" className={`adm-stat${status === k ? " on" : ""}`} onClick={() => setStatus(status === k ? "" : k)}><b>{counts[k] ?? 0}</b><span>{en}</span></button>
        ))}
      </div>

      <div className="adm-filters card">
        <div className="field adm-search">
          <label htmlFor="adm-q">Search</label>
          <input id="adm-q" type="search" placeholder="Ticket, name, mobile, village, subject…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="adm-cat">Category</label>
          <select id="adm-cat" value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All categories</option>
            {CATS.map(([k, , en]) => <option key={k} value={k}>{en}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="adm-days">Date</label>
          <select id="adm-days" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={0}>All time</option>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="adm-sort">Sort</label>
          <select id="adm-sort" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="new">Newest first</option>
            <option value="old">Oldest first</option>
            <option value="pending">Pending first</option>
          </select>
        </div>
      </div>

      <p className="muted adm-count" role="status">Showing {shown.length} of {rows.length}</p>

      {shown.length === 0 ? (
        <p className="card adm-empty">{rows.length ? "No complaints match these filters." : "No complaints yet."}</p>
      ) : (
        <ul className="adm-list">
          {shown.map((r) => (
            <ComplaintRow key={r.complaint_id} r={r} open={open === r.complaint_id} onToggle={() => setOpen(open === r.complaint_id ? null : r.complaint_id)} onSaved={onSaved} />
          ))}
        </ul>
      )}
    </>
  );
}

function ComplaintRow({ r, open, onToggle, onSaved }: { r: Row; open: boolean; onToggle: () => void; onSaved: (c: Row) => void }) {
  const [status, setStatus] = useState<Status>(r.status);
  const [note, setNote] = useState(r.office_note ?? "");
  const [save, setSave] = useState<"idle" | "saving" | "saved" | "failed" | "expired">("idle");
  const dirty = status !== r.status || note.trim() !== (r.office_note ?? "");

  const submit = async () => {
    setSave("saving");
    try {
      const res = await fetch(API, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ complaint_id: r.complaint_id, status, office_note: note }) });
      if (res.status === 401) { setSave("expired"); return; }
      if (!res.ok) { setSave("failed"); return; }
      const { complaint } = (await res.json()) as { complaint: Row };
      onSaved(complaint);
      setNote(complaint.office_note ?? "");
      setSave("saved");
    } catch {
      setSave("failed");
    }
  };

  const panel = `adm-panel-${r.complaint_id}`;
  return (
    <li className={`card adm-row${open ? " open" : ""}`}>
      <button type="button" className="adm-head" aria-expanded={open} aria-controls={panel} onClick={onToggle}>
        <span className="adm-id">{r.complaint_id}</span>
        <span className="adm-sub"><b>{r.subject}</b><span className="muted">{r.name} · {r.village} · {catName(r.category)}</span></span>
        <span className="adm-when muted">{fmtDate(r.created_at)}</span>
        <span className={`adm-badge s-${r.status}`}>{statusLabel(r.status)}</span>
      </button>
      {open && (
        <div className="adm-body" id={panel}>
          <dl className="adm-meta">
            <div><dt>Mobile</dt><dd><a href={`tel:+91${r.mobile}`}>{r.mobile}</a></dd></div>
            <div><dt>Village</dt><dd>{r.village}</dd></div>
            <div><dt>Category</dt><dd>{catName(r.category)}</dd></div>
            <div><dt>Filed</dt><dd>{fmtDate(r.created_at)}</dd></div>
            {r.rating ? <div><dt>Citizen rating</dt><dd>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</dd></div> : null}
          </dl>
          <p className="adm-desc">{r.description}</p>
          {r.photo_url && <a className="link-arrow" href={r.photo_url} target="_blank" rel="noopener noreferrer">View photo</a>}

          <div className="adm-edit">
            <div className="field">
              <label htmlFor={`st-${r.complaint_id}`}>Status</label>
              <select id={`st-${r.complaint_id}`} value={status} onChange={(e) => { setStatus(e.target.value as Status); setSave("idle"); }}>
                {STATUSES.map(([k, , en]) => <option key={k} value={k}>{en}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor={`nt-${r.complaint_id}`}>Reply / note shown to the citizen</label>
              <textarea id={`nt-${r.complaint_id}`} value={note} maxLength={NOTE_MAX} onChange={(e) => { setNote(e.target.value); setSave("idle"); }} />
              <div className="hint">{note.length}/{NOTE_MAX}</div>
            </div>
            <div className="adm-save">
              <button type="button" className="btn btn-primary btn-sm" onClick={submit} disabled={save === "saving" || !dirty}>{save === "saving" ? "Saving…" : "Save"}</button>
              <span role="status" className={`adm-state ${save}`}>
                {save === "saved" ? "Saved" : save === "failed" ? "Could not save. Try again." : save === "expired" ? "Session expired. Refresh the page and sign in again." : ""}
              </span>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
