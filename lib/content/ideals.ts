/* Our Ideals: the Sangh and BJP leaders whose lives and thought we draw from.
   `line.kind`: "quote" = their own words (well-attested); "about" = a line about their contribution.
   `day` fields = anniversaries used by the e-card maker (MM-DD).
   Portraits: /images/ideals, cropped 4:5 from Wikimedia Commons — license and source in `credit`. */
import type { StaticImageData } from "next/image";
import atal from "@/images/ideals/atal.jpg";
import golwalkar from "@/images/ideals/golwalkar.jpg";
import hedgewar from "@/images/ideals/hedgewar.jpg";
import kalam from "@/images/ideals/kalam.jpg";
import modi from "@/images/ideals/modi.jpg";
import nanaji from "@/images/ideals/nanaji.jpg";
import rajmata from "@/images/ideals/rajmata.jpg";
import vivekananda from "@/images/ideals/vivekananda.jpg";
import type { Bi } from "../i18n";

export type IdealGroup = "sangh" | "bjp" | "nation";

export const idealGroups: { id: IdealGroup; label: Bi }[] = [
  { id: "sangh", label: { hi: "राष्ट्रीय स्वयंसेवक संघ", en: "Rashtriya Swayamsevak Sangh" } },
  { id: "bjp", label: { hi: "भारतीय जनता पार्टी", en: "Bharatiya Janata Party" } },
  { id: "nation", label: { hi: "राष्ट्र-निर्माता", en: "Nation builders" } },
];

export type Ideal = {
  id: string;
  group: IdealGroup;
  name: Bi;
  years: string;
  role: Bi;
  line: { kind: "quote" | "about"; text: Bi };
  img: StaticImageData;
  credit: { by: string; license: string; url: string };
  birth?: string; // MM-DD
  death?: string; // MM-DD
};

