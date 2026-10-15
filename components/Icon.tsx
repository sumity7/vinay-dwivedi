/* Line icons (24px grid, stroke = currentColor). */
const P = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  chevDown: <path d="m6 9 6 6 6-6" />,
  chevRight: <path d="m9 6 6 6-6 6" />,
  chevLeft: <path d="m15 6-6 6 6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  complaint: <><path d="M4 4h16v12H8l-4 4z" /><path d="M12 7v6M9 10h6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2.4" /><path d="M14 10h4M14 14h4M6 17c.8-1.8 2-2.6 3-2.6s2.2.8 3 2.6" /></>,
  trend: <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  chat: <><path d="M4 5h16v11H9l-5 4z" /><path d="M8 9h8M8 12h5" /></>,
  send: <path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />,
  doc: <><path d="M14 3v5h5" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" /><path d="M9 13h6M9 17h4" /></>,
  form: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  ticket: <><path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z" /><path d="M9 6v12" /></>,
  checkCircle: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  check: <path d="m5 12 5 5 9-10" />,
  photoAdd: <><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /><path d="M16 5h6M19 2v6" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></>,
  pen: <path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" />,
  images: <><rect x="7" y="3" width="14" height="14" rx="2" /><path d="M3 7v12a2 2 0 0 0 2 2h12" /><path d="m7 13 4-4 4 4 2-2 4 4" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  pin: <><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  download: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></>,
  copy: <><rect x="8" y="8" width="13" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
  book: <><path d="M3 5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16a2 2 0 0 0-2-2H3zM21 5a2 2 0 0 0-2-2h-5a2 2 0 0 0-2 2v16a2 2 0 0 1 2-2h7z" /></>,
  quote: <path d="M9 7H5v6h4v4H5M19 7h-4v6h4v4h-4" />,
  health: <><path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z" /><path d="M9 11h6M12 8v6" /></>,
  house: <><path d="m3 11 9-7 9 7" /><path d="M5 10v10h14V10M10 20v-6h4v6" /></>,
  wheat: <><path d="M12 22V8" /><path d="M12 8c-3-1-4-3-4-5 2 0 4 1 4 5zM12 8c3-1 4-3 4-5-2 0-4 1-4 5zM12 13c-3-1-4-3-4-5 2 0 4 1 4 5zM12 13c3-1 4-3 4-5-2 0-4 1-4 5zM12 18c-3-1-4-3-4-5 2 0 4 1 4 5zM12 18c3-1 4-3 4-5-2 0-4 1-4 5z" /></>,
  shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /><path d="m9 12 2 2 4-4" /></>,
  tools: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />,
  chart: <><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></>,
  road: <path d="M5 21 9 3M19 21 15 3M12 6v2M12 11v2M12 16v2" />,
  plane: <path d="M10 14 3 11l2-2 6 1 5-6a2 2 0 0 1 3 3l-6 5 1 6-2 2-3-7-3 3v3l-2 1-1-3-3-1 1-2h3z" />,
  metro: <><rect x="5" y="3" width="14" height="14" rx="3" /><path d="M5 11h14M8 21l2-4M16 21l-2-4" /><circle cx="9" cy="14" r=".5" /><circle cx="15" cy="14" r=".5" /></>,
  hospital: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M12 7v6M9 10h6M9 21v-4h6v4" /></>,
  cap: <><path d="m2 9 10-5 10 5-10 5z" /><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6" /></>,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  bank: <><path d="m3 9 9-5 9 5" /><path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18" /></>,
  flame: <path d="M12 3c3 4 6 6.5 6 11a6 6 0 0 1-12 0c0-3 1.5-4.5 3-6 0 2 1 3 2 3 0-3-1-5 1-8z" />,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.5" /><path d="M16 14c3 0 5 2.2 5 5" /></>,
  school: <><path d="m3 9 9-5 9 5-9 5z" /><path d="M7 11v5c3 2 7 2 10 0v-5" /></>,
  water: <path d="M12 3c3 4 5 6.5 5 9.5a5 5 0 0 1-10 0C7 9.5 9 7 12 3z" />,
  grievance: <><path d="M4 4h16v12H8l-4 4z" /><path d="m9 10 2 2 4-4" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  play: <path d="M7 4v16l13-8z" fill="currentColor" stroke="none" />,
} satisfies Record<string, React.ReactNode>;

const FILLED = {
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8z" />,
  youtube: <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12a31 31 0 0 0 .4 3.8 3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8zM10 15V9l5.2 3z" />,
  whatsapp: <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.6 2.1 1.1 1 2.1 1.3 2.4 1.4.3.2.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.2 1.2z" />,
} satisfies Record<string, React.ReactNode>;

export type IconName = keyof typeof P | keyof typeof FILLED | "instagram";

export function Icon({ name, className }: { name: IconName; className?: string }) {
  if (name === "instagram") {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>;
  }
  if (name in FILLED) return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">{FILLED[name as keyof typeof FILLED]}</svg>;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {P[name as keyof typeof P]}
    </svg>
  );
}
