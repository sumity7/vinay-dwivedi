/* Which illustrated cover (components/CoverArt.tsx) each article and development figure uses. */
import type { Scene } from "@/components/CoverArt";
import type { FigIcon } from "./vikas";

export const articleScene: Record<string, Scene> = {
  "ayushman-bharat": "health",
  "pm-awas-gramin": "house",
  "pm-kisan": "farm",
  "mission-shakti": "women",
  "nep-2020": "edu",
  "mudra-vishwakarma": "skill",
  "bharat-2014-ke-baad": "growth",
  "uttar-pradesh-2017-ke-baad": "road",
};

export const figScene: Record<FigIcon, Scene> = {
  road: "road", plane: "plane", metro: "metro", hospital: "health", cap: "edu",
  bolt: "bolt", bank: "bank", flame: "flame", people: "people",
};
