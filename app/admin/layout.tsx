import type { Metadata, Viewport } from "next";
import { Noto_Serif, Noto_Serif_Devanagari, Tiro_Devanagari_Hindi } from "next/font/google";
import type { ReactNode } from "react";
import "../globals.css";
import "./admin.css";

const tiro = Tiro_Devanagari_Hindi({ weight: "400", subsets: ["devanagari", "latin"], variable: "--font-display", display: "swap" });
const serifLatin = Noto_Serif({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-body", display: "swap" });
const serifHindi = Noto_Serif_Devanagari({ weight: ["400", "500", "600", "700"], subsets: ["devanagari"], variable: "--font-body-hi", display: "swap" });

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const viewport: Viewport = { themeColor: "#141b38" };

/* /admin sits outside [lang], so it is its own root layout (no site header, footer or assistant) */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${tiro.variable} ${serifLatin.variable} ${serifHindi.variable}`}>
      <body>{children}</body>
    </html>
  );
}
