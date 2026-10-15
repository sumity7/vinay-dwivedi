/* Meetings & interactions, and photos that don't belong to an event. */
import type { StaticImageData } from "next/image";
import type { Bi } from "../i18n";
import { img } from "../images";
import type { Photo } from "./events";

export const meetings: { img: StaticImageData; title: Bi; text: Bi }[] = [
  { img: img.meetingGreeting, title: { hi: "शीर्ष नेतृत्व के साथ", en: "With senior leadership" }, text: { hi: "भेंट एवं स्वागत।", en: "A courtesy meeting." } },
  { img: img.stateMeeting, title: { hi: "शासन स्तर पर क्षेत्र की माँगें", en: "Raising the area’s demands with the state" }, text: { hi: "मेहनौन विधानसभा क्षेत्र की माँगों को शासन स्तर पर रखा गया।", en: "The demands of Mehnaun constituency were put before the state government." } },
  { img: img.officialMeeting, title: { hi: "समीक्षा बैठक", en: "Review meeting" }, text: { hi: "विधानसभा क्षेत्र में चल रहे कार्यों की समीक्षा।", en: "Reviewing work under way in the constituency." } },
  { img: img.addressing, title: { hi: "जनसभा", en: "Public meeting" }, text: { hi: "जनसभा को संबोधन।", en: "Addressing a gathering." } },
  { img: img.atWork, title: { hi: "कार्यालय में", en: "At the office" }, text: { hi: "जन समस्याओं पर कार्य।", en: "Working through public grievances." } },
];

export const morePhotos: Photo[] = [
  { img: img.hero, cap: { hi: "जनसंवाद", en: "Speaking with residents" } },
  { img: img.addressing, cap: { hi: "जनसभा को संबोधन", en: "Addressing a gathering" } },
  { img: img.meetingGreeting, cap: { hi: "भेंट एवं स्वागत", en: "A courtesy meeting" } },
  { img: img.stateMeeting, cap: { hi: "क्षेत्र की माँगें शासन स्तर पर", en: "Raising the constituency’s demands with the state government" } },
  { img: img.officialMeeting, cap: { hi: "विधानसभा क्षेत्र की समीक्षा बैठक", en: "Constituency review meeting" } },
  { img: img.atWork, cap: { hi: "जन समस्याओं पर कार्य", en: "Working through public grievances" } },
];
