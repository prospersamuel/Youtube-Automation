import React from "react";
import type { Theme } from "./theme";

export const W = 1920;
export const H = 1080;
export const FLOOR = 880;

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type P = { t: Theme };

export const Defs: React.FC<P & { sky?: string[] }> = ({ t, sky }) => (
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      {(sky ?? [t.wall, t.wall2]).map((c, i, a) => (
        <stop key={i} offset={i / (a.length - 1)} stopColor={c} />
      ))}
    </linearGradient>
    <radialGradient id="glow">
      <stop offset="0" stopColor={t.accent} stopOpacity="0.55" />
      <stop offset="1" stopColor={t.accent} stopOpacity="0" />
    </radialGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity="0.38" />
    </radialGradient>
    <filter id="wobble" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="4" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="5" />
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" />
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 -0.12" />
    </filter>
  </defs>
);

export const Finish: React.FC<{ dark: boolean }> = ({ dark }) => (
  <g pointerEvents="none">
    <rect width={W} height={H} filter="url(#grain)" opacity={dark ? 0.1 : 0.16} style={{ mixBlendMode: "soft-light" }} />
    <rect width={W} height={H} fill="url(#vignette)" opacity={dark ? 1 : 0.35} />
  </g>
);

export const RoomShell: React.FC<P> = ({ t }) => (
  <g>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#wall)" />
    <rect x={-60} y={FLOOR} width={W + 120} height={H - FLOOR + 60} fill={t.floor} />
    <path d={`M-60 ${FLOOR - 30} H${W + 60}`} stroke={t.line} strokeWidth={4} opacity={0.25} />
    <path d={`M-60 ${FLOOR} H${W + 60}`} stroke={t.line} strokeWidth={7} />
  </g>
);

export const Window: React.FC<P & { x: number; y: number; w: number; h: number; night: boolean }> = ({ t, x, y, w, h, night }) => {
  const r = rng(7);
  return (
    <g>
      <clipPath id={`win${x}`}>
        <rect x={x} y={y} width={w} height={h} rx={12} />
      </clipPath>
      <rect x={x} y={y} width={w} height={h} rx={12} fill={night ? "#0B1028" : "#BFE6EC"} />
      <g clipPath={`url(#win${x})`}>
        {night ? (
          <>
            {Array.from({ length: 22 }, (_, i) => (
              <circle key={i} cx={x + r() * w} cy={y + r() * h * 0.8} r={1.5 + r() * 2.5} fill="#FDF3D0" opacity={0.5 + r() * 0.5} />
            ))}
            <circle cx={x + w * 0.68} cy={y + h * 0.3} r={54} fill="#FDF3D0" />
            <circle cx={x + w * 0.68 - 24} cy={y + h * 0.3 - 12} r={48} fill="#0B1028" />
            <path d={`M${x} ${y + h} v-70 h50 v-40 h60 v70 h40 v-110 h70 v60 h50 v-30 h60 v80 h${w} v40 Z`} fill="#161E44" />
          </>
        ) : (
          <>
            <circle cx={x + w * 0.74} cy={y + h * 0.28} r={50} fill="#FFC94D" />
            <g fill="#FFFFFF">
              <rect x={x + 30} y={y + h * 0.45} width={170} height={44} rx={22} />
              <rect x={x + 70} y={y + h * 0.45 - 26} width={90} height={50} rx={25} />
              <rect x={x + w * 0.5} y={y + h * 0.66} width={210} height={40} rx={20} />
            </g>
            <path d={`M${x} ${y + h} q${w * 0.3} -120 ${w * 0.55} -30 q${w * 0.25} -70 ${w * 0.5} 10 v40 Z`} fill={t.accent2} opacity={0.55} />
          </>
        )}
      </g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="none" stroke={t.line} strokeWidth={9} />
      <path d={`M${x + w / 2} ${y} v${h} M${x} ${y + h / 2} h${w}`} stroke={t.line} strokeWidth={6} />
      <rect x={x - 26} y={y + h - 2} width={w + 52} height={24} rx={8} fill={t.surface} stroke={t.line} strokeWidth={7} />
    </g>
  );
};

