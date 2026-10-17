"use client";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { daysUntil, nextOccurrence, occasions, type Occasion } from "@/lib/content/ecard";
import { ideals, yearsText, type Ideal } from "@/lib/content/ideals";
import type { Bi } from "@/lib/i18n";
import { img } from "@/lib/images";
import { site } from "@/lib/site";
import { CARD_H, CARD_W, drawCard, type CardInput } from "./ecard-draw";
import { Icon } from "./Icon";
import { useSite } from "./SiteProvider";

/* ---------- anniversaries of our ideals, as card occasions ---------- */
type Anniv = Occasion & { kind: "birth" | "death"; days: number; quoted: boolean; ideal: Ideal };
const living = (i: Ideal) => !i.years.includes("–");

function upcomingAnniversaries(limit = 8): Anniv[] {
  const list: Anniv[] = [];
  for (const i of ideals) {
    for (const kind of ["birth", "death"] as const) {
      const mmdd = kind === "birth" ? i.birth : i.death;
      if (!mmdd) continue;
      const alive = living(i);
      /* "जयंती" is only for those no longer with us; a living leader gets a birthday card */
      const what: Bi = kind === "death" ? { hi: "पुण्यतिथि", en: "Death anniversary" } : alive ? { hi: "जन्मदिन", en: "Birthday" } : { hi: "जयंती", en: "Birth anniversary" };
      list.push({
        id: `${i.id}-${kind}`, kind, days: daysUntil(mmdd), date: mmdd, ideal: i, quoted: i.line.kind === "quote",
        label: { hi: `${i.name.hi}: ${what.hi}`, en: `${i.name.en}: ${what.en}` },
        bg: kind === "death" ? ["#f1e9df", "#e4d8ca"] : ["#fff7ec", "#fcdcc2"], accent: "#9e3c03", text: "#1c1410", light: true, motif: "lamp",
        title: kind === "death" ? { hi: "विनम्र श्रद्धांजलि", en: "Humble Tributes" } : alive ? { hi: "जन्मदिन की हार्दिक शुभकामनाएँ", en: "Happy Birthday" } : { hi: "शत-शत नमन", en: "Respectful Tributes" },
        /* the small line above the headline */
        sub: kind === "death" ? { hi: "पुण्यतिथि पर", en: "On the death anniversary" } : alive ? { hi: "जन्मदिन विशेष", en: "Birthday wishes" } : { hi: "जयंती पर", en: "On the birth anniversary" },
        wish: i.line.text,
      });
    }
  }
  return list.sort((a, b) => a.days - b.days).slice(0, limit);
}

/* images used on the card, loaded once and kept */
const imgCache = new Map<string, HTMLImageElement>();
function useImage(src: string | undefined, onLoad: () => void) {
  const [, force] = useState(0);
  useEffect(() => {
    if (!src || imgCache.has(src)) return;
    const im = new Image();
    im.onload = () => { force((n) => n + 1); onLoad(); };
    im.src = src;
    imgCache.set(src, im);
  }, [src, onLoad]);
  return src ? imgCache.get(src) ?? null : null;
}