export const ideals: Ideal[] = [
  {
    id: "hedgewar", group: "sangh", years: "1889–1940", birth: "04-01", death: "06-21", img: hedgewar,
    name: { hi: "डॉ. केशव बलिराम हेडगेवार", en: "Dr. Keshav Baliram Hedgewar" },
    role: { hi: "राष्ट्रीय स्वयंसेवक संघ के संस्थापक", en: "Founder, Rashtriya Swayamsevak Sangh" },
    line: { kind: "about", text: {
      hi: "1925 में विजयादशमी के दिन नागपुर में संघ की स्थापना की और शाखा के माध्यम से चरित्रवान, अनुशासित व्यक्ति-निर्माण का मार्ग दिखाया।",
      en: "Founded the Sangh in Nagpur on Vijayadashami 1925, and showed how the daily shakha builds disciplined people of character." } },
    credit: { by: "Sudhirn", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Dr._Hedgevar.jpg" },
  },
  {
    id: "golwalkar", group: "sangh", years: "1906–1973", birth: "02-19", death: "06-05", img: golwalkar,
    name: { hi: "श्री माधव सदाशिव गोलवलकर ‘श्री गुरुजी’", en: "Shri M. S. Golwalkar ‘Shri Guruji’" },
    role: { hi: "संघ के द्वितीय सरसंघचालक (1940–1973)", en: "Second Sarsanghchalak of the Sangh (1940–1973)" },
    line: { kind: "about", text: {
      hi: "33 वर्षों तक सरसंघचालक रहकर संघ कार्य को देश के हर कोने तक पहुँचाया और सेवा व संगठन के अनेक कार्यों के प्रेरणास्रोत बने।",
      en: "Led the Sangh for 33 years, carrying its work to every corner of the country and inspiring many service and organisational efforts." } },
    credit: { by: "Filmindia magazine, 1949", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:M_S_Golwalkar.jpg" },
  },
  {
    id: "nanaji", group: "sangh", years: "1916–2010", birth: "10-11", death: "02-27", img: nanaji,
    name: { hi: "भारत रत्न नानाजी देशमुख", en: "Bharat Ratna Nanaji Deshmukh" },
    role: { hi: "ग्रामोदय के प्रणेता, चित्रकूट", en: "Pioneer of village self-reliance, Chitrakoot" },
    line: { kind: "quote", text: {
      hi: "मैं अपने लिए नहीं, अपनों के लिए हूँ; अपने वे हैं जो सदियों से पीड़ित और उपेक्षित हैं।",
      en: "I am not for myself but for my own; and my own are those who have suffered and been neglected for centuries." } },
    credit: { by: "India Post, Government of India", license: "GODL-India", url: "https://commons.wikimedia.org/wiki/File:Nanaji_Deshmukh_2017_stamp_of_India.jpg" },
  },
  {
    id: "atal", group: "bjp", years: "1924–2018", birth: "12-25", death: "08-16", img: atal,
    name: { hi: "भारत रत्न श्री अटल बिहारी वाजपेयी", en: "Bharat Ratna Shri Atal Bihari Vajpayee" },
    role: { hi: "भाजपा के संस्थापक अध्यक्ष, पूर्व प्रधानमंत्री", en: "Founding President of the BJP, former Prime Minister" },
    line: { kind: "quote", text: {
      hi: "छोटे मन से कोई बड़ा नहीं होता, टूटे मन से कोई खड़ा नहीं होता।",
      en: "No one grows great with a small mind; no one stands tall with a broken heart." } },
    credit: { by: "Government of India", license: "GODL-India", url: "https://commons.wikimedia.org/wiki/File:Atal_Bihari_Vajpayee_(crop_2).jpg" },
  },
  {
    id: "rajmata", group: "bjp", years: "1919–2001", birth: "10-12", death: "01-25", img: rajmata,
    name: { hi: "राजमाता विजयाराजे सिंधिया", en: "Rajmata Vijaya Raje Scindia" },
    role: { hi: "भाजपा की संस्थापक उपाध्यक्ष", en: "Founding Vice-President of the BJP" },
    line: { kind: "about", text: {
      hi: "भाजपा को जन-जन तक पहुँचाने में अग्रणी रहीं; सादगी और जनसेवा से ‘राजमाता’ के रूप में घर-घर में सम्मान पाया।",
      en: "A leading force in taking the BJP to the people, honoured in every home as ‘Rajmata’ for her simplicity and service." } },
    credit: { by: "India Post, Government of India", license: "GODL-India", url: "https://commons.wikimedia.org/wiki/File:Vijaya_Raje_Scindia_2001_cover_of_India_crop.jpg" },
  },
  {
    id: "modi", group: "bjp", years: "1950", birth: "09-17", img: modi,
    name: { hi: "श्री नरेन्द्र मोदी", en: "Shri Narendra Modi" },
    role: { hi: "भारत के प्रधानमंत्री", en: "Prime Minister of India" },
    line: { kind: "quote", text: {
      hi: "सबका साथ, सबका विकास, सबका विश्वास, सबका प्रयास।",
      en: "Together with all, development for all, the trust of all, the effort of all." } },
    credit: { by: "Prime Minister's Office", license: "GODL-India", url: "https://commons.wikimedia.org/wiki/File:Shri_Narendra_Modi,_Prime_Minister_of_India.jpg" },
  },
  {
    id: "vivekananda", group: "nation", years: "1863–1902", birth: "01-12", death: "07-04", img: vivekananda,
    name: { hi: "स्वामी विवेकानंद", en: "Swami Vivekananda" },
    role: { hi: "युवाओं के प्रेरणास्रोत, वेदांत के प्रवक्ता", en: "Inspirer of the youth, exponent of Vedanta" },
    line: { kind: "quote", text: {
      hi: "उठो, जागो और तब तक मत रुको जब तक लक्ष्य प्राप्त न हो जाए।",
      en: "Arise, awake, and stop not till the goal is reached." } },
    credit: { by: "Photograph, Chicago, September 1893 (via Wikimedia Commons)", license: "Public domain", url: "https://commons.wikimedia.org/wiki/File:Swami_Vivekananda-1893-09-signed.jpg" },
  },
  {
    id: "kalam", group: "nation", years: "1931–2015", birth: "10-15", death: "07-27", img: kalam,
    name: { hi: "भारत रत्न डॉ. ए. पी. जे. अब्दुल कलाम", en: "Bharat Ratna Dr. A. P. J. Abdul Kalam" },
    role: { hi: "‘मिसाइल मैन’, भारत के 11वें राष्ट्रपति", en: "The ‘Missile Man’, 11th President of India" },
    line: { kind: "quote", text: {
      hi: "सपने वो नहीं जो आप सोते समय देखते हैं, सपने वो हैं जो आपको सोने नहीं देते।",
      en: "Dreams are not what you see in your sleep; dreams are what do not let you sleep." } },
    credit: { by: "Government of India", license: "GODL-India", url: "https://commons.wikimedia.org/wiki/File:A._P._J._Abdul_Kalam_(cropped)_3x4.jpg" },
  },
];

/** "1950" -> "1950 से" / "b. 1950" for the living. */
export const yearsText = (y: string, lang: "hi" | "en") => (y.includes("–") ? y : lang === "hi" ? `जन्म ${y}` : `b. ${y}`);

/** Only their own words make a "thought of the day". */
const quotes = ideals.filter((i) => i.line.kind === "quote");

/** A different thought each day, the same for every visitor. */
export function thoughtOfTheDay(date = new Date()) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start) / 864e5);
  return quotes[day % quotes.length];
}
