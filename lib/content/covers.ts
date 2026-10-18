/* Cover photographs for the article cards (/vichar) and the development-figure cards (/vikas-yatra). */
import type { StaticImageData } from "next/image";
import ayushmanBharat from "@/images/vichar/ayushman-bharat.webp";
import bharat2014 from "@/images/vichar/bharat-2014-ke-baad.webp";
import missionShakti from "@/images/vichar/mission-shakti.webp";
import mudraVishwakarma from "@/images/vichar/mudra-vishwakarma.webp";
import nep2020 from "@/images/vichar/nep-2020.webp";
import pmAwasGramin from "@/images/vichar/pm-awas-gramin.webp";
import pmKisan from "@/images/vichar/pm-kisan.webp";
import up2017 from "@/images/vichar/uttar-pradesh-2017-ke-baad.webp";
import airports from "@/images/vikas/airports.webp";
import highways from "@/images/vikas/highways.webp";
import janDhan from "@/images/vikas/jan-dhan.webp";
import mbbs from "@/images/vikas/mbbs.webp";
import medicalColleges from "@/images/vikas/medical-colleges.webp";
import metro from "@/images/vikas/metro.webp";
import poverty from "@/images/vikas/poverty.webp";
import railElectrification from "@/images/vikas/rail-electrification.webp";
import ujjwala from "@/images/vikas/ujjwala.webp";

/** article slug -> cover */
export const articleCovers: Record<string, StaticImageData> = {
  "ayushman-bharat": ayushmanBharat,
  "pm-awas-gramin": pmAwasGramin,
  "pm-kisan": pmKisan,
  "mission-shakti": missionShakti,
  "nep-2020": nep2020,
  "mudra-vishwakarma": mudraVishwakarma,
  "bharat-2014-ke-baad": bharat2014,
  "uttar-pradesh-2017-ke-baad": up2017,
};

/** development figure (by its icon, which is unique on the page) -> cover */
export const figureCovers: Record<string, StaticImageData> = {
  road: highways, plane: airports, metro, hospital: medicalColleges, cap: mbbs, bolt: railElectrification,
  bank: janDhan, flame: ujjwala, people: poverty,
};
