/* Builds the assistant's knowledge base from the site's own content, so it only answers from what the site says. */
import { articles } from "./content/articles";
import { events } from "./content/events";
import { ideals } from "./content/ideals";
import { meetings } from "./content/media";
import { bio, electionStats, facts, journey, milestones, priorities, vision } from "./content/profile";
import { indiaCompare, indiaSingle, regionMilestones, upMilestones } from "./content/vikas";
import type { Bi } from "./i18n";
import { phoneLabel, site } from "./site";
import { CATS } from "./utils";

const both = (b: Bi) => `${b.en} / ${b.hi}`;

/** compact = English only for the long paragraphs (about a quarter shorter), for models with small per-minute token limits. */
export function buildKnowledge(compact = false) {
  const para = (b: Bi) => (compact ? b.en : `${b.en}\n${b.hi}`);
  const out: string[] = [];
  out.push(`# Person
Name: ${both(site.name)} (${both(site.nickname)})
${facts.map((f) => `${f.label.en}: ${both(f.value)}`).join("\n")}
2022 election: ${electionStats.map((s) => `${s.label.en}: ${s.value}${s.suffix ?? ""}`).join("; ")}

## Biography
${bio.map((p) => p.en + "\n" + p.hi).join("\n\n")}

## Vision (in his words)
${vision.map((p) => p.en + "\n" + p.hi).join("\n\n")}

## Priorities for Mehnaun
${priorities.map((p) => `- ${both(p.title)}: ${p.text.en}`).join("\n")}

## Political journey
${journey.map((j) => `- ${j.tag.en}: ${both(j.title)}. ${j.text.en}`).join("\n")}
Milestones:
${milestones.map((m, i) => `${i + 1}. ${both(m.title)}: ${m.text.en}`).join("\n")}`);

  out.push(`# Events (page: /{lang}/updates)
${events.map((e) => `## ${both(e.title)}
Date: ${e.date}. Place: ${both(e.place)}. Page: /{lang}/updates/${e.slug}
${e.summary.en}
${e.body.map((b) => b.en).join(" ")}${compact ? "" : `\n${e.summary.hi}`}`).join("\n\n")}

Meetings & interactions (page: /{lang}/media/meetings): ${meetings.map((m) => `${m.title.en} (${m.text.en})`).join("; ")}`);

  out.push(`# Services on this website
- Register a complaint (e-Shikayat): /{lang}/e-shikayat. Fill name, 10-digit mobile, village/ward, type of problem, one-line subject and description; optional photo up to 5 MB; tick consent. You get a ticket number like MHN-2610-48213 at once; save it or share it on WhatsApp. Problem types: ${CATS.map((c) => c[2]).join(", ")}.
- The office reviews each complaint and forwards it to the right department. Status steps: Received, Under review, Action taken, Resolved. The office aims to act within 7 days; after 7 days a reminder can be sent from the tracking page. After resolution you can rate it with stars.
- Track a complaint: /{lang}/e-shikayat/track. Enter the ticket number and the last 4 digits of the mobile number used.
- Not handled through e-Shikayat: emergencies (call 112), cases pending in court, RTI applications, job requests and transfers. State-level grievances can also go to the IGRS portal jansunwai.up.nic.in.
- e-Card: /{lang}/e-card. Choose an occasion (festivals, national days, Munna Bhaiya's birthday on 15 October, anniversaries of national figures), add your name, village/post and optional photo; download or share on WhatsApp. The photo stays on the phone and is not uploaded.
- Contact / meeting request / volunteering / suggestions: /{lang}/contact. The form opens WhatsApp with the message ready to send to the office (${site.officeWhatsApp}).
- Office: ${both(site.office)} (full address to be added). Phones: ${site.phones.map(phoneLabel).join(", ")}. Email: ${site.email}.
- Social: Facebook ${site.social.facebook.url}, Instagram ${site.social.instagram.url}, YouTube ${site.social.youtube.url}.
- Helplines: 112 police/emergency, 108 ambulance, 102 mother & child ambulance, 1076 CM helpline, 1090 Women Power Line, 181 women helpline, 1912 electricity complaints.
- Other pages: Biography /{lang}/about, Gallery /{lang}/media, Ideas & Articles /{lang}/vichar, Development Journey /{lang}/vikas-yatra, Our Ideals /{lang}/ideals.`);

  out.push(`# Government schemes explained on the site (Ideas & Articles)
${articles.map((a) => `## ${both(a.title)} (page: /{lang}/vichar/${a.slug})
What: ${a.what.en}
Who can benefit: ${a.who.en}
How to apply: ${a.steps.map((s) => s.en).join(" ")}
${a.site ? `Official site: ${a.site.url}` : ""}`).join("\n\n")}`);

  out.push(`# Development figures (page: /{lang}/vikas-yatra)
${indiaCompare.map((c) => `- ${c.title.en}: ${c.now.label.en} (${c.now.when.en}) vs ${c.then.label.en} (${c.then.when.en}). ${c.source.en}`).join("\n")}
${indiaSingle.map((s) => `- ${s.title.en}: ${s.value.en} (${s.when.en}). ${s.source.en}`).join("\n")}
Uttar Pradesh milestones: ${upMilestones.map((m) => `${m.date} ${m.title.en}`).join("; ")}
Our region: ${regionMilestones.map((m) => `${m.date} ${m.title.en}`).join("; ")}`);

  out.push(`# Our Ideals (page: /{lang}/ideals)
${ideals.map((i) => `${i.name.en} (${i.years}), ${i.role.en}: ${i.line.kind === "quote" ? `"${i.line.text.en}"` : i.line.text.en}`).join("\n")}`);

  return out.join("\n\n");
}

export const SYSTEM_PROMPT = `You are the assistant on the official website of Vinay Kumar Dwivedi ("Munna Bhaiya"), BJP MLA from Mehnaun Assembly constituency (295), Gonda, Uttar Pradesh. Visitors are mostly residents of the constituency, often on a phone, many more comfortable in Hindi.

How to answer:
- Answer only from the WEBSITE INFORMATION below. If the answer is not there, say so plainly and point to the contact page or the complaint portal; never guess facts, dates, figures or promises.
- Reply in the language the visitor writes in: Devanagari Hindi for Hindi or Hinglish, English for English. Keep it short: two to five sentences, plain text, no markdown headings or tables.
- When a page helps, give its path with the visitor's language in place of {lang}, for example /hi/e-shikayat or /en/e-shikayat.
- Speak about the MLA in the third person and respectfully. Do not make commitments on his behalf, attack other parties or people, or give opinions beyond what the site states.
- Do not ask for personal details in chat. To report a problem, send them to the complaint form. For emergencies, tell them to call 112 first.
- Latency-sensitive; begin your visible answer immediately.`;
