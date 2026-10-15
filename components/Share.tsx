"use client";
import { useEffect, useState } from "react";
import { absUrl, waLink } from "@/lib/utils";
import { Icon } from "./Icon";
import { useSite } from "./SiteProvider";

export function ShareWhatsApp({ text, path, className = "btn btn-primary" }: { text: string; path: string; className?: string }) {
  const { t } = useSite();
  const [url, setUrl] = useState(path);
  useEffect(() => setUrl(absUrl(path)), [path]);
  return (
    <a className={className} target="_blank" rel="noopener" href={waLink(`${text}\n${url}`)}>
      <Icon name="whatsapp" />{t("WhatsApp पर साझा करें", "Share on WhatsApp")}
    </a>
  );
}
