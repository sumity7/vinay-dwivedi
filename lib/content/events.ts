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
  photos: Photo[]; // first photo is the cover
  source?: string; // link to the original post
};

const CAT = { events: { hi: "कार्यक्रम", en: "Events" }, outreach: { hi: "जनसंपर्क", en: "Outreach" }, relief: { hi: "राहत कार्य", en: "Relief" } };

export const events: EventPost[] = [
  {
    slug: "kisan-rahat-vitaran",
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
