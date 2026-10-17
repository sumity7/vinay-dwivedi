import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/Chrome";
import { YouTubeFeed } from "@/components/Home";
import { Icon } from "@/components/Icon";
import { PhotoGrid } from "@/components/PhotoGrid";
import { sortedEvents } from "@/lib/content/events";
import { morePhotos } from "@/lib/content/media";
import { href, tr, type Lang } from "@/lib/i18n";
import { getVideos } from "@/lib/youtube";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "hi" ? "मीडिया" : "Media" };
}

export default async function Media({ params }: Props) {
  const lang = (await params).lang as Lang;
  const t = (hi: string, en: string) => (lang === "hi" ? hi : en);
  const videos = await getVideos();
  return (
    <>
      <PageHero
        lang={lang}
        crumbs={[{ label: { hi: "मीडिया", en: "Media" } }]}
        title={{ hi: "मीडिया", en: "Media" }}
        lead={{ hi: "सार्वजनिक जीवन के आधिकारिक चित्र और यादगार पल। फोटो दबाकर बड़ा देखें और साझा करें।", en: "Official photographs and moments from public life. Tap a photo to view it larger and share it." }}
      />
      <section>
        <h2 className="sr-only">{lang === "hi" ? "मीडिया" : "Media"}</h2>
        <div className="wrap">
          <div className="occ" style={{ marginTop: 0, marginBottom: 36 }}>
            {sortedEvents.map((e) => <a key={e.slug} className="chip" href={`#${e.slug}`}>{tr(e.title, lang)}</a>)}
            <a className="chip" href="#more">{t("और तस्वीरें", "More photographs")}</a>
            <a className="chip" href="#videos">{t("वीडियो", "Videos")}</a>
          </div>
          {sortedEvents.map((e) => (
            <div className="album" id={e.slug} key={e.slug} style={{ scrollMarginTop: 100 }}>
              <h2><Link href={href(lang, `/updates/${e.slug}`)} style={{ textDecoration: "none" }}>{tr(e.title, lang)}</Link></h2>
              <PhotoGrid photos={e.photos} />
            </div>
          ))}
          <div className="album" id="more" style={{ scrollMarginTop: 100 }}>
            <h2>{t("और तस्वीरें", "More photographs")}</h2>
            <PhotoGrid photos={morePhotos} />
          </div>
          <div className="album" id="videos" style={{ scrollMarginTop: 100, maxWidth: 760 }}>
            <h2>{t("वीडियो", "Videos")}</h2>
            <YouTubeFeed videos={videos} />
          </div>
          <div className="foot-links">
            <Link className="link-arrow" href={href(lang, "/media/meetings")}>{t("भेंट व संवाद", "Meetings & Interactions")} <Icon name="arrow" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
