"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "./Icon";
import { useSite } from "./SiteProvider";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGEST = {
  hi: ["विनय कुमार द्विवेदी कौन हैं?", "उनकी विधानसभा कौन-सी है?", "विकास के लिए क्या काम हुए?", "‘मुन्ना भैया’ नाम से क्यों जाने जाते हैं?", "शिकायत कैसे दर्ज करें?", "आयुष्मान कार्ड कैसे बनेगा?"],
  en: ["Who is Vinay Kumar Dwivedi?", "Which assembly does he represent?", "What development work has been done?", "Why is he called ‘Munna Bhaiya’?", "How do I register a complaint?", "How do I get an Ayushman card?"],
};

/* Turn "/hi/e-shikayat" style paths in answers into links. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\/(?:hi|en)(?:\/[\w-]+)*)/g);
  return <>{parts.map((p, i) => (/^\/(hi|en)(\/[\w-]+)*$/.test(p) ? <Link key={i} href={p}>{p}</Link> : p))}</>;
}

export function Assistant() {
  const { lang, t, assistantOpen: open, setAssistantOpen: setOpen } = useSite();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight }); }, [msgs]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [open, setOpen]);

  async function ask(q: string) {
    q = q.trim();
    if (!q || busy) return;
    const asked: Msg = { role: "user", content: q };
    const history = [...msgs, asked].slice(-11);
    if (history[0].role !== "user") history.shift();
    setMsgs([...msgs, asked, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    const setAnswer = (s: string) => setMsgs((m): Msg[] => [...m.slice(0, -1), { role: "assistant", content: s }]);
    try {
      const res = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history, lang }) });
      if (!res.ok || !res.body) {
        const code = res.status === 503 ? "nc" : res.status === 429 ? "rl" : "err";
        setAnswer(code === "nc"
          ? t("सहायक अभी चालू नहीं है। आप शिकायत /hi/e-shikayat पर दर्ज कर सकते हैं या /hi/contact से कार्यालय से संपर्क कर सकते हैं।", "The assistant isn’t switched on yet. You can register a complaint at /en/e-shikayat or reach the office at /en/contact.")
          : code === "rl" ? t("आपने बहुत सारे प्रश्न पूछे हैं। कृपया कुछ मिनट बाद प्रयास करें।", "You’ve asked a lot of questions. Please try again in a few minutes.")
          : t("कुछ गड़बड़ हो गई। कृपया दोबारा प्रयास करें।", "Something went wrong. Please try again."));
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        setAnswer(text);
      }
      if (!text.trim()) setAnswer(t("कोई उत्तर नहीं मिला। कृपया प्रश्न दूसरे शब्दों में पूछें।", "No answer came back. Please try rephrasing."));
    } catch {
      setAnswer(t("इंटरनेट कनेक्शन जाँचें और दोबारा प्रयास करें।", "Check your internet connection and try again."));
    } finally {
      setBusy(false);
    }
  }

  const submit = (e: FormEvent) => { e.preventDefault(); ask(input); };

  return (
    <>
      {open && (
        <div className="assistant" role="dialog" aria-label={t("विनय कुमार द्विवेदी के बारे में पूछें", "Ask about Vinay Kumar Dwivedi")}>
          <header>
            <b>{t("विनय कुमार द्विवेदी के बारे में पूछें", "Ask about Vinay Kumar Dwivedi")}</b>
            <button type="button" onClick={() => setOpen(false)} aria-label={t("बंद करें", "Close")}><Icon name="close" /></button>
          </header>
          <div className="chat" ref={chatRef} aria-live="polite">
            <div className="msg bot">{t("उनके काम, सफर, कार्यक्रमों, योजनाओं और इस वेबसाइट की सेवाओं के बारे में पूछें। मैं केवल इस वेबसाइट पर दी गई जानकारी से उत्तर देता हूँ।", "Ask about his work, journey, events, schemes and the services on this website. I answer only from the information on this website.")}</div>
            {msgs.length === 0 && (
              <div className="suggest">
                {SUGGEST[lang].map((s) => <button key={s} type="button" onClick={() => ask(s)}>{s}</button>)}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`msg ${m.role === "user" ? "me" : "bot"}${m.content ? "" : " typing"}`}>
                {m.content ? (m.role === "assistant" ? <Rich text={m.content} /> : m.content) : t("सोच रहा हूँ…", "Thinking…")}
              </div>
            ))}
          </div>
          <form className="chat-form" onSubmit={submit}>
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} maxLength={1200}
              placeholder={t("अपना प्रश्न लिखें…", "Type your question…")} aria-label={t("आपका प्रश्न", "Your question")} />
            <button type="submit" disabled={busy || !input.trim()} aria-label={t("भेजें", "Send")}><Icon name="send" /></button>
          </form>
        </div>
      )}
      <button type="button" className="ask-fab" onClick={() => setOpen(!open)} aria-expanded={open}>
        <Icon name="chat" />{t("सहायक से पूछें", "Ask assistant")}
      </button>
    </>
  );
}
