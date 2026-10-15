/* Our Ideals: lives and words we draw inspiration from. `day` = anniversary used by the e-card maker (MM-DD). */
import type { Bi } from "../i18n";

export type IdealCat = "sangh" | "heroes" | "dharma" | "awakening";

export const idealCats: { id: IdealCat; label: Bi }[] = [
  { id: "sangh", label: { hi: "राष्ट्रवादी विचार के प्रणेता", en: "Leading lights of the Sangh and BJP" } },
  { id: "heroes", label: { hi: "भारत के महानायक", en: "Great heroes of Bharat" } },
  { id: "dharma", label: { hi: "संत और मनीषी", en: "Saints and seers" } },
  { id: "awakening", label: { hi: "सामाजिक-राजनीतिक जागरण के अग्रदूत", en: "Leaders of social and political awakening" } },
];

export type Ideal = {
  id: string;
  cat: IdealCat;
  name: Bi;
  years: string;
  quote: Bi;
  birth?: string; // MM-DD
  death?: string; // MM-DD
};

export const ideals: Ideal[] = [
  { id: "deendayal", cat: "sangh", name: { hi: "पं. दीनदयाल उपाध्याय", en: "Pt. Deendayal Upadhyaya" }, years: "1916–1968", birth: "09-25", death: "02-11",
    quote: { hi: "अंत्योदय: विकास की कसौटी वह व्यक्ति है जो समाज की सबसे अंतिम पंक्ति में खड़ा है।", en: "Antyodaya: the measure of development is the person standing in the very last row of society." } },
  { id: "atal", cat: "sangh", name: { hi: "श्री अटल बिहारी वाजपेयी", en: "Shri Atal Bihari Vajpayee" }, years: "1924–2018", birth: "12-25", death: "08-16",
    quote: { hi: "छोटे मन से कोई बड़ा नहीं होता, टूटे मन से कोई खड़ा नहीं होता।", en: "No one grows great with a small mind; no one stands tall with a broken heart." } },
  { id: "mookerjee", cat: "sangh", name: { hi: "डॉ. श्यामा प्रसाद मुखर्जी", en: "Dr. Syama Prasad Mookerjee" }, years: "1901–1953", birth: "07-06", death: "06-23",
    quote: { hi: "एक देश में दो विधान, दो प्रधान और दो निशान नहीं चलेंगे।", en: "One country cannot have two constitutions, two heads and two flags." } },
  { id: "nanaji", cat: "sangh", name: { hi: "भारत रत्न नानाजी देशमुख", en: "Bharat Ratna Nanaji Deshmukh" }, years: "1916–2010", birth: "10-11", death: "02-27",
    quote: { hi: "मैं अपने लिए नहीं, अपनों के लिए हूँ; और अपने वे हैं जो पीड़ित और उपेक्षित हैं।", en: "I am not for myself but for my own; and my own are those who are suffering and neglected." } },
  { id: "modi", cat: "sangh", name: { hi: "श्री नरेन्द्र मोदी", en: "Shri Narendra Modi" }, years: "1950",
    quote: { hi: "सबका साथ, सबका विकास, सबका विश्वास, सबका प्रयास।", en: "Together with all, development for all, the trust of all, the effort of all." } },

  { id: "bose", cat: "heroes", name: { hi: "नेताजी सुभाष चंद्र बोस", en: "Netaji Subhas Chandra Bose" }, years: "1897–1945", birth: "01-23",
    quote: { hi: "तुम मुझे खून दो, मैं तुम्हें आज़ादी दूँगा।", en: "Give me blood, and I will give you freedom." } },
  { id: "patel", cat: "heroes", name: { hi: "सरदार वल्लभभाई पटेल", en: "Sardar Vallabhbhai Patel" }, years: "1875–1950", birth: "10-31", death: "12-15",
    quote: { hi: "एकता के बिना जनशक्ति, शक्ति नहीं है; जब वह ठीक से संगठित होती है, तभी वह आत्मिक शक्ति बनती है।", en: "Manpower without unity is not a strength; only when it is properly united does it become a spiritual power." } },
  { id: "tilak", cat: "heroes", name: { hi: "लोकमान्य बाल गंगाधर तिलक", en: "Lokmanya Bal Gangadhar Tilak" }, years: "1856–1920", birth: "07-23", death: "08-01",
    quote: { hi: "स्वराज मेरा जन्मसिद्ध अधिकार है, और मैं उसे लेकर रहूँगा।", en: "Swaraj is my birthright, and I shall have it." } },
  { id: "bhagat", cat: "heroes", name: { hi: "शहीद भगत सिंह", en: "Shaheed Bhagat Singh" }, years: "1907–1931", birth: "09-28", death: "03-23",
    quote: { hi: "क्रांति मानव जाति का अविच्छिन्न अधिकार है, और स्वतंत्रता सबका जन्मसिद्ध अधिकार।", en: "Revolution is an inalienable right of mankind; freedom is the birthright of all." } },
  { id: "azad", cat: "heroes", name: { hi: "चंद्रशेखर आज़ाद", en: "Chandrashekhar Azad" }, years: "1906–1931", birth: "07-23", death: "02-27",
    quote: { hi: "दुश्मन की गोलियों का हम सामना करेंगे, आज़ाद ही रहे हैं, आज़ाद ही रहेंगे।", en: "We will face the enemy’s bullets; we have always been free, and free we shall remain." } },
  { id: "lakshmibai", cat: "heroes", name: { hi: "रानी लक्ष्मीबाई", en: "Rani Lakshmibai" }, years: "1828–1858", birth: "11-19", death: "06-18",
    quote: { hi: "मैं अपनी झाँसी नहीं दूँगी।", en: "I shall not give up my Jhansi." } },
  { id: "shastri", cat: "heroes", name: { hi: "लाल बहादुर शास्त्री", en: "Lal Bahadur Shastri" }, years: "1904–1966", birth: "10-02", death: "01-11",
    quote: { hi: "जय जवान, जय किसान।", en: "Hail the soldier, hail the farmer." } },
  { id: "kalam", cat: "heroes", name: { hi: "डॉ. ए.पी.जे. अब्दुल कलाम", en: "Dr. A.P.J. Abdul Kalam" }, years: "1931–2015", birth: "10-15", death: "07-27",
    quote: { hi: "सपने वे नहीं जो हम सोते समय देखते हैं, सपने वे हैं जो हमें सोने नहीं देते।", en: "Dreams are not what you see in sleep; they are what do not let you sleep." } },

  { id: "vivekananda", cat: "dharma", name: { hi: "स्वामी विवेकानंद", en: "Swami Vivekananda" }, years: "1863–1902", birth: "01-12", death: "07-04",
    quote: { hi: "उठो, जागो और तब तक मत रुको जब तक लक्ष्य प्राप्त न हो जाए।", en: "Arise, awake, and stop not till the goal is reached." } },
  { id: "tulsidas", cat: "dharma", name: { hi: "गोस्वामी तुलसीदास", en: "Goswami Tulsidas" }, years: "1532–1623",
    quote: { hi: "परहित सरिस धरम नहिं भाई। पर पीड़ा सम नहिं अधमाई॥", en: "There is no virtue like doing good to others, and no sin like causing them pain." } },
  { id: "kabir", cat: "dharma", name: { hi: "संत कबीर", en: "Sant Kabir" }, years: "15वीं सदी|15th century",
    quote: { hi: "बुरा जो देखन मैं चला, बुरा न मिलिया कोय। जो दिल खोजा आपना, मुझसा बुरा न कोय॥", en: "I went looking for the bad and found none; when I searched my own heart, I found none worse than me." } },
  { id: "nanak", cat: "dharma", name: { hi: "गुरु नानक देव", en: "Guru Nanak Dev" }, years: "1469–1539",
    quote: { hi: "किरत करो, नाम जपो, वंड छको: ईमानदारी से श्रम करो, ईश्वर को याद रखो और बाँटकर खाओ।", en: "Kirat karo, naam japo, vand chhako: work honestly, remember God, and share what you have." } },
  { id: "dayanand", cat: "dharma", name: { hi: "महर्षि दयानंद सरस्वती", en: "Maharshi Dayanand Saraswati" }, years: "1824–1883", death: "10-30",
    quote: { hi: "वेदों की ओर लौटो।", en: "Go back to the Vedas." } },

  { id: "gandhi", cat: "awakening", name: { hi: "महात्मा गांधी", en: "Mahatma Gandhi" }, years: "1869–1948", birth: "10-02", death: "01-30",
    quote: { hi: "जब भी संदेह हो, सबसे गरीब और कमज़ोर व्यक्ति का चेहरा याद करो और सोचो कि तुम्हारा अगला कदम उसके किसी काम आएगा या नहीं।", en: "Whenever in doubt, recall the face of the poorest and weakest person you have seen, and ask if the step you contemplate will be of any use to them." } },
  { id: "ambedkar", cat: "awakening", name: { hi: "डॉ. भीमराव आंबेडकर", en: "Dr. Bhimrao Ambedkar" }, years: "1891–1956", birth: "04-14", death: "12-06",
    quote: { hi: "शिक्षित बनो, संगठित रहो, संघर्ष करो।", en: "Educate, organise, agitate." } },
  { id: "lohia", cat: "awakening", name: { hi: "डॉ. राम मनोहर लोहिया", en: "Dr. Ram Manohar Lohia" }, years: "1910–1967", birth: "03-23", death: "10-12",
    quote: { hi: "ज़िंदा क़ौमें पाँच साल इंतज़ार नहीं करतीं।", en: "Living nations do not wait five years." } },
];

export const yearsText = (y: string, lang: "hi" | "en") => (y.includes("|") ? y.split("|")[lang === "hi" ? 0 : 1] : y);

/** A different thought each day, the same for every visitor. */
export function thoughtOfTheDay(date = new Date()) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start) / 864e5);
  return ideals[day % ideals.length];
}
