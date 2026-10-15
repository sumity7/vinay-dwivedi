/* Vikas Yatra: development in figures. Every figure carries its source; update both together. */
import type { Bi } from "../i18n";

export type FigIcon = "road" | "plane" | "metro" | "hospital" | "cap" | "bolt" | "bank" | "flame" | "people";

export type Compare = {
  icon: FigIcon;
  title: Bi;
  now: { value: number; label: Bi; when: Bi };
  then: { value: number; label: Bi; when: Bi };
  note?: Bi;
  source: Bi;
};
export type Single = { icon: FigIcon; title: Bi; value: Bi; when: Bi; note?: Bi; source: Bi };
export type Milestone = { date: string; title: Bi; text: Bi };

const PIB_INFRA: Bi = { hi: "स्रोत: पीआईबी, बुनियादी ढाँचे में बदलाव के 11 वर्ष (जून 2025)", en: "Source: PIB, 11 years of transforming infrastructure (June 2025)" };
const HEALTH: Bi = { hi: "स्रोत: स्वास्थ्य मंत्रालय, संसद में उत्तर, आईएएनएस के माध्यम से (दिसंबर 2024)", en: "Source: Ministry of Health in Parliament, via IANS (December 2024)" };

export const indiaCompare: Compare[] = [
  { icon: "road", title: { hi: "राष्ट्रीय राजमार्ग", en: "National highways" }, now: { value: 146204, label: { hi: "1,46,204 किमी", en: "1,46,204 km" }, when: { hi: "अब (मार्च 2025)", en: "Now (March 2025)" } }, then: { value: 91287, label: { hi: "91,287 किमी", en: "91,287 km" }, when: { hi: "तब (2013-14)", en: "Then (2013-14)" } }, source: PIB_INFRA },
  { icon: "plane", title: { hi: "परिचालित हवाई अड्डे", en: "Operational airports" }, now: { value: 160, label: { hi: "160", en: "160" }, when: { hi: "अब (मार्च 2025)", en: "Now (March 2025)" } }, then: { value: 74, label: { hi: "74", en: "74" }, when: { hi: "तब (2014)", en: "Then (2014)" } }, note: { hi: "वाटर एयरोड्रोम और हेलीपोर्ट सहित।", en: "Includes water aerodromes and heliports." }, source: PIB_INFRA },
  { icon: "metro", title: { hi: "मेट्रो रेल नेटवर्क", en: "Metro rail network" }, now: { value: 1013, label: { hi: "1,013 किमी", en: "1,013 km" }, when: { hi: "अब (मई 2025)", en: "Now (May 2025)" } }, then: { value: 248, label: { hi: "248 किमी", en: "248 km" }, when: { hi: "तब (2014)", en: "Then (2014)" } }, source: PIB_INFRA },
  { icon: "hospital", title: { hi: "मेडिकल कॉलेज", en: "Medical colleges" }, now: { value: 780, label: { hi: "780", en: "780" }, when: { hi: "अब (2024)", en: "Now (2024)" } }, then: { value: 387, label: { hi: "387", en: "387" }, when: { hi: "तब (2014)", en: "Then (2014)" } }, source: HEALTH },
  { icon: "cap", title: { hi: "एमबीबीएस सीटें", en: "MBBS seats" }, now: { value: 118137, label: { hi: "1,18,137", en: "1,18,137" }, when: { hi: "अब (2024)", en: "Now (2024)" } }, then: { value: 51348, label: { hi: "51,348", en: "51,348" }, when: { hi: "तब (2014)", en: "Then (2014)" } }, source: HEALTH },
  { icon: "bolt", title: { hi: "रेल लाइनों का विद्युतीकरण", en: "Railway lines electrified" }, now: { value: 45000, label: { hi: "45,000+ रूट किमी", en: "45,000+ route km" }, when: { hi: "2014-25 में", en: "In 2014-25" } }, then: { value: 5188, label: { hi: "5,188 रूट किमी", en: "5,188 route km" }, when: { hi: "2004-14 में", en: "In 2004-14" } }, source: PIB_INFRA },
];

