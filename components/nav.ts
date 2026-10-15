import type { Bi } from "@/lib/i18n";

export type NavLink = { path: string; label: Bi; desc?: Bi };
export type NavItem = NavLink | { label: Bi; base: string; children: NavLink[] };

export const NAV: NavItem[] = [
  { path: "", label: { hi: "होम", en: "Home" } },
  { path: "/about", label: { hi: "जीवन परिचय", en: "Biography" } },
  {
    label: { hi: "जन सेवा", en: "Public Service" }, base: "/e-",
    children: [
      { path: "/e-shikayat", label: { hi: "ई-शिकायत दर्ज करें", en: "Register a complaint" }, desc: { hi: "सड़क, पानी, बिजली, पेंशन", en: "Road, water, power, pension" } },
      { path: "/e-shikayat/track", label: { hi: "शिकायत की स्थिति", en: "Track your complaint" }, desc: { hi: "टिकट संख्या डालें", en: "Enter your ticket number" } },
      { path: "/e-card", label: { hi: "ई-कार्ड बनाएं", en: "Make an e-card" }, desc: { hi: "अपने नाम व फोटो के साथ शुभकामनाएँ", en: "Greetings with your name and photo" } },
    ],
  },
  { path: "/updates", label: { hi: "कार्यक्रम", en: "Events" } },
  {
    label: { hi: "मीडिया", en: "Media" }, base: "/media",
    children: [
      { path: "/media", label: { hi: "फोटो गैलरी", en: "Gallery" } },
      { path: "/media/meetings", label: { hi: "भेंट व संवाद", en: "Meetings & Interactions" } },
    ],
  },
  {
    label: { hi: "विकास व विचार", en: "Development & Ideas" }, base: "/vi",
    children: [
      { path: "/vimarsh", label: { hi: "विमर्श: एक नज़र में", en: "Overview" } },
      { path: "/vichar", label: { hi: "विचार व लेख", en: "Ideas & Articles" } },
      { path: "/vikas-yatra", label: { hi: "विकास यात्रा", en: "Development Journey" } },
    ],
  },
  { path: "/ideals", label: { hi: "हमारे आदर्श", en: "Our Ideals" } },
];

export const FOOTER_LINKS: NavLink[] = [
  { path: "", label: { hi: "होम", en: "Home" } },
  { path: "/about", label: { hi: "जीवन परिचय", en: "Biography" } },
  { path: "/e-shikayat", label: { hi: "शिकायत दर्ज करें", en: "Register a complaint" } },
  { path: "/e-shikayat/track", label: { hi: "शिकायत की स्थिति", en: "Track complaint" } },
  { path: "/e-card", label: { hi: "ई-कार्ड", en: "e-Card" } },
  { path: "/updates", label: { hi: "कार्यक्रम", en: "Events" } },
  { path: "/media", label: { hi: "फोटो गैलरी", en: "Gallery" } },
  { path: "/media/meetings", label: { hi: "भेंट व संवाद", en: "Meetings & Interactions" } },
  { path: "/vichar", label: { hi: "विचार व लेख", en: "Ideas & Articles" } },
  { path: "/vikas-yatra", label: { hi: "विकास यात्रा", en: "Development Journey" } },
  { path: "/ideals", label: { hi: "हमारे आदर्श", en: "Our Ideals" } },
  { path: "/contact", label: { hi: "संपर्क", en: "Contact" } },
];
