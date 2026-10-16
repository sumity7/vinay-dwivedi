"use client";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { daysUntil, occasions, type Motif, type Occasion } from "@/lib/content/ecard";
import { ideals } from "@/lib/content/ideals";
import type { Bi } from "@/lib/i18n";
import { img } from "@/lib/images";
import { site } from "@/lib/site";
import { Icon } from "./Icon";
import { useSite } from "./SiteProvider";

type Ctx = CanvasRenderingContext2D;
const W = 1080, H = 1350;

/* ---------- anniversaries of our ideals, as card occasions ---------- */
type Anniv = Occasion & { kind: "birth" | "death"; days: number };
function upcomingAnniversaries(limit = 6): Anniv[] {
  const list: Anniv[] = [];
  for (const i of ideals) {
    for (const kind of ["birth", "death"] as const) {
      const mmdd = kind === "birth" ? i.birth : i.death;
      if (!mmdd) continue;
      list.push({
        id: `${i.id}-${kind}`, kind, days: daysUntil(mmdd), date: mmdd,
        label: { hi: `${i.name.hi}: ${kind === "birth" ? "जयंती" : "पुण्यतिथि"}`, en: `${i.name.en}: ${kind === "birth" ? "Birth anniversary" : "Death anniversary"}` },
        bg: kind === "birth" ? ["#fff7ec", "#fde3cf"] : ["#f1e9df", "#e7ddd1"], accent: "#9e3c03", text: "#1c1410", light: true, motif: "lamp",
        title: i.name,
        wish: i.line.kind === "quote" ? i.line.text : i.role,
        sub: kind === "birth" ? { hi: "जयंती पर शत-शत नमन", en: "Respectful tributes on the birth anniversary" } : { hi: "पुण्यतिथि पर विनम्र श्रद्धांजलि", en: "Humble tributes on the death anniversary" },
      });
    }
  }
  return list.sort((a, b) => a.days - b.days).slice(0, limit);
}