export const Desk: React.FC<P & { x: number; w: number; top: number }> = ({ t, x, w, top }) => (
  <g>
    <path d={`M${x + 36} ${top + 20} V${FLOOR} M${x + w - 36} ${top + 20} V${FLOOR}`} stroke={t.line} strokeWidth={11} strokeLinecap="round" />
    <rect x={x + 60} y={top + 22} width={150} height={74} rx={8} fill={t.surface} stroke={t.line} strokeWidth={7} />
    <circle cx={x + 135} cy={top + 60} r={7} fill={t.accent} stroke={t.line} strokeWidth={4} />
    <rect x={x} y={top} width={w} height={26} rx={9} fill={t.surface} stroke={t.line} strokeWidth={7} />
  </g>
);

export const Laptop: React.FC<P & { x: number; y: number }> = ({ t, x, y }) => (
  <g>
    <path d={`M${x + 34} ${y - 12} L${x + 62} ${y - 124} H${x + 216} L${x + 188} ${y - 12} Z`} fill={t.accent2} stroke={t.line} strokeWidth={7} strokeLinejoin="round" />
    <path d={`M${x + 84} ${y - 92} h70 M${x + 78} ${y - 68} h96 M${x + 72} ${y - 44} h54`} stroke={t.ink} strokeWidth={6} strokeLinecap="round" opacity={0.55} />
    <rect x={x} y={y - 14} width={200} height={14} rx={7} fill={t.surface} stroke={t.line} strokeWidth={7} />
  </g>
);

export const Lamp: React.FC<P & { x: number; y: number }> = ({ t, x, y }) => (
  <g>
    <circle cx={x + 90} cy={y - 110} r={330} fill="url(#glow)" />
    <path d={`M${x} ${y - 10} q-34 -110 46 -170`} stroke={t.line} strokeWidth={9} strokeLinecap="round" fill="none" />
    <rect x={x - 40} y={y - 16} width={80} height={16} rx={8} fill={t.surface} stroke={t.line} strokeWidth={7} />
    <path d="M-24 -44 H24 L60 30 H-60 Z" fill={t.accent} stroke={t.line} strokeWidth={8} strokeLinejoin="round" transform={`translate(${x + 62} ${y - 190}) rotate(28)`} />
  </g>
);

export const BookStack: React.FC<P & { x: number; y: number }> = ({ t, x, y }) => (
  <g stroke={t.line} strokeWidth={7}>
    <rect x={x} y={y - 26} width={150} height={26} rx={6} fill={t.accent2} />
    <rect x={x + 14} y={y - 52} width={128} height={26} rx={6} fill={t.accent} />
    <rect x={x - 4} y={y - 78} width={136} height={26} rx={6} fill={t.surface} />
  </g>
);

export const Mug: React.FC<P & { x: number; y: number }> = ({ t, x, y }) => (
  <g>
    <path d={`M${x + 52} ${y - 44} q28 0 28 18 q0 18 -28 14`} stroke={t.line} strokeWidth={7} fill="none" />
    <rect x={x} y={y - 60} width={56} height={60} rx={10} fill={t.accent} stroke={t.line} strokeWidth={7} />
    <path d={`M${x + 16} ${y - 76} q-10 -14 0 -26 q10 -12 0 -26 M${x + 40} ${y - 80} q-10 -12 0 -22 q10 -10 0 -22`} stroke={t.line} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.6} />
  </g>
);

export const Plant: React.FC<P & { x: number; y?: number; s?: number }> = ({ t, x, y = FLOOR, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-58, -30, -4, 24, 52].map((a, i) => (
      <path
        key={i}
        d="M0 -96 C-46 -150 -40 -236 0 -286 C40 -236 46 -150 0 -96 Z"
        fill={t.accent2}
        stroke={t.line}
        strokeWidth={7}
        strokeLinejoin="round"
        transform={`rotate(${a} 0 -96) scale(${i % 2 ? 0.82 : 1})`}
      />
    ))}
    <path d="M-62 -110 H62 L46 0 H-46 Z" fill={t.accent} stroke={t.line} strokeWidth={8} strokeLinejoin="round" />
    <path d="M-70 -110 H70" stroke={t.line} strokeWidth={14} strokeLinecap="round" />
  </g>
);

