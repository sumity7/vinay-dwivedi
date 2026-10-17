/* Vichar: articles on government schemes and development. Check figures against the linked sources before editing. */
import type { Bi } from "../i18n";

export type ArticleCat = "schemes" | "farmers" | "women" | "education" | "employment" | "development";
export type ArticleIcon = "health" | "house" | "wheat" | "shield" | "book" | "tools" | "chart" | "road";

export const articleCats: { id: ArticleCat; label: Bi }[] = [
  { id: "schemes", label: { hi: "सरकारी योजनाएँ", en: "Government schemes" } },
  { id: "education", label: { hi: "शिक्षा", en: "Education" } },
  { id: "women", label: { hi: "महिला सुरक्षा", en: "Women’s safety" } },
  { id: "employment", label: { hi: "रोज़गार", en: "Employment" } },
  { id: "farmers", label: { hi: "किसान", en: "Farmers" } },
  { id: "development", label: { hi: "विकास", en: "Development" } },
];

export type Article = {
  slug: string;
  cat: ArticleCat;
  icon: ArticleIcon;
  published: string;
  readMin: number;
  figure?: { value: Bi; label: Bi };
  title: Bi;
  summary: Bi;
  what: Bi;
  who: Bi;
  steps: Bi[];
  position: Bi;
  site?: { label: string; url: string };
  sources: { label: Bi; url: string }[];
};

