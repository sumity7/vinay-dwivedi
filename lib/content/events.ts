/* Events (news posts with photo albums). Newest first. The first one marked `featured` leads the list. */
import type { StaticImageData } from "next/image";
import type { Bi } from "../i18n";
import { img } from "../images";

export type Photo = { img: StaticImageData; cap: Bi };

export type EventPost = {
  slug: string;
  date: string; // YYYY-MM-DD
  featured?: boolean;
  category: Bi;
  place: Bi;
  title: Bi;
  summary: Bi;
  lead: Bi;
  body: Bi[];
  points: Bi[]; // "key points" box: short facts from the post
  context: Bi[]; // background and "what it means for you" paragraphs (general context, no new claims about the event)
  photos: Photo[]; // first photo is the cover
  source?: string; // link to the original post
};

const CAT = { events: { hi: "कार्यक्रम", en: "Events" }, outreach: { hi: "जनसंपर्क", en: "Outreach" }, relief: { hi: "राहत कार्य", en: "Relief" }, culture: { hi: "आस्था व संस्कृति", en: "Faith & culture" } };

export const events: EventPost[] = [
  {
    slug: "navratri-durga-puja-bhagwat-katha",
    points: [
      { hi: "चार गाँवों में पूजन: पारासराय, जमुनही हरदोपट्टी, बगाही (जगन्नाथीपुर) और नौसहरा (इटियाथोक)", en: "Prayers in four villages: Parasrai, Jamunhi Hardopatti, Bagahi (Jagannathipur) and Nausahra (Itia Thok)" },
      { hi: "आयोजन गाँवों की पूजा समितियों द्वारा किए गए: दुर्गा पूजा और श्रीमद्भागवत कथा", en: "Organised by the villages’ own puja committees: Durga Puja and Shrimad Bhagwat Katha" },
      { hi: "व्यासपीठ का आशीर्वाद लिया और माँ भगवती का पूजन-अर्चन किया", en: "Received the blessings of the Vyaspeeth and offered prayers to Maa Bhagwati" },
      { hi: "समस्त क्षेत्रवासियों के सुख, शांति व समृद्धि की कामना", en: "Prayed for the happiness, peace and prosperity of everyone in the area" },
    ],
    context: [
      {
        hi: "नवरात्रि के नौ दिन माँ दुर्गा के नौ स्वरूपों की आराधना के होते हैं। गाँवों में यह पर्व किसी एक परिवार का नहीं, पूरे गाँव का होता है: पूजा समिति बनती है, पंडाल सजता है, रोज़ आरती होती है और हर घर अपनी सामर्थ्य से सहयोग करता है।",
        en: "The nine nights of Navratri are devoted to the nine forms of Maa Durga. In villages the festival belongs to everyone, not one family: a puja committee is formed, a pandal is decorated, aarti is held every day and each household helps as it can.",
      },
      {
        hi: "श्रीमद्भागवत कथा में कथावाचक व्यासपीठ से श्रीमद्भागवत पुराण का वाचन करते हैं, जो प्रायः कई दिनों तक चलता है। पूरा गाँव एक साथ बैठकर कथा सुनता है, इसलिए यह भक्ति के साथ-साथ आपसी मेल-जोल का भी अवसर बन जाता है।",
        en: "In a Bhagwat Katha the kathavachak reads and explains the Shrimad Bhagwat Purana from the Vyaspeeth, usually over several days. The whole village sits and listens together, so it is a time for devotion and for coming together.",
      },
      {
        hi: "ऐसे आयोजनों में पूरा गाँव एक जगह जुटता है, इसीलिए जनप्रतिनिधि भी इनमें पहुँचकर लोगों से सीधे मिल पाते हैं। यदि आपके गाँव में भी कोई धार्मिक या सामाजिक आयोजन है और आप विधायक जी को आमंत्रित करना चाहते हैं, तो संपर्क पृष्ठ पर आमंत्रण भेजें।",
        en: "Because the whole village gathers at such events, public representatives can meet people directly there. If your village is holding a religious or community event and you would like to invite the MLA, send an invitation through the Contact page.",
      },
    ],
    date: "2026-10-16",
    category: CAT.culture,
    place: { hi: "पारासराय, जमुनही हरदोपट्टी, बगाही, नौसहरा (इटियाथोक)", en: "Parasrai, Jamunhi Hardopatti, Bagahi, Nausahra (Itia Thok)" },
    title: { hi: "नवरात्रि: दुर्गा पूजा एवं श्रीमद्भागवत कथा में सहभागिता", en: "Navratri: Durga Puja and Shrimad Bhagwat Katha across the constituency" },
    summary: {
      hi: "मेहनौन विधानसभा के चार गाँवों में आयोजित दुर्गा पूजा महोत्सव और श्रीमद्भागवत कथा में सम्मिलित होकर माँ भगवती का पूजन-अर्चन किया।",
      en: "Joined Durga Puja celebrations and Shrimad Bhagwat Katha gatherings in four villages of Mehnaun and offered prayers to Maa Bhagwati.",
    },
    lead: {
      hi: "नवरात्रि के पावन अवसर पर विधायक जी ने क्षेत्र के अनेक गाँवों में पूजा समितियों द्वारा आयोजित दुर्गा पूजा एवं श्रीमद्भागवत कथा में सहभागिता की और समस्त क्षेत्रवासियों के सुख, शांति व समृद्धि की मंगलकामना की।",
      en: "During Navratri the MLA joined Durga Puja and Bhagwat Katha gatherings organised by village puja committees, and prayed for the happiness, peace and prosperity of everyone in the area.",
    },
    body: [
      {
        hi: "ग्रामसभा पारासराय स्थित चतुर्भुजी मंदिर में श्री नवदुर्गा पूजा समिति तथा ग्रामसभा जमुनही हरदोपट्टी में श्री-श्री 1008 माँ दुर्गा पूजा सेवा समिति द्वारा आयोजित दुर्गा पूजा एवं श्रीमद्भागवत कथा में सम्मिलित होकर विधिवत पूजन-अर्चन किया और व्यासपीठ का आशीर्वाद प्राप्त किया।",
        en: "At the Chaturbhuji temple in Parasrai (Shri Navdurga Puja Samiti) and at Jamunhi Hardopatti (Shri Shri 1008 Maa Durga Puja Seva Samiti), he took part in the Durga Puja and Bhagwat Katha and received the blessings of the Vyaspeeth.",
      },
      {
        hi: "ग्रामसभा बगाही (जगन्नाथीपुर) में श्री नवदुर्गा पूजा समिति के दुर्गा पूजा समारोह तथा श्री सम्मय माता मंदिर, नौसहरा (इटियाथोक) में आयोजित दुर्गा पूजा एवं श्रीमद्भागवत कथा में भी माँ भगवती का पूजन किया।",
        en: "He also offered prayers at the Shri Navdurga Puja Samiti celebration in Bagahi (Jagannathipur) and at the Durga Puja and Bhagwat Katha at the Shri Sammay Mata temple, Nausahra (Itia Thok).",
      },
      {
        hi: "श्रीमद्भागवत कथा जैसे धार्मिक आयोजन हमारी सनातन संस्कृति, परंपराओं और संस्कारों को नई पीढ़ी तक पहुँचाते हैं तथा समाज में भक्ति, सद्भाव, सेवा और नैतिक मूल्यों को सुदृढ़ करते हैं। जय माता दी!",
        en: "Religious gatherings like the Bhagwat Katha carry our culture, traditions and values to the next generation, and strengthen devotion, harmony, service and moral values in society.",
      },
    ],
    photos: [
      { img: img.fbJamunhi5, cap: { hi: "जमुनही हरदोपट्टी में माँ दुर्गा का पूजन-अर्चन", en: "Worship of Maa Durga at Jamunhi Hardopatti" } },
      { img: img.fbJamunhi1, cap: { hi: "श्रीमद्भागवत कथा में व्यासपीठ का आशीर्वाद", en: "Blessings from the Vyaspeeth at the Bhagwat Katha" } },
      { img: img.fbNausahra1, cap: { hi: "श्री सम्मय माता मंदिर, नौसहरा में पूजन", en: "Prayers at the Shri Sammay Mata temple, Nausahra" } },
      { img: img.fbBagahi1, cap: { hi: "बगाही (जगन्नाथीपुर) में माँ भगवती की आराधना", en: "Prayers to Maa Bhagwati at Bagahi (Jagannathipur)" } },
      { img: img.fbParasrai1, cap: { hi: "पारासराय में श्री नवदुर्गा पूजा समिति द्वारा स्वागत", en: "Welcomed by the Shri Navdurga Puja Samiti, Parasrai" } },
      { img: img.fbNausahra4, cap: { hi: "नौसहरा में व्यासपीठ को नमन", en: "Bowing before the Vyaspeeth at Nausahra" } },
      { img: img.fbBagahi4, cap: { hi: "पूजा समिति के सदस्यों व ग्रामवासियों के साथ", en: "With the puja committee and villagers" } },
      { img: img.fbJamunhi3, cap: { hi: "कथा में उपस्थित श्रद्धालु", en: "Devotees at the Katha" } },
    ],
    source: "https://www.facebook.com/vinaydwivedi295/posts/pfbid02XHWqhuDHS3LGwUvwYjrtYH64HctiMFnoSeQhjzGoMCsiuW5LbasR2HZdNhqz9JJdl",
  },
  {
    slug: "binuhani-ramlila",
    points: [
      { hi: "बिनुहनी में श्री रामलीला का आयोजन विगत 53 वर्षों से अनवरत हो रहा है", en: "Binuhani has staged the Ramlila without a break for 53 years" },
      { hi: "आयोजक: आदर्श रामलीला प्रबंध समिति, बिनुहनी", en: "Organiser: Adarsh Ramlila Prabandh Samiti, Binuhani" },
      { hi: "उपस्थित: ग्राम प्रधान श्री दशरथ लाल जी, मंडल अध्यक्ष इटियाथोक श्री संतोष चौरसिया जी, ग्रामवासी व श्रद्धालु", en: "Present: village head Shri Dashrath Lal, Itia Thok mandal president Shri Santosh Chaurasiya, villagers and devotees" },
    ],
    context: [
      {
        hi: "रामलीला प्रभु श्रीराम के जीवन का मंचन है। अनेक गाँवों में इसके पात्र स्थानीय लोग ही निभाते हैं और मंच, वेशभूषा तथा आयोजन की व्यवस्था भी गाँव की समिति मिलकर करती है। इसी कारण यह परंपरा सिर्फ़ मनोरंजन नहीं, गाँव की साझा पहचान बन जाती है।",
        en: "The Ramlila is a stage retelling of the life of Lord Ram. In many villages the roles are played by local people, and the stage, costumes and arrangements are managed by a village committee. That is why such a tradition is more than entertainment: it becomes the village’s shared identity.",
      },
      {
        hi: "53 वर्ष तक बिना रुके किसी आयोजन का चलते रहना तभी संभव है जब कई पीढ़ियाँ उसे अपना मानकर आगे बढ़ाएँ। ऐसी परंपराओं को सम्मान देना और उनके आयोजकों का उत्साह बढ़ाना क्षेत्र की सांस्कृतिक विरासत को सहेजने का ही काम है।",
        en: "An event can run for 53 years without a break only when several generations take it as their own. Honouring such traditions and encouraging their organisers is part of preserving the area’s cultural heritage.",
      },
    ],
    date: "2026-10-16",
    category: CAT.culture,
    place: { hi: "ग्रामसभा बिनुहनी, इटियाथोक", en: "Binuhani, Itia Thok" },
    title: { hi: "बिनुहनी की 53 वर्ष पुरानी श्री रामलीला में सहभागिता", en: "At Binuhani’s Ramlila, staged every year for 53 years" },
    summary: {
      hi: "आदर्श रामलीला प्रबंध समिति, बिनुहनी द्वारा आयोजित भव्य श्री रामलीला में सम्मिलित होकर प्रभु श्रीराम के आदर्शों का स्मरण किया।",
      en: "Joined the grand Ramlila staged by the Adarsh Ramlila committee of Binuhani and recalled the ideals of Lord Ram.",
    },
    lead: {
      hi: "ग्राम बिनुहनी के ग्रामवासी विगत 53 वर्षों से अनवरत श्री रामलीला का आयोजन कर रहे हैं। यह गौरवशाली परंपरा पूरे क्षेत्र के लिए गर्व का विषय है।",
      en: "The people of Binuhani have staged the Ramlila without a break for 53 years. This proud tradition belongs to the whole area.",
    },
    body: [
      {
        hi: "प्रत्येक वर्ष की भांति इस वर्ष भी आदर्श रामलीला प्रबंध समिति, बिनुहनी द्वारा आयोजित भव्य श्री रामलीला कार्यक्रम में सम्मिलित होकर प्रभु श्रीराम के पावन चरित्र एवं उनके आदर्शों का स्मरण किया।",
        en: "As every year, the MLA attended the Ramlila organised by the Adarsh Ramlila committee and recalled Lord Ram’s life and ideals.",
      },
      {
        hi: "प्रभु श्रीराम का जीवन सिखाता है कि कठिन से कठिन परिस्थिति में भी सत्य और धर्म के मार्ग पर अडिग रहना ही वास्तविक विजय है। ऐसे आयोजन नई पीढ़ी को अपनी जड़ों और संस्कारों से जोड़ते हैं।",
        en: "Lord Ram’s life teaches that standing firm on the path of truth and duty, however hard the times, is the real victory. Such events connect the next generation with its roots and values.",
      },
      {
        hi: "इस अवसर पर ग्राम प्रधान बिनुहनी श्री दशरथ लाल जी, मंडल अध्यक्ष इटियाथोक श्री संतोष चौरसिया जी सहित बड़ी संख्या में ग्रामवासी एवं श्रद्धालु उपस्थित रहे। जय श्रीराम!",
        en: "Binuhani’s village head Shri Dashrath Lal, Itia Thok mandal president Shri Santosh Chaurasiya and a large number of villagers and devotees were present.",
      },
    ],
    photos: [
      { img: img.fbBinuhani4, cap: { hi: "आदर्श रामलीला प्रबंध समिति, बिनुहनी के मंच पर", en: "On stage with the Adarsh Ramlila committee, Binuhani" } },
      { img: img.fbBinuhani1, cap: { hi: "रामलीला मंच से क्षेत्रवासियों को संबोधन", en: "Addressing residents from the Ramlila stage" } },
      { img: img.fbBinuhani3, cap: { hi: "समिति द्वारा स्मृति-चिह्न भेंट कर स्वागत", en: "Welcomed with a memento by the committee" } },
      { img: img.fbBinuhani2, cap: { hi: "अंगवस्त्र भेंट कर सम्मान", en: "Honoured with a stole" } },
      { img: img.fbBinuhani5, cap: { hi: "रामलीला देखने उमड़े ग्रामवासी", en: "Villagers gathered for the Ramlila" } },
    ],
    source: "https://www.facebook.com/vinaydwivedi295/posts/pfbid024MUyT9EnxddU22dbEBzTXnyppfScFTDA7yd6MCuNmzvZSDS7kX3TnZso3YhEUQcul",
  },
  {
    slug: "kisan-rahat-vitaran",
    points: [
      { hi: "चक्रवात और बाढ़ से फसल क्षति झेलने वाले किसानों के लिए कार्यक्रम", en: "A programme for farmers whose crops were damaged by the cyclone and floods" },
      { hi: "दो तरह की मदद: आपदा राहत सहायता के चेक और कृषि निवेश अनुदान के अंतर्गत बीज", en: "Two kinds of help: disaster-relief cheques, and seeds under the agricultural input grant" },
      { hi: "स्थान: जिला पंचायत सभागार, गोंडा", en: "Venue: Zila Panchayat hall, Gonda" },
      { hi: "अधिकारी और क्षेत्रवासी कार्यक्रम में उपस्थित रहे", en: "Officials and residents were present" },
    ],
    context: [
      {
        hi: "दोनों मदद के काम अलग हैं। चेक उस नुकसान की भरपाई में सहारा देता है जो खेत में हो चुका है, जबकि बीज अगली बुवाई की तैयारी के लिए है, ताकि किसान को दोबारा खेती शुरू करने के लिए कर्ज़ का इंतज़ार न करना पड़े।",
        en: "The two kinds of help do different jobs. The cheque eases the loss already suffered in the field, while the seed is for the next sowing, so a farmer can restart farming without waiting for a loan.",
      },
      {
        hi: "सामान्यतः फसल क्षति का आकलन गाँव स्तर पर राजस्व और कृषि विभाग के कर्मचारी करते हैं और प्रभावित किसानों की सूची आगे भुगतान के लिए जाती है। इसलिए अपनी खेती, बैंक खाते और ज़मीन के कागज़ों की जानकारी सही और अद्यतन रखें।",
        en: "Generally, crop losses are assessed at village level by revenue and agriculture department staff, and the list of affected farmers then goes forward for payment. So keep your farming details, bank account and land papers correct and up to date.",
      },
      {
        hi: "यदि आपका नाम सूची में नहीं है, नुकसान का आकलन आपके अनुसार ठीक नहीं हुआ है या राशि नहीं मिली है, तो ई-शिकायत पोर्टल पर अपनी बात दर्ज करें। आपको टिकट संख्या मिलेगी, जिससे आप कार्यवाही की स्थिति स्वयं देख सकते हैं।",
        en: "If your name is missing from the list, your loss was not assessed correctly or the money has not reached you, register it on the e-Shikayat portal. You will get a ticket number to follow the progress yourself.",
      },
    ],
    date: "2026-10-12",
    featured: true,
    category: CAT.relief,
    place: { hi: "जिला पंचायत सभागार, गोंडा", en: "Zila Panchayat hall, Gonda" },
    title: { hi: "चक्रवात व बाढ़ प्रभावित किसानों को राहत सहायता", en: "Relief for farmers hit by cyclone and floods" },
    summary: {
      hi: "जिला पंचायत सभागार में फसल क्षति से प्रभावित किसानों को आपदा राहत सहायता एवं कृषि निवेश अनुदान का वितरण किया गया।",
      en: "At the Zila Panchayat hall, disaster-relief aid and agricultural input grants were handed over to farmers whose crops were damaged.",
    },
    lead: {
      hi: "चक्रवात और बाढ़ से जिन किसानों की फसल को नुकसान पहुँचा, उन्हें आपदा राहत सहायता के चेक और कृषि निवेश अनुदान के अंतर्गत बीज सौंपे गए।",
      en: "Farmers whose crops were damaged by the cyclone and floods received disaster-relief cheques, and seeds under the agricultural input grant.",
    },
    body: [
      {
        hi: "जिला पंचायत सभागार में आयोजित कार्यक्रम में विधायक विनय कुमार द्विवेदी ने प्रभावित किसानों को आपदा राहत सहायता के चेक प्रदान किए।",
        en: "At a programme in the Zila Panchayat hall, MLA Vinay Kumar Dwivedi handed disaster-relief cheques to the affected farmers.",
      },
      {
        hi: "कृषि निवेश अनुदान के अंतर्गत किसानों को अगली फसल के लिए बीज के पैकेट भी दिए गए, ताकि नुकसान के बाद खेती दोबारा शुरू हो सके।",
        en: "Under the agricultural input grant, farmers were also given seed packets for the next crop, so that farming can restart after the loss.",
      },
      {
        hi: "कार्यक्रम में अधिकारियों और क्षेत्रवासियों ने विधायक जी का स्वागत किया। किसान की हर कठिनाई में सरकार और जनप्रतिनिधि उसके साथ खड़े हैं।",
        en: "Officials and residents welcomed the MLA at the programme. In every hardship, the government and its representatives stand with the farmer.",
      },
    ],
    photos: [
      { img: img.reliefCheque, cap: { hi: "किसान को राहत सहायता चेक का वितरण", en: "Relief cheque handed to a farmer" } },
      { img: img.reliefSeeds, cap: { hi: "कृषि निवेश अनुदान के तहत बीज वितरण", en: "Seeds under the agricultural input grant" } },
      { img: img.felicitation, cap: { hi: "राहत वितरण कार्यक्रम में स्वागत", en: "Welcome at the relief programme" } },
    ],
  },
  {
    slug: "gaon-gaon-jansampark",
    points: [
      { hi: "खेत की मेड़ से लेकर गाँव की गलियों और चौपाल तक सीधा संवाद", en: "Direct conversation from the edge of the fields to village lanes and the chaupal" },
      { hi: "सड़क, बिजली, पानी और योजनाओं के लाभ से जुड़ी बातें सुनी गईं", en: "Heard concerns about roads, electricity, water and access to schemes" },
      { hi: "सामने आई समस्याएँ संबंधित विभागों तक पहुँचाई जाएँगी", en: "The problems raised will be taken to the departments concerned" },
      { hi: "घर बैठे शिकायत दर्ज करने का विकल्प: ई-शिकायत पोर्टल", en: "You can also complain from home: the e-Shikayat portal" },
    ],
    context: [
      {
        hi: "गाँव की कई समस्याएँ छोटी होती हैं: बिगड़ा हैंडपंप, रुकी हुई पेंशन, टूटी नाली। पर वे किसी दफ़्तर तक पहुँच ही नहीं पातीं। जनसंपर्क का असली फ़ायदा यही है कि लोग अपनी बात उसी जगह कह पाते हैं जहाँ वे रहते हैं, और बात सीधे सुनने वाले तक पहुँचती है।",
        en: "Many village problems are small, such as a broken handpump, a stopped pension or a damaged drain, yet they never reach an office. The real value of outreach is that people can speak where they live and be heard directly.",
      },
      {
        hi: "बैठक में हर बात का समाधान उसी समय संभव नहीं होता, इसलिए आगे की कार्यवाही का एक व्यवस्थित तरीका ज़रूरी है। ई-शिकायत पोर्टल यही करता है: नाम, मोबाइल, गाँव और विषय के साथ शिकायत दर्ज होती है, एक टिकट संख्या मिलती है, और स्थिति ‘प्राप्त’ से ‘जाँच में’, ‘कार्यवाही में’ और फिर ‘निस्तारित’ तक दिखती रहती है।",
        en: "Not everything can be settled on the spot, so a clear way to follow up matters. The e-Shikayat portal does this: you file with your name, mobile, village and subject, get a ticket number, and watch the status move from ‘Received’ to ‘Under review’, ‘Action taken’ and then ‘Resolved’.",
      },
      {
        hi: "शिकायत की स्थिति देखने के लिए केवल टिकट संख्या और मोबाइल के अंतिम 4 अंक चाहिए। निस्तारण के बाद आप सेवा को सितारों से रेटिंग भी दे सकते हैं।",
        en: "To check the status you only need the ticket number and the last 4 digits of your mobile. After a complaint is resolved you can also rate the service with stars.",
      },
    ],
    date: "2026-10-12",
    category: CAT.outreach,
    place: { hi: "मेहनौन विधानसभा क्षेत्र", en: "Mehnaun Assembly constituency" },
    title: { hi: "गाँव-गाँव जनसंपर्क: खेत से चौपाल तक", en: "Village to village: from the fields to the chaupal" },
    summary: {
      hi: "विधायक जी ने क्षेत्र के गाँवों में पहुँचकर किसानों, बुजुर्गों और परिवारों से भेंट की और उनकी समस्याएँ सुनीं।",
      en: "The MLA visited villages across the constituency, meeting farmers, elders and families and listening to their problems.",
    },
    lead: {
      hi: "खेत की मेड़ से लेकर गाँव की गलियों और चौपाल तक, विधायक जी ने क्षेत्रवासियों के बीच पहुँचकर सीधे संवाद किया।",
      en: "From the edge of the fields to village lanes and the chaupal, the MLA went among residents and spoke with them directly.",
    },
    body: [
      {
        hi: "जनसंपर्क के दौरान विधायक जी खेतों में किसानों से मिले, गाँव की गलियों में लोगों का अभिवादन स्वीकार किया और कई परिवारों के घर पहुँचकर उनका हालचाल जाना।",
        en: "During the outreach the MLA met farmers in their fields, greeted people in village lanes and visited several families at home to ask after them.",
      },
      {
        hi: "गाँव के बुजुर्गों और क्षेत्रवासियों के साथ बैठकर सड़क, बिजली, पानी और योजनाओं के लाभ से जुड़ी बातें सुनी गईं। जो समस्याएँ सामने आईं, उन्हें संबंधित विभागों तक पहुँचाया जाएगा।",
        en: "Sitting with village elders and residents, he heard about roads, electricity, water and access to schemes. The problems raised will be taken to the departments concerned.",
      },
      {
        hi: "अपनी समस्या आप इस वेबसाइट के ई-शिकायत पोर्टल पर भी दर्ज कर सकते हैं और उसकी स्थिति कभी भी देख सकते हैं।",
        en: "You can also register your problem on this website’s e-Shikayat portal and check its status at any time.",
      },
    ],
    photos: [
      { img: img.farmerField, cap: { hi: "खेत में किसान से भेंट", en: "Meeting a farmer in his field" } },
      { img: img.villageGreeting, cap: { hi: "गाँव की गलियों में जनसंपर्क", en: "Greeting residents on a village street" } },
      { img: img.homeVisit, cap: { hi: "ग्रामीण के घर पहुँचकर हालचाल जाना", en: "Visiting a resident at home" } },
      { img: img.villageWalk, cap: { hi: "गाँव में पैदल जनसंपर्क", en: "Walking through a village with residents" } },
      { img: img.villagerChat, cap: { hi: "ग्रामीण से आत्मीय बातचीत", en: "A conversation with a villager" } },
      { img: img.villageElders, cap: { hi: "गाँव के बुजुर्गों के साथ बातचीत", en: "Sitting with village elders" } },
      { img: img.villageBaithak, cap: { hi: "क्षेत्रवासियों के साथ बैठक", en: "A meeting with local residents" } },
    ],
  },
  {
    slug: "samajik-karyakram",
    points: [
      { hi: "श्रद्धांजलि सभा में पुष्पांजलि अर्पित कर शोकाकुल परिवार को सांत्वना दी", en: "Offered flowers at a tribute gathering and consoled the bereaved family" },
      { hi: "क्षेत्रवासियों ने स्मृति-चिह्न भेंट कर स्वागत किया", en: "Residents welcomed him with mementos" },
      { hi: "अंगवस्त्र पहनाकर अतिथियों का सम्मान किया", en: "Honoured guests with a ceremonial stole" },
    ],
    context: [
      {
        hi: "गाँव और कस्बों के जीवन में शोक की घड़ी में पहुँचना या किसी आयोजन में शामिल होना सम्मान और अपनत्व की निशानी माना जाता है। लोग याद रखते हैं कि कठिन समय में कौन उनके साथ खड़ा था।",
        en: "In village and town life, being present at a time of grief or at someone’s event is a mark of respect and belonging. People remember who stood with them in a hard time.",
      },
      {
        hi: "स्मृति-चिह्न और अंगवस्त्र जैसे सम्मान हमारी परंपरा में आदर प्रकट करने के सहज तरीके हैं। इनसे अधिक महत्त्वपूर्ण वह संवाद है जो ऐसे कार्यक्रमों में लोगों के बीच बनता है, और जिससे क्षेत्र की ज़रूरतें सीधे सुनने को मिलती हैं।",
        en: "A memento or a stole are simple, traditional ways of showing respect. More important is the conversation that happens between people at such programmes, through which the area’s needs are heard first-hand.",
      },
    ],
    date: "2026-10-13",
    category: CAT.events,
    place: { hi: "गोंडा", en: "Gonda" },
    title: { hi: "सामाजिक कार्यक्रमों में सहभागिता", en: "Taking part in community programmes" },
    summary: {
      hi: "श्रद्धांजलि सभा, स्वागत समारोह और सार्वजनिक कार्यक्रमों में विधायक जी ने क्षेत्रवासियों के साथ सहभागिता की।",
      en: "The MLA joined residents at a tribute gathering, welcome ceremonies and public programmes.",
    },
    lead: {
      hi: "सुख-दुख में साथ खड़े रहना ही जनप्रतिनिधि का धर्म है। बीते दिनों विधायक जी अनेक सामाजिक कार्यक्रमों में शामिल हुए।",
      en: "Standing with people in joy and sorrow is a representative’s duty. In recent days the MLA attended several community programmes.",
    },
    body: [
      {
        hi: "एक श्रद्धांजलि सभा में विधायक जी ने पुष्पांजलि अर्पित कर दिवंगत आत्मा को नमन किया और शोकाकुल परिवार को सांत्वना दी।",
        en: "At a tribute gathering, the MLA offered flowers in homage and consoled the bereaved family.",
      },
      {
        hi: "विभिन्न कार्यक्रमों में क्षेत्रवासियों ने स्मृति-चिह्न भेंट कर उनका स्वागत किया, और विधायक जी ने अंगवस्त्र पहनाकर अतिथियों का सम्मान किया।",
        en: "At several programmes residents welcomed him with mementos, and he honoured guests with a ceremonial stole.",
      },
    ],
    photos: [
      { img: img.tribute, cap: { hi: "पुष्पांजलि अर्पित कर श्रद्धांजलि", en: "Paying a floral tribute" } },
      { img: img.memento, cap: { hi: "कार्यक्रम में स्मृति-चिह्न भेंट कर स्वागत", en: "Welcomed with a memento at a programme" } },
      { img: img.honouringGuest, cap: { hi: "अंगवस्त्र पहनाकर सम्मान", en: "Honouring a guest with a stole" } },
      { img: img.communityProgramme, cap: { hi: "सामाजिक कार्यक्रम में क्षेत्रवासियों के साथ", en: "With residents at a community programme" } },
      { img: img.publicProgramme, cap: { hi: "सार्वजनिक कार्यक्रम में उपस्थिति", en: "Attending a public programme" } },
    ],
  },
];

export const getEvent = (slug: string) => events.find((e) => e.slug === slug);

/* Featured first, then newest */
export const sortedEvents = [...events].sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.date.localeCompare(a.date));