export const Bookshelf: React.FC<P & { x: number; y: number; w: number }> = ({ t, x, y, w }) => {
  const r = rng(21);
  const fills = [t.accent, t.accent2, t.line, t.surface, "#F2B84B"];
  const rows = 3;
  const rowH = (FLOOR - y) / rows;
  return (
    <g>
      <rect x={x} y={y} width={w} height={FLOOR - y} rx={10} fill={t.wall2} stroke={t.line} strokeWidth={9} />
      {Array.from({ length: rows }, (_, row) => {
        const base = y + rowH * (row + 1) - 8;
        let cx = x + 22;
        const books: React.ReactNode[] = [];
        let i = 0;
        while (cx < x + w - 70) {
          const bw = 26 + Math.floor(r() * 22);
          const bh = rowH * (0.55 + r() * 0.25);
          const gap = r() > 0.82;
          if (!gap) {
            books.push(
              <rect key={i} x={cx} y={base - bh} width={bw} height={bh} rx={5} fill={fills[Math.floor(r() * fills.length)]} stroke={t.line} strokeWidth={6} />
            );
          }
          cx += bw + (gap ? 20 : 4);
          i++;
        }
        return (
          <g key={row}>
            {books}
            <path d={`M${x} ${base + 4} h${w}`} stroke={t.line} strokeWidth={8} />
          </g>
        );
      })}
    </g>
  );
};

export const Picture: React.FC<P & { x: number; y: number }> = ({ t, x, y }) => (
  <g>
    <rect x={x} y={y} width={190} height={140} rx={8} fill={t.surface} stroke={t.line} strokeWidth={8} />
    <path d={`M${x + 24} ${y + 108} l36 -34 l30 18 l34 -50 l42 26`} stroke={t.accent} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </g>
);

export const Sparkle: React.FC<{ x: number; y: number; s?: number; c: string }> = ({ x, y, s = 1, c }) => (
  <path
    d="M0 -26 Q4 -4 26 0 Q4 4 0 26 Q-4 4 -26 0 Q-4 -4 0 -26 Z"
    fill={c}
    transform={`translate(${x} ${y}) scale(${s})`}
  />
);

