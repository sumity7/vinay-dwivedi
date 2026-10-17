"use client";
import { useRef, useState, type FormEvent } from "react";
import { digitsOnly, openWa, validMobile } from "@/lib/utils";
import { Field, useValidation } from "./forms";
import { Icon } from "./Icon";
import { useSite } from "./SiteProvider";

const TYPES = [
  ["general", "सामान्य जानकारी", "General enquiry"],
  ["meeting", "मुलाकात का अनुरोध", "Meeting request"],
  ["programme", "कार्यक्रम में आमंत्रण", "Invitation to a programme"],
  ["volunteer", "अभियान से जुड़ें (स्वयंसेवक)", "Join as a volunteer"],
  ["suggestion", "सुझाव", "Suggestion"],
  ["media", "मीडिया", "Media"],
  ["other", "अन्य", "Other"],
] as const;

const EMPTY = { name: "", mobile: "", village: "", type: "general", date: "", subject: "", message: "", website: "" };

export function ContactForm() {
  const { t } = useSite();
  const formRef = useRef<HTMLFormElement>(null);
  const [v, setV] = useState(EMPTY);
  const [done, setDone] = useState<"" | "sent" | "wa" | "error" | "limit">("");
  const [busy, setBusy] = useState(false);
  const { invalid, validate, clear } = useValidation<"name" | "mobile" | "subject" | "message">();
  const set = (k: keyof typeof EMPTY, val: string) => {
    setV((s) => ({ ...s, [k]: val }));
    if (k === "name" || k === "mobile" || k === "subject" || k === "message") clear(k);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!validate({
      name: v.name.trim().length > 1,
      mobile: validMobile(v.mobile.trim()),
      subject: v.subject.trim().length > 2,
      message: v.message.trim().length > 9,
    }, formRef.current)) return;
    /* the office gets the enquiry by e-mail; if e-mail is not switched on, it falls back to a ready WhatsApp message */
    setBusy(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) });
      if (res.ok) { setV(EMPTY); setDone("sent"); return; }
      if (res.status === 429) { setDone("limit"); return; }
      if (res.status !== 503) { setDone("error"); return; }
    } catch { setDone("error"); return; } finally { setBusy(false); }
    const type = TYPES.find((x) => x[0] === v.type)!;
    openWa([
      `${type[1]} / ${type[2]}`,
      `नाम / Name: ${v.name.trim()}`,
      `मोबाइल / Mobile: ${v.mobile.trim()}`,
      `गाँव / Village: ${v.village.trim() || "-"}`,
      ...(v.type === "meeting" ? [`पसंदीदा तिथि / Preferred date: ${v.date || "-"}`] : []),
      `विषय / Subject: ${v.subject.trim()}`,
      "",
      v.message.trim(),
    ].join("\n"));
    setDone("wa");
  };

  return (
    <form ref={formRef} className="card form-card" noValidate onSubmit={submit}>
      <div className="form-grid">
        <Field id="f-name" label={t("पूरा नाम", "Full name")} req invalid={invalid.name} err={t("नाम दर्ज करें।", "Enter your name.")}>
          <input id="f-name" autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field id="f-mobile" label={t("मोबाइल नंबर", "Mobile number")} req invalid={invalid.mobile} err={t("10 अंकों का मोबाइल नंबर दर्ज करें।", "Enter a 10-digit mobile number.")}>
          <input id="f-mobile" inputMode="numeric" autoComplete="tel" maxLength={10} value={v.mobile} onChange={(e) => set("mobile", digitsOnly(e.target.value))} />
        </Field>
        <Field id="f-village" label={t("गाँव / वार्ड (वैकल्पिक)", "Village / ward (optional)")}>
          <input id="f-village" value={v.village} onChange={(e) => set("village", e.target.value)} />
        </Field>
        <Field id="f-type" label={t("विषय का प्रकार", "Enquiry type")}>
          <select id="f-type" value={v.type} onChange={(e) => set("type", e.target.value)}>
            {TYPES.map(([k, hi, en]) => <option key={k} value={k}>{t(hi, en)}</option>)}
          </select>
        </Field>
        {v.type === "meeting" && (
          <Field id="f-date" full label={t("पसंदीदा तिथि", "Preferred date")} hint={t("कार्यालय आपके मोबाइल पर समय की पुष्टि करेगा।", "The office will confirm a time on your mobile.")}>
            <input id="f-date" type="date" value={v.date} onChange={(e) => set("date", e.target.value)} />
          </Field>
        )}
        <Field id="f-subject" full label={t("विषय", "Subject")} req invalid={invalid.subject} err={t("विषय लिखें।", "Add a subject.")}>
          <input id="f-subject" value={v.subject} onChange={(e) => set("subject", e.target.value)} />
        </Field>
        <Field id="f-msg" full label={t("संदेश", "Message")} req invalid={invalid.message} err={t("कम से कम एक पंक्ति लिखें।", "Write at least a line.")}>
          <textarea id="f-msg" value={v.message} onChange={(e) => set("message", e.target.value)} />
        </Field>
        {/* hidden trap for bots: people never see or fill this */}
        <input className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={v.website} onChange={(e) => set("website", e.target.value)} />
        <div className="full">
          <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? t("भेज रहे हैं…", "Sending…") : t("संदेश भेजें", "Send message")} <Icon name="arrow" /></button>
          <p className="hint" style={{ marginTop: 10 }}>{t("आपका संदेश सीधे विधायक कार्यालय को ईमेल से पहुँचेगा।", "Your message goes straight to the MLA’s office by e-mail.")}</p>
        </div>
      </div>
      {done === "sent" && <div className="done-msg" role="status">{t("धन्यवाद! आपका संदेश विधायक कार्यालय को भेज दिया गया है। कार्यालय आपके मोबाइल पर संपर्क करेगा।", "Thank you! Your message has been sent to the MLA’s office. They will contact you on your mobile.")}</div>}
      {done === "wa" && <div className="done-msg" role="status">{t("आपका संदेश WhatsApp में खुल गया है। भेजने के लिए वहाँ Send दबाएं।", "Your message opened in WhatsApp. Press send there to finish.")}</div>}
      {done === "limit" && <div className="err" role="alert">{t("आपने कई संदेश भेज दिए हैं। कृपया कुछ मिनट बाद प्रयास करें।", "You have sent several messages. Please try again in a few minutes.")}</div>}
      {done === "error" && <div className="err" role="alert">{t("संदेश नहीं जा सका। कृपया दोबारा प्रयास करें या फ़ोन/WhatsApp से संपर्क करें।", "The message could not be sent. Please try again, or call or WhatsApp the office.")}</div>}
    </form>
  );
}
