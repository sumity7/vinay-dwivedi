/* Cover photos for articles and development figures: HD (1200×750) freely licensed photos of each subject
   (Wikimedia Commons, mostly PIB / GODL-India). Replace a file in /images/vichar or /images/vikas to change one. */
import type { StaticImageData } from "next/image";
import type { FigIcon } from "./vikas";
import v_ayushmanBharat from "@/images/vichar/ayushman-bharat.webp";
import v_pmAwasGramin from "@/images/vichar/pm-awas-gramin.webp";
import v_pmKisan from "@/images/vichar/pm-kisan.webp";
import v_missionShakti from "@/images/vichar/mission-shakti.webp";
import v_nep2020 from "@/images/vichar/nep-2020.webp";
import v_mudraVishwakarma from "@/images/vichar/mudra-vishwakarma.webp";
import v_bharat2014KeBaad from "@/images/vichar/bharat-2014-ke-baad.webp";
import v_uttarPradesh2017KeBaad from "@/images/vichar/uttar-pradesh-2017-ke-baad.webp";
import k_highways from "@/images/vikas/highways.webp";
import k_airports from "@/images/vikas/airports.webp";
import k_metro from "@/images/vikas/metro.webp";
import k_medicalColleges from "@/images/vikas/medical-colleges.webp";
import k_mbbs from "@/images/vikas/mbbs.webp";
import k_railElectrification from "@/images/vikas/rail-electrification.webp";
import k_janDhan from "@/images/vikas/jan-dhan.webp";
import k_ujjwala from "@/images/vikas/ujjwala.webp";
import k_poverty from "@/images/vikas/poverty.webp";

export const articlePhoto: Record<string, StaticImageData> = {
  "ayushman-bharat": v_ayushmanBharat,
  "pm-awas-gramin": v_pmAwasGramin,
  "pm-kisan": v_pmKisan,
  "mission-shakti": v_missionShakti,
  "nep-2020": v_nep2020,
  "mudra-vishwakarma": v_mudraVishwakarma,
  "bharat-2014-ke-baad": v_bharat2014KeBaad,
  "uttar-pradesh-2017-ke-baad": v_uttarPradesh2017KeBaad,
};

export const figPhoto: Record<FigIcon, StaticImageData> = {
  road: k_highways,
  plane: k_airports,
  metro: k_metro,
  hospital: k_medicalColleges,
  cap: k_mbbs,
  bolt: k_railElectrification,
  bank: k_janDhan,
  flame: k_ujjwala,
  people: k_poverty,
};
