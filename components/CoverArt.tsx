/* Original flat illustrations, one per scheme / development topic. Pure SVG (no image files, no licences),
   used as card covers on Ideas & Articles and Development Journey. Server component. */
import type { ReactNode } from "react";

export type Scene = "health" | "house" | "farm" | "women" | "edu" | "skill" | "growth" | "road" | "plane" | "metro" | "bolt" | "bank" | "flame" | "people";

const SKY: Record<Scene, [string, string]> = {
  health: ["#0f8f8f", "#5fd0c4"],
  house: ["#f6a04a", "#ffd9a0"],
  farm: ["#f4b43c", "#ffe9a8"],
  women: ["#6b3fa0", "#e58bb8"],
  edu: ["#1e3a8a", "#6ea8ff"],
  skill: ["#b45309", "#fbbf5d"],
  growth: ["#172554", "#f68b2c"],
  road: ["#7c2d12", "#fdba74"],
  plane: ["#0b6bcb", "#a5d8ff"],
  metro: ["#312e81", "#a78bfa"],
  bolt: ["#0f172a", "#38bdf8"],
  bank: ["#14532d", "#86efac"],
  flame: ["#9a3412", "#fdba74"],
  people: ["#0f766e", "#fde68a"],
};

const Sun = ({ x, y, r = 46, c = "#fff7d6" }: { x: number; y: number; r?: number; c?: string }) => (
  <g><circle cx={x} cy={y} r={r * 1.9} fill={c} opacity=".18" /><circle cx={x} cy={y} r={r * 1.35} fill={c} opacity=".3" /><circle cx={x} cy={y} r={r} fill={c} /></g>
);
const Cloud = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity=".85"><ellipse cx="0" cy="0" rx="44" ry="16" /><ellipse cx="-20" cy="-12" rx="22" ry="16" /><ellipse cx="14" cy="-18" rx="26" ry="20" /></g>
);
const Hills = ({ a, b }: { a: string; b: string }) => (
  <g><path d="M0 380 Q150 320 300 372 T600 350 T800 380 V500 H0Z" fill={a} /><path d="M0 430 Q200 390 400 430 T800 420 V500 H0Z" fill={b} /></g>
);
const Tree = ({ x, y, s = 1, c = "#1f9d55" }: { x: number; y: number; s?: number; c?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-4" y="0" width="8" height="34" fill="#7a4a21" /><circle cx="0" cy="-8" r="26" fill={c} /><circle cx="-16" cy="6" r="18" fill={c} /><circle cx="16" cy="6" r="18" fill={c} /></g>
);

function art(s: Scene): ReactNode {
  switch (s) {
    case "health":
      return (<>
        <Cloud x={120} y={90} /><Cloud x={640} y={70} s={.8} />
        <Hills a="#0b7a7a" b="#095f63" />
        <rect x="430" y="150" width="250" height="250" rx="8" fill="#fff" /><rect x="430" y="150" width="250" height="34" fill="#e2f6f3" />
        {[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={452 + c * 56} y={206 + r * 46} width="34" height="28" rx="3" fill="#bfe6ee" />))}
        <rect x="530" y="340" width="50" height="60" fill="#0f8f8f" />
        <rect x="540" y="116" width="30" height="34" fill="#ef4444" /><rect x="528" y="128" width="54" height="10" fill="#ef4444" />
        <path d="M230 120 L330 150 V250 Q330 330 230 370 Q130 330 130 250 V150Z" fill="#fff" /><path d="M230 140 L312 164 V250 Q312 316 230 350 Q148 316 148 250 V164Z" fill="#14b8a6" />
        <rect x="216" y="196" width="28" height="100" rx="5" fill="#fff" /><rect x="180" y="232" width="100" height="28" rx="5" fill="#fff" />
        <path d="M0 430 H130 L160 400 L190 460 L220 420 H800" fill="none" stroke="#fff" strokeWidth="5" opacity=".8" />
      </>);
    case "house":
      return (<>
        <Sun x={640} y={110} /><Cloud x={160} y={90} />
        <Hills a="#4ca35a" b="#2f7d42" />
        <g><rect x="150" y="250" width="230" height="160" fill="#f3d9b1" /><path d="M130 258 L265 160 L400 258Z" fill="#c2410c" /><rect x="236" y="320" width="56" height="90" fill="#7a4a21" /><rect x="170" y="290" width="46" height="46" fill="#9bd4f5" /><rect x="312" y="290" width="46" height="46" fill="#9bd4f5" /></g>
        <g><rect x="450" y="290" width="190" height="120" fill="#fde7c3" /><path d="M432 296 L545 214 L658 296Z" fill="#b45309" /><rect x="520" y="340" width="46" height="70" fill="#7a4a21" /><rect x="466" y="316" width="36" height="36" fill="#9bd4f5" /><rect x="584" y="316" width="36" height="36" fill="#9bd4f5" /></g>
        <Tree x={90} y={330} s={.9} /><Tree x={710} y={340} />
        <circle cx="265" cy="214" r="18" fill="#fff" /><path d="M255 214 l7 7 l13 -14" stroke="#16a34a" strokeWidth="5" fill="none" strokeLinecap="round" />
      </>);
    case "farm":
      return (<>
        <Sun x={600} y={120} r={52} c="#fff3b0" /><Cloud x={180} y={90} />
        <path d="M0 300 H800 V500 H0Z" fill="#d9a82c" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-50 + i * 60} 500 L400 300`} stroke="#b9851a" strokeWidth="9" opacity=".7" />)}
        {[0, 1, 2, 3, 4].map((i) => <path key={`b${i}`} d={`M${450 + i * 80} 500 L400 300`} stroke="#b9851a" strokeWidth="9" opacity=".7" />)}
        <path d="M0 310 Q200 270 400 305 T800 300 V320 H0Z" fill="#5bb04b" />
        {[130, 210, 290, 510, 590, 670].map((x, i) => (<g key={x} transform={`translate(${x} ${360 + (i % 3) * 26})`}><path d="M0 60 V0" stroke="#a16207" strokeWidth="5" />{[0, 1, 2, 3].map((k) => <ellipse key={k} cx={k % 2 ? 8 : -8} cy={k * 11 - 2} rx="6" ry="12" fill="#e6b422" />)}</g>))}
        <circle cx="400" cy="200" r="64" fill="#f68b2c" stroke="#fff" strokeWidth="6" /><text x="400" y="228" textAnchor="middle" fontSize="80" fontWeight="700" fill="#fff" fontFamily="sans-serif">₹</text>
      </>);
    case "women":
      return (<>
        <Sun x={650} y={100} c="#ffe3f0" /><Cloud x={150} y={110} />
        <Hills a="#7e4fb3" b="#5b3489" />
        <path d="M400 70 L540 112 V240 Q540 340 400 395 Q260 340 260 240 V112Z" fill="#fff" /><path d="M400 94 L518 128 V240 Q518 322 400 370 Q282 322 282 240 V128Z" fill="#be3b8a" />
        <circle cx="400" cy="205" r="42" fill="none" stroke="#fff" strokeWidth="12" /><path d="M400 247 V312 M370 285 H430" stroke="#fff" strokeWidth="12" strokeLinecap="round" />
        {[[150, 260], [680, 250], [110, 180], [720, 170]].map(([x, y], i) => <path key={i} d={`M${x} ${y - 14} l4 10 l11 1 l-8 7 l3 11 l-10 -6 l-10 6 l3 -11 l-8 -7 l11 -1z`} fill="#ffe3f0" />)}
      </>);
    case "edu":
      return (<>
        <Sun x={650} y={100} c="#fff3b0" /><Cloud x={140} y={100} />
        <Hills a="#2e5bb8" b="#1e3a8a" />
        <path d="M400 150 L620 232 L400 314 L180 232Z" fill="#0f172a" /><path d="M280 270 V340 Q400 400 520 340 V270 L400 314Z" fill="#1e293b" /><path d="M590 245 V330" stroke="#fbbf24" strokeWidth="6" /><circle cx="590" cy="338" r="11" fill="#fbbf24" />
        <path d="M130 410 Q265 380 400 410 Q535 380 670 410 V440 Q535 410 400 440 Q265 410 130 440Z" fill="#fff" /><path d="M400 410 V440" stroke="#cbd5e1" strokeWidth="4" />
        <rect x="150" y="448" width="500" height="14" rx="4" fill="#f68b2c" />
      </>);
    case "skill":
      return (<>
        <Cloud x={620} y={90} s={.8} />
        <Hills a="#b36a12" b="#8a4b0a" />
        {[[260, 230, 90, 12], [470, 190, 66, 10]].map(([x, y, r, n], i) => (<g key={i} transform={`translate(${x} ${y})`}><g fill="#fff">{Array.from({ length: n }).map((_, k) => <rect key={k} x={-9} y={-(r as number) - 12} width="18" height="28" rx="3" transform={`rotate(${(360 / (n as number)) * k})`} />)}<circle r={r as number} /></g><circle r={(r as number) * .55} fill="#c2410c" /><circle r={(r as number) * .2} fill="#fff" /></g>))}
        <g transform="rotate(-35 600 330)"><rect x="560" y="250" width="26" height="170" rx="8" fill="#e5e7eb" /><circle cx="573" cy="250" r="34" fill="none" stroke="#e5e7eb" strokeWidth="22" /></g>
        <circle cx="180" cy="390" r="48" fill="#fbbf24" stroke="#fff" strokeWidth="5" /><text x="180" y="412" textAnchor="middle" fontSize="58" fontWeight="700" fill="#fff" fontFamily="sans-serif">₹</text>
      </>);
    case "growth":
      return (<>
        <Sun x={620} y={110} c="#ffd08a" />
        <rect y="400" width="800" height="100" fill="#0b1c4d" />
        <rect y="400" width="800" height="12" fill="#f68b2c" /><rect y="412" width="800" height="12" fill="#fff" /><rect y="424" width="800" height="12" fill="#1fa34a" />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={150 + i * 90} y={370 - i * 46} width="62" height={30 + i * 46} rx="5" fill={i % 2 ? "#fff" : "#fbbf24"} opacity=".95" />)}
        <path d="M150 300 L330 230 L430 250 L640 90" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" /><path d="M640 90 l-34 4 m34 -4 l-8 34" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
        <circle cx="130" cy="130" r="46" fill="#fff" /><circle cx="130" cy="130" r="38" fill="none" stroke="#1d4ed8" strokeWidth="4" />{Array.from({ length: 12 }).map((_, k) => <path key={k} d="M130 130 L130 94" stroke="#1d4ed8" strokeWidth="3" transform={`rotate(${k * 30} 130 130)`} />)}
      </>);
    case "road":
      return (<>
        <Sun x={400} y={250} r={64} c="#fff1c2" />
        <path d="M0 290 L140 250 L260 285 L400 240 L540 285 L670 255 L800 290 V330 H0Z" fill="#7c2d12" opacity=".55" />
        <rect y="300" width="800" height="200" fill="#4a3a31" />
        <path d="M250 500 L385 300 H415 L550 500Z" fill="#2a2a33" /><path d="M392 500 L398 300 H402 L408 500Z" fill="#fff" opacity=".0" />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${400 - 2 - i * 3} ${312 + i * i * 9 + i * 14} l${4 + i * 6} 0 l${1 + i * 4} ${16 + i * 8} l${-(6 + i * 8)} 0Z`} fill="#fff" />)}
        {[-1, 1].map((d) => [0, 1, 2].map((i) => (<g key={`${d}${i}`} transform={`translate(${400 + d * (70 + i * 80)} ${296 + i * 46}) scale(${.5 + i * .3})`}><rect x="-2" y="-60" width="4" height="60" fill="#e5e7eb" /><circle cx="0" cy="-64" r="8" fill="#ffe08a" /></g>)))}
      </>);
    case "plane":
      return (<>
        <Cloud x={160} y={110} s={1.2} /><Cloud x={640} y={330} s={1.1} /><Cloud x={420} y={60} s={.7} />
        <g transform="translate(400 210) rotate(-14)"><path d="M-190 0 Q-200 -22 -150 -26 H150 Q210 -22 230 0 Q210 22 150 26 H-150 Q-200 22 -190 0Z" fill="#fff" /><path d="M-30 -22 L-110 -120 H-70 L40 -22Z" fill="#e2e8f0" /><path d="M-30 22 L-110 120 H-70 L40 22Z" fill="#cbd5e1" /><path d="M-170 -22 L-200 -78 H-165 L-120 -22Z" fill="#f68b2c" />{[-90, -60, -30, 0, 30, 60, 90, 120].map((x) => <circle key={x} cx={x} cy="-6" r="6" fill="#38bdf8" />)}<path d="M150 -26 Q215 -20 230 0 L150 0Z" fill="#cbd5e1" /></g>
        <rect y="440" width="800" height="60" fill="#334155" /><path d="M0 470 H800" stroke="#fff" strokeWidth="5" strokeDasharray="40 30" />
      </>);
    case "metro":
      return (<>
        <Hills a="#4338ca" b="#312e81" />
        {[120, 330, 540, 750].map((x) => <rect key={x} x={x - 16} y="330" width="32" height="170" fill="#475569" />)}
        <rect y="320" width="800" height="26" fill="#64748b" /><rect y="346" width="800" height="8" fill="#334155" />
        <g><rect x="150" y="190" width="500" height="130" rx="28" fill="#fff" /><rect x="150" y="270" width="500" height="22" fill="#f68b2c" />{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={186 + i * 92} y="212" width="66" height="46" rx="8" fill="#7dd3fc" />)}<circle cx="190" cy="320" r="15" fill="#1e293b" /><circle cx="610" cy="320" r="15" fill="#1e293b" /></g>
        <path d="M0 150 H800" stroke="#c7d2fe" strokeWidth="3" opacity=".6" /><path d="M120 150 V190 M680 150 V190" stroke="#c7d2fe" strokeWidth="3" />
      </>);
    case "bolt":
      return (<>
        <Hills a="#0e4a6b" b="#0b3550" />
        {[190, 600].map((x) => (<g key={x} transform={`translate(${x} 130)`} stroke="#e2e8f0" strokeWidth="6" fill="none"><path d="M0 0 L-46 300 M0 0 L46 300 M-24 120 H24 M-36 210 H36 M-60 70 H60 M-30 70 L0 120 L30 70" /></g>))}
        <path d="M130 200 Q395 270 660 200 M130 240 Q395 310 660 240" stroke="#e2e8f0" strokeWidth="3" fill="none" />
        <path d="M430 40 L330 220 H410 L370 380 L520 170 H440Z" fill="#fde047" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
        <rect y="420" width="800" height="80" fill="#0b2a3f" /><path d="M0 436 H800 M0 464 H800" stroke="#94a3b8" strokeWidth="4" />
      </>);
    case "bank":
      return (<>
        <Sun x={650} y={100} c="#e8ffd2" /><Cloud x={140} y={100} />
        <Hills a="#2f8f4e" b="#14532d" />
        <path d="M200 190 L400 100 L600 190Z" fill="#fff" /><rect x="200" y="190" width="400" height="22" fill="#e2e8f0" />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={226 + i * 80} y="216" width="36" height="150" fill="#fff" />)}
        <rect x="180" y="366" width="440" height="22" fill="#e2e8f0" /><rect x="160" y="388" width="480" height="22" fill="#cbd5e1" />
        <circle cx="400" cy="160" r="22" fill="#f68b2c" /><text x="400" y="170" textAnchor="middle" fontSize="26" fontWeight="700" fill="#fff" fontFamily="sans-serif">₹</text>
        <g><circle cx="110" cy="360" r="40" fill="#fbbf24" stroke="#fff" strokeWidth="5" /><text x="110" y="378" textAnchor="middle" fontSize="48" fontWeight="700" fill="#fff" fontFamily="sans-serif">₹</text><circle cx="700" cy="380" r="32" fill="#fbbf24" stroke="#fff" strokeWidth="5" /><text x="700" y="396" textAnchor="middle" fontSize="38" fontWeight="700" fill="#fff" fontFamily="sans-serif">₹</text></g>
      </>);
    case "flame":
      return (<>
        <Hills a="#c2410c" b="#9a3412" />
        <g><rect x="300" y="180" width="170" height="240" rx="40" fill="#e11d48" /><rect x="300" y="248" width="170" height="14" fill="#fff" opacity=".6" /><rect x="352" y="146" width="66" height="44" rx="8" fill="#9f1239" /><rect x="362" y="126" width="46" height="26" rx="6" fill="#64748b" /><rect x="316" y="214" width="138" height="16" rx="6" fill="#fff" opacity=".35" /></g>
        <g transform="translate(540 190)"><path d="M0 -110 C60 -50 70 20 30 70 C10 95 -30 95 -50 70 C-80 30 -60 -30 -20 -50 C-20 -20 0 -10 10 -30 C20 -60 0 -80 0 -110Z" fill="#fbbf24" /><path d="M0 -40 C30 -5 40 30 18 58 C6 72 -22 72 -32 54 C-46 28 -30 0 -4 -14 C-6 6 6 10 10 -4Z" fill="#f97316" /></g>
        <path d="M120 420 H680" stroke="#fff" strokeWidth="4" opacity=".4" />
      </>);
    case "people":
      return (<>
        <Sun x={650} y={100} c="#fff3b0" /><Cloud x={140} y={100} />
        <Hills a="#2f9e8f" b="#0f766e" />
        {[[250, 4, "#f68b2c"], [400, 0, "#fff"], [550, 4, "#1fa34a"], [330, 36, "#fbbf24"], [470, 36, "#38bdf8"]].map(([x, d, c], i) => (<g key={i} transform={`translate(${x} ${240 + (d as number) * 2})`}><circle cy="-44" r="30" fill="#f1c9a0" /><path d="M-52 120 Q-52 10 0 10 Q52 10 52 120Z" fill={c as string} /></g>))}
        <path d="M120 380 H680" stroke="#fff" strokeWidth="4" opacity=".4" />
      </>);
  }
}

export function CoverArt({ scene, className }: { scene: Scene; className?: string }) {
  const [a, b] = SKY[scene];
  const id = `cv-${scene}`;
  return (
    <svg className={className} viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
      <rect width="800" height="500" fill={`url(#${id})`} />
      {art(scene)}
    </svg>
  );
}
