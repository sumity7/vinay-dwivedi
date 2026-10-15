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

const EMPTY = { name: "", mobile: "", village: "", type: "general", date: "", subject: "", message: "" };

export function ContactForm() {
  const { t } = useSite();
  const formRef = useRef<HTMLFormElement>(null);
  const [v, setV] = useState(EMPTY);
  const [done, setDone] = useState(false);
  const { invalid, validate, clear } = useValidation<"name" | "mobile" | "subject" | "message">();
  const set = (k: keyof typeof EMPTY, val: string) => {
    setV((s) => ({ ...s, [k]: val }));
    if (k === "name" || k === "mobile" || k === "subject" || k === "message") clear(k);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate({
      name: v.name.trim().length > 1,
      mobile: validMobile(v.mobile.trim()),
      subject: v.subject.trim().length > 2,
      message: v.message.trim().length > 9,
    }, formRef.current)) return;
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
    setDone(true);
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
        <div className="full">
          <button className="btn btn-primary" type="submit">{t("WhatsApp पर भेजें", "Send on WhatsApp")} <Icon name="arrow" /></button>
          <p className="hint" style={{ marginTop: 10 }}>{t("आपका संदेश WhatsApp में खुलेगा, विधायक कार्यालय को भेजने के लिए तैयार।", "Your message opens in WhatsApp, ready to send to the MLA’s office.")}</p>
        </div>
      </div>
      {done && <div className="done-msg">{t("आपका संदेश WhatsApp में खुल गया है। भेजने के लिए वहाँ Send दबाएं।", "Your message opened in WhatsApp. Press send there to finish.")}</div>}
    </form>
  );
}
