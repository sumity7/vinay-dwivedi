import type { Bi } from "./i18n";
import { site } from "./site";

export const store = {
  get<T>(k: string, d: T): T {
    try {
      const v = localStorage.getItem(k);
      return v === null ? d : ((JSON.parse(v) as T) ?? d);
    } catch {
      return d;
    }
  },
  set(k: string, v: unknown) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  },
};

export const prefersReducedMotion = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Absolute URL for share links: NEXT_PUBLIC_SITE_URL when set, else the current origin. */
export const absUrl = (path = "") => (site.siteUrl || (typeof location !== "undefined" ? location.origin : "")) + path;

export const fmtIN = (n: number) => Math.round(n).toLocaleString("en-IN");
export const validMobile = (v: string) => /^[6-9]\d{9}$/.test(v);
export const digitsOnly = (v: string) => v.replace(/\D/g, "");

export const waLink = (msg: string, to = "") => `https://wa.me/${to}?text=${encodeURIComponent(msg)}`;
export const openWa = (msg: string) => window.open(waLink(msg, site.officeWhatsApp), "_blank", "noopener");

/* complaint categories & statuses */
export const CATS = [
  ["road", "सड़क / नाली", "Road / drain"], ["water", "पेयजल / हैंडपंप", "Drinking water / handpump"], ["power", "बिजली", "Electricity"],
  ["pension", "पेंशन", "Pension"], ["ration", "राशन कार्ड", "Ration card"], ["housing", "आवास (पीएम आवास)", "Housing (PM Awas)"],
  ["health", "स्वास्थ्य / अस्पताल", "Health / hospital"], ["school", "विद्यालय / शिक्षा", "School / education"], ["clean", "साफ़-सफ़ाई", "Cleanliness"],
  ["police", "पुलिस / सुरक्षा", "Police / safety"], ["land", "भूमि / राजस्व", "Land / revenue"], ["other", "अन्य", "Other"],
] as const;
export type Category = (typeof CATS)[number][0];
export const catLabel = (k: string): Bi => {
  const c = CATS.find((x) => x[0] === k);
  return c ? { hi: c[1], en: c[2] } : { hi: k, en: k };
};

export const STATUSES = [["received", "प्राप्त", "Received"], ["review", "जाँच में", "Under review"], ["action", "कार्यवाही में", "Action taken"], ["resolved", "निस्तारित", "Resolved"]] as const;
export type Status = (typeof STATUSES)[number][0];

/** Ticket number like MHN-2610-48213 (year+month, then 5 random digits) */
export const newTicket = () => {
  const d = new Date(), p = (n: number) => String(n).padStart(2, "0");
  return `MHN-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}-${Math.floor(10000 + Math.random() * 90000)}`;
};
export const TICKET_RE = /^MHN-\d{4}-\d{5}$/;
