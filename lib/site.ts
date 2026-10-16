/* Office details, social accounts and integrations. */
import type { Bi } from "./i18n";

export const site = {
  name: { hi: "विनय कुमार द्विवेदी", en: "Vinay Kumar Dwivedi" } as Bi,
  nickname: { hi: "मुन्ना भैया", en: "Munna Bhaiya" } as Bi,
  role: { hi: "विधायक, 295-मेहनौन", en: "MLA, 295-Mehnaun" } as Bi,
  roleLong: { hi: "विधायक, मेहनौन विधानसभा (295), गोंडा", en: "MLA, Mehnaun Assembly (295), Gonda" } as Bi,
  area: { hi: "मेहनौन विधानसभा, गोंडा", en: "Mehnaun Assembly, Gonda" } as Bi,
  office: { hi: "जनसंपर्क कार्यालय, मेहनौन, गोंडा", en: "Jansampark office, Mehnaun, Gonda" } as Bi,

  phones: ["+918887151095", "+919670086000"],
  email: "vinaydwivedi71@gmail.com",
  officeWhatsApp: "919670086000", // contact form, meeting requests and reminders go here

  social: {
    facebook: { url: "https://www.facebook.com/vinaydwivedi295/", handle: "vinaydwivedi295", followers: { hi: "1.28 लाख+", en: "128K+" } as Bi },
    instagram: { url: "https://www.instagram.com/vinaydwivedimla/", handle: "@vinaydwivedimla", followers: { hi: "14.6 हज़ार+", en: "14.6K+" } as Bi },
    youtube: { url: "https://www.youtube.com/@vinaydwivedi71", handle: "@vinaydwivedi71", channelId: "UCQmXUpUFhZ1cBPNYTe0qznw" },
  },

  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "", // e.g. https://vinaydwivedi.in, used in share links
};

export const phoneLabel = (p: string) => p.replace(/^\+91(\d{5})(\d{5})$/, "+91 $1 $2");
