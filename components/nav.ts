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
  { path: "/updates", label: { hi: "अपडेट्स", en: "Updates" } },
  {
    label: { hi: "मीडिया", en: "Media" }, base: "/media",
    children: [
      { path: "/media", label: { hi: "गैलरी", en: "Gallery" } },
      { path: "/media/meetings", label: { hi: "भेंट व संवाद", en: "Meetings & Interactions" } },
    ],
  },
  {
    label: { hi: "दृष्टि व आदर्श", en: "Vision & Ideals" }, base: "/v",
    children: [
      { path: "/vimarsh", label: { hi: "एक नज़र में", en: "Overview" }, desc: { hi: "विकास व विचार का सार", en: "Development and ideas at a glance" } },
      { path: "/vichar", label: { hi: "विचार व लेख", en: "Ideas & Articles" }, desc: { hi: "योजनाओं की सरल जानकारी", en: "Schemes explained simply" } },
      { path: "/vikas-yatra", label: { hi: "उपलब्धियाँ", en: "Achievements" }, desc: { hi: "आँकड़े और पड़ाव", en: "Figures and milestones" } },
      { path: "/ideals", label: { hi: "हमारे आदर्श", en: "Our Ideals" }, desc: { hi: "प्रेरणा देने वाले विचार", en: "Words that guide us" } },
    ],
  },
  { path: "/contact", label: { hi: "संपर्क करें", en: "Contact" } },
];

/* Footer columns: व्यक्तित्व / क्विक लिंक्स */
export const FOOTER_PERSONA: NavLink[] = [
  { path: "/about", label: { hi: "परिचय", en: "Introduction" } },
  { path: "/about#journey", label: { hi: "यात्रा", en: "Journey" } },
  { path: "/vikas-yatra", label: { hi: "उपलब्धियाँ", en: "Achievements" } },
  { path: "/ideals", label: { hi: "हमारे आदर्श", en: "Our Ideals" } },
];

export const FOOTER_QUICK: NavLink[] = [
  { path: "/media", label: { hi: "फोटो गैलरी", en: "Photo Gallery" } },
  { path: "/media#videos", label: { hi: "विडियो गैलरी", en: "Video Gallery" } },
  { path: "/updates", label: { hi: "अपडेट्स", en: "Updates" } },
  { path: "/vichar", label: { hi: "विचार व लेख", en: "Ideas & Articles" } },
  { path: "/e-shikayat", label: { hi: "ई-शिकायत", en: "Register a complaint" } },
  { path: "/e-card", label: { hi: "ई-कार्ड", en: "e-Card" } },
];
