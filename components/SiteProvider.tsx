"use client";
import Image, { type StaticImageData } from "next/image";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Bi, Lang } from "@/lib/i18n";
import { absUrl, waLink } from "@/lib/utils";
import { Icon } from "./Icon";

export type LightboxItem = { img: StaticImageData; cap: string };

type SiteCtx = {
  lang: Lang;
  t: (hi: string, en: string) => string;
  pick: (b: Bi) => string;
  toast: (msg: string) => void;
  openLightbox: (list: LightboxItem[], idx: number) => void;
  assistantOpen: boolean;
  setAssistantOpen: (v: boolean) => void;
};

const Ctx = createContext<SiteCtx | null>(null);

export function useSite() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSite must be used inside <SiteProvider>");
  return c;
}

export function SiteProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const [lb, setLb] = useState<{ list: LightboxItem[]; idx: number } | null>(null);
  const [toastMsg, setToastMsg] = useState({ msg: "", show: false });
  const [assistantOpen, setAssistantOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toast = useCallback((msg: string) => {
    setToastMsg({ msg, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg((s) => ({ ...s, show: false })), 2800);
  }, []);

  const value = useMemo<SiteCtx>(() => ({
    lang,
    t: (hi, en) => (lang === "en" ? en : hi),
    pick: (b) => b[lang],
    toast,
    openLightbox: (list, idx) => setLb({ list, idx }),
    assistantOpen,
    setAssistantOpen,
  }), [lang, toast, assistantOpen]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <Lightbox state={lb} setState={setLb} />
      <div className={`toast${toastMsg.show ? " show" : ""}`} role="status">{toastMsg.msg}</div>
    </Ctx.Provider>
  );
}

function Lightbox({ state, setState }: {
  state: { list: LightboxItem[]; idx: number } | null;
  setState: (s: { list: LightboxItem[]; idx: number } | null) => void;
}) {
  const { t } = useSite();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = !!state;

  const step = useCallback((d: number) => {
    if (!state) return;
    const n = state.list.length;
    setState({ ...state, idx: (state.idx + d + n) % n });
  }, [state, setState]);

  useEffect(() => { if (open) closeRef.current?.focus(); }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setState(null);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, step, setState]);

  const it = state?.list[state.idx];
  const multi = (state?.list.length ?? 0) > 1;
  return (
    <div className={`lightbox${open ? " open" : ""}`} role="dialog" aria-modal="true" aria-label={t("फोटो", "Photo")}
      onClick={(e) => { if (e.target === e.currentTarget) setState(null); }}>
      <button ref={closeRef} type="button" className="lb-btn lb-x" aria-label={t("बंद करें", "Close")} onClick={() => setState(null)}><Icon name="close" /></button>
      {multi && <button type="button" className="lb-btn lb-l" aria-label={t("पिछली", "Previous")} onClick={() => step(-1)}><Icon name="chevLeft" /></button>}
      {multi && <button type="button" className="lb-btn lb-r" aria-label={t("अगली", "Next")} onClick={() => step(1)}><Icon name="chevRight" /></button>}
      {it && (
        <div className="lb-body">
          <Image src={it.img} alt={it.cap} sizes="(max-width: 1100px) 100vw, 1100px" quality={90} priority />
          <p className="cap">{it.cap}</p>
          <div className="share-row">
            <a target="_blank" rel="noopener" href={waLink(`${it.cap} — ${t("विनय कुमार द्विवेदी, विधायक मेहनौन", "Vinay Kumar Dwivedi, MLA Mehnaun")} ${absUrl(location.pathname)}`)}>
              {t("WhatsApp पर साझा करें", "Share on WhatsApp")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