/* ---------- component ---------- */
export function ECardMaker() {
  const { lang, t, pick, toast } = useSite();
  const params = useSearchParams();
  const annivs = useMemo(() => upcomingAnniversaries(), []);
  const all = useMemo<(Occasion | Anniv)[]>(() => [...occasions, ...annivs], [annivs]);

  const [occId, setOccId] = useState(() => {
    const q = params.get("occasion");
    if (q && all.some((o) => o.id === q)) return q;
    const soon = occasions.map((o) => ({ o, n: nextOccurrence(o) })).filter((x) => x.n).sort((a, b) => a.n!.days - b.n!.days)[0];
    return soon && soon.n!.days <= 30 ? soon.o.id : "diwali";
  });
  const occ = all.find((o) => o.id === occId) ?? occasions[1];
  const anniv = "kind" in occ ? (occ as Anniv) : null;
  const [tab, setTab] = useState<"fest" | "ideals">(() => (anniv ? "ideals" : "fest"));

  const rootRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const [userImg, setUserImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [tick, setTick] = useState(0);
  const bump = useCallback(() => setTick((n) => n + 1), []);

  /* the straight studio portrait (the one in the site icon), and the ideal's portrait on anniversary cards */
  const mla = useImage(img.portrait.src, bump);
  const idealImg = useImage(anniv?.ideal.img.src, bump);

  const draw = useCallback(() => {
    const cv = cvRef.current, ctx = cv?.getContext("2d"), root = rootRef.current;
    if (!cv || !ctx || !root) return;
    const cs = getComputedStyle(root);
    const fam = (v: string, fb: string) => cs.getPropertyValue(v).trim() || fb;
    const fonts = { title: fam("--ec-title", "serif"), name: fam("--ec-name", "sans-serif"), body: fam("--ec-body", "sans-serif") };
    const mlaName = pick(site.name);
    const input: CardInput = {
      o: occ, lang, fonts, user: userImg, name, place, t,
      footer: site.social.facebook.url.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""),
      ...(anniv
        ? {
            arch: { img: idealImg, name: pick(anniv.ideal.name), line: yearsText(anniv.ideal.years, lang), fy: 0.08 },
            badge: { img: mla, name: mlaName, line: pick(site.role) },
            garland: anniv.kind === "death",
          }
        : { arch: { img: mla, name: mlaName, line: pick(site.roleLong) } }),
    };
    drawCard(ctx, input);
  }, [occ, anniv, lang, t, pick, name, place, userImg, mla, idealImg, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { draw(); }, [draw]);
  /* wait for the card fonts (both scripts), then redraw */
  useEffect(() => {
    const root = rootRef.current; if (!root) return;
    const cs = getComputedStyle(root);
    const want = [["--ec-title", "400"], ["--ec-name", "700"], ["--ec-body", "500"], ["--ec-body", "600"]]
      .map(([v, w]) => `${w} 60px ${cs.getPropertyValue(v).trim()}`);
    Promise.all(want.map((f) => document.fonts.load(f, "शुभकामनाएँ Aa").catch(() => []))).then(bump);
    document.fonts.ready.then(bump);
  }, [bump]);

  const onPhoto = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => { const im = new Image(); im.onload = () => setUserImg(im); im.src = r.result as string; };
    r.readAsDataURL(f);
  };
  const blob = () => new Promise<Blob | null>((res) => cvRef.current ? cvRef.current.toBlob(res, "image/png") : res(null));
  const fileName = () => `ecard-${occ.id}-${(name.trim() || "mehnaun").replace(/\s+/g, "-")}.png`;
  const download = async () => {
    const b = await blob(); if (!b) return;
    const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = fileName(); a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast(t("कार्ड डाउनलोड हो गया", "Card downloaded"));
  };
  const share = async () => {
    const b = await blob(); if (!b) return;
    const f = new File([b], fileName(), { type: "image/png" });
    if (navigator.canShare?.({ files: [f] })) { try { await navigator.share({ files: [f], text: pick(occ.title) }); } catch {} }
    else { await download(); toast(t("कार्ड डाउनलोड हुआ, अब इसे WhatsApp पर भेजें", "Card downloaded, now send it on WhatsApp")); }
  };
  const when = (d: number) => (d === 0 ? t("आज", "Today") : d === 1 ? t("कल", "Tomorrow") : t(`${d} दिन में`, `In ${d} days`));
  const swatch = (o: Occasion) => ({ background: `linear-gradient(150deg, ${o.bg[0]}, ${o.bg[1]})`, color: o.accent });

  return (
    <div className="ec" ref={rootRef}>
      <div className="ec-controls">
        <section className="ec-step" aria-labelledby="ec-s1">
          <header className="ec-step-head">
            <span className="ec-n" aria-hidden="true">1</span>
            <div><h3 id="ec-s1">{t("अवसर चुनें", "Choose the occasion")}</h3><p>{t("त्योहार, राष्ट्रीय पर्व या हमारे आदर्शों की जयंती व पुण्यतिथि", "A festival, a national day, or an anniversary of our ideals")}</p></div>
          </header>
          <div className="ec-tabs" role="tablist" aria-label={t("अवसर का प्रकार", "Kind of occasion")}>
            <button type="button" role="tab" aria-selected={tab === "fest"} onClick={() => setTab("fest")}>{t("त्योहार व पर्व", "Festivals & days")}</button>
            <button type="button" role="tab" aria-selected={tab === "ideals"} onClick={() => setTab("ideals")}>{t("जयंती व पुण्यतिथि", "Anniversaries")}</button>
          </div>
          {tab === "fest" ? (
            <div className="ec-occ" role="group" aria-label={t("त्योहार व पर्व", "Festivals & days")}>
              {occasions.map((o) => {
                const n = nextOccurrence(o);
                return (
                  <button key={o.id} type="button" className="ec-tile" aria-pressed={o.id === occId} onClick={() => setOccId(o.id)}>
                    <span className="ec-sw" style={swatch(o)} aria-hidden="true"><i /></span>
                    <span className="ec-lbl">{pick(o.label)}</span>
                    {n && n.days <= 30 && <span className="ec-when">{when(n.days)}</span>}
                    <span className="ec-tick" aria-hidden="true"><Icon name="check" /></span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="ec-occ ec-occ-people" role="group" aria-label={t("जयंती व पुण्यतिथि", "Anniversaries")}>
              {annivs.map((o) => (
                <button key={o.id} type="button" className="ec-tile ec-person" aria-pressed={o.id === occId} onClick={() => setOccId(o.id)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.ideal.img.src} alt="" loading="lazy" />
                  <span className="ec-lbl"><b>{pick(o.ideal.name)}</b>{pick(o.kind === "death" ? { hi: "पुण्यतिथि", en: "Death anniversary" } : living(o.ideal) ? { hi: "जन्मदिन", en: "Birthday" } : { hi: "जयंती", en: "Birth anniversary" })}</span>
                  <span className="ec-when">{when(o.days)}</span>
                  <span className="ec-tick" aria-hidden="true"><Icon name="check" /></span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="ec-step" aria-labelledby="ec-s2">
          <header className="ec-step-head">
            <span className="ec-n" aria-hidden="true">2</span>
            <div><h3 id="ec-s2">{t("अपना नाम और फोटो जोड़ें", "Add your name and photo")}</h3><p>{t("कार्ड पर आप शुभेच्छु के रूप में दिखेंगे", "You appear on the card as the sender")}</p></div>
          </header>
          <div className="ec-fields">
            <label className="ec-field"><span>{t("आपका नाम", "Your name")}</span>
              <input maxLength={28} placeholder={t("जैसे: रमेश तिवारी", "e.g. Ramesh Tiwari")} value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className="ec-field"><span>{t("गाँव / पद (वैकल्पिक)", "Village / designation (optional)")}</span>
              <input maxLength={34} placeholder={t("जैसे: बूथ अध्यक्ष, बाबागंज", "e.g. Booth President, Babaganj")} value={place} onChange={(e) => setPlace(e.target.value)} /></label>
          </div>
          <div className="ec-photo">
            <span className="ec-avatar" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {userImg ? <img src={userImg.src} alt="" /> : <Icon name="photoAdd" />}
            </span>
            <div>
              <div className="ec-photo-btns">
                <label className="ec-file">{userImg ? t("फोटो बदलें", "Change photo") : t("अपनी फोटो चुनें", "Choose your photo")}
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => { onPhoto(e.target.files?.[0]); e.target.value = ""; }} /></label>
                {userImg && <button type="button" className="ec-link" onClick={() => setUserImg(null)}>{t("हटाएँ", "Remove")}</button>}
              </div>
              <p className="ec-hint">{t("वैकल्पिक। फोटो आपके फोन में ही रहती है, कहीं अपलोड नहीं होती।", "Optional. It stays on your phone and is never uploaded.")}</p>
            </div>
          </div>
        </section>

        <section className="ec-step" aria-labelledby="ec-s3">
          <header className="ec-step-head">
            <span className="ec-n" aria-hidden="true">3</span>
            <div><h3 id="ec-s3">{t("कार्ड भेजें", "Send your card")}</h3><p>{t("HD कार्ड, WhatsApp स्टेटस और Facebook के लिए तैयार", "An HD card, ready for WhatsApp status and Facebook")}</p></div>
          </header>
          <div className="ec-actions">
            <button className="ec-btn ec-btn-wa" type="button" onClick={share}><Icon name="whatsapp" />{t("WhatsApp पर भेजें", "Send on WhatsApp")}</button>
            <button className="ec-btn ec-btn-ghost" type="button" onClick={download}><Icon name="download" />{t("डाउनलोड करें", "Download")}</button>
          </div>
        </section>
      </div>

      <figure className="ec-stage">
        <div className="ec-stage-bar"><span className="ec-live" aria-hidden="true" />{t("लाइव पूर्वावलोकन", "Live preview")}<span className="ec-stage-occ">{pick(occ.label)}</span></div>
        <canvas ref={cvRef} width={CARD_W} height={CARD_H} role="img" aria-label={`${t("ई-कार्ड", "E-card")}: ${pick(occ.title)}`} />
        <figcaption>{t("1080 × 1350 HD · WhatsApp और Facebook पर साफ़ दिखता है", "1080 × 1350 HD · sharp on WhatsApp and Facebook")}</figcaption>
      </figure>
    </div>
  );
}