export const Lightbulb: React.FC<P & { x: number; y: number }> = ({ t, x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={150} fill="url(#glow)" />
    {[-90, -45, 0, 45, 90].map((a) => (
      <path key={a} d="M0 -92 V-124" stroke={t.accent} strokeWidth={9} strokeLinecap="round" transform={`rotate(${a})`} />
    ))}
    <path d="M-48 -8 a48 48 0 1 1 96 0 q0 26 -22 44 v18 h-52 v-18 q-22 -18 -22 -44 Z" fill={t.accent} stroke={t.line} strokeWidth={8} strokeLinejoin="round" />
    <rect x={-22} y={56} width={44} height={22} rx={8} fill={t.surface} stroke={t.line} strokeWidth={7} />
  </g>
);

export const OpenBook: React.FC<P> = ({ t }) => (
  <g transform="translate(-4 -6) rotate(-8) scale(0.88)">
    <path d="M0 0 L-74 -22 V-92 L0 -70 Z" fill={t.surface} stroke={t.line} strokeWidth={7} strokeLinejoin="round" />
    <path d="M0 0 L74 -22 V-92 L0 -70 Z" fill={t.accent} stroke={t.line} strokeWidth={7} strokeLinejoin="round" />
    <path d="M-58 -70 l42 12 M-58 -50 l42 12" stroke={t.line} strokeWidth={5} strokeLinecap="round" opacity={0.5} />
  </g>
);

export const IdeaCard: React.FC<P & { x: number; y: number }> = ({ t, x, y }) => {
  const bars = [46, 70, 98, 132, 176];
  return (
    <g transform={`translate(${x} ${y}) rotate(-4)`}>
      <path d="M660 70 h90 M680 150 h120 M660 230 h70" stroke={t.line} strokeWidth={8} strokeLinecap="round" opacity={0.45} />
      <rect x={14} y={18} width={620} height={330} rx={30} fill="#000" opacity={0.28} />
      <rect width={620} height={330} rx={30} fill={t.surface} stroke={t.line} strokeWidth={9} />
      {bars.map((h, i) => (
        <rect key={i} x={44 + i * 50} y={282 - h} width={36} height={h} rx={8} fill={i === 4 ? t.accent : t.accent2} stroke={t.line} strokeWidth={6} />
      ))}
      <path d="M40 282 H300" stroke={t.line} strokeWidth={7} strokeLinecap="round" />
    </g>
  );
};

export const StreetShell: React.FC<P> = ({ t }) => {
  const r = rng(5);
  const far: React.ReactNode[] = [];
  const near: React.ReactNode[] = [];
  let x = -20;
  let i = 0;
  while (x < W) {
    const bw = 90 + r() * 110;
    const bh = 200 + r() * 260;
    far.push(<rect key={i++} x={x} y={FLOOR - bh} width={bw} height={bh} fill="#6A3672" />);
    x += bw + r() * 30;
  }
  x = -40;
  while (x < W) {
    const bw = 130 + r() * 130;
    const bh = 110 + r() * 240;
    const top = FLOOR - bh;
    const wins: React.ReactNode[] = [];
    for (let wy = top + 26; wy < FLOOR - 50; wy += 46) {
      for (let wx = x + 22; wx < x + bw - 34; wx += 40) {
        if (r() > 0.45) wins.push(<rect key={`${wx}-${wy}`} x={wx} y={wy} width={18} height={24} rx={3} fill={t.accent} opacity={0.55 + r() * 0.45} />);
      }
    }
    near.push(
      <g key={i++}>
        <rect x={x} y={top} width={bw} height={bh} fill="#33225A" />
        {wins}
      </g>
    );
    x += bw + 12 + r() * 60;
  }
  return (
    <g>
      <rect x={-60} y={-60} width={W + 120} height={H + 120} fill="url(#wall)" />
      {Array.from({ length: 26 }, (_, k) => (
        <circle key={k} cx={r() * W} cy={r() * 300} r={1.5 + r() * 2.5} fill="#FFF4E6" opacity={0.3 + r() * 0.5} />
      ))}
      <circle cx={1420} cy={600} r={300} fill="#FFE08A" opacity={0.22} />
      <circle cx={1420} cy={600} r={140} fill="#FFE9A8" />
      <g fill="#FFB08A" opacity={0.5}>
        <rect x={160} y={300} width={420} height={36} rx={18} />
        <rect x={300} y={346} width={280} height={28} rx={14} />
        <rect x={1100} y={420} width={520} height={34} rx={17} />
      </g>
      {far}
      {near}
      <rect x={-60} y={FLOOR} width={W + 120} height={H - FLOOR + 60} fill={t.floor} />
      <rect x={-60} y={FLOOR + 74} width={W + 120} height={H - FLOOR} fill="#180F30" />
      <path d={`M-60 ${FLOOR + 74} H${W + 60}`} stroke={t.line} strokeWidth={5} opacity={0.5} />
      <path d={`M-60 ${FLOOR + 150} H${W + 60}`} stroke={t.accent} strokeWidth={8} strokeDasharray="90 70" opacity={0.7} />
      <path d={`M-60 ${FLOOR} H${W + 60}`} stroke={t.line} strokeWidth={7} />
    </g>
  );
};

export const StreetLamp: React.FC<P & { x: number }> = ({ t, x }) => (
  <g>
    <circle cx={x + 120} cy={330} r={300} fill="url(#glow)" />
    <path d={`M${x} ${FLOOR} V360 q0 -70 70 -70 h30`} stroke={t.line} strokeWidth={13} strokeLinecap="round" fill="none" />
    <rect x={x - 22} y={FLOOR - 40} width={44} height={40} rx={8} fill={t.surface} stroke={t.line} strokeWidth={7} />
    <path d={`M${x + 84} 276 h84 l-16 50 h-52 Z`} fill={t.accent} stroke={t.line} strokeWidth={8} strokeLinejoin="round" />
  </g>
);

export const Tree: React.FC<P & { x: number }> = ({ t, x }) => (
  <g>
    <path d={`M${x} ${FLOOR} V560`} stroke={t.line} strokeWidth={16} strokeLinecap="round" />
    <g fill="#4A2F78" stroke={t.line} strokeWidth={8}>
      <circle cx={x - 70} cy={520} r={84} />
      <circle cx={x + 76} cy={510} r={92} />
      <circle cx={x} cy={430} r={110} />
    </g>
  </g>
);

export const ThoughtBubble: React.FC<P & { x: number; y: number }> = ({ t, x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle cx={-86} cy={322} r={15} fill={t.skin} stroke={t.ink} strokeWidth={6} />
    <circle cx={-40} cy={264} r={25} fill={t.skin} stroke={t.ink} strokeWidth={6} />
    <rect width={520} height={230} rx={115} fill={t.skin} stroke={t.ink} strokeWidth={8} />
    {[0, 1, 2].map((i) => (
      <g key={i} transform={`translate(${96 + i * 62} ${126 - i * 14}) rotate(${-10 + i * 10})`} opacity={1 - i * 0.28}>
        <circle r={44} fill={t.accent} stroke={t.ink} strokeWidth={7} />
        <circle r={30} fill="none" stroke={t.ink} strokeWidth={4} opacity={0.4} />
      </g>
    ))}
    <path d="M300 96 h60 M310 136 h70" stroke={t.ink} strokeWidth={7} strokeLinecap="round" opacity={0.5} />
  </g>
);
