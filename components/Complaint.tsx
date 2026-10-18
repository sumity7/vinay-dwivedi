"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { findComplaint, isDemoMode, loadCounts, saveComplaint, sendFeedback, type Complaint, type ComplaintStatus, type Counts } from "@/lib/complaints";
import { href } from "@/lib/i18n";
import { site } from "@/lib/site";
import { absUrl, CATS, catLabel, digitsOnly, newTicket, prefersReducedMotion, STATUSES, TICKET_RE, validMobile, waLink, type Category } from "@/lib/utils";
import { Field, useValidation } from "./forms";
import { Icon } from "./Icon";
import { useSite } from "./SiteProvider";

const EMPTY = { name: "", mobile: "", village: "", cat: "" as Category | "", subject: "", desc: "", consent: false };

export function ComplaintForm() {
  const { lang, t, pick, toast } = useSite();
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<Complaint | null>(null);
  const { invalid, validate, clear, reset } = useValidation<"name" | "mobile" | "village" | "cat" | "subject" | "desc" | "consent">();

  const set = <K extends keyof typeof EMPTY>(k: K, val: (typeof EMPTY)[K]) => { setV((s) => ({ ...s, [k]: val })); clear(k); };

  useEffect(() => {
    if (receipt) receiptRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
  }, [receipt]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const ok = validate({
      name: v.name.trim().length > 1,
      mobile: validMobile(v.mobile.trim()),
      village: v.village.trim().length > 1,
      cat: !!v.cat,
      subject: v.subject.trim().length > 4,
      desc: v.desc.trim().length >= 15,
      consent: v.consent,
    }, formRef.current);
    if (!ok || !v.cat) return;
    const file = fileRef.current?.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) { toast(t("फोटो 5 MB से छोटी होनी चाहिए।", "Photo must be under 5 MB.")); return; }
    setBusy(true);
    const c: Complaint = {
      complaint_id: newTicket(), name: v.name.trim(), mobile: v.mobile.trim(), village: v.village.trim(),
      category: v.cat, subject: v.subject.trim(), description: v.desc.trim(), status: "received",
    };
    try { await saveComplaint(c, file); setReceipt(c); }
    catch (err) { console.error(err); toast(t("शिकायत दर्ज नहीं हो सकी। इंटरनेट जाँचें और दोबारा प्रयास करें।", "Couldn't submit. Check your internet and try again.")); }
    finally { setBusy(false); }
  };

  const startNew = () => {
    setV(EMPTY); reset(); setReceipt(null);
    if (fileRef.current) fileRef.current.value = "";
    setTimeout(() => document.getElementById("c-name")?.focus());
  };

  const copy = async () => {
    if (!receipt) return;
    try { await navigator.clipboard.writeText(receipt.complaint_id); toast(t("टिकट संख्या कॉपी हो गई", "Ticket number copied")); }
    catch { toast(receipt.complaint_id); }
  };

  if (receipt) {
    const cat = pick(catLabel(receipt.category));
    const trackUrl = absUrl(href(lang, "/e-shikayat/track"));
    return (
      <div ref={receiptRef} className="card form-card receipt" aria-live="polite">
        <div className="ok-mark"><Icon name="check" /></div>
        <h2 style={{ fontSize: 32 }}>{t("शिकायत दर्ज हो गई", "Complaint registered")}</h2>
        <p style={{ margin: "10px 0 0" }}>{t("आपकी टिकट संख्या:", "Your ticket number:")}</p>
        <div className="ticket">{receipt.complaint_id}</div>
        <p className="muted">{cat} · {receipt.village} · {receipt.subject}</p>
        <p>{t("इस संख्या को संभालकर रखें। स्थिति देखने के लिए यही संख्या और अपने मोबाइल के अंतिम 4 अंक डालें।", "Keep this number safe. To check the status, enter it with the last 4 digits of your mobile.")}</p>
        {isDemoMode() && <p className="hint">{t("डेमो मोड: अभी शिकायत केवल इसी फोन/ब्राउज़र में सहेजी गई है।", "Demo mode: for now the complaint is saved only on this phone/browser.")}</p>}
        <div className="hero-actions" style={{ marginTop: 18 }}>
          <button className="btn btn-primary" type="button" onClick={copy}><Icon name="copy" />{t("संख्या कॉपी करें", "Copy number")}</button>
          <a className="btn btn-ghost" target="_blank" rel="noopener" href={waLink(t(
            `मेरी शिकायत संख्या ${receipt.complaint_id} है (${cat}, ${receipt.village})। स्थिति यहाँ देखें: ${trackUrl}`,
            `My complaint number is ${receipt.complaint_id} (${cat}, ${receipt.village}). Check the status here: ${trackUrl}`))}>
            <Icon name="whatsapp" />{t("WhatsApp पर सहेजें", "Save on WhatsApp")}
          </a>
          <button className="btn btn-ghost" type="button" onClick={startNew}>{t("नई शिकायत", "File another")}</button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={submit}>
      <div className="form-grid">
        <Field id="c-name" label={t("पूरा नाम", "Full name")} req invalid={invalid.name} err={t("नाम दर्ज करें।", "Enter your name.")}>
          <input id="c-name" autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field id="c-mobile" label={t("मोबाइल नंबर", "Mobile number")} req invalid={invalid.mobile}
          hint={t("10 अंक। केवल इस शिकायत के संबंध में संपर्क के लिए।", "10 digits. Used only to contact you about this complaint.")}
          err={t("10 अंकों का मोबाइल नंबर दर्ज करें।", "Enter a 10-digit mobile number.")}>
          <input id="c-mobile" inputMode="numeric" autoComplete="tel" maxLength={10} value={v.mobile} onChange={(e) => set("mobile", digitsOnly(e.target.value))} />
        </Field>
        <Field id="c-village" full label={t("गाँव / ग्राम पंचायत / वार्ड", "Village / Gram Panchayat / Ward")} req invalid={invalid.village} err={t("गाँव या वार्ड दर्ज करें।", "Enter your village or ward.")}>
          <input id="c-village" value={v.village} onChange={(e) => set("village", e.target.value)} />
        </Field>
        <Field full invalid={invalid.cat} err={t("समस्या का प्रकार चुनें।", "Choose the type of problem.")}>
          <span className="label">{t("समस्या का प्रकार", "Type of problem")} <span className="req">*</span></span>
          <div className="pick" role="radiogroup">
            {CATS.map(([k, hi, en]) => (
              <label key={k}><input type="radio" name="cat" value={k} checked={v.cat === k} onChange={() => set("cat", k)} /><span>{t(hi, en)}</span></label>
            ))}
          </div>
        </Field>
        <Field id="c-subject" full label={t("एक पंक्ति में विषय", "Subject in one line")} req invalid={invalid.subject} err={t("विषय एक पंक्ति में लिखें।", "Write the subject in one line.")}>
          <input id="c-subject" maxLength={120} placeholder={t("जैसे: प्राथमिक विद्यालय के पास हैंडपंप खराब", "e.g. Handpump not working near the primary school")} value={v.subject} onChange={(e) => set("subject", e.target.value)} />
        </Field>
        <Field id="c-desc" full label={t("समस्या का विवरण", "Describe the problem")} req invalid={invalid.desc} err={t("समस्या कम से कम 15 अक्षरों में लिखें।", "Describe the problem in at least 15 characters.")}>
          <textarea id="c-desc" maxLength={1500} placeholder={t("कहाँ है, कब से है, किस पर असर पड़ रहा है। पहले की कोई शिकायत संख्या हो तो लिखें।", "Where exactly, since when, and whom it affects. Mention any earlier complaint number.")} value={v.desc} onChange={(e) => set("desc", e.target.value)} />
        </Field>
        <Field id="c-photo" full label={t("फोटो (वैकल्पिक)", "Photo (optional)")} hint={t("स्थल की फोटो से कार्यवाही जल्दी होती है। अधिकतम 5 MB।", "A photo of the site helps the office act faster. Up to 5 MB.")}>
          <input ref={fileRef} id="c-photo" type="file" accept="image/*" />
        </Field>
        <Field full invalid={invalid.consent} err={t("आगे बढ़ने के लिए सहमति दें।", "Tick the box to continue.")}>
          <label className="check">
            <input type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} />
            <span>{t("मैं सहमत हूँ कि विधायक कार्यालय मेरे नाम और मोबाइल नंबर का उपयोग केवल इस शिकायत पर कार्यवाही और जवाब देने के लिए करे।", "I agree that my name and mobile number may be used by the MLA’s office only to act on and respond to this complaint.")}</span>
          </label>
        </Field>
        <div className="full">
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? t("दर्ज हो रही है…", "Submitting…") : t("शिकायत दर्ज करें", "Register complaint")}</button>
        </div>
      </div>
    </form>
  );
}

