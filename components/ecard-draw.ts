/* Drawing the e-card on a canvas. Pure functions, no React: ECardMaker calls drawCard(). */
import type { Motif, Occasion } from "@/lib/content/ecard";
import type { Bi } from "@/lib/i18n";

type Ctx = CanvasRenderingContext2D;
const W = 1080;

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

/* ---------- premium finish: foil, rules, ornaments ---------- */
function hexRgb(h: string) { const n = parseInt(h.replace("#", "").slice(0, 6), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function mix(a: string, b: string, k: number) { const A = hexRgb(a), B = hexRgb(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",")})`; }
/** metallic gradient built from the occasion's accent colour */
function foil(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, accent: string) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, mix(accent, "#000000", 0.3)); g.addColorStop(0.25, mix(accent, "#ffffff", 0.55)); g.addColorStop(0.5, accent);
  g.addColorStop(0.72, mix(accent, "#ffffff", 0.7)); g.addColorStop(1, mix(accent, "#000000", 0.25));
  return g;
}
function rule(ctx: Ctx, x0: number, x1: number, y: number, color: string) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.4; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
}
function diamond(ctx: Ctx, x: number, y: number, r: number, color: string) {
  ctx.save(); ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.closePath(); ctx.fill(); ctx.restore();
}
/** a small lotus-and-arc ornament sitting in a corner of the inner frame */
function cornerOrnament(ctx: Ctx, x: number, y: number, sx: number, sy: number, stroke: CanvasGradient) {
  ctx.save(); ctx.translate(x, y); ctx.scale(sx, sy);
  ctx.strokeStyle = stroke; ctx.fillStyle = stroke; ctx.lineWidth = 1.6;
  for (const r of [26, 40]) { ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI / 2); ctx.stroke(); }
  ctx.save(); ctx.translate(30, 30); ctx.rotate(Math.PI / 4);
  for (const a of [-0.6, 0, 0.6]) { ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.ellipse(0, -14, 5, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  ctx.restore();
  ctx.beginPath(); ctx.moveTo(52, 6); ctx.lineTo(120, 6); ctx.moveTo(6, 52); ctx.lineTo(6, 120); ctx.stroke();
  for (const [dx, dy] of [[128, 6], [6, 128]]) { ctx.beginPath(); ctx.arc(dx, dy, 3, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
/** foil ring around a round portrait, with a faint outer ring */
function portraitRing(ctx: Ctx, x: number, y: number, r: number, accent: string, dark: boolean) {
  ctx.save();
  if (dark) { ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; }
  ctx.fillStyle = foil(ctx, x - r, y - r, x + r, y + r, accent); ctx.beginPath(); ctx.arc(x, y, r + 7, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.strokeStyle = foil(ctx, x - r, y - r, x + r, y + r, accent); ctx.globalAlpha = 0.55; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.arc(x, y, r + 18, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
}
/** first letter of a name, keeping Devanagari matras with their consonant */
function firstLetter(s: string) {
  if (!s) return "";
  const Seg = (Intl as unknown as { Segmenter?: new (l: string, o: { granularity: string }) => { segment: (t: string) => Iterable<{ segment: string }> } }).Segmenter;
  if (Seg) { for (const g of new Seg("hi", { granularity: "grapheme" }).segment(s)) return g.segment.toUpperCase(); }
  return s.charAt(0).toUpperCase();
}


/* ---------- the card: poster layout ---------- */
export type CardFonts = { title: string; name: string; body: string };
export type CardInput = {
  /** `kind` marks an anniversary card; `quoted` puts the wish in quotation marks (the person’s own words) */
  o: Occasion & { kind?: "birth" | "death"; quoted?: boolean };
  lang: "hi" | "en";
  fonts: CardFonts;
  /** who stands in the gold arch: the MLA, or the great person whose anniversary it is */
  arch: { img: HTMLImageElement | null; name: string; line: string; fy?: number };
  /** the MLA as a small badge in the sender strip (anniversary cards, where the arch shows someone else) */
  badge?: { img: HTMLImageElement | null; name: string; line: string };
  /** a marigold garland across the portrait (death anniversaries) */
  garland?: boolean;
  /** the sender's own photo, if they added one */
  user: HTMLImageElement | null;
  name: string;
  place: string;
  footer: string;
  t: (hi: string, en: string) => string;
};

/** an arch (round top) path */
function archPath(ctx: Ctx, x: number, y: number, w: number, h: number) {
  const r = w / 2;
  ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x, y + r); ctx.arc(x + r, y + r, r, Math.PI, 0); ctx.lineTo(x + w, y + h); ctx.closePath();
}
/** cover-fit an image into a box, anchored near the top (faces stay in frame) */
function coverTop(ctx: Ctx, im: HTMLImageElement, x: number, y: number, w: number, h: number, fy = 0) {
  const s = Math.max(w / im.width, h / im.height), sw = w / s, sh = h / s;
  ctx.drawImage(im, (im.width - sw) / 2, (im.height - sh) * fy, sw, sh, x, y, w, h);
}
/** largest font size at which `text` wraps into at most `maxLines` lines no wider than maxW */
function fitWrap(ctx: Ctx, text: string, font: (s: number) => string, start: number, min: number, maxW: number, maxLines: number) {
  for (let s = start; s >= min; s -= 2) {
    ctx.font = font(s);
    const words = text.split(" ");
    if (words.some((w) => ctx.measureText(w).width > maxW)) continue;
    const lines = wrapLines(ctx, text, maxW);
    if (lines.length <= maxLines) return { size: s, lines };
  }
  ctx.font = font(min);
  return { size: min, lines: wrapLines(ctx, text, maxW).slice(0, maxLines) };
}
function spaced(ctx: Ctx, px: number) { (ctx as Ctx & { letterSpacing?: string }).letterSpacing = `${px}px`; }

export const CARD_W = 1080, CARD_H = 1350;

/** marigold garland hanging between two points (genda phool: orange and yellow, with a few leaves) */
function garland(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, sag: number) {
  const cx = (x0 + x1) / 2, cy = 2 * sag - (y0 + y1) / 2;
  const pt = (t: number) => ({ x: (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, y: (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1 });
  const n = 26, r = rng(11);
  ctx.save(); ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
  for (let i = 0; i <= n; i++) {
    const p = pt(i / n);
    if (i % 4 === 2) { ctx.fillStyle = "#2f7d32"; ctx.beginPath(); ctx.ellipse(p.x, p.y + 14, 7, 15, (r() - 0.5) * 0.8, 0, Math.PI * 2); ctx.fill(); }
    const col = i % 3 === 1 ? "#ffc107" : "#f57c00";
    const rr = 15 + r() * 3;
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,.18)";
    for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2 + r(); ctx.beginPath(); ctx.arc(p.x + Math.cos(a) * rr * 0.55, p.y + Math.sin(a) * rr * 0.55, rr * 0.28, 0, Math.PI * 2); ctx.fill(); }
    ctx.shadowBlur = 8;
  }
  ctx.restore();
}

export function drawCard(ctx: Ctx, c: CardInput) {
  const W = CARD_W, H = CARD_H, o = c.o, F = c.fonts, L = (b: Bi) => b[c.lang];
  /* letter-spacing only for English: it breaks Devanagari conjuncts */
  const sp = (px: number) => spaced(ctx, c.lang === "en" ? px : 0);
  const dark = !o.light, ink = o.text;
  const soft = dark ? "rgba(255,255,255,.8)" : "rgba(28,20,16,.68)";
  const gold = dark ? mix(o.accent, "#ffffff", 0.2) : mix(o.accent, "#000000", 0.15);
  const deep = dark ? mix(o.bg[1], "#000000", 0.45) : mix(o.accent, "#000000", 0.35);
  ctx.save(); ctx.textBaseline = "alphabetic"; ctx.textAlign = "left"; ctx.globalAlpha = 1; ctx.shadowBlur = 0; spaced(ctx, 0);

  /* ---- paper ---- */
  const g = ctx.createLinearGradient(0, 0, W * 0.35, H); g.addColorStop(0, o.bg[0]); g.addColorStop(1, o.bg[1]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(790, 380, 30, 790, 380, 620);
  glow.addColorStop(0, dark ? "rgba(255,230,170,.20)" : "rgba(255,255,255,.85)"); glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
  const vig = ctx.createRadialGradient(W / 2, H / 2, 380, W / 2, H / 2, 920);
  vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, dark ? "rgba(0,0,0,.42)" : "rgba(110,70,30,.12)");
  ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
  /* fine diagonal guilloché lines and grain */
  ctx.save(); ctx.strokeStyle = gold; ctx.globalAlpha = dark ? 0.05 : 0.07; ctx.lineWidth = 1;
  for (let i = -H; i < W; i += 14) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + H * 0.6, H); ctx.stroke(); }
  ctx.restore();
  const gr = rng(7);
  for (let i = 0; i < 2600; i++) { ctx.fillStyle = gr() > 0.5 ? "#fff" : "#000"; ctx.globalAlpha = 0.02 + gr() * 0.03; ctx.fillRect(gr() * W, gr() * H, 1.6, 1.6); }
  ctx.globalAlpha = 1;
  /* rosette watermark behind the headline */
  ctx.save(); ctx.translate(250, 330); ctx.strokeStyle = gold; ctx.lineWidth = 1.3; ctx.globalAlpha = dark ? 0.1 : 0.13;
  for (const [rad, n] of [[280, 24], [210, 18], [140, 12]] as const) {
    for (let i = 0; i < n; i++) { ctx.save(); ctx.rotate((i / n) * Math.PI * 2); ctx.beginPath(); ctx.ellipse(rad * 0.62, 0, rad * 0.38, rad * 0.09, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
    ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();

  /* ---- foil frame ---- */
  const fr = foil(ctx, 0, 0, W, H, o.accent);
  ctx.lineWidth = 3.5; ctx.strokeStyle = fr; ctx.strokeRect(28, 28, W - 56, H - 56);
  ctx.lineWidth = 1.2; ctx.globalAlpha = 0.8; ctx.strokeRect(42, 42, W - 84, H - 84); ctx.globalAlpha = 1;
  for (const [x, y, sx, sy] of [[42, 42, 1, 1], [W - 42, 42, -1, 1], [42, H - 42, 1, -1], [W - 42, H - 42, -1, -1]] as const) cornerOrnament(ctx, x, y, sx, sy, fr);

  /* ---- the MLA in a gold arch (right) ---- */
  const ax = 572, ay = 112, aw = 420, ah = 610;
  ctx.save(); ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16;
  archPath(ctx, ax - 9, ay - 9, aw + 18, ah + 18); ctx.fillStyle = foil(ctx, ax, ay, ax + aw, ay + ah, o.accent); ctx.fill();
  ctx.restore();
  ctx.save(); archPath(ctx, ax - 24, ay - 24, aw + 48, ah + 40); ctx.strokeStyle = fr; ctx.lineWidth = 1.4; ctx.globalAlpha = 0.7; ctx.stroke(); ctx.restore();
  ctx.save(); archPath(ctx, ax, ay, aw, ah); ctx.clip();
  ctx.fillStyle = "#3a3a36"; ctx.fillRect(ax, ay, aw, ah);
  /* the shading sits behind the portrait, so the clothes keep their true colour */
  const shade = ctx.createLinearGradient(0, ay + ah * 0.62, 0, ay + ah); shade.addColorStop(0, "rgba(0,0,0,0)"); shade.addColorStop(1, "rgba(0,0,0,.55)");
  ctx.fillStyle = shade; ctx.fillRect(ax, ay, aw, ah);
  const ai = c.arch.img;
  if (ai?.complete && ai.naturalWidth) coverTop(ctx, ai, ax, ay, aw, ah, c.arch.fy ?? 0);
  ctx.restore();
  if (c.garland) garland(ctx, ax - 6, ay + ah * 0.6, ax + aw + 6, ay + ah * 0.6, ay + ah * 0.84);

  /* nameplate overlapping the arch's foot */
  const pw = 476, ph = 118, px = ax + aw / 2 - pw / 2, py = ay + ah - 52;
  ctx.save(); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
  roundRect(ctx, px, py, pw, ph, 14); ctx.fillStyle = dark ? foil(ctx, px, py, px + pw, py + ph, o.accent) : deep; ctx.fill();
  ctx.restore();
  ctx.save(); roundRect(ctx, px + 7, py + 7, pw - 14, ph - 14, 9); ctx.strokeStyle = dark ? "rgba(60,30,0,.45)" : "rgba(255,255,255,.55)"; ctx.lineWidth = 1.2; ctx.stroke(); ctx.restore();
  ctx.textAlign = "center"; ctx.fillStyle = dark ? "#2a1606" : "#ffffff";
  fitFont(ctx, c.arch.name, F.name, "700", 50, 28, pw - 50); ctx.fillText(c.arch.name, px + pw / 2, py + 62);
  ctx.fillStyle = dark ? "rgba(42,22,6,.82)" : "rgba(255,255,255,.88)";
  fitFont(ctx, c.arch.line, F.body, "600", 21, 15, pw - 50); ctx.fillText(c.arch.line, px + pw / 2, py + 94);

  /* ---- headline column (left) ---- */
  const x0 = 88, colW = 452;
  ctx.textAlign = "left";
  const kicker = o.kind ? L(o.sub!) : c.t("हार्दिक शुभकामनाएँ", "Warm wishes");
  ctx.font = `600 25px ${F.body}`; sp(2); ctx.fillStyle = gold;
  rule(ctx, x0, x0 + 46, 168, gold); diamond(ctx, x0 + 52, 168, 5, gold);
  fitFont(ctx, kicker, F.body, "600", 25, 18, colW - 70); ctx.fillText(kicker, x0 + 68, 177);
  spaced(ctx, 0);

  const title = L(o.title);
  const tf = (s: number) => `400 ${s}px ${F.title}`;
  const T = fitWrap(ctx, title, tf, 148, 58, colW, o.kind ? 3 : 3);
  const lh = T.size * 1.12;
  let y = 214 + T.size * 0.95;
  ctx.font = tf(T.size);
  const blockTop = y - T.size, blockBot = y + lh * (T.lines.length - 1);
  ctx.save();
  if (dark) { ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 22; ctx.shadowOffsetY = 8; }
  const tg = ctx.createLinearGradient(0, blockTop, 0, blockBot + 10);
  if (dark) { tg.addColorStop(0, mix(o.accent, "#ffffff", 0.75)); tg.addColorStop(0.45, mix(o.accent, "#ffffff", 0.15)); tg.addColorStop(0.55, o.accent); tg.addColorStop(1, mix(o.accent, "#ffffff", 0.55)); }
  else { tg.addColorStop(0, mix(o.accent, "#000000", 0.05)); tg.addColorStop(1, mix(o.accent, "#000000", 0.4)); }
  ctx.fillStyle = tg;
  for (const ln of T.lines) { ctx.fillText(ln, x0 - 4, y); y += lh; }
  ctx.restore();
  y = blockBot + 44;
  rule(ctx, x0, x0 + 150, y, gold); diamond(ctx, x0 + 162, y, 8, gold); rule(ctx, x0 + 174, x0 + 230, y, gold);

  /* the wish */
  y += 58;
  ctx.font = `500 31px ${F.body}`; ctx.fillStyle = dark ? "rgba(255,255,255,.93)" : ink;
  const wish = o.quoted ? `“${L(o.wish)}”` : L(o.wish);
  const wl = wrapLines(ctx, wish, colW).slice(0, 5);
  for (const ln of wl) { ctx.fillText(ln, x0, y); y += 46; }
  const subTxt = !o.kind && o.sub ? L(o.sub) : "";
  if (subTxt) {
    y += 8; ctx.font = `600 22px ${F.body}`; ctx.fillStyle = gold;
    for (const ln of wrapLines(ctx, subTxt, colW).slice(0, 2)) { ctx.fillText(ln, x0, y); y += 32; }
  }

  /* occasion motif, small, in the space left under the text */
  const mTop = y + 6, mBot = 916, avail = mBot - mTop;
  if (avail > 90) {
    /* the motif art spans x 100–980, y 120–540 of the old full-width layout: crop to that and scale into the column */
    const MX = 100, MW = 880, MH = 420;
    const off = document.createElement("canvas"); off.width = MW; off.height = MH;
    const oc = off.getContext("2d")!; oc.translate(-MX, -120);
    if (o.kind) { for (const [dx, sc] of [[-150, 1.25], [0, 1.6], [150, 1.25]] as const) diya(oc, W / 2 + dx, 470, sc, o.accent); }
    else drawMotif(oc, o, "", F.title);
    const s = Math.min(colW / MW, avail / MH), mw = MW * s, mh = MH * s;
    ctx.save(); if (dark) { ctx.shadowColor = o.accent; ctx.shadowBlur = 18; }
    ctx.drawImage(off, x0 + (colW - mw) / 2, mTop + (avail - mh) / 2, mw, mh); ctx.restore();
  }

  /* ---- sender strip (bottom) ---- */
  const bx = 74, by = 936, bw = W - 148, bh = 300;
  ctx.save();
  roundRect(ctx, bx, by, bw, bh, 26); ctx.fillStyle = dark ? "rgba(0,0,0,.30)" : "rgba(255,255,255,.72)"; ctx.fill();
  ctx.strokeStyle = fr; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
  const ux = bx + 170, uy = by + bh / 2, ur = 104;
  portraitRing(ctx, ux, uy, ur, o.accent, dark);
  ctx.save(); ctx.beginPath(); ctx.arc(ux, uy, ur, 0, Math.PI * 2); ctx.clip();
  if (c.user) coverTop(ctx, c.user, ux - ur, uy - ur, ur * 2, ur * 2, 0.25);
  else {
    ctx.fillStyle = dark ? mix(o.bg[0], o.accent, 0.18) : mix("#ffffff", o.accent, 0.12); ctx.fillRect(ux - ur, uy - ur, ur * 2, ur * 2);
    const ini = firstLetter(c.name.trim());
    ctx.textAlign = "center";
    if (ini) { ctx.fillStyle = foil(ctx, ux - 50, uy - 60, ux + 50, uy + 40, o.accent); ctx.font = `700 112px ${F.name}`; ctx.fillText(ini, ux, uy + 40); }
    else { ctx.fillStyle = gold; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(ux, uy - 24, 34, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(ux, uy + 74, 66, 56, 0, Math.PI, 0); ctx.fill(); }
  }
  ctx.restore();

  let tx = ux + ur + 58, tw = bx + bw - tx - 46;
  if (c.badge) {
    const gx = bx + bw - 120, gy = by + bh / 2 - 22, gr2 = 68;
    portraitRing(ctx, gx, gy, gr2, o.accent, dark);
    ctx.save(); ctx.beginPath(); ctx.arc(gx, gy, gr2, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = "#3a3a36"; ctx.fillRect(gx - gr2, gy - gr2, gr2 * 2, gr2 * 2);
    if (c.badge.img?.complete && c.badge.img.naturalWidth) coverTop(ctx, c.badge.img, gx - gr2, gy - gr2, gr2 * 2, gr2 * 2, 0.05);
    ctx.restore();
    ctx.textAlign = "center"; ctx.fillStyle = dark ? "#ffffff" : ink;
    fitFont(ctx, c.badge.name, F.name, "700", 27, 18, 200); ctx.fillText(c.badge.name, gx, gy + gr2 + 42);
    ctx.fillStyle = soft; fitFont(ctx, c.badge.line, F.body, "500", 16, 12, 200); ctx.fillText(c.badge.line, gx, gy + gr2 + 64);
    tw -= 230;
  }
  ctx.textAlign = "left";
  ctx.font = `600 23px ${F.body}`; sp(3); ctx.fillStyle = gold;
  ctx.fillText(c.t("शुभेच्छु", "WITH BEST WISHES FROM"), tx, by + 92); spaced(ctx, 0);
  rule(ctx, tx, tx + 120, by + 110, gold);
  const nm = c.name.trim() || c.t("आपका नाम", "Your Name");
  ctx.fillStyle = dark ? "#ffffff" : ink; ctx.globalAlpha = c.name.trim() ? 1 : 0.45;
  fitFont(ctx, nm, F.name, "700", 76, 38, tw); ctx.fillText(nm, tx, by + 186);
  ctx.globalAlpha = 1;
  const line2 = c.place.trim() || c.t("की ओर से हार्दिक शुभकामनाएँ", "sends warm wishes");
  ctx.fillStyle = soft; fitFont(ctx, line2, F.body, "500", 29, 18, tw); ctx.fillText(line2, tx, by + 232);

  /* ---- footer ---- */
  ctx.textAlign = "center"; ctx.fillStyle = soft; ctx.globalAlpha = 0.9; ctx.font = `500 18px ${F.body}`; sp(1);
  ctx.fillText(c.footer, W / 2, H - 66); spaced(ctx, 0);
  const fw = ctx.measureText(c.footer).width / 2 + 20; diamond(ctx, W / 2 - fw, H - 72, 4, gold); diamond(ctx, W / 2 + fw, H - 72, 4, gold);
  ctx.restore();
}
