/* Cover photo for each article and development figure. Swap any value for another key of `img`
   (lib/images.ts), or add a topic photo there first (e.g. an airport or metro photo). */
import { img } from "../images";
import type { FigIcon } from "./vikas";

type Key = keyof typeof img;

export const articleCover: Record<string, Key> = {
  "ayushman-bharat": "villageElders",
  "pm-awas-gramin": "villageWalk",
  "pm-kisan": "farmerField",
  "mission-shakti": "communityProgramme",
  "nep-2020": "publicProgramme",
  "mudra-vishwakarma": "atWork",
  "bharat-2014-ke-baad": "stateMeeting",
  "uttar-pradesh-2017-ke-baad": "officialMeeting",
};

export const figCover: Record<FigIcon, Key> = {
  road: "villageWalk",
  plane: "stateMeeting",
  metro: "officialMeeting",
  hospital: "homeVisit",
  cap: "publicProgramme",
  bolt: "atWork",
  bank: "reliefCheque",
  flame: "villagerChat",
  people: "communityProgramme",
};

export const coverOf = (k?: Key) => img[k ?? "hero"];
