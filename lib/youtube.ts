/* Latest videos from the YouTube channel's public RSS feed (no API key). Refreshed hourly. */
import { site } from "./site";

export type Video = { id: string; title: string; published: string };

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

export async function getVideos(limit = 8): Promise<Video[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${site.social.youtube.channelId}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, limit).map(([, e]) => ({
      id: e.match(/<yt:videoId>([^<]+)/)?.[1] ?? "",
      title: decode(e.match(/<title>([^<]*)/)?.[1] ?? ""),
      published: e.match(/<published>([^<]+)/)?.[1] ?? "",
    })).filter((v) => v.id);
  } catch {
    return [];
  }
}