/* ---------- drawing helpers ---------- */
function rng(seed: number) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function crescent(ctx: Ctx, x: number, y: number, r: number, color: string) {
  const c = document.createElement("canvas"); c.width = c.height = Math.ceil(r * 2.4);
  const o = c.getContext("2d")!; const m = c.width / 2;
  o.fillStyle = color; o.beginPath(); o.arc(m, m, r, 0, Math.PI * 2); o.fill();
  o.globalCompositeOperation = "destination-out"; o.beginPath(); o.arc(m + r * 0.42, m - r * 0.22, r * 0.86, 0, Math.PI * 2); o.fill();
  ctx.drawImage(c, x - m, y - m);
}
function star(ctx: Ctx, x: number, y: number, r: number, points = 5, inner = 0.45) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const a = (Math.PI * i) / points - Math.PI / 2, rr = i % 2 ? r * inner : r;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath(); ctx.fill();
}
function sparkle(ctx: Ctx, x: number, y: number, r: number) { star(ctx, x, y, r, 4, 0.22); }
function diya(ctx: Ctx, x: number, y: number, s: number, accent: string) {
  ctx.save();
  const fl = ctx.createRadialGradient(x, y - 26 * s, 2, x, y - 26 * s, 34 * s);
  fl.addColorStop(0, "rgba(255,240,180,.95)"); fl.addColorStop(1, "rgba(255,180,60,0)");
  ctx.fillStyle = fl; ctx.beginPath(); ctx.arc(x, y - 26 * s, 34 * s, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#ffe08a"; ctx.beginPath(); ctx.moveTo(x, y - 46 * s); ctx.quadraticCurveTo(x + 11 * s, y - 22 * s, x, y - 12 * s); ctx.quadraticCurveTo(x - 11 * s, y - 22 * s, x, y - 46 * s); ctx.fill();
  ctx.fillStyle = "#c2570c"; ctx.beginPath(); ctx.ellipse(x, y - 6 * s, 30 * s, 16 * s, 0, 0, Math.PI); ctx.fill();
  ctx.strokeStyle = accent; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.ellipse(x, y - 6 * s, 30 * s, 5 * s, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}
function cover(ctx: Ctx, im: HTMLImageElement, x: number, y: number, w: number, h: number, fy = 0.15) {
  const s = Math.max(w / im.width, h / im.height), sw = w / s, sh = h / s;
  ctx.drawImage(im, (im.width - sw) / 2, Math.max(0, Math.min(im.height - sh, (im.height - sh) * fy)), sw, sh, x, y, w, h);
}
function fitFont(ctx: Ctx, text: string, family: string, weight: string, start: number, min: number, maxW: number) {
  let s = start;
  ctx.font = `${weight} ${s}px ${family}`;
  while (ctx.measureText(text).width > maxW && s > min) { s -= 4; ctx.font = `${weight} ${s}px ${family}`; }
  return s;
}
function wrapLines(ctx: Ctx, text: string, maxW: number) {
  const lines: string[] = []; let line = "";
  for (const w of text.split(" ")) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function drawMotif(ctx: Ctx, o: Occasion, initial: string, display: string) {
  const cx = W / 2, cy = 330, a = o.accent, r = rng(o.id.length * 97 + 13);
  ctx.save();
  switch (o.motif as Motif) {
    case "diyas": {
      crescent(ctx, 830, 210, 58, "#fff6d5");
      ctx.fillStyle = a; for (let i = 0; i < 40; i++) { ctx.globalAlpha = 0.3 + r() * 0.6; ctx.beginPath(); ctx.arc(80 + r() * 920, 170 + r() * 230, 2 + r() * 3, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(120 + i * 24, 470 + i * 12); ctx.lineTo(960 - i * 24, 470 + i * 12); ctx.stroke(); }
      for (let i = 0; i < 7; i++) diya(ctx, 180 + i * 120, 460, i % 2 ? 0.9 : 1.05, a);
      break;
    }
    case "sun": {
      const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, 130); g.addColorStop(0, "#fff7d6"); g.addColorStop(1, a);
      ctx.strokeStyle = a; ctx.lineWidth = 6; ctx.globalAlpha = 0.6;
      for (let i = 0; i < 24; i++) { const an = (i / 24) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * 140, cy + Math.sin(an) * 140); ctx.lineTo(cx + Math.cos(an) * (i % 2 ? 175 : 200), cy + Math.sin(an) * (i % 2 ? 175 : 200)); ctx.stroke(); }
      ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, 120, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.55)"; ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) { ctx.beginPath(); for (let x = 140; x <= 940; x += 10) ctx.lineTo(x, 470 + i * 22 + Math.sin(x / 40 + i) * 6); ctx.stroke(); }
      break;
    }
    case "colors": {
      const cols = ["#ffd23f", "#4ade80", "#38bdf8", "#f472b6", "#fb923c", "#a78bfa"];
      for (let i = 0; i < 28; i++) { ctx.globalAlpha = 0.35 + r() * 0.4; ctx.fillStyle = cols[i % cols.length]; ctx.beginPath(); ctx.arc(100 + r() * 880, 160 + r() * 320, 20 + r() * 60, 0, Math.PI * 2); ctx.fill(); }
      break;
    }
    case "mandala": case "lotus": {
      ctx.translate(cx, cy + (o.motif === "lotus" ? 30 : 0));
      const rings = o.motif === "lotus" ? [[150, 9, 0.9], [100, 7, 1]] : [[170, 16, 0.35], [130, 12, 0.6], [90, 8, 0.9]];
      for (const [len, n, al] of rings) {
        ctx.globalAlpha = al;
        for (let i = 0; i < n; i++) {
          ctx.save(); ctx.rotate(o.motif === "lotus" ? -Math.PI / 2 + ((i - (n - 1) / 2) / n) * Math.PI * 0.95 : (i / n) * Math.PI * 2);
          ctx.fillStyle = a; ctx.beginPath(); ctx.ellipse(len / 2, 0, len / 2, len / 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
      }
      ctx.globalAlpha = 1; ctx.fillStyle = o.light ? "#fff" : o.bg[0]; ctx.beginPath(); ctx.arc(0, 0, o.motif === "lotus" ? 26 : 34, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case "crescent": {
      crescent(ctx, cx + 20, cy - 10, 130, a);
      ctx.fillStyle = a; for (let i = 0; i < 18; i++) { ctx.globalAlpha = 0.5 + r() * 0.5; star(ctx, 120 + r() * 840, 160 + r() * 300, 5 + r() * 9); }
      break;
    }
    case "rakhi": {
      ctx.strokeStyle = a; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(110, cy + 10); ctx.bezierCurveTo(330, cy - 50, 750, cy + 70, 970, cy - 10); ctx.stroke();
      ctx.translate(cx, cy);
      for (let i = 0; i < 12; i++) { ctx.save(); ctx.rotate((i / 12) * Math.PI * 2); ctx.fillStyle = i % 2 ? a : "#ffffff"; ctx.beginPath(); ctx.ellipse(70, 0, 62, 24, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
      ctx.fillStyle = "#f59e0b"; ctx.beginPath(); ctx.arc(0, 0, 46, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#fff6d5"; ctx.beginPath(); ctx.arc(0, 0, 22, 0, Math.PI * 2); ctx.fill();
      break;
    }
    case "kites": {
      const kite = (x: number, y: number, s: number, c: string, rot: number) => {
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
        ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, -70 * s); ctx.lineTo(55 * s, 0); ctx.lineTo(0, 80 * s); ctx.lineTo(-55 * s, 0); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -70 * s); ctx.lineTo(0, 80 * s); ctx.moveTo(-55 * s, 0); ctx.lineTo(55 * s, 0); ctx.stroke();
        ctx.strokeStyle = "rgba(255,255,255,.7)"; ctx.beginPath(); ctx.moveTo(0, 80 * s); ctx.bezierCurveTo(30, 140 * s, -30, 190 * s, 10, 250 * s); ctx.stroke();
        ctx.restore();
      };
      kite(330, 280, 1.1, a, -0.2); kite(620, 230, 0.8, "#ff7043", 0.15); kite(820, 350, 0.95, "#ffffff", 0.3);
      break;
    }
    case "peacock": {
      ctx.translate(cx, cy);
      ctx.strokeStyle = "#6ee7b7"; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
      for (let i = -30; i <= 30; i += 3) { ctx.beginPath(); ctx.moveTo(0, 200); ctx.quadraticCurveTo(i * 4, 40, i * 5.5, -150); ctx.stroke(); }
      ctx.globalAlpha = 1;
      ([[110, 150, "#0f766e"], [80, 112, "#14b8a6"], [58, 80, a], [36, 50, "#1e3a8a"], [18, 26, "#0b1026"]] as const).forEach(([rx, ry, c]) => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(0, -40, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); });
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = a; for (let i = 0; i < 16; i++) { ctx.globalAlpha = 0.5 + r() * 0.5; star(ctx, 100 + r() * 880, 150 + r() * 330, 4 + r() * 7); }
      break;
    }
    case "star": {
      ctx.shadowColor = a; ctx.shadowBlur = 40; ctx.fillStyle = a; star(ctx, cx, cy, 120); ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff"; for (let i = 0; i < 26; i++) { ctx.globalAlpha = 0.4 + r() * 0.6; ctx.beginPath(); ctx.arc(90 + r() * 900, 150 + r() * 340, 2 + r() * 4, 0, Math.PI * 2); ctx.fill(); }
      break;
    }
    case "flag": {
      const bands = ["#ff9933", "#ffffff", "#138808"];
      bands.forEach((c, i) => {
        ctx.fillStyle = c; ctx.beginPath();
        for (let x = 120; x <= 960; x += 8) ctx.lineTo(x, 210 + i * 80 + Math.sin(x / 70) * 18);
        for (let x = 960; x >= 120; x -= 8) ctx.lineTo(x, 290 + i * 80 + Math.sin(x / 70) * 18);
        ctx.closePath(); ctx.fill();
        if (c === "#ffffff") { ctx.strokeStyle = "#e7ddd1"; ctx.lineWidth = 2; ctx.stroke(); }
      });
      const fy = 330 + Math.sin(cx / 70) * 18;
      ctx.strokeStyle = "#000080"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, fy, 34, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1.6; for (let i = 0; i < 24; i++) { const an = (i / 24) * Math.PI * 2; ctx.beginPath(); ctx.moveTo(cx, fy); ctx.lineTo(cx + Math.cos(an) * 34, fy + Math.sin(an) * 34); ctx.stroke(); }
      break;
    }
    case "sparkles": {
      const cols = [a, "#ffffff", "#ffb4a2", "#fde68a"];
      for (let i = 0; i < 22; i++) { ctx.fillStyle = cols[i % 4]; ctx.globalAlpha = 0.5 + r() * 0.5; sparkle(ctx, 90 + r() * 900, 150 + r() * 330, 8 + r() * 22); }
      ctx.globalAlpha = 1; ctx.fillStyle = a; sparkle(ctx, cx, cy, 90);
      break;
    }
    case "lamp": {
      ctx.fillStyle = "#ffffff"; ctx.strokeStyle = a; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(cx, cy - 20, 118, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = a; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `400 120px ${display}`; ctx.fillText(initial, cx, cy - 12);
      ctx.textBaseline = "alphabetic";
      diya(ctx, cx - 170, 470, 1, a); diya(ctx, cx + 170, 470, 1, a);
      break;
    }
  }
  ctx.restore();
}

/* ---------- component ---------- */
export function ECardMaker() {
  const { lang, t, pick, toast } = useSite();
  const params = useSearchParams();
  const annivs = useMemo(() => upcomingAnniversaries(), []);
  const all = useMemo<Occasion[]>(() => [...occasions, ...annivs], [annivs]);

  const [occId, setOccId] = useState(() => {
    const q = params.get("occasion");
    if (q && all.some((o) => o.id === q)) return q;
    const soon = [...occasions].filter((o) => o.date).map((o) => ({ o, d: daysUntil(o.date!) })).sort((a, b) => a.d - b.d)[0];
    return soon && soon.d <= 7 ? soon.o.id : "diwali";
  });
  const occ = all.find((o) => o.id === occId) ?? occasions[1];

  const cvRef = useRef<HTMLCanvasElement>(null);
  const mla = useRef<HTMLImageElement | null>(null);
  const [userImg, setUserImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [tick, setTick] = useState(0);

  const draw = useCallback(() => {
    const cv = cvRef.current, ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const cs = getComputedStyle(document.documentElement);
    const display = cs.getPropertyValue("--display").trim() || "serif";
    const body = cs.getPropertyValue("--body").trim() || "sans-serif";
    const o = occ, L = (b: Bi) => b[lang];
    const dim = o.light ? "rgba(28,20,16,.65)" : "rgba(255,255,255,.8)";

    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, o.bg[0]); g.addColorStop(1, o.bg[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = o.accent; ctx.globalAlpha = 0.55; ctx.lineWidth = 2; ctx.strokeRect(28, 28, W - 56, H - 56); ctx.globalAlpha = 1;

    // header
    ctx.fillStyle = o.accent; ctx.beginPath(); ctx.arc(92, 96, 34, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = o.light ? "#fff" : o.bg[0]; ctx.textAlign = "center"; ctx.font = `400 34px ${display}`; ctx.fillText("वि", 92, 108);
    ctx.textAlign = "left"; ctx.fillStyle = o.text; ctx.font = `700 30px ${body}`; ctx.fillText(L(site.name), 142, 92);
    ctx.fillStyle = dim; ctx.font = `500 22px ${body}`; ctx.fillText(L(site.role), 142, 124);

    drawMotif(ctx, o, L(o.title).replace(/^(श्री|डॉ\.|पं\.|Shri|Dr\.|Pt\.|Bharat Ratna|भारत रत्न|Netaji|नेताजी|Sardar|सरदार|Lokmanya|लोकमान्य|Shaheed|शहीद|Rani|रानी|Swami|स्वामी|Goswami|गोस्वामी|Sant|संत|Guru|गुरु|Maharshi|महर्षि|Mahatma|महात्मा)\s+/, "").trim().charAt(0), display);

    // pill
    const pill = "kind" in o ? L(o.sub!) : t("हार्दिक शुभकामनाएँ", "Warm wishes");
    ctx.font = `700 24px ${body}`; const pw = ctx.measureText(pill).width + 48;
    ctx.fillStyle = o.accent; roundRect(ctx, (W - pw) / 2, 540, pw, 46, 23); ctx.fill();
    ctx.fillStyle = o.light ? "#fff" : o.bg[0]; ctx.textAlign = "center"; ctx.fillText(pill, W / 2, 572);

    // title
    ctx.fillStyle = o.light ? o.accent : o.text;
    fitFont(ctx, L(o.title), display, "400", 96, 52, W - 180); ctx.fillText(L(o.title), W / 2, 680);
    ctx.strokeStyle = o.accent; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W / 2 - 170, 712); ctx.lineTo(W / 2 - 18, 712); ctx.moveTo(W / 2 + 18, 712); ctx.lineTo(W / 2 + 170, 712); ctx.stroke();
    ctx.fillStyle = o.accent; ctx.beginPath(); ctx.moveTo(W / 2, 702); ctx.lineTo(W / 2 + 10, 712); ctx.lineTo(W / 2, 722); ctx.lineTo(W / 2 - 10, 712); ctx.fill();

    // message box
    ctx.font = `500 33px ${body}`;
    const lines = wrapLines(ctx, L(o.wish), W - 260).slice(0, 3);
    const subTxt = "kind" in o ? "" : o.sub ? L(o.sub) : "";
    const boxH = 50 + lines.length * 46 + (subTxt ? 40 : 0);
    ctx.fillStyle = o.light ? "rgba(158,60,3,.06)" : "rgba(0,0,0,.16)"; roundRect(ctx, 100, 748, W - 200, boxH, 20); ctx.fill();
    ctx.strokeStyle = o.accent; ctx.globalAlpha = 0.6; ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = o.text; lines.forEach((ln, i) => ctx.fillText(ln, W / 2, 800 + i * 46));
    if (subTxt) { ctx.fillStyle = o.light ? o.accent : o.accent; ctx.font = `500 23px ${body}`; ctx.fillText(subTxt, W / 2, 800 + lines.length * 46 + 4); }

    // MLA photo (arch, bottom right)
    const ax = 650, aw = 340, ay = 960, ah = H - 70 - ay;
    ctx.save(); ctx.beginPath(); ctx.moveTo(ax, ay + aw / 2); ctx.arc(ax + aw / 2, ay + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(ax + aw, ay + ah); ctx.lineTo(ax, ay + ah); ctx.closePath();
    ctx.fillStyle = "#fff"; ctx.fill(); ctx.clip();
    const m = mla.current; if (m?.complete && m.naturalWidth) cover(ctx, m, ax, ay, aw, ah, 0.08);
    ctx.restore();
    ctx.strokeStyle = o.accent; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ax, ay + ah); ctx.lineTo(ax, ay + aw / 2); ctx.arc(ax + aw / 2, ay + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(ax + aw, ay + ah); ctx.stroke();
    ctx.font = `700 24px ${body}`; const nm = L(site.name); const nw = Math.max(ctx.measureText(nm).width + 44, 250);
    ctx.fillStyle = "#ffffff"; roundRect(ctx, ax + aw / 2 - nw / 2, ay + ah - 92, nw, 72, 36); ctx.fill();
    ctx.fillStyle = "#1c1410"; ctx.textAlign = "center"; ctx.fillText(nm, ax + aw / 2, ay + ah - 60);
    ctx.font = `500 18px ${body}`; ctx.fillStyle = "#6e625a"; ctx.fillText(L(site.role), ax + aw / 2, ay + ah - 34);

    // sender (bottom left)
    // with a photo: label, photo, then name below it; without: label and name lower down
    ctx.textAlign = "left";
    const tx = 92, labelY = userImg ? 990 : 1080, nameY = userImg ? 1200 : 1146;
    ctx.fillStyle = dim; ctx.font = `500 26px ${body}`; ctx.fillText(t("शुभकामनाओं सहित", "With best wishes"), tx, labelY);
    if (userImg) {
      ctx.save(); ctx.beginPath(); ctx.arc(162, 1080, 66, 0, Math.PI * 2); ctx.clip(); cover(ctx, userImg, 96, 1014, 132, 132, 0.3); ctx.restore();
      ctx.strokeStyle = o.accent; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(162, 1080, 66, 0, Math.PI * 2); ctx.stroke();
    }
    const nameTxt = name.trim() || t("आपका नाम", "Your name");
    ctx.fillStyle = o.light ? o.accent : o.text; ctx.globalAlpha = name.trim() ? 1 : 0.55;
    fitFont(ctx, nameTxt, display, "400", 56, 30, ax - tx - 30); ctx.fillText(nameTxt, tx, nameY);
    ctx.globalAlpha = 1;
    if (place.trim()) { ctx.fillStyle = dim; ctx.font = `500 26px ${body}`; ctx.fillText(place.trim(), tx, nameY + 42); }

    // footer: tricolour strip + page
    ctx.fillStyle = dim; ctx.font = `500 18px ${body}`; ctx.fillText(site.social.facebook.url.replace("https://www.", ""), 92, H - 50);
    const sw = (W - 56) / 3; ["#ff9933", "#ffffff", "#138808"].forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(28 + i * sw, H - 40, sw, 12); });
  }, [occ, lang, t, name, place, userImg, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { draw(); }, [draw]);
  useEffect(() => {
    const im = new Image(); im.onload = () => setTick((n) => n + 1); im.src = img.hero.src; mla.current = im;
    document.fonts.ready.then(() => setTick((n) => n + 1));
  }, []);

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
  const when = (d: number) => (d === 0 ? t("आज", "today") : d === 1 ? t("कल", "tomorrow") : t(`${d} दिन में`, `in ${d} days`));

  return (
    <div className="ecard-grid">
      <div>
        <span className="label">{t("अवसर चुनें", "Occasion")}</span>
        <p className="hint" style={{ margin: "0 0 0" }}>{t("त्योहार और राष्ट्रीय पर्व", "Festivals and national days")}</p>
        <div className="occ" role="group" aria-label={t("अवसर", "Occasion")}>
          {occasions.map((o) => {
            const d = o.date ? daysUntil(o.date) : 99;
            return (
              <button key={o.id} type="button" aria-pressed={o.id === occId} onClick={() => setOccId(o.id)}>
                <i style={{ background: `linear-gradient(135deg, ${o.bg[0]}, ${o.accent})` }} />{pick(o.label)}{d <= 30 && <small>{when(d)}</small>}
              </button>
            );
          })}
        </div>
        <p className="hint" style={{ margin: 0 }}>{t("हमारे आदर्श: जयंती व पुण्यतिथि", "Our Ideals: anniversaries")}</p>
        <div className="occ" role="group" aria-label={t("जयंती व पुण्यतिथि", "Anniversaries")}>
          {annivs.map((o) => (
            <button key={o.id} type="button" aria-pressed={o.id === occId} onClick={() => setOccId(o.id)}>
              <i style={{ background: o.kind === "birth" ? "#f47216" : "#6e625a" }} />{pick(o.label)}<small>{when(o.days)}</small>
            </button>
          ))}
        </div>
        <div className="form-grid">
          <div className="field"><label htmlFor="e-name">{t("आपका नाम", "Your name")}</label>
            <input id="e-name" maxLength={28} placeholder={t("जैसे: रमेश तिवारी", "e.g. Ramesh Tiwari")} value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="field"><label htmlFor="e-place">{t("गाँव / पद (वैकल्पिक)", "Village / designation (optional)")}</label>
            <input id="e-place" maxLength={34} placeholder={t("जैसे: बूथ अध्यक्ष, बाबागंज", "e.g. Booth President, Babaganj")} value={place} onChange={(e) => setPlace(e.target.value)} /></div>
          <div className="field full">
            <span className="label">{t("आपकी फोटो (वैकल्पिक)", "Your photo (optional)")}</span>
            <label className="file-btn"><Icon name="photoAdd" />{userImg ? t("फोटो बदलें", "Change photo") : t("फोटो चुनें", "Choose photo")}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => onPhoto(e.target.files?.[0])} /></label>
            <div className="hint">{t("फोटो आपके फोन में ही रहती है, कहीं अपलोड नहीं होती।", "Stays on your phone; it is not uploaded.")}</div>
          </div>
          <div className="full hero-actions">
            <button className="btn btn-primary" type="button" onClick={share}><Icon name="share" />{t("WhatsApp पर साझा करें", "Share on WhatsApp")}</button>
            <button className="btn btn-ghost" type="button" onClick={download}><Icon name="download" />{t("कार्ड डाउनलोड करें", "Download card")}</button>
          </div>
        </div>
      </div>
      <div className="preview">
        <span className="label">{t("कार्ड का पूर्वावलोकन", "Card preview")}</span>
        <canvas ref={cvRef} width={W} height={H} aria-label={t("ई-कार्ड पूर्वावलोकन", "E-card preview")} />
      </div>
    </div>
  );
}
