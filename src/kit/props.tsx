import React from "react";
import type { Theme } from "../theme";

const FONT = "Fredoka, sans-serif";
const WHITE = "#FFFDF8";
type P = { t: Theme };

export const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export const Txt: React.FC<{
  x?: number;
  y?: number;
  size: number;
  weight?: number;
  fill: string;
  anchor?: "start" | "middle" | "end";
  spacing?: number;
  opacity?: number;
  children: React.ReactNode;
}> = ({ x = 0, y = 0, size, weight = 600, fill, anchor = "middle", spacing = 0, opacity = 1, children }) => (
  <text x={x} y={y} fontFamily={FONT} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} letterSpacing={spacing} opacity={opacity}>
    {children}
  </text>
);

// Draws children around their own origin, then places, scales and rotates them: the basic "pop in" container.
export const At: React.FC<{ x: number; y: number; s?: number; sx?: number; r?: number; o?: number; children: React.ReactNode }> = ({
  x,
  y,
  s = 1,
  sx = 1,
  r = 0,
  o = 1,
  children,
}) =>
  s <= 0.001 || o <= 0.001 ? null : (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s * sx} ${s})`} opacity={o}>
      {children}
    </g>
  );

export const Panel: React.FC<P & { w: number; h: number; fill?: string; r?: number }> = ({ t, w, h, fill, r = 30 }) => (
  <>
    <rect x={-w / 2 + 12} y={-h / 2 + 14} width={w} height={h} rx={r} fill="#000" opacity={0.16} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={r} fill={fill ?? t.surface} stroke={t.line} strokeWidth={9} />
  </>
);

export const PayCard: React.FC<P & { amount: number; badge?: number; strike?: number }> = ({ t, amount, badge = 0, strike = 0 }) => (
  <g>
    <Panel t={t} w={560} h={310} />
    <circle cx={-222} cy={-100} r={22} fill={t.accent2} stroke={t.line} strokeWidth={6} />
    <Txt x={-222} y={-89} size={30} weight={700} fill={WHITE}>
      $
    </Txt>
    <Txt x={-186} y={-85} size={42} weight={700} fill={t.accent2} anchor="start" spacing={5}>
      SALARY
    </Txt>
    <path d="M-240 -52 H240" stroke={t.line} strokeWidth={4} opacity={0.2} />
    <Txt x={-240} y={72} size={136} weight={700} fill={t.line} anchor="start">
      {money(amount)}
    </Txt>
    <Txt x={-236} y={122} size={40} weight={500} fill={t.line} anchor="start" opacity={0.6}>
      per month
    </Txt>
    {strike > 0 && <path d={`M-256 70 L${-256 + 512 * strike} ${70 - 96 * strike}`} stroke={t.accent} strokeWidth={20} strokeLinecap="round" />}
    <At x={215} y={-150} s={badge} r={8}>
      <rect x={-125} y={-42} width={250} height={84} rx={42} fill={t.accent2} stroke={t.line} strokeWidth={8} />
      <Txt y={18} size={52} weight={700} fill={WHITE}>
        +$1,000
      </Txt>
    </At>
  </g>
);

export const Calendar: React.FC<P & { month: string; day?: string; dayPop?: number; flip?: number; circle?: number }> = ({
  t,
  month,
  day,
  dayPop = 1,
  flip = 0,
  circle = 0,
}) => (
  <g>
    <rect x={-198} y={-216} width={420} height={460} rx={26} fill="#000" opacity={0.16} />
    <rect x={-210} y={-230} width={420} height={460} rx={26} fill={t.surface} stroke={t.line} strokeWidth={9} />
    {day ? (
      <At x={0} y={50} s={dayPop}>
        <Txt y={70} size={200} weight={700} fill={t.line}>
          {day}
        </Txt>
      </At>
    ) : (
      Array.from({ length: 28 }, (_, i) => (
        <circle key={i} cx={-150 + (i % 7) * 50} cy={-50 + Math.floor(i / 7) * 62} r={11} fill={t.line} opacity={0.18} />
      ))
    )}
    {flip > 0 && flip < 1 && (
      <g transform={`translate(0 -118) scale(1 ${1 - flip}) translate(0 118)`}>
        <rect x={-205} y={-118} width={410} height={342} rx={20} fill="#EFE3CC" stroke={t.line} strokeWidth={6} />
      </g>
    )}
    <path d="M-210 -118 V-204 a26 26 0 0 1 26 -26 H184 a26 26 0 0 1 26 26 V-118 Z" fill={t.accent} stroke={t.line} strokeWidth={9} strokeLinejoin="round" />
    <rect x={-122} y={-256} width={24} height={56} rx={12} fill={t.surface} stroke={t.line} strokeWidth={7} />
    <rect x={98} y={-256} width={24} height={56} rx={12} fill={t.surface} stroke={t.line} strokeWidth={7} />
    <Txt y={-146} size={58} weight={700} fill={WHITE} spacing={6}>
      {month}
    </Txt>
    {circle > 0 && (
      <ellipse
        cx={0}
        cy={52}
        rx={150}
        ry={118}
        fill="none"
        stroke={t.accent}
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={`${850 * circle} 850`}
        transform="rotate(-8 0 52)"
      />
    )}
  </g>
);

export const BigPhone: React.FC<P & { time: number; balance?: string; balancePop?: number }> = ({ t, time, balance, balancePop = 1 }) => (
  <g>
    <rect x={-178} y={-336} width={380} height={700} rx={52} fill="#000" opacity={0.16} />
    <rect x={-190} y={-350} width={380} height={700} rx={52} fill={t.line} />
    <rect x={-172} y={-332} width={344} height={664} rx={38} fill={t.surface} />
    <rect x={-46} y={-320} width={92} height={20} rx={10} fill={t.line} />
    <circle cx={-124} cy={-244} r={20} fill={t.accent2} />
    <Txt x={-94} y={-231} size={38} weight={700} fill={t.line} anchor="start">
      MyBank
    </Txt>
    <Txt x={-144} y={-150} size={31} weight={500} fill={t.line} anchor="start" opacity={0.6}>
      Available balance
    </Txt>
    {balance ? (
      <At x={0} y={-78} s={balancePop}>
        <Txt y={32} size={88} weight={700} fill={t.accent}>
          {balance}
        </Txt>
      </At>
    ) : (
      [0, 1, 2].map((i) => <circle key={i} cx={-44 + i * 44} cy={-78 - Math.max(0, Math.sin(time * 7 - i * 0.9)) * 14} r={13} fill={t.line} opacity={0.35} />)
    )}
    <path d="M-144 -4 H144" stroke={t.line} strokeWidth={4} opacity={0.15} />
    {["Rent", "Car payment", "Restaurants", "Subscriptions"].map((label, i) => (
      <g key={label} transform={`translate(0 ${56 + i * 66})`}>
        <circle cx={-126} cy={0} r={16} fill={[t.accent, t.accent2, "#F2B84B", t.line][i]} />
        <Txt x={-96} y={11} size={30} weight={500} fill={t.line} anchor="start">
          {label}
        </Txt>
        <rect x={104} y={-9} width={44} height={18} rx={9} fill={t.line} opacity={0.2} />
      </g>
    ))}
  </g>
);

export const HandPhone: React.FC<P> = ({ t }) => (
  <g transform="translate(-4 -44) rotate(14)">
    <rect x={-19} y={-32} width={38} height={64} rx={9} fill={t.line} />
    <rect x={-13} y={-25} width={26} height={48} rx={4} fill={t.accent2} />
  </g>
);

export const Stamp: React.FC<P & { text: string }> = ({ t, text }) => (
  <g>
    <rect x={-222} y={-58} width={444} height={116} rx={18} fill={t.surface} opacity={0.94} />
    <rect x={-222} y={-58} width={444} height={116} rx={18} fill="none" stroke={t.accent} strokeWidth={10} />
    <Txt y={19} size={52} weight={700} fill={t.accent} spacing={3}>
      {text}
    </Txt>
  </g>
);

export const CrossOut: React.FC<P & { k: number }> = ({ t, k }) => {
  const len = 256;
  const a = Math.min(1, k * 2);
  const b = Math.max(0, k * 2 - 1);
  const line = { stroke: t.accent, strokeWidth: 26, strokeLinecap: "round" as const, fill: "none" };
  return (
    <g>
      {a > 0 && <path d="M-90 -90 L90 90" {...line} strokeDasharray={`${len * a} ${len}`} />}
      {b > 0 && <path d="M90 -90 L-90 90" {...line} strokeDasharray={`${len * b} ${len}`} />}
    </g>
  );
};

const MaskIcon: React.FC<P> = ({ t }) => (
  <g transform="scale(1.1)">
    <path d="M96 -30 l34 -18 M96 -22 l36 6" stroke={t.line} strokeWidth={8} strokeLinecap="round" />
    <path d="M-96 -28 q0 -36 40 -36 h112 q40 0 40 36 q0 44 -44 44 q-30 0 -52 -22 q-22 22 -52 22 q-44 0 -44 -44 Z" fill={t.line} />
    <ellipse cx={-46} cy={-24} rx={24} ry={15} fill={WHITE} />
    <ellipse cx={46} cy={-24} rx={24} ry={15} fill={WHITE} />
  </g>
);

const DiceIcon: React.FC<P> = ({ t }) => (
  <g transform="translate(0 -22)">
    <g transform="translate(-42 -18) rotate(-12)">
      <rect x={-50} y={-50} width={100} height={100} rx={20} fill={WHITE} stroke={t.line} strokeWidth={8} />
      {[
        [-24, -24],
        [24, -24],
        [0, 0],
        [-24, 24],
        [24, 24],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={9} fill={t.line} />
      ))}
    </g>
    <g transform="translate(54 30) rotate(14)">
      <rect x={-42} y={-42} width={84} height={84} rx={18} fill={t.accent} stroke={t.line} strokeWidth={8} />
      <circle cx={-18} cy={-18} r={8} fill={WHITE} />
      <circle cx={18} cy={18} r={8} fill={WHITE} />
    </g>
  </g>
);

const CalculatorIcon: React.FC<P> = ({ t }) => (
  <g transform="translate(0 -22)">
    <rect x={-66} y={-92} width={132} height={176} rx={18} fill={t.accent2} stroke={t.line} strokeWidth={8} />
    <rect x={-48} y={-74} width={96} height={40} rx={8} fill={WHITE} stroke={t.line} strokeWidth={6} />
    {Array.from({ length: 9 }, (_, i) => (
      <rect key={i} x={-48 + (i % 3) * 36} y={-18 + Math.floor(i / 3) * 31} width={24} height={21} rx={5} fill={WHITE} stroke={t.line} strokeWidth={5} />
    ))}
  </g>
);

const icons = { mask: MaskIcon, dice: DiceIcon, calculator: CalculatorIcon };

export const IconCard: React.FC<P & { icon: keyof typeof icons; label: string; cross: number }> = ({ t, icon, label, cross }) => {
  const Icon = icons[icon];
  return (
    <g>
      <Panel t={t} w={290} h={350} />
      <g transform="translate(0 -36)">
        <Icon t={t} />
      </g>
      <Txt y={130} size={38} fill={t.line}>
        {label}
      </Txt>
      <g transform="translate(0 -40)">
        <CrossOut t={t} k={cross} />
      </g>
    </g>
  );
};

// A numbered card that starts as a trap and flips (0 to 1) to reveal the matching move.
export const TrapCard: React.FC<P & { n: number; flip?: number; question?: number }> = ({ t, n, flip = 0, question = 0 }) => {
  const back = flip > 0.5;
  const ink = back ? WHITE : t.line;
  return (
    <g transform={`scale(${Math.max(0.02, Math.abs(Math.cos(Math.PI * flip)))} 1)`}>
      <Panel t={t} w={300} h={400} fill={back ? t.accent2 : t.surface} />
      <Txt y={-122} size={44} weight={700} spacing={8} fill={back ? WHITE : t.accent}>
        {back ? "MOVE" : "TRAP"}
      </Txt>
      <Txt y={62} size={210} weight={700} fill={ink}>
        {n}
      </Txt>
      {back ? (
        <path d="M-52 122 l34 34 l72 -80" stroke={WHITE} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ) : (
        <path d="M-96 172 l24 -42 l24 42 l24 -42 l24 42 l24 -42 l24 42 l24 -42 l24 42 Z" fill={t.line} stroke={t.line} strokeWidth={6} strokeLinejoin="round" />
      )}
      {!back && (
        <At x={122} y={-182} s={question} r={10}>
          <circle r={40} fill={t.accent} stroke={t.line} strokeWidth={8} />
          <Txt y={19} size={54} weight={700} fill={WHITE}>
            ?
          </Txt>
        </At>
      )}
    </g>
  );
};

export const NameTag: React.FC<P & { text: string }> = ({ t, text }) => (
  <g>
    <path d="M-78 34 l-34 52 l66 -52 Z" fill={t.accent} stroke={t.line} strokeWidth={8} strokeLinejoin="round" />
    <rect x={-130} y={-48} width={260} height={96} rx={26} fill={t.accent} stroke={t.line} strokeWidth={8} />
    <path d="M-70 46 h30" stroke={t.accent} strokeWidth={10} />
    <Txt y={18} size={54} weight={700} fill={WHITE}>
      {text}
    </Txt>
  </g>
);

export const WingedMoney: React.FC<P & { flap: number; text: string }> = ({ t, flap, text }) => (
  <g>
    <ellipse cx={-64} cy={0} rx={62} ry={24} fill={WHITE} stroke={t.line} strokeWidth={7} transform={`translate(-112 -22) rotate(${18 + flap})`} />
    <ellipse cx={64} cy={0} rx={62} ry={24} fill={WHITE} stroke={t.line} strokeWidth={7} transform={`translate(112 -22) rotate(${-18 - flap})`} />
    <rect x={-122} y={-44} width={244} height={88} rx={44} fill={t.accent2} stroke={t.line} strokeWidth={8} />
    <Txt y={18} size={52} weight={700} fill={WHITE}>
      {text}
    </Txt>
  </g>
);

export const SweatDrop: React.FC<P> = ({ t }) => (
  <path d="M0 -22 C14 -4 16 6 16 12 a16 16 0 0 1 -32 0 C-16 6 -14 -4 0 -22 Z" fill="#9AD4E0" stroke={t.line} strokeWidth={6} strokeLinejoin="round" />
);

// A burst of paper bits thrown up from (0,0) at time 0; `age` is seconds since the burst.
export const Confetti: React.FC<P & { age: number }> = ({ t, age }) => {
  if (age <= 0 || age > 2.4) return null;
  const colors = [t.accent, t.accent2, "#F2B84B", t.line];
  return (
    <g opacity={Math.min(1, (2.4 - age) / 0.5)}>
      {Array.from({ length: 34 }, (_, i) => {
        const angle = ((200 + ((i * 47) % 140)) * Math.PI) / 180;
        const speed = 520 + ((i * 131) % 520);
        const x = Math.cos(angle) * speed * age;
        const y = Math.sin(angle) * speed * age + 0.5 * 1500 * age * age;
        return i % 3 === 0 ? (
          <circle key={i} cx={x} cy={y} r={9} fill={colors[i % 4]} />
        ) : (
          <rect key={i} x={x - 12} y={y - 7} width={24} height={14} rx={3} fill={colors[i % 4]} transform={`rotate(${age * (240 + i * 20)} ${x} ${y})`} />
        );
      })}
    </g>
  );
};

export const Pill: React.FC<P & { text: string; fill?: string; w?: number; size?: number }> = ({ t, text, fill, w = 300, size = 46 }) => (
  <g>
    <rect x={-w / 2} y={-42} width={w} height={84} rx={42} fill={fill ?? t.accent2} stroke={t.line} strokeWidth={8} />
    <Txt y={size * 0.34} size={size} weight={700} fill={WHITE}>
      {text}
    </Txt>
  </g>
);

// Hangs from its origin (the top of the string), so rotating it makes it swing.
export const PriceTag: React.FC<P & { amount: string; note?: string }> = ({ t, amount, note = "more per month" }) => (
  <g>
    <path d="M0 0 V70" stroke={t.line} strokeWidth={6} />
    <rect x={-214} y={54} width={428} height={196} rx={26} fill={t.accent} stroke={t.line} strokeWidth={9} />
    <circle cx={0} cy={84} r={12} fill={t.surface} stroke={t.line} strokeWidth={5} />
    <Txt y={186} size={92} weight={700} fill={WHITE}>
      {amount}
    </Txt>
    <Txt y={228} size={34} weight={500} fill={WHITE} opacity={0.9}>
      {note}
    </Txt>
  </g>
);

export const ThoughtCloud: React.FC<P & { w: number; h: number; children: React.ReactNode }> = ({ t, w, h, children }) => (
  <g>
    <circle cx={-w / 2 - 44} cy={h / 2 + 76} r={13} fill={t.surface} stroke={t.line} strokeWidth={6} />
    <circle cx={-w / 2 - 6} cy={h / 2 + 30} r={22} fill={t.surface} stroke={t.line} strokeWidth={7} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={Math.min(h / 2, 90)} fill={t.surface} stroke={t.line} strokeWidth={8} />
    {children}
  </g>
);

// Origin is the floor at the sofa's left edge.
export const Sofa: React.FC<P & { w: number; fill: string }> = ({ t, w, fill }) => (
  <g stroke={t.line} strokeWidth={8}>
    <path d={`M36 -30 V0 M${w - 36} -30 V0`} strokeWidth={12} strokeLinecap="round" />
    <rect x={22} y={-236} width={w - 44} height={160} rx={42} fill={fill} />
    <rect x={0} y={-158} width={64} height={134} rx={30} fill={fill} />
    <rect x={w - 64} y={-158} width={64} height={134} rx={30} fill={fill} />
    <rect x={54} y={-124} width={w - 108} height={100} rx={26} fill={fill} />
  </g>
);

const CarWheel: React.FC<P & { x: number; spin: number }> = ({ t, x, spin }) => (
  <g transform={`translate(${x} -46)`}>
    <circle r={46} fill={t.line} />
    <circle r={20} fill={t.surface} />
    <path d="M-20 0 H20 M0 -20 V20" stroke={t.line} strokeWidth={5} transform={`rotate(${spin})`} />
  </g>
);

// Origin is the road under the middle of the car; both cars face right.
export const Car: React.FC<P & { sleek?: boolean; spin?: number }> = ({ t, sleek = false, spin = 0 }) =>
  sleek ? (
    <g>
      <path
        d="M-260 -60 Q-270 -130 -200 -144 L-130 -214 Q-114 -230 -86 -230 H24 Q54 -230 76 -210 L142 -148 Q212 -140 220 -98 V-60 Z"
        fill={t.accent}
        stroke={t.line}
        strokeWidth={9}
        strokeLinejoin="round"
      />
      <path d="M-122 -160 L-80 -206 H20 Q40 -206 54 -194 L92 -160 Z" fill="#BFE6EC" stroke={t.line} strokeWidth={7} strokeLinejoin="round" />
      <path d="M-14 -206 V-160" stroke={t.line} strokeWidth={6} />
      <circle cx={196} cy={-112} r={13} fill="#FFD76B" stroke={t.line} strokeWidth={5} />
      <path d="M-236 -104 h34" stroke={t.line} strokeWidth={8} strokeLinecap="round" />
      <CarWheel t={t} x={-150} spin={spin} />
      <CarWheel t={t} x={132} spin={spin} />
    </g>
  ) : (
    <g>
      <path d="M-150 -146 L-112 -252 H86 L138 -146 Z" fill="#CDBDA0" stroke={t.line} strokeWidth={9} strokeLinejoin="round" />
      <path d="M-118 -156 L-92 -230 H-18 V-156 Z M6 -156 V-230 H72 L108 -156 Z" fill="#BFE6EC" stroke={t.line} strokeWidth={6} strokeLinejoin="round" />
      <rect x={-232} y={-152} width={464} height={96} rx={24} fill="#CDBDA0" stroke={t.line} strokeWidth={9} />
      <circle cx={206} cy={-116} r={13} fill="#FFD76B" stroke={t.line} strokeWidth={5} />
      <path d="M-232 -92 h-16 M232 -92 h16" stroke={t.line} strokeWidth={12} strokeLinecap="round" />
      {[
        [-70, -90, 9],
        [-46, -74, 6],
        [96, -84, 8],
        [-196, -120, 6],
      ].map(([x, y, r]) => (
        <circle key={`${x}`} cx={x} cy={y} r={r} fill="#B5693B" opacity={0.75} />
      ))}
      <CarWheel t={t} x={-140} spin={spin} />
      <CarWheel t={t} x={140} spin={spin} />
    </g>
  );

export const Meter: React.FC<P & { level: number; label: string; value: string }> = ({ t, level, label, value }) => (
  <g>
    <Txt y={-292} size={40} weight={700} spacing={4} fill={t.line}>
      {label}
    </Txt>
    <rect x={-108} y={-246} width={240} height={520} rx={36} fill="#000" opacity={0.16} />
    <rect x={-120} y={-260} width={240} height={520} rx={36} fill={t.surface} stroke={t.line} strokeWidth={9} />
    {level > 0.005 && <rect x={-102} y={242 - 484 * level} width={204} height={484 * level} rx={Math.min(22, 242 * level)} fill={t.accent2} />}
    <rect x={-98} y={-44} width={196} height={88} rx={44} fill={t.surface} stroke={t.line} strokeWidth={6} />
    <Txt y={22} size={60} weight={700} fill={t.line}>
      {value}
    </Txt>
  </g>
);

export const Wheel: React.FC<P & { r: number; angle: number }> = ({ t, r, angle }) => (
  <g>
    <path
      d={`M${-r * 0.5} ${r * 0.866} L${-r * 0.66} ${r + 70} H${r * 0.66} L${r * 0.5} ${r * 0.866}`}
      stroke={t.line}
      strokeWidth={15}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <g transform={`rotate(${angle})`}>
      {[0, 45, 90, 135].map((a) => (
        <path key={a} d={`M${-r} 0 H${r}`} stroke={t.line} strokeWidth={6} opacity={0.3} transform={`rotate(${a})`} />
      ))}
      {Array.from({ length: 24 }, (_, i) => (
        <path key={i} d={`M0 ${r - 34} V${r - 6}`} stroke={t.line} strokeWidth={7} strokeLinecap="round" opacity={0.55} transform={`rotate(${i * 15})`} />
      ))}
    </g>
    <circle r={r} fill="none" stroke={t.line} strokeWidth={16} />
    <circle r={22} fill={t.accent} stroke={t.line} strokeWidth={8} />
  </g>
);

const PlateIcon: React.FC<P> = ({ t }) => (
  <g>
    <path d="M-112 -72 v144 M-128 -72 v42 q0 18 16 18 q16 0 16 -18 v-42" stroke={t.line} strokeWidth={8} strokeLinecap="round" fill="none" />
    <path d="M112 72 v-144 q30 34 0 86" stroke={t.line} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill={t.surface} />
    <circle r={72} fill={WHITE} stroke={t.line} strokeWidth={8} />
    <circle r={44} fill="none" stroke={t.line} strokeWidth={5} opacity={0.3} />
  </g>
);

const ScreensIcon: React.FC<P> = ({ t }) => (
  <g>
    <rect x={-70} y={-78} width={160} height={104} rx={14} fill={t.accent2} stroke={t.line} strokeWidth={8} transform="rotate(-8)" />
    <rect x={-92} y={-46} width={176} height={116} rx={14} fill={t.line} />
    <path d="M-22 -16 l48 28 l-48 28 Z" fill={WHITE} />
  </g>
);

const ShirtIcon: React.FC<P> = ({ t }) => (
  <g transform="translate(0 -4)">
    <path d="M0 -84 q0 -28 18 -28" stroke={t.line} strokeWidth={7} strokeLinecap="round" fill="none" />
    <path d="M-40 -80 q40 30 80 0 l70 40 l-34 50 l-36 -18 v98 h-80 v-98 l-36 18 l-34 -50 Z" fill={t.accent} stroke={t.line} strokeWidth={8} strokeLinejoin="round" />
  </g>
);

const HouseIcon: React.FC<P> = ({ t }) => (
  <g transform="translate(0 76)">
    <path d="M-92 0 V-84 L0 -156 L92 -84 V0 Z" fill={t.accent2} stroke={t.line} strokeWidth={8} strokeLinejoin="round" />
    <rect x={-22} y={-62} width={44} height={62} rx={6} fill={WHITE} stroke={t.line} strokeWidth={6} />
  </g>
);

const CarIcon: React.FC<P> = ({ t }) => (
  <g transform="translate(6 56) scale(0.44)">
    <Car t={t} sleek />
  </g>
);

Object.assign(icons, { plate: PlateIcon, screens: ScreensIcon, shirt: ShirtIcon, house: HouseIcon, car: CarIcon });

export const ItemCard: React.FC<P & { icon: string; label: string; check?: number }> = ({ t, icon, label, check = 0 }) => {
  const Icon = (icons as Record<string, React.FC<P>>)[icon];
  return (
    <g>
      <Panel t={t} w={290} h={350} />
      <g transform="translate(0 -36)">
        <Icon t={t} />
      </g>
      <Txt y={130} size={38} fill={t.line}>
        {label}
      </Txt>
      <At x={128} y={-162} s={check} r={8}>
        <circle r={40} fill={t.accent2} stroke={t.line} strokeWidth={8} />
        <path d="M-17 2 l12 12 l24 -27" stroke={WHITE} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </At>
    </g>
  );
};
