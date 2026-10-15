/* =========================================================
   SITE CONTENT — edit this file to update news, photos, videos.
   Each item has Hindi (hi) and English (en) text.
   Images go in /images. Newest items first.
   ========================================================= */

window.SITE = {
  config: {
    officeWhatsApp: "919670086000",      // meeting requests, views and volunteer sign-ups go here
    supabaseUrl: "",                     // fill to receive complaints for real (see README)
    supabaseAnonKey: "",
    facebook: "https://www.facebook.com/vinaydwivedi295/",
    instagram: "https://www.instagram.com/vinaydwivedimla/",
    siteUrl: ""                          // e.g. https://vinaydwivedi.in — used in share links
  },

  /* Gallery albums (filter chips) */
  albums: [
    { id: "leaders", hi: "शीर्ष नेतृत्व के साथ", en: "With leadership" },
    { id: "public",  hi: "जनता के बीच",          en: "Among the people" },
    { id: "govt",    hi: "शासकीय कार्यक्रम",       en: "Government programmes" },
    { id: "office",  hi: "बैठकें व कार्यालय",      en: "Meetings & office" }
  ],

  /* Latest news / updates (first item is shown large) */
  news: [
    {
      date: "2026-10-12",
      img: "images/relief-cheque.jpg",
      hi: { title: "चक्रवात व बाढ़ प्रभावित किसानों को राहत", text: "जिला पंचायत सभागार में फसल क्षति से प्रभावित किसानों को आपदा राहत सहायता एवं कृषि निवेश अनुदान का वितरण किया गया।" },
      en: { title: "Relief for farmers hit by cyclone and floods", text: "At the Zila Panchayat hall, disaster-relief aid and agricultural input grants were handed over to farmers whose crops were damaged." },
      link: ""
    },
    {
      date: "2026-10-12",
      img: "images/relief-seeds.jpg",
      hi: { title: "किसानों को बीज वितरण", text: "कृषि निवेश अनुदान के अंतर्गत प्रभावित किसानों को बीज के पैकेट सौंपे गए।" },
      en: { title: "Seeds handed to farmers", text: "Seed packets were given to affected farmers under the agricultural input grant." },
      link: ""
    },
    {
      date: "2026-10-12",
      img: "images/felicitation.jpg",
      hi: { title: "राहत वितरण कार्यक्रम में स्वागत", text: "कार्यक्रम में अधिकारियों व क्षेत्रवासियों ने विधायक जी का स्वागत किया।" },
      en: { title: "Welcomed at the relief programme", text: "Officials and residents welcomed the MLA at the programme." },
      link: ""
    }
  ],

  /* Photo gallery. album = one of the album ids above */
  gallery: [
    { img: "images/state-meeting.jpg",    album: "leaders", hi: "क्षेत्र की माँगें शासन स्तर पर",       en: "Raising the constituency's demands with the state government" },
    { img: "images/meeting-greeting.jpg", album: "leaders", hi: "भेंट एवं स्वागत",                    en: "A courtesy meeting" },
    { img: "images/relief-cheque.jpg",    album: "govt",    hi: "किसान को राहत सहायता चेक का वितरण",     en: "Relief cheque handed to a farmer" },
    { img: "images/relief-seeds.jpg",     album: "govt",    hi: "कृषि निवेश अनुदान के तहत बीज वितरण",    en: "Seeds under the agricultural input grant" },
    { img: "images/felicitation.jpg",     album: "govt",    hi: "राहत वितरण कार्यक्रम में स्वागत",       en: "Welcome at the relief programme" },
    { img: "images/hero.jpg",             album: "public",  hi: "जनसंवाद",                           en: "Speaking with residents" },
    { img: "images/addressing.jpg",       album: "public",  hi: "जनसभा को संबोधन",                   en: "Addressing a gathering" },
    { img: "images/official-meeting.jpg", album: "office",  hi: "विधानसभा क्षेत्र की समीक्षा बैठक",      en: "Constituency review meeting" },
    { img: "images/at-work.jpg",          album: "office",  hi: "जन समस्याओं पर कार्य",                en: "Working through public grievances" }
  ],

  /* Videos: link to the Facebook reel/video, thumbnail from /images */
  videos: [
    { url: "https://www.facebook.com/vinaydwivedi295/reels/", img: "images/addressing.jpg", hi: "जनसभा में संबोधन", en: "Address at a public meeting" },
    { url: "https://www.facebook.com/vinaydwivedi295/reels/", img: "images/relief-seeds.jpg", hi: "किसान राहत वितरण", en: "Farmer relief distribution" },
    { url: "https://www.facebook.com/vinaydwivedi295/reels/", img: "images/hero.jpg", hi: "जनसंवाद", en: "Talking with residents" }
  ]
};
