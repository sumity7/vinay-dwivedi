/* Every photo used on the site. Add a new file to /images, then import it here. */
import addressing from "@/images/addressing.jpg";
import atWork from "@/images/at-work.jpg";
import communityProgramme from "@/images/community-programme.jpg";
import fbAvatar from "@/images/fb/avatar.jpg";
import fbBagahi1 from "@/images/fb/bagahi-1.jpg";
import fbCover from "@/images/fb/cover.jpg";
import fbBagahi4 from "@/images/fb/bagahi-4.jpg";
import fbBinuhani1 from "@/images/fb/binuhani-1.jpg";
import fbBinuhani2 from "@/images/fb/binuhani-2.jpg";
import fbBinuhani3 from "@/images/fb/binuhani-3.jpg";
import fbBinuhani4 from "@/images/fb/binuhani-4.jpg";
import fbBinuhani5 from "@/images/fb/binuhani-5.jpg";
import fbJamunhi1 from "@/images/fb/jamunhi-1.jpg";
import fbJamunhi3 from "@/images/fb/jamunhi-3.jpg";
import fbJamunhi5 from "@/images/fb/jamunhi-5.jpg";
import fbNausahra1 from "@/images/fb/nausahra-1.jpg";
import fbNausahra4 from "@/images/fb/nausahra-4.jpg";
import fbParasrai1 from "@/images/fb/parasrai-1.jpg";
import farmerField from "@/images/farmer-field.jpg";
import felicitation from "@/images/felicitation.jpg";
import hero from "@/images/hero.jpg";
import heroAchievements from "@/images/hero-achievements.jpg";
import heroComplaint from "@/images/hero-complaint.jpg";
import heroEcard from "@/images/hero-ecard.jpg";
import homeVisit from "@/images/home-visit.jpg";
import honouringGuest from "@/images/honouring-guest.jpg";
import meetingGreeting from "@/images/meeting-greeting.jpg";
import memento from "@/images/memento.jpg";
import officialMeeting from "@/images/official-meeting.jpg";
import portrait from "@/images/portrait.jpg";
import portraitCut from "@/images/portrait-cut.webp";
import publicProgramme from "@/images/public-programme.jpg";
import reliefCheque from "@/images/relief-cheque.jpg";
import reliefSeeds from "@/images/relief-seeds.jpg";
import stateMeeting from "@/images/state-meeting.jpg";
import tribute from "@/images/tribute.jpg";
import villageBaithak from "@/images/village-baithak.jpg";
import villageElders from "@/images/village-elders.jpg";
import villageGreeting from "@/images/village-greeting.jpg";
import villageWalk from "@/images/village-walk.jpg";
import villagerChat from "@/images/villager-chat.jpg";

export const img = {
  addressing, atWork, communityProgramme, farmerField, felicitation, hero, heroAchievements, heroComplaint, heroEcard, homeVisit, honouringGuest,
  meetingGreeting, memento, officialMeeting, portrait, portraitCut, publicProgramme, reliefCheque, reliefSeeds, stateMeeting,
  tribute, villageBaithak, villageElders, villageGreeting, villageWalk, villagerChat,
  /* from the official Facebook page (Oct 2026) */
  fbAvatar, fbCover, fbBagahi1, fbBagahi4, fbBinuhani1, fbBinuhani2, fbBinuhani3, fbBinuhani4, fbBinuhani5,
  fbJamunhi1, fbJamunhi3, fbJamunhi5, fbNausahra1, fbNausahra4, fbParasrai1,
};

/* Where the important part of each photo is (usually his face), as CSS object-position.
   Every <Photo> uses this, so any crop (slider, tile, card, gallery) keeps the face in frame. */
const focus: Record<keyof typeof img, string> = {
  addressing: "50% 40%", atWork: "62% 18%", communityProgramme: "58% 30%", farmerField: "42% 28%",
  felicitation: "55% 18%", hero: "50% 14%", heroAchievements: "50% 34%", heroComplaint: "62% 24%", heroEcard: "58% 30%", homeVisit: "45% 35%", honouringGuest: "62% 28%",
  meetingGreeting: "55% 22%", memento: "62% 30%", officialMeeting: "50% 20%", portrait: "50% 32%", portraitCut: "50% 20%", publicProgramme: "68% 50%",
  reliefCheque: "62% 38%", reliefSeeds: "62% 38%", stateMeeting: "50% 50%", tribute: "58% 42%",
  villageBaithak: "50% 55%", villageElders: "62% 42%", villageGreeting: "56% 44%", villageWalk: "55% 45%",
  villagerChat: "68% 32%",
  fbAvatar: "50% 30%", fbCover: "50% 40%", fbBagahi1: "30% 20%", fbBagahi4: "60% 30%", fbBinuhani1: "50% 14%", fbBinuhani2: "30% 24%", fbBinuhani3: "48% 30%",
  fbBinuhani4: "50% 35%", fbBinuhani5: "50% 50%", fbJamunhi1: "30% 30%", fbJamunhi3: "50% 50%", fbJamunhi5: "70% 35%",
  fbNausahra1: "30% 22%", fbNausahra4: "35% 50%", fbParasrai1: "50% 40%",
};
const bySrc = new Map(Object.entries(focus).map(([k, v]) => [img[k as keyof typeof img].src, v]));

/** object-position for a photo; matched by src so it also works after server → client serialisation. */
export const focusOf = (src: { src: string } | string) => bySrc.get(typeof src === "string" ? src : src.src) ?? "50% 30%";
