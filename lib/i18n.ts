export const LANGS = ["hi", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "hi";

/** A piece of text in both languages. */
export type Bi = { hi: string; en: string };

export const isLang = (v: string): v is Lang => (LANGS as readonly string[]).includes(v);

/** Pick the text for the current language. */
export const tr = (b: Bi, lang: Lang) => b[lang];

/** Locale-prefixed path: href("hi", "/about") -> "/hi/about". */
export const href = (lang: Lang, path = "") => `/${lang}${path}`;

const MONTHS: Record<Lang, string[]> = {
  hi: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

/** "2026-10-12" -> "12 अक्टूबर 2026" / "12 October 2026" */
export function fmtDate(iso: string, lang: Lang) {
  const { d, month, y } = dateParts(iso, lang);
  return `${d} ${month} ${y}`;
}

/** "2026-10-12" -> { d: 12, month: "अक्टूबर", y: 2026 } */
export function dateParts(iso: string, lang: Lang) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return { d, month: MONTHS[lang][m - 1], y };
}