export const indiaSingle: Single[] = [
  { icon: "bank", title: { hi: "जन धन बैंक खाते", en: "Jan Dhan bank accounts" }, value: { hi: "56.16 करोड़", en: "56.16 crore" }, when: { hi: "शुरुआत से (अगस्त 2025 तक)", en: "Since launch (to August 2025)" }, note: { hi: "अगस्त 2014 में शुरू। जमा राशि: ₹2.67 लाख करोड़।", en: "Launched in August 2014. Deposits: ₹2.67 lakh crore." }, source: { hi: "स्रोत: पीआईबी, पीएम जन धन योजना के 11 वर्ष (अगस्त 2025)", en: "Source: PIB, 11 years of PM Jan Dhan Yojana (August 2025)" } },
  { icon: "flame", title: { hi: "मुफ़्त एलपीजी कनेक्शन (उज्ज्वला)", en: "Free LPG connections (Ujjwala)" }, value: { hi: "10.33 करोड़", en: "10.33 crore" }, when: { hi: "शुरुआत से (1 मार्च 2025 तक)", en: "Since launch (to 1 March 2025)" }, note: { hi: "मई 2016 में उत्तर प्रदेश के बलिया से शुरू।", en: "Launched in Ballia, Uttar Pradesh, in May 2016." }, source: { hi: "स्रोत: पीआईबी, पीएम उज्ज्वला योजना के नौ वर्ष (अप्रैल 2025)", en: "Source: PIB, nine years of PM Ujjwala Yojana (April 2025)" } },
  { icon: "people", title: { hi: "बहुआयामी गरीबी से बाहर आए लोग", en: "People out of multidimensional poverty" }, value: { hi: "24.82 करोड़", en: "24.82 crore" }, when: { hi: "2013-14 से 2022-23", en: "2013-14 to 2022-23" }, source: { hi: "स्रोत: नीति आयोग, बहुआयामी गरीबी पर चर्चा पत्र (जनवरी 2024)", en: "Source: NITI Aayog discussion paper on multidimensional poverty (January 2024)" } },
];

export const upMilestones: Milestone[] = [
  { date: "2018-01-24", title: { hi: "एक जनपद एक उत्पाद", en: "One District One Product" }, text: { hi: "उत्तर प्रदेश दिवस पर शुरू; हर जनपद के पारंपरिक उत्पाद को पहचान, ऋण और बाज़ार।", en: "Launched on UP Day: recognition, credit and markets for each district’s traditional product." } },
  { date: "2019-02-24", title: { hi: "पीएम किसान सम्मान निधि", en: "PM Kisan Samman Nidhi" }, text: { hi: "गोरखपुर से देशभर के किसानों के लिए योजना का शुभारंभ।", en: "The scheme for farmers across India was launched from Gorakhpur." } },
  { date: "2021-11-16", title: { hi: "पूर्वांचल एक्सप्रेसवे", en: "Purvanchal Expressway" }, text: { hi: "लखनऊ से गाज़ीपुर तक 341 किमी; पूर्वी उत्तर प्रदेश राजधानी से कुछ घंटों की दूरी पर।", en: "341 km from Lucknow to Ghazipur, bringing eastern UP within hours of the capital." } },
  { date: "2021-12-13", title: { hi: "श्री काशी विश्वनाथ धाम", en: "Shri Kashi Vishwanath Dham" }, text: { hi: "मंदिर को गंगा घाटों से जोड़ने वाले धाम का लोकार्पण।", en: "The corridor linking the temple to the Ganga ghats was dedicated." } },
  { date: "2022-07-16", title: { hi: "बुंदेलखंड एक्सप्रेसवे", en: "Bundelkhand Expressway" }, text: { hi: "296 किमी का एक्सप्रेसवे; बुंदेलखंड को सीधे आगरा-लखनऊ और यमुना एक्सप्रेसवे से जोड़ा।", en: "A 296 km expressway linking Bundelkhand to the Agra-Lucknow and Yamuna expressways." } },
];

export const regionMilestones: Milestone[] = [
  { date: "2023-12-30", title: { hi: "महर्षि वाल्मीकि अंतरराष्ट्रीय हवाई अड्डा, अयोध्या", en: "Maharishi Valmiki International Airport, Ayodhya" }, text: { hi: "गोंडा से कुछ ही दूरी पर नया हवाई अड्डा; साथ ही अयोध्या धाम रेलवे स्टेशन का नया भवन।", en: "A new airport a short drive from Gonda, opened alongside the rebuilt Ayodhya Dham railway station." } },
  { date: "2024-01-22", title: { hi: "श्री राम जन्मभूमि मंदिर में प्राण-प्रतिष्ठा", en: "Pran Pratishtha at Shri Ram Janmabhoomi temple" }, text: { hi: "सरयू पार अयोध्या में भव्य मंदिर; देवीपाटन मंडल में आस्था, पर्यटन और रोज़गार के नए अवसर।", en: "The temple across the Saryu at Ayodhya brings new faith, tourism and jobs to the Devipatan division." } },
];
