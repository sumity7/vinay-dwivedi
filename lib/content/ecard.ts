/* e-Card occasions. `date` (MM-DD) is set only for fixed-date occasions; it drives the countdown and default pick. */
import type { Bi } from "../i18n";

export type Motif = "diyas" | "sun" | "colors" | "mandala" | "crescent" | "rakhi" | "kites" | "peacock" | "star" | "flag" | "sparkles" | "lotus" | "lamp";

export type Occasion = {
  id: string;
  label: Bi;
  bg: [string, string];
  accent: string;
  text: string;
  light?: boolean;
  motif: Motif;
  title: Bi;
  wish: Bi;
  sub?: Bi;
  date?: string;
};

const SUB: Bi = { hi: "मेहनौन विधानसभा क्षेत्र के सभी परिवारों को हार्दिक शुभकामनाएँ", en: "Warm wishes to every family of Mehnaun" };

export const occasions: Occasion[] = [
  { id: "birthday", label: { hi: "मुन्ना भैया का जन्मदिन", en: "Munna Bhaiya’s birthday" }, date: "10-15", bg: ["#9e3c03", "#e8670f"], accent: "#ffd27a", text: "#ffffff", motif: "sparkles",
    title: { hi: "जन्मदिन की हार्दिक शुभकामनाएँ", en: "Happy Birthday" }, wish: { hi: "हमारे प्रिय विधायक मुन्ना भैया को जन्मदिवस की अनंत शुभकामनाएँ।", en: "Warmest birthday wishes to our dear MLA, Munna Bhaiya." }, sub: { hi: "आप स्वस्थ रहें, दीर्घायु हों और यूँ ही जनसेवा करते रहें", en: "Wishing you good health, long life and many more years of service" } },
  { id: "diwali", label: { hi: "दीपावली", en: "Deepawali" }, bg: ["#0f3a48", "#0a2832"], accent: "#f2a51a", text: "#ffffff", motif: "diyas",
    title: { hi: "शुभ दीपावली", en: "Happy Deepawali" }, wish: { hi: "दीपों का यह पर्व आपके घर-आँगन में सुख, समृद्धि और उजाला लाए।", en: "May the festival of lamps fill your home with joy, prosperity and light." }, sub: SUB },
  { id: "chhath", label: { hi: "छठ पूजा", en: "Chhath Puja" }, bg: ["#c2410c", "#f28c0f"], accent: "#fff1b8", text: "#ffffff", motif: "sun",
    title: { hi: "छठ पूजा की शुभकामनाएँ", en: "Happy Chhath Puja" }, wish: { hi: "छठी मैया सबकी मनोकामनाएँ पूर्ण करें और हर घर में सुख-समृद्धि बनी रहे।", en: "May Chhathi Maiya fulfil every wish and bless every home." }, sub: SUB },
  { id: "holi", label: { hi: "होली", en: "Holi" }, bg: ["#6d1b5f", "#c2185b"], accent: "#ffd23f", text: "#ffffff", motif: "colors",
    title: { hi: "होली की शुभकामनाएँ", en: "Happy Holi" }, wish: { hi: "रंगों का यह त्योहार आपके जीवन में खुशियों के रंग भर दे।", en: "May the festival of colours fill your life with happiness." }, sub: SUB },
  { id: "navratri", label: { hi: "नवरात्रि / विजयादशमी", en: "Navratri / Vijayadashami" }, bg: ["#7f0f16", "#c2201f"], accent: "#f5b700", text: "#ffffff", motif: "mandala",
    title: { hi: "नवरात्रि व विजयादशमी", en: "Navratri & Vijayadashami" }, wish: { hi: "माँ दुर्गा की कृपा सब पर बनी रहे और असत्य पर सत्य की विजय हो।", en: "May Maa Durga bless all, and may truth triumph over untruth." }, sub: SUB },
  { id: "shivratri", label: { hi: "महाशिवरात्रि", en: "Mahashivratri" }, bg: ["#141838", "#2e3577"], accent: "#a8d8ff", text: "#ffffff", motif: "crescent",
    title: { hi: "महाशिवरात्रि की शुभकामनाएँ", en: "Happy Mahashivratri" }, wish: { hi: "भगवान भोलेनाथ की कृपा आप पर सदा बनी रहे। हर हर महादेव!", en: "May Bholenath always bless you. Har Har Mahadev!" }, sub: SUB },
  { id: "rakhi", label: { hi: "रक्षाबंधन", en: "Raksha Bandhan" }, bg: ["#8a1f3d", "#d6336c"], accent: "#ffd27a", text: "#ffffff", motif: "rakhi",
    title: { hi: "रक्षाबंधन की शुभकामनाएँ", en: "Happy Raksha Bandhan" }, wish: { hi: "भाई-बहन के अटूट स्नेह और विश्वास का यह पर्व सबके लिए मंगलमय हो।", en: "May this festival of the bond between brother and sister bring joy to all." }, sub: SUB },
  { id: "sankranti", label: { hi: "मकर संक्रांति", en: "Makar Sankranti" }, date: "01-14", bg: ["#0b5394", "#3d8ee0"], accent: "#ffd23f", text: "#ffffff", motif: "kites",
    title: { hi: "मकर संक्रांति की शुभकामनाएँ", en: "Happy Makar Sankranti" }, wish: { hi: "सूर्य के उत्तरायण होने का यह पर्व आपके जीवन में नई ऊर्जा और उमंग लाए।", en: "May the sun’s northward journey bring new energy and cheer to your life." }, sub: SUB },
  { id: "ramnavami", label: { hi: "श्री राम नवमी", en: "Ram Navami" }, bg: ["#c2410c", "#f59e0b"], accent: "#fff3c4", text: "#ffffff", motif: "sun",
    title: { hi: "श्री राम नवमी की शुभकामनाएँ", en: "Happy Ram Navami" }, wish: { hi: "मर्यादा पुरुषोत्तम प्रभु श्री राम सबका कल्याण करें। जय श्री राम!", en: "May Prabhu Shri Ram bless all. Jai Shri Ram!" }, sub: SUB },
  { id: "janmashtami", label: { hi: "जन्माष्टमी", en: "Janmashtami" }, bg: ["#0d1b4c", "#283593"], accent: "#ffd23f", text: "#ffffff", motif: "peacock",
    title: { hi: "श्री कृष्ण जन्माष्टमी", en: "Happy Janmashtami" }, wish: { hi: "नंदलाल की कृपा से आपका जीवन प्रेम और आनंद से भरा रहे।", en: "May Nandlal fill your life with love and joy." }, sub: SUB },
  { id: "eid", label: { hi: "ईद", en: "Eid" }, bg: ["#0b4d33", "#138a4b"], accent: "#f6e27a", text: "#ffffff", motif: "crescent",
    title: { hi: "ईद मुबारक", en: "Eid Mubarak" }, wish: { hi: "ईद का यह पर्व सबके जीवन में भाईचारा, सुख और समृद्धि लाए।", en: "May Eid bring brotherhood, happiness and prosperity to all." }, sub: SUB },
  { id: "christmas", label: { hi: "क्रिसमस", en: "Christmas" }, date: "12-25", bg: ["#6b1212", "#b3261e"], accent: "#ffd27a", text: "#ffffff", motif: "star",
    title: { hi: "क्रिसमस की शुभकामनाएँ", en: "Merry Christmas" }, wish: { hi: "क्रिसमस का यह पर्व सबके जीवन में शांति और प्रेम लाए।", en: "May Christmas bring peace and love to all." }, sub: SUB },
  { id: "independence", label: { hi: "स्वतंत्रता दिवस", en: "Independence Day" }, date: "08-15", bg: ["#ffffff", "#fff4e6"], accent: "#e2560b", text: "#1c1410", light: true, motif: "flag",
    title: { hi: "स्वतंत्रता दिवस की शुभकामनाएँ", en: "Happy Independence Day" }, wish: { hi: "देश की आज़ादी के लिए बलिदान देने वाले वीरों को नमन। जय हिन्द!", en: "A salute to the heroes who gave everything for our freedom. Jai Hind!" }, sub: SUB },
  { id: "republic", label: { hi: "गणतंत्र दिवस", en: "Republic Day" }, date: "01-26", bg: ["#ffffff", "#f1f6ff"], accent: "#e2560b", text: "#1c1410", light: true, motif: "flag",
    title: { hi: "गणतंत्र दिवस की शुभकामनाएँ", en: "Happy Republic Day" }, wish: { hi: "संविधान के मूल्यों के प्रति हमारी निष्ठा सदा अटूट रहे। जय हिन्द!", en: "May our faith in the values of the Constitution stay unshaken. Jai Hind!" }, sub: SUB },
  { id: "newyear", label: { hi: "नव वर्ष", en: "New Year" }, date: "01-01", bg: ["#1c1410", "#3f3530"], accent: "#f2a51a", text: "#ffffff", motif: "sparkles",
    title: { hi: "नव वर्ष की शुभकामनाएँ", en: "Happy New Year" }, wish: { hi: "नया वर्ष आपके और आपके परिवार के लिए सुख, स्वास्थ्य और सफलता लेकर आए।", en: "May the new year bring happiness, health and success to you and your family." }, sub: SUB },
  { id: "supporter", label: { hi: "नया मेहनौन", en: "New Mehnaun" }, bg: ["#f5b700", "#ffd54a"], accent: "#9e3c03", text: "#1c1410", light: true, motif: "lotus",
    title: { hi: "नया मेहनौन", en: "New Mehnaun" }, wish: { hi: "मैं हूँ मेहनौन के विकास के साथ।", en: "I stand with Mehnaun’s development." }, sub: { hi: "विकास, विश्वास और जनसेवा", en: "Development, trust and public service" } },
];

/** Days from today until the next MM-DD (0 = today). */
export function daysUntil(mmdd: string, now = new Date()) {
  const [m, d] = mmdd.split("-").map(Number);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let next = new Date(now.getFullYear(), m - 1, d);
  if (next < today) next = new Date(now.getFullYear() + 1, m - 1, d);
  return Math.round((next.getTime() - today.getTime()) / 864e5);
}