export function ComplaintCounts() {
  const { t } = useSite();
  const [c, setC] = useState<Counts | null>(null);
  useEffect(() => { loadCounts().then(setC).catch(() => setC(null)); }, []);
  if (!c) return null;
  return (
    <div className="dash">
      <div><b>{c.total.toLocaleString("en-IN")}</b><span>{t("प्राप्त", "Received")}</span></div>
      <div className="ok"><b>{c.resolved.toLocaleString("en-IN")}</b><span>{t("निस्तारित", "Resolved")}</span></div>
      <div className="pend"><b>{(c.total - c.resolved).toLocaleString("en-IN")}</b><span>{t("प्रक्रिया में", "In progress")}</span></div>
    </div>
  );
}

type TrackResult = { kind: "idle" | "searching" | "notfound" | "error" } | { kind: "found"; id: string; last4: string; c: ComplaintStatus };

export function TrackForm() {
  const { t, toast } = useSite();
  const params = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [id, setId] = useState(params.get("ticket") ?? "");
  const [last4, setLast4] = useState("");
  const [res, setRes] = useState<TrackResult>({ kind: "idle" });
  const { invalid, validate, clear } = useValidation<"id" | "last4">();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const cid = id.trim().toUpperCase(), l4 = last4.trim();
    if (!validate({ id: TICKET_RE.test(cid), last4: /^\d{4}$/.test(l4) }, formRef.current)) return;
    setRes({ kind: "searching" });
    try {
      const c = await findComplaint(cid, l4);
      setRes(c ? { kind: "found", id: cid, last4: l4, c } : { kind: "notfound" });
    } catch (err) { console.error(err); setRes({ kind: "error" }); }
  };

  const rate = async (n: number) => {
    if (res.kind !== "found") return;
    try { await sendFeedback(res.id, res.last4, n); setRes({ ...res, c: { ...res.c, rating: n } }); }
    catch { toast(t("प्रतिक्रिया नहीं भेजी जा सकी।", "Couldn't send feedback.")); }
  };

  return (
    <div className="card track-card">
      <form ref={formRef} noValidate onSubmit={submit} style={{ display: "grid", gap: 18 }}>
        <Field id="t-id" label={t("टिकट संख्या", "Ticket number")} invalid={invalid.id} err={t("शिकायत दर्ज करते समय मिली संख्या डालें, जैसे MHN-2610-48213।", "Enter the number you received, e.g. MHN-2610-48213.")}>
          <input id="t-id" placeholder="MHN-2610-XXXXX" autoComplete="off" style={{ textTransform: "uppercase", fontFamily: "ui-monospace, monospace" }} value={id} onChange={(e) => { setId(e.target.value); clear("id"); }} />
        </Field>
        <Field id="t-last4" label={t("मोबाइल नंबर के अंतिम 4 अंक", "Last 4 digits of mobile")} invalid={invalid.last4} err={t("4 अंक डालें।", "Enter 4 digits.")}>
          <input id="t-last4" inputMode="numeric" maxLength={4} value={last4} onChange={(e) => { setLast4(digitsOnly(e.target.value)); clear("last4"); }} />
        </Field>
        <button className="btn btn-primary btn-block" type="submit"><Icon name="search" />{t("स्थिति देखें", "Check status")}</button>
      </form>
      {res.kind !== "idle" && (
        <div className="result" aria-live="polite">
          {res.kind === "searching" && t("खोज रहे हैं…", "Searching…")}
          {res.kind === "error" && t("स्थिति नहीं मिल सकी। बाद में प्रयास करें।", "Couldn't load the status. Try again later.")}
          {res.kind === "notfound" && <><b>{t("शिकायत नहीं मिली।", "No complaint found.")}</b><p style={{ margin: "6px 0 0" }}>{t("टिकट संख्या और मोबाइल के अंतिम 4 अंक दोबारा जाँचें।", "Check the ticket number and the last 4 digits of the mobile.")}</p></>}
          {res.kind === "found" && <StatusView id={res.id} c={res.c} onRate={rate} />}
        </div>
      )}
    </div>
  );
}

