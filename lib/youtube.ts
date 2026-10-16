/* Latest videos from the YouTube channel's public RSS feed (no API key). Refreshed hourly. */
import { site } from "./site";

export type Video = { id: string; title: string; published: string };

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

/* Shown when YouTube's feed is unavailable (it often answers 404/500 to cloud servers like Vercel).
   Update this list now and then so the site never shows an empty video section. Last updated: Oct 2026. */
export const FALLBACK_VIDEOS: Video[] = [
  { id: "Na7f6urdhaI", title: "गरीब-पिछड़ों के दिल में बसी है भाजपा…", published: "2026-02-23T08:33:58+00:00" },
  { id: "3GL3p7NvO5o", title: "सेवा परमो धर्मः।", published: "2026-01-07T08:53:21+00:00" },
  { id: "a67mY-gyrD0", title: "हर-हर महादेव। 🙏", published: "2025-08-26T10:19:44+00:00" },
  { id: "HWiZSZGeH2M", title: "धर्मपत्नी श्रीमती पूनम द्विवेदी जी के साथ पृथ्वीनाथ मंदिर में दर्शन-पूजन का सौभाग्य प्राप्त हुआ।", published: "2025-08-26T10:18:00+00:00" },
  { id: "IVSd8H59Fz4", title: "आप सभी को पवित्र श्रावण मास के द्वितीय सोमवार की हार्दिक शुभकामनाएं।", published: "2025-08-26T10:15:40+00:00" },
  { id: "8l5Lec56_nI", title: "मेरे अतिप्रिय स्व० हृदयराम राजभर जी की चाय की दुकान पर परिवारजनों से भेंट कर कुशलक्षेम जाना…", published: "2025-08-26T10:14:45+00:00" },
  { id: "5whergySZ5o", title: "श्री अनूप सिंह जी भुलैया के प्रथम पुत्र प्राप्ति पर हार्दिक बधाई एवं शुभकामनाएं।", published: "2025-08-26T10:13:23+00:00" },
  { id: "RvxOJVTkpJ4", title: "पूर्व क्षे0 पं0 सदस्य श्री बद्री प्रसाद पाण्डेय जी के अस्वस्थ होने का समाचार हृदय को व्यथित कर गया।", published: "2025-08-26T10:12:02+00:00" },
];

export async function getVideos(limit = 8): Promise<Video[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${site.social.youtube.channelId}`, { next: { revalidate: 3600 } });
    if (!res.ok) return FALLBACK_VIDEOS.slice(0, limit);
    const xml = await res.text();
    const list = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, limit).map(([, e]) => ({
      id: e.match(/<yt:videoId>([^<]+)/)?.[1] ?? "",
      title: decode(e.match(/<title>([^<]*)/)?.[1] ?? ""),
      published: e.match(/<published>([^<]+)/)?.[1] ?? "",
    })).filter((v) => v.id);
    return list.length ? list : FALLBACK_VIDEOS.slice(0, limit);
  } catch {
    return FALLBACK_VIDEOS.slice(0, limit);
  }
}