export const articles: Article[] = [
  {
    slug: "ayushman-bharat",
    cat: "schemes",
    icon: "health",
    published: "2026-10-10",
    readMin: 3,
    figure: { value: { hi: "₹5 लाख", en: "₹5 lakh" }, label: { hi: "प्रति परिवार, प्रति वर्ष", en: "per family, per year" } },
    title: { hi: "आयुष्मान भारत: हर साल ₹5 लाख तक का मुफ़्त इलाज", en: "Ayushman Bharat: free treatment up to ₹5 lakh a year" },
    summary: {
      hi: "पात्र परिवारों को सरकारी और सूचीबद्ध निजी अस्पतालों में कैशलेस इलाज, और अब 70 वर्ष से अधिक आयु के हर नागरिक को।",
      en: "Cashless treatment in government and listed private hospitals for eligible families, and now for every citizen aged 70 and above.",
    },
    what: {
      hi: "सितंबर 2018 में शुरू हुई आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना (PM-JAY) पात्र परिवारों को अस्पताल में भर्ती होकर इलाज के लिए हर साल प्रति परिवार ₹5 लाख तक का स्वास्थ्य कवर देती है। इलाज सूचीबद्ध सरकारी और निजी अस्पतालों में बिना पैसे दिए (कैशलेस) होता है। अक्टूबर 2024 से 70 वर्ष या उससे अधिक आयु के सभी नागरिक, आय की परवाह किए बिना, इसके दायरे में हैं।",
      en: "Launched in September 2018, Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY) gives eligible families health cover of up to ₹5 lakh a year for hospital treatment. Treatment is cashless at listed government and private hospitals. Since October 2024, every citizen aged 70 or above is covered, whatever their income.",
    },
    who: {
      hi: "सामाजिक-आर्थिक जाति जनगणना (SECC 2011) के आधार पर चिन्हित गरीब और वंचित परिवार, राज्य द्वारा जोड़े गए परिवार, और 70 वर्ष से अधिक आयु के सभी वरिष्ठ नागरिक।",
      en: "Poor and deprived families identified through the Socio-Economic Caste Census (SECC 2011), families added by the state, and all senior citizens aged 70 and above.",
    },
    steps: [
      { hi: "beneficiary.nha.gov.in या ‘आयुष्मान ऐप’ पर अपना नाम जाँचें।", en: "Check your name at beneficiary.nha.gov.in or in the Ayushman app." },
      { hi: "आधार लेकर नज़दीकी जन सेवा केंद्र (CSC) या सूचीबद्ध अस्पताल के ‘आयुष्मान मित्र’ से आयुष्मान कार्ड बनवाएँ।", en: "Take your Aadhaar to a Common Service Centre (CSC) or the Ayushman Mitra at a listed hospital to get your Ayushman card." },
      { hi: "जानकारी या शिकायत के लिए राष्ट्रीय हेल्पलाइन 14555 पर कॉल करें।", en: "For information or complaints, call the national helpline 14555." },
    ],
    position: {
      hi: "बीमारी किसी गरीब परिवार को कर्ज़ में न डुबोए, यही इस योजना की सबसे बड़ी उपलब्धि है। क्षेत्र का हर पात्र परिवार आयुष्मान कार्ड बनवाए, इसके लिए हम गाँव-गाँव शिविर लगवाने का प्रयास करते हैं।",
      en: "That illness should not push a poor family into debt is this scheme’s greatest achievement. We work to hold camps in villages so that every eligible family in the area gets an Ayushman card.",
    },
    site: { label: "pmjay.gov.in", url: "https://pmjay.gov.in" },
    sources: [{ label: { hi: "राष्ट्रीय स्वास्थ्य प्राधिकरण: आयुष्मान भारत PM-JAY", en: "National Health Authority: Ayushman Bharat PM-JAY" }, url: "https://pmjay.gov.in" }],
  },
  {
    slug: "pm-awas-gramin",
    cat: "schemes",
    icon: "house",
    published: "2026-10-10",
    readMin: 3,
    figure: { value: { hi: "₹1.20 लाख", en: "₹1.20 lakh" }, label: { hi: "मैदानी क्षेत्र में एक घर के लिए", en: "for a house in the plains" } },
    title: { hi: "प्रधानमंत्री आवास योजना (ग्रामीण): हर परिवार का पक्का घर", en: "PM Awas Yojana (Gramin): a pucca house for every family" },
    summary: {
      hi: "पक्का घर बनाने के लिए किस्तों में पैसा सीधे बैंक खाते में, साथ में जुड़ी योजनाओं से शौचालय, गैस और बिजली कनेक्शन।",
      en: "Money in instalments straight to your bank account to build a pucca house, with a toilet, gas and power connection through linked schemes.",
    },
    what: {
      hi: "प्रधानमंत्री आवास योजना-ग्रामीण (PMAY-G) के तहत बेघर और कच्चे घरों में रहने वाले ग्रामीण परिवारों को पक्का घर बनाने के लिए मैदानी क्षेत्रों में ₹1.20 लाख और पहाड़ी व दुर्गम क्षेत्रों में ₹1.30 लाख की सहायता किस्तों में सीधे बैंक खाते में दी जाती है। इसके साथ मनरेगा से 90 दिन की मज़दूरी और स्वच्छ भारत मिशन से शौचालय के लिए सहायता भी मिलती है।",
      en: "Under Pradhan Mantri Awas Yojana-Gramin (PMAY-G), rural families who are homeless or live in kutcha houses get ₹1.20 lakh in the plains and ₹1.30 lakh in hilly and difficult areas to build a pucca house, paid in instalments straight to their bank account. They also get 90 days’ wages under MGNREGA and help for a toilet under the Swachh Bharat Mission.",
    },
    who: {
      hi: "SECC 2011 और आवास+ सर्वे में चिन्हित बेघर या कच्चे/जर्जर घरों में रहने वाले ग्रामीण परिवार, जिनकी सूची ग्राम सभा सत्यापित करती है।",
      en: "Rural families who are homeless or live in kutcha or dilapidated houses, as identified in SECC 2011 and the Awaas+ survey, with the list verified by the Gram Sabha.",
    },
    steps: [
      { hi: "अपने ग्राम प्रधान, ग्राम सचिव या ब्लॉक कार्यालय से संपर्क कर जानें कि आपका नाम सूची में है या नहीं।", en: "Ask your gram pradhan, panchayat secretary or block office whether your name is on the list." },
      { hi: "आधार, बैंक खाता और मनरेगा जॉब कार्ड की जानकारी ब्लॉक कार्यालय में जमा करें।", en: "Submit your Aadhaar, bank account and MGNREGA job card details at the block office." },
      { hi: "pmayg.nic.in पर अपने आवास और किस्तों की स्थिति देखें।", en: "Check the status of your house and instalments at pmayg.nic.in." },
    ],
    position: {
      hi: "पक्की छत केवल घर नहीं, सम्मान और सुरक्षा है। क्षेत्र में कोई पात्र परिवार इससे वंचित न रहे, इसके लिए हम सूची और किस्तों की निगरानी करते हैं। अगर किस्त अटकी है, तो ई-शिकायत पर ‘आवास’ चुनकर बताएँ।",
      en: "A pucca roof is not just a house; it is dignity and safety. We watch the lists and instalments so that no eligible family in the area is left out. If an instalment is stuck, tell us on e-Shikayat under ‘Housing’.",
    },
    site: { label: "pmayg.nic.in", url: "https://pmayg.nic.in" },
    sources: [{ label: { hi: "ग्रामीण विकास मंत्रालय: PMAY-G", en: "Ministry of Rural Development: PMAY-G" }, url: "https://pmayg.nic.in" }],
  },
  {
    slug: "pm-kisan",
    cat: "farmers",
    icon: "wheat",
    published: "2026-10-10",
    readMin: 2,
    figure: { value: { hi: "₹6,000", en: "₹6,000" }, label: { hi: "हर साल, तीन किस्तों में", en: "a year, in three instalments" } },
    title: { hi: "पीएम किसान सम्मान निधि: हर किसान परिवार को सालाना ₹6,000", en: "PM Kisan Samman Nidhi: ₹6,000 a year to every farmer family" },
    summary: {
      hi: "भूमिधारक किसान परिवारों के बैंक खाते में हर साल ₹2,000 की तीन किस्तें सीधे।",
      en: "Three instalments of ₹2,000 a year directly into the bank accounts of land-holding farmer families.",
    },
    what: {
      hi: "24 फ़रवरी 2019 को उत्तर प्रदेश के गोरखपुर से शुरू हुई पीएम-किसान योजना के तहत किसान परिवारों को हर साल ₹6,000 दिए जाते हैं, ₹2,000 की तीन किस्तों में सीधे उनके बैंक खाते में।",
      en: "Launched from Gorakhpur, Uttar Pradesh, on 24 February 2019, PM-KISAN pays farmer families ₹6,000 a year, in three instalments of ₹2,000 sent straight to their bank accounts.",
    },
    who: {
      hi: "जिन किसान परिवारों के नाम पर खेती योग्य भूमि है। आयकरदाता, संस्थागत भूमिधारक और कुछ पेशेवर/पेंशनभोगी इससे बाहर हैं।",
      en: "Farmer families who own cultivable land in their name. Income-tax payers, institutional land holders and some professionals and pensioners are excluded.",
    },
    steps: [
      { hi: "pmkisan.gov.in पर ‘New Farmer Registration’ से या नज़दीकी CSC पर पंजीकरण करें।", en: "Register at pmkisan.gov.in (New Farmer Registration) or at a CSC." },
      { hi: "ई-केवाईसी पूरा करें और बैंक खाते को आधार से जोड़ें, वरना किस्त रुक जाती है।", en: "Complete e-KYC and link Aadhaar to your bank account, or instalments stop." },
      { hi: "उसी वेबसाइट पर ‘Know Your Status’ में स्थिति देखें; हेल्पलाइन 155261।", en: "Check your status under ‘Know Your Status’ on the same site; helpline 155261." },
    ],
    position: {
      hi: "अन्नदाता देश का पेट भरता है; अब उसका पैसा बिना बिचौलिए के, पूरा का पूरा उसके खाते में पहुँचता है। प्रत्यक्ष लाभ अंतरण ने यही बदला है।",
      en: "The farmer feeds the nation; now the money reaches him in full, without a middleman. That is what direct benefit transfer has changed.",
    },
    site: { label: "pmkisan.gov.in", url: "https://pmkisan.gov.in" },
    sources: [{ label: { hi: "कृषि एवं किसान कल्याण मंत्रालय: पीएम-किसान", en: "Ministry of Agriculture: PM-KISAN" }, url: "https://pmkisan.gov.in" }],
  },
  {
    slug: "mission-shakti",
    cat: "women",
    icon: "shield",
    published: "2026-10-09",
    readMin: 3,
    title: { hi: "मिशन शक्ति: उत्तर प्रदेश में महिलाओं की सुरक्षा, सम्मान और स्वावलंबन", en: "Mission Shakti: safety, respect and self-reliance for women in UP" },
    summary: {
      hi: "हर थाने में महिला हेल्प डेस्क, त्वरित हेल्पलाइन, और महिलाओं के हाथ में पैसा व हुनर देने वाली योजनाएँ।",
      en: "Women’s help desks in every police station, quick-response helplines, and schemes that put money and skills in women’s hands.",
    },
    what: {
      hi: "अक्टूबर 2020 में शारदीय नवरात्रि पर मुख्यमंत्री श्री योगी आदित्यनाथ जी द्वारा शुरू किया गया मिशन शक्ति महिलाओं और बेटियों की सुरक्षा, सम्मान और स्वावलंबन का प्रदेशव्यापी अभियान है। इसके तहत थानों में महिला हेल्प डेस्क, जागरूकता अभियान और महिलाओं के लिए विभिन्न योजनाएँ एक साथ चलती हैं।",
      en: "Launched by Chief Minister Shri Yogi Adityanath during Sharadiya Navratri in October 2020, Mission Shakti is a statewide campaign for the safety, dignity and self-reliance of women and girls. It brings together women’s help desks in police stations, awareness drives and schemes for women.",
    },
    who: {
      hi: "उत्तर प्रदेश की हर महिला और बेटी। किसी भी परेशानी में पुलिस, हेल्पलाइन और हेल्प डेस्क से तुरंत मदद ली जा सकती है।",
      en: "Every woman and girl in Uttar Pradesh. Help is available at once from the police, the helplines and the help desks.",
    },
    steps: [
      { hi: "आपात स्थिति में 112 पर कॉल करें।", en: "In an emergency, call 112." },
      { hi: "वुमेन पावर लाइन 1090 या महिला हेल्पलाइन 181 पर शिकायत करें; पहचान गोपनीय रहती है।", en: "Complain to Women Power Line 1090 or women’s helpline 181; your identity is kept confidential." },
      { hi: "अपने थाने की महिला हेल्प डेस्क पर सीधे जाएँ।", en: "Go directly to the women’s help desk at your police station." },
    ],
    position: {
      hi: "बेटियाँ सुरक्षित होंगी तभी आगे बढ़ेंगी। क्षेत्र की हर बहन-बेटी इन नंबरों को जाने, यह हम सबकी ज़िम्मेदारी है।",
      en: "Daughters can move ahead only when they are safe. It is all of our responsibility that every woman and girl in the area knows these numbers.",
    },
    site: { label: "missionshakti.up.gov.in", url: "https://missionshakti.up.gov.in" },
    sources: [{ label: { hi: "उत्तर प्रदेश सरकार: मिशन शक्ति", en: "Government of Uttar Pradesh: Mission Shakti" }, url: "https://missionshakti.up.gov.in" }],
  },
  {
    slug: "nep-2020",
    cat: "education",
    icon: "book",
    published: "2026-10-09",
    readMin: 3,
    title: { hi: "राष्ट्रीय शिक्षा नीति 2020: मातृभाषा में पढ़ाई, कक्षा 6 से हुनर", en: "National Education Policy 2020: learning in your mother tongue, skills from class 6" },
    summary: {
      hi: "34 वर्ष बाद आई नई शिक्षा नीति में बचपन की शिक्षा, भारतीय भाषाएँ और व्यावहारिक कौशल केंद्र में हैं।",
      en: "The first new education policy in 34 years puts early learning, Indian languages and practical skills at the centre.",
    },
    what: {
      hi: "29 जुलाई 2020 को स्वीकृत राष्ट्रीय शिक्षा नीति ने 1986 की नीति की जगह ली। इसमें स्कूली शिक्षा का नया 5+3+3+4 ढाँचा, कम से कम कक्षा 5 तक मातृभाषा या स्थानीय भाषा में पढ़ाई, और कक्षा 6 से व्यावसायिक शिक्षा व इंटर्नशिप की व्यवस्था है।",
      en: "Approved on 29 July 2020, the National Education Policy replaced the 1986 policy. It sets a new 5+3+3+4 structure for school education, teaching in the mother tongue or local language at least up to class 5, and vocational education with internships from class 6.",
    },
    who: {
      hi: "देश का हर विद्यार्थी, आंगनबाड़ी से लेकर विश्वविद्यालय तक।",
      en: "Every student in the country, from the anganwadi to university.",
    },
    steps: [
      { hi: "बच्चे को 3 वर्ष की आयु से आंगनबाड़ी या बाल वाटिका में भेजें।", en: "Send your child to an anganwadi or bal vatika from the age of 3." },
      { hi: "कक्षा 6 से विद्यालय में चल रहे कौशल व व्यावसायिक विषयों के बारे में शिक्षकों से जानकारी लें।", en: "From class 6, ask teachers about the skill and vocational subjects on offer." },
      { hi: "नीति का पूरा पाठ education.gov.in पर पढ़ें।", en: "Read the full policy at education.gov.in." },
    ],
    position: {
      hi: "गाँव का बच्चा अपनी भाषा में सीखे और साथ में हुनर भी, तभी वह आत्मनिर्भर बनेगा। मेहनौन के विद्यालयों को इसी दिशा में मज़बूत करना हमारी प्राथमिकता है।",
      en: "A village child who learns in their own language, and picks up a skill too, grows up self-reliant. Strengthening Mehnaun’s schools in this direction is our priority.",
    },
    site: { label: "education.gov.in", url: "https://www.education.gov.in/nep/about-nep" },
    sources: [{ label: { hi: "शिक्षा मंत्रालय: राष्ट्रीय शिक्षा नीति 2020", en: "Ministry of Education: National Education Policy 2020" }, url: "https://www.education.gov.in/nep/about-nep" }],
  },
  {
    slug: "mudra-vishwakarma",
    cat: "employment",
    icon: "tools",
    published: "2026-10-08",
    readMin: 3,
    figure: { value: { hi: "₹20 लाख", en: "₹20 lakh" }, label: { hi: "अधिकतम मुद्रा ऋण", en: "maximum Mudra loan" } },
    title: { hi: "मुद्रा और पीएम विश्वकर्मा: अपने काम के लिए बिना गारंटी ऋण", en: "Mudra and PM Vishwakarma: loans without collateral for your own work" },
    summary: {
      hi: "छोटे व्यवसाय के लिए ₹20 लाख तक का ऋण, और बढ़ई, कुम्हार, दर्ज़ी जैसे कारीगरों के लिए सस्ता ऋण, प्रशिक्षण और टूलकिट।",
      en: "Loans up to ₹20 lakh for small businesses, and cheap credit, training and a toolkit for carpenters, potters, tailors and other artisans.",
    },
    what: {
      hi: "अप्रैल 2015 में शुरू हुई प्रधानमंत्री मुद्रा योजना में छोटे कारोबार के लिए बिना गारंटी ऋण मिलता है: शिशु (₹50,000 तक), किशोर (₹5 लाख तक), तरुण (₹10 लाख तक) और तरुण प्लस (₹20 लाख तक)। सितंबर 2023 में शुरू हुई पीएम विश्वकर्मा योजना 18 पारंपरिक व्यवसायों के कारीगरों को प्रशिक्षण, टूलकिट और 5% ब्याज पर ₹1 लाख व फिर ₹2 लाख तक का ऋण देती है।",
      en: "Pradhan Mantri Mudra Yojana, launched in April 2015, gives collateral-free loans for small businesses: Shishu (up to ₹50,000), Kishore (up to ₹5 lakh), Tarun (up to ₹10 lakh) and Tarun Plus (up to ₹20 lakh). PM Vishwakarma, launched in September 2023, gives artisans in 18 traditional trades training, a toolkit and loans of ₹1 lakh and then ₹2 lakh at 5% interest.",
    },
    who: {
      hi: "मुद्रा: दुकान, सेवा, उत्पादन या खेती से जुड़ा कोई भी छोटा गैर-कॉरपोरेट व्यवसाय। विश्वकर्मा: बढ़ई, लोहार, कुम्हार, दर्ज़ी, नाई, राजमिस्त्री, मोची जैसे 18 व्यवसायों के कारीगर।",
      en: "Mudra: any small non-corporate business in trade, services, manufacturing or allied farming. Vishwakarma: artisans in 18 trades such as carpenters, blacksmiths, potters, tailors, barbers, masons and cobblers.",
    },
    steps: [
      { hi: "मुद्रा ऋण के लिए किसी भी बैंक शाखा में या jansamarth.in पर आवेदन करें।", en: "For a Mudra loan, apply at any bank branch or at jansamarth.in." },
      { hi: "विश्वकर्मा के लिए नज़दीकी CSC पर pmvishwakarma.gov.in पर पंजीकरण कराएँ; ग्राम प्रधान सत्यापन करते हैं।", en: "For Vishwakarma, register at pmvishwakarma.gov.in through a CSC; the gram pradhan verifies it." },
      { hi: "प्रशिक्षण पूरा करने पर टूलकिट और ऋण की प्रक्रिया आगे बढ़ती है।", en: "After training, the toolkit and loan process moves ahead." },
    ],
    position: {
      hi: "गाँव का युवा नौकरी माँगने वाला नहीं, रोज़गार देने वाला बने। हुनर और पूँजी साथ मिले, तो यह संभव है।",
      en: "The village youth should become a job-giver, not a job-seeker. With skill and capital together, that is possible.",
    },
    site: { label: "pmvishwakarma.gov.in", url: "https://pmvishwakarma.gov.in" },
    sources: [
      { label: { hi: "प्रधानमंत्री मुद्रा योजना", en: "Pradhan Mantri Mudra Yojana" }, url: "https://www.mudra.org.in" },
      { label: { hi: "पीएम विश्वकर्मा", en: "PM Vishwakarma" }, url: "https://pmvishwakarma.gov.in" },
    ],
  },
  {
    slug: "bharat-2014-ke-baad",
    cat: "development",
    icon: "chart",
    published: "2026-10-08",
    readMin: 3,
    figure: { value: { hi: "74 → 160", en: "74 → 160" }, label: { hi: "हवाई अड्डे, 2014 से 2025", en: "airports, 2014 to 2025" } },
    title: { hi: "2014 से पहले और बाद का भारत: आँकड़े क्या कहते हैं", en: "India before and after 2014: what the figures show" },
    summary: {
      hi: "राष्ट्रीय राजमार्ग डेढ़ गुना से अधिक, हवाई अड्डे दोगुने से अधिक, मेडिकल कॉलेज दोगुने, और 56 करोड़ लोगों के पहली बार बैंक खाते।",
      en: "Highways up by more than half, airports more than doubled, medical colleges doubled, and 56 crore people with a bank account for the first time.",
    },
    what: {
      hi: "2014 के बाद देश में बुनियादी ढाँचे और गरीब कल्याण का पैमाना बदला है। राष्ट्रीय राजमार्ग 91,287 किमी से बढ़कर 1,46,204 किमी हुए, परिचालित हवाई अड्डे 74 से 160 हुए, और मेडिकल कॉलेज 387 से 780। जन धन योजना से 56 करोड़ से अधिक खाते खुले और उज्ज्वला से 10 करोड़ से अधिक परिवारों को गैस कनेक्शन मिला।",
      en: "Since 2014 the scale of infrastructure and welfare for the poor has changed. National highways grew from 91,287 km to 1,46,204 km, operational airports from 74 to 160, and medical colleges from 387 to 780. Jan Dhan opened more than 56 crore accounts, and Ujjwala gave over 10 crore families a gas connection.",
    },
    who: {
      hi: "यह बदलाव हर नागरिक तक पहुँचा है: सड़क से यात्रा करने वाले से लेकर पहली बार बैंक खाता खोलने वाली गृहिणी तक।",
      en: "This change has reached every citizen, from the traveller on the highway to the homemaker opening a bank account for the first time.",
    },
    steps: [
      { hi: "पूरे आँकड़े और उनके सरकारी स्रोत ‘उपलब्धियाँ’ पृष्ठ पर देखें।", en: "See all the figures and their government sources on the Achievements page." },
      { hi: "जन धन खाता न हो तो किसी भी बैंक शाखा में शून्य बैलेंस पर खुलवाएँ।", en: "If you don’t have a Jan Dhan account, open one with zero balance at any bank branch." },
    ],
    position: {
      hi: "नारों से नहीं, आँकड़ों से बात होनी चाहिए। हर आँकड़ा सरकारी स्रोत से है और उसका लिंक साथ में दिया गया है।",
      en: "The case should be made with figures, not slogans. Every number comes from a government source, linked alongside it.",
    },
    sources: [
      { label: { hi: "पीआईबी: बुनियादी ढाँचे में 11 वर्ष (जून 2025)", en: "PIB: 11 years of transforming infrastructure (June 2025)" }, url: "https://pib.gov.in" },
      { label: { hi: "पीआईबी: पीएम जन धन योजना के 11 वर्ष (अगस्त 2025)", en: "PIB: 11 years of PM Jan Dhan Yojana (August 2025)" }, url: "https://pib.gov.in" },
    ],
  },
  {
    slug: "uttar-pradesh-2017-ke-baad",
    cat: "development",
    icon: "road",
    published: "2026-10-07",
    readMin: 3,
    title: { hi: "2017 के बाद उत्तर प्रदेश: एक्सप्रेसवे, आस्था और उद्यम", en: "Uttar Pradesh since 2017: expressways, faith and enterprise" },
    summary: {
      hi: "पूर्वांचल और बुंदेलखंड एक्सप्रेसवे, श्री काशी विश्वनाथ धाम, अयोध्या का नया हवाई अड्डा और ‘एक जनपद एक उत्पाद’।",
      en: "The Purvanchal and Bundelkhand expressways, Shri Kashi Vishwanath Dham, Ayodhya’s new airport and ‘One District One Product’.",
    },
    what: {
      hi: "2017 के बाद प्रदेश में बड़े पैमाने पर एक्सप्रेसवे बने: पूर्वांचल एक्सप्रेसवे (नवंबर 2021) और बुंदेलखंड एक्सप्रेसवे (जुलाई 2022)। 24 जनवरी 2018 को ‘एक जनपद एक उत्पाद’ योजना शुरू हुई, दिसंबर 2021 में श्री काशी विश्वनाथ धाम का लोकार्पण हुआ, और दिसंबर 2023 में अयोध्या में महर्षि वाल्मीकि अंतरराष्ट्रीय हवाई अड्डा शुरू हुआ।",
      en: "Since 2017 the state has built expressways on a large scale: the Purvanchal Expressway (November 2021) and the Bundelkhand Expressway (July 2022). ‘One District One Product’ began on 24 January 2018, Shri Kashi Vishwanath Dham was dedicated in December 2021, and Maharishi Valmiki International Airport opened at Ayodhya in December 2023.",
    },
    who: {
      hi: "गोंडा और देवीपाटन मंडल के लोगों के लिए अयोध्या का हवाई अड्डा और बेहतर सड़कें सीधे काम की हैं।",
      en: "For people in Gonda and the Devipatan division, Ayodhya’s airport and better roads are of direct use.",
    },
    steps: [
      { hi: "पूरी समय-रेखा ‘उपलब्धियाँ’ पृष्ठ पर देखें।", en: "See the full timeline on the Achievements page." },
      { hi: "‘एक जनपद एक उत्पाद’ से जुड़कर ऋण और प्रशिक्षण के लिए odopup.in देखें।", en: "For loans and training under ‘One District One Product’, see odopup.in." },
    ],
    position: {
      hi: "प्रदेश की पहचान बदली है। अब यह बदलाव मेहनौन के हर गाँव तक पहुँचे, यही हमारा प्रयास है।",
      en: "The state’s image has changed. Our effort is to carry that change to every village of Mehnaun.",
    },
    sources: [{ label: { hi: "उत्तर प्रदेश सरकार", en: "Government of Uttar Pradesh" }, url: "https://up.gov.in" }],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