function StatusView({ id, c, onRate }: { id: string; c: ComplaintStatus; onRate: (n: number) => void }) {
  const { t, pick } = useSite();
  const idx = Math.max(0, STATUSES.findIndex((s) => s[0] === c.status));
  const days = c.created_at ? Math.floor((Date.now() - new Date(c.created_at).getTime()) / 864e5) : 0;
  const resolved = c.status === "resolved";
  const late = days >= 7;
  const r = c.rating || 0;
  const cat = pick(catLabel(c.category));
  return (
    <>
      <b className="serif" style={{ fontSize: 24, fontWeight: 400 }}>{id}</b>
      <p className="muted" style={{ margin: "2px 0 0" }}>{cat} · {c.village}{c.subject ? ` · ${c.subject}` : ""}</p>
      <div className="status-track">{STATUSES.map((s, i) => <div key={s[0]} className={i <= idx ? "done" : ""}>{t(s[1], s[2])}</div>)}</div>
      {c.office_note && <p style={{ margin: "12px 0 0" }}><b>{t("कार्यालय की टिप्पणी:", "Office note:")}</b> {c.office_note}</p>}
      {!resolved ? (
        <>
          <p style={{ margin: "12px 0 0", fontSize: 15 }}>
            {late ? t(`शिकायत ${days} दिन से लंबित है। आप कार्यालय को स्मरण भेज सकते हैं।`, `Pending for ${days} days. You can send the office a reminder.`)
              : t("कार्यालय 7 दिन में कार्यवाही का प्रयास करता है। उसके बाद आप स्मरण भेज सकते हैं।", "The office aims to act within 7 days. After that you can send a reminder.")}
          </p>
          {late && <a className="btn btn-primary btn-sm" style={{ marginTop: 12 }} target="_blank" rel="noopener"
            href={waLink(`स्मरण / Reminder: शिकायत संख्या ${id} (${cat}, ${c.village}): ${days} दिन से लंबित।`, site.officeWhatsApp)}>{t("स्मरण भेजें", "Send reminder")}</a>}
        </>
      ) : (
        <>
          <p style={{ margin: "14px 0 0", fontWeight: 600 }}>{r ? t("आपकी प्रतिक्रिया के लिए धन्यवाद।", "Thanks for your feedback.") : t("समाधान से आप कितने संतुष्ट हैं?", "How satisfied are you with the resolution?")}</p>
          <div className="stars" role="group" aria-label={t("रेटिंग", "Rating")}>
            {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" className={n <= r ? "on" : ""} aria-label={String(n)} disabled={!!r} onClick={() => onRate(n)}>★</button>)}
          </div>
        </>
      )}
    </>
  );
}

