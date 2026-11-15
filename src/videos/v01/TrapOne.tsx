import React from "react";
import { Easing } from "remotion";
import { alive, poseAt } from "../../kit/pose";
import * as K from "../../kit/props";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses, type Pose } from "../../Stickman";
import { HOOK_END } from "./Hook";
import { cue, drift, Hero, T, type SceneDef } from "./shared";

const WHITE = "#FFFDF8";

const CUT = {
  title: HOOK_END,
  small: cue.at("Pip looks around") - 0.3,
  nice: cue.at("So he moves") - 0.15,
  car: cue.at("Then he looks at") - 0.3,
  things: cue.at("Then come the small") - 0.3,
  total: cue.at("Add it up") - 0.3,
  race: cue.at("This is the rat race") - 0.3,
  reasonable: cue.at("And the scary part") - 0.3,
  truth: cue.at("So here is the first") - 0.3,
};
export const TRAP_ONE_END = cue.end("a bigger budget") + 0.4;

const MONTHS = ["JUL", "JUN", "MAY", "APR", "MAR", "FEB", "JAN"];

const swing = (t: number, from: number) => 9 * Math.sin((t - from) * 5) * Math.exp(-(t - from) * 1.1);

const Tag: React.FC<{ t: number; at: number; x: number; y: number; amount: string }> = ({ t, at, x, y, amount }) => (
  <K.At x={x} y={y} s={pop(t, at)} r={t > at ? swing(t, at) : 0}>
    <K.PriceTag t={T} amount={amount} />
  </K.At>
);

const Title: React.FC<{ t: number }> = ({ t }) => {
  const rewind = cue.at("Let's rewind") - 0.1;
  const textOut = ramp(t, rewind, 0.3);
  const turned = Math.max(0, Math.min(6, Math.floor((t - rewind - 0.35) / 0.2) + 1));
  const turning = t >= rewind + 0.35 && turned <= 6 ? ((t - rewind - 0.35) % 0.2) / 0.18 : 1;
  return (
    <Stage
      theme={T}
      zoom={drift(t, CUT.title, CUT.small)}
      back={<S.RoomShell t={T} />}
      front={
        <>
          <K.At x={430} y={mix(-320, 450, pop(t, CUT.title + 0.25, 0.9))} s={1.3} r={-4}>
            <K.TrapCard t={T} n={1} />
          </K.At>
          <g opacity={1 - textOut} transform={`translate(${-60 * textOut} 0)`}>
            {["The raise", "that disappears"].map((line, i) => (
              <K.At key={line} x={720} y={420 + i * 140} s={pop(t, CUT.title + 0.45 + i * 0.12)}>
                <K.Txt size={124} weight={700} fill={T.line} anchor="start">
                  {line}
                </K.Txt>
              </K.At>
            ))}
          </g>
          <K.At x={1250} y={490} s={1.15 * pop(t, rewind + 0.1)} r={2}>
            <K.Calendar t={T} month={MONTHS[turned]} flip={turned < 6 || turning < 1 ? turning : 1} />
          </K.At>
          <K.At x={1250} y={150} s={pop(t, rewind + 0.2) * (1 + 0.05 * Math.sin(t * 10))}>
            <K.Pill t={T} text="◀◀  REWIND" fill={T.accent} w={360} />
          </K.At>
        </>
      }
    />
  );
};

const SmallApartment: React.FC<{ t: number }> = ({ t }) => {
  const thinks = cue.at("and thinks") - 0.1;
  const deserve = cue.at("I deserve better");
  const pose = poseAt(t, [
    [0, poses.idle],
    [thinks, poses.think],
    [deserve + 0.3, poses.pump],
  ]);
  return (
    <Stage
      theme={T}
      zoom={drift(t, CUT.small, CUT.nice)}
      back={
        <>
          <S.RoomShell t={T} />
          <path d="M330 110 l26 64 l-22 38 l40 74" stroke={T.line} strokeWidth={5} fill="none" opacity={0.3} />
          <path d="M1010 -60 V150" stroke={T.line} strokeWidth={6} />
          <circle cx={1010} cy={182} r={32} fill="#F2D98B" stroke={T.line} strokeWidth={7} />
          <S.Window t={T} x={1250} y={240} w={230} h={210} night={false} />
          <g transform={`translate(1180 ${S.FLOOR})`}>
            <K.Sofa t={T} w={310} fill="#CDBDA0" />
          </g>
          <rect x={1570} y={782} width={140} height={98} rx={8} fill="#D9B88A" stroke={T.line} strokeWidth={7} />
          <path d="M1640 782 v98" stroke={T.line} strokeWidth={5} opacity={0.4} />
        </>
      }
      front={
        <>
          <Hero t={t} x={560} pose={alive(pose, t)} facing={t > CUT.small + 0.9 && t < thinks - 0.1 ? -1 : 1} expression={t < deserve ? "wonder" : "smile"} />
          <K.At x={880} y={250} s={pop(t, thinks + 0.2)}>
            <K.ThoughtCloud t={T} w={560} h={170}>
              <K.At x={0} y={0} s={t < deserve ? 1 : 0.7 + 0.3 * pop(t, deserve)}>
                <K.Txt y={20} size={58} weight={700} fill={t < deserve ? T.line : T.accent}>
                  {t < deserve ? "I earn more now." : "I deserve better."}
                </K.Txt>
              </K.At>
            </K.ThoughtCloud>
          </K.At>
        </>
      }
    />
  );
};

const NiceApartment: React.FC<{ t: number }> = ({ t }) => {
  const tag = cue.at("That's four hundred") - 0.1;
  const pose = poseAt(t, [
    [0, poses.cheer],
    [CUT.nice + 1.3, poses.pump],
    [tag + 0.2, { ...poses.point, armF: [118, 150] }],
  ]);
  const hop = t < CUT.nice + 1.25 ? Math.abs(Math.sin(((t - CUT.nice) * Math.PI) / 0.42)) * 40 : 0;
  return (
    <Stage
      theme={T}
      zoom={drift(t, CUT.nice, CUT.car)}
      back={
        <>
          <S.RoomShell t={T} />
          <S.Window t={T} x={150} y={110} w={620} h={390} night={false} />
          <g transform={`translate(190 ${S.FLOOR})`}>
            <K.Sofa t={T} w={540} fill={T.accent2} />
          </g>
          <S.Picture t={T} x={880} y={160} />
          <S.Plant t={T} x={1760} />
        </>
      }
      front={
        <>
          <Hero t={t} x={1090} pose={alive(pose, t)} lift={hop} expression="open" />
          {[
            [860, 420, 0.8],
            [1290, 560, 0.6],
            [960, 640, 0.5],
          ].map(([x, y, s], i) => (
            <S.Sparkle key={i} x={x} y={y} s={s * pop(t, CUT.nice + 0.4 + i * 0.15) * (0.85 + 0.15 * Math.sin(t * 6 + i))} c={i === 1 ? T.accent2 : T.accent} />
          ))}
          <Tag t={t} at={tag} x={1440} y={120} amount="+$400" />
        </>
      }
    />
  );
};

const Street: React.FC = () => (
  <>
    <rect x={-60} y={-60} width={S.W + 120} height={S.H + 120} fill="url(#wall)" />
    <circle cx={1560} cy={190} r={74} fill="#FFC94D" />
    <g fill={WHITE}>
      <rect x={250} y={170} width={300} height={56} rx={28} />
      <rect x={330} y={132} width={150} height={70} rx={35} />
      <rect x={1050} y={250} width={260} height={48} rx={24} />
    </g>
    {[
      [60, 420, 300, "#E6D4B4"],
      [380, 330, 260, "#C9DCD4"],
      [660, 470, 340, "#EAD9BC"],
      [1020, 380, 280, "#DCC8A4"],
      [1320, 440, 300, "#C9DCD4"],
      [1640, 350, 260, "#E6D4B4"],
    ].map(([x, top, w, fill]) => (
      <g key={x as number}>
        <rect x={x as number} y={top as number} width={w as number} height={S.FLOOR - (top as number)} fill={fill as string} stroke={T.line} strokeWidth={6} />
        {Array.from({ length: 6 }, (_, i) => (
          <rect
            key={i}
            x={(x as number) + 40 + (i % 3) * (((w as number) - 110) / 2)}
            y={(top as number) + 50 + Math.floor(i / 3) * 110}
            width={34}
            height={50}
            rx={5}
            fill={WHITE}
            stroke={T.line}
            strokeWidth={4}
            opacity={0.8}
          />
        ))}
      </g>
    ))}
    <rect x={-60} y={S.FLOOR} width={S.W + 120} height={S.H} fill="#BCAA88" />
    <path d={`M-60 ${S.FLOOR + 120} H${S.W + 60}`} stroke={WHITE} strokeWidth={8} strokeDasharray="90 70" opacity={0.7} />
    <path d={`M-60 ${S.FLOOR} H${S.W + 60}`} stroke={T.line} strokeWidth={7} />
  </>
);

const CarScene: React.FC<{ t: number }> = ({ t }) => {
  const doubt = cue.at("But it doesn't") - 0.1;
  const newer = cue.at("So he gets") - 0.1;
  const tag = cue.at("That's a three hundred") - 0.1;
  const leave = ramp(t, newer, 0.9, Easing.in(Easing.cubic));
  const arrive = pop(t, newer + 0.7, 0.6);
  const pose = poseAt(t, [
    [0, poses.think],
    [newer + 1.2, poses.cheer],
    [tag + 0.3, poses.pump],
  ]);
  const road = S.FLOOR + 36;
  return (
    <Stage
      theme={T}
      zoom={drift(t, CUT.car, CUT.things)}
      back={<Street />}
      front={
        <>
          <Hero t={t} x={430} pose={alive(pose, t)} expression={t < doubt ? "smile" : t < newer + 1.2 ? "sad" : "open"} />
          {t < newer + 1 &&
            [0, 1, 2].map((i) => {
              const age = (t * 1.1 + i / 3) % 1;
              return <circle key={i} cx={mix(1180, -700, leave) - 270 - age * 90} cy={road - 70 - age * 110} r={14 + age * 22} fill={T.line} opacity={0.22 * (1 - age)} />;
            })}
          <K.At x={mix(1180, -700, leave)} y={road + Math.sin(t * 38) * 2.5}>
            <K.Car t={T} spin={-leave * 900} />
          </K.At>
          <K.At x={mix(2700, 1180, arrive)} y={road} s={t > newer + 0.7 ? 1 : 0}>
            <K.Car t={T} sleek spin={-arrive * 900} />
          </K.At>
          <S.Sparkle x={1010} y={640} s={0.8 * pop(t, newer + 1.5) * (0.85 + 0.15 * Math.sin(t * 6))} c={WHITE} />
          <S.Sparkle x={1400} y={600} s={0.6 * pop(t, newer + 1.65) * (0.85 + 0.15 * Math.sin(t * 6 + 2))} c={T.accent2} />
          <K.At x={800} y={240} s={pop(t, doubt + 0.2) * (1 - ramp(t, newer - 0.1, 0.2))}>
            <K.ThoughtCloud t={T} w={540} h={210}>
              <K.Txt y={-14} size={50} weight={700} fill={T.line}>
                I earn $4,000.
              </K.Txt>
              <K.Txt y={52} size={50} weight={700} fill={T.accent}>
                And I drive that?
              </K.Txt>
            </K.ThoughtCloud>
          </K.At>
          <Tag t={t} at={tag} x={1180} y={130} amount="+$350" />
        </>
      }
    />
  );
};

const SmallThings: React.FC<{ t: number }> = ({ t }) => {
  const items = [
    { icon: "plate", label: "Restaurants", at: cue.at("Better restaurants") },
    { icon: "screens", label: "Subscriptions", at: cue.at("A few more subscriptions") },
    { icon: "shirt", label: "Clothes", at: cue.at("Nicer clothes") },
  ];
  const tag = cue.at("Another two hundred") - 0.1;
  const pose = poseAt(t, [
    [0, poses.idle],
    [items[0].at, { ...poses.point, armF: [100, 120] }],
    [tag + 0.3, poses.pump],
  ]);
  return (
    <Stage
      theme={T}
      zoom={drift(t, CUT.things, CUT.total)}
      back={
        <>
          <S.RoomShell t={T} />
          <S.Plant t={T} x={130} s={0.8} />
        </>
      }
      front={
        <>
          <Hero t={t} x={430} pose={alive(pose, t)} expression="open" />
          {items.map((it, i) => (
            <K.At key={it.label} x={900 + i * 350} y={mix(250, 320, pop(t, it.at))} s={1.1 * pop(t, it.at)} r={[-3, 2, -2][i]}>
              <K.ItemCard t={T} icon={it.icon} label={it.label} />
            </K.At>
          ))}
          <Tag t={t} at={tag} x={1250} y={540} amount="+$250" />
        </>
      }
    />
  );
};

const Total: React.FC<{ t: number }> = ({ t }) => {
  const rows = [
    { label: "Apartment", amount: "+$400", at: cue.at("Four hundred, plus"), left: 600 },
    { label: "Car", amount: "+$350", at: cue.at("three fifty, plus"), left: 250 },
    { label: "Small things", amount: "+$250", at: cue.at("two fifty."), left: 0 },
  ];
  const total = cue.at("exactly one thousand") + 0.2;
  const gone = cue.at("gone, before");
  const saved = cue.at("saved a single");
  let left = 1000;
  rows.forEach((r) => {
    left = mix(left, r.left, ramp(t, r.at, 0.45));
  });
  const pose = poseAt(t, [
    [0, poses.think],
    [gone, poses.slump],
  ]);
  return (
    <Stage
      theme={T}
      zoom={drift(t, CUT.total, CUT.race)}
      back={<S.RoomShell t={T} />}
      front={
        <>
          <Hero t={t} x={290} pose={alive(pose, t)} expression={t < gone ? "wonder" : "sad"} />
          <K.At x={880} y={mix(380, 450, pop(t, CUT.total + 0.3))} s={pop(t, CUT.total + 0.3)} r={-1.5}>
            <K.Panel t={T} w={620} h={580} />
            <K.Txt y={-212} size={40} weight={700} spacing={5} fill={T.accent2}>
              WHERE IT WENT
            </K.Txt>
            <path d="M-260 -180 H260" stroke={T.line} strokeWidth={4} opacity={0.2} />
            {rows.map((r, i) => {
              const k = ramp(t, r.at, 0.3);
              return (
                <g key={r.label} opacity={k} transform={`translate(${(1 - k) * 40} ${-96 + i * 84})`}>
                  <K.Txt x={-256} size={48} weight={500} fill={T.line} anchor="start">
                    {r.label}
                  </K.Txt>
                  <K.Txt x={256} size={50} weight={700} fill={T.accent} anchor="end">
                    {r.amount}
                  </K.Txt>
                </g>
              );
            })}
            <path d="M-260 118 H260" stroke={T.line} strokeWidth={6} strokeDasharray="14 12" opacity={ramp(t, total - 0.3, 0.3) * 0.5} />
            <K.At x={0} y={206} s={pop(t, total)}>
              <K.Txt x={-256} size={52} weight={700} fill={T.line} anchor="start">
                Total
              </K.Txt>
              <K.Txt x={256} y={8} size={84} weight={700} fill={T.accent} anchor="end">
                $1,000
              </K.Txt>
            </K.At>
          </K.At>
          <K.At x={1500 + (t > gone && t < gone + 0.5 ? Math.sin(t * 60) * 8 : 0)} y={mix(400, 470, pop(t, CUT.total + 0.5))} s={pop(t, CUT.total + 0.5)}>
            <K.Meter t={T} level={left / 1000} label="THE RAISE" value={K.money(Math.round(left / 10) * 10)} />
          </K.At>
          <K.At x={1500} y={330} s={0.62 * mix(2.4, 1, ramp(t, gone, 0.16, Easing.in(Easing.cubic)))} o={ramp(t, gone, 0.08)} r={-10}>
            <K.Stamp t={T} text="GONE" />
          </K.At>
          <K.At x={1500} y={812} s={pop(t, saved)}>
            <K.Pill t={T} text="$0 saved" fill={T.accent} w={300} />
          </K.At>
        </>
      }
    />
  );
};

const runPose = (phase: number): Pose => {
  const a = Math.sin(phase);
  return {
    lean: 12,
    headTilt: -6,
    armF: [-46 * a, -46 * a + 70],
    armB: [46 * a, 46 * a + 70],
    legF: [42 * a, 42 * a - 46 * Math.max(0, -Math.cos(phase))],
    legB: [-42 * a, -42 * a - 46 * Math.max(0, Math.cos(phase))],
  };
};

const RatRace: React.FC<{ t: number }> = ({ t }) => {
  const faster = cue.at("You run faster");
  const since = t - CUT.race;
  const extra = Math.max(0, t - faster);
  const labels = [
    { text: "Earn more", at: cue.at("You earn more"), x: 300, y: 250, fill: T.accent2 },
    { text: "Spend more", at: cue.at("so you spend more"), x: 1620, y: 250, fill: T.accent },
    { text: "Need more", at: cue.at("so you need"), x: 1620, y: 590, fill: "#D99A1E" },
  ];
  const cx = 960;
  const cy = 470;
  const r = 340;
  return (
    <Stage
      theme={T}
      zoom={drift(t, CUT.race, CUT.reasonable)}
      back={<S.RoomShell t={T} />}
      front={
        <>
          <g transform={`translate(${cx} ${cy})`}>
            <K.Wheel t={T} r={r} angle={since * 150 + extra * 220} />
          </g>
          <Hero
            t={t}
            x={cx}
            floorY={cy + r - 12}
            scale={0.8}
            pose={runPose(since * 9.5 + extra * 7)}
            lift={Math.abs(Math.sin(since * 9.5 + extra * 7)) * 8}
            expression={t < faster ? "open" : "sad"}
          />
          {t > faster &&
            [0, 1].map((i) => {
              const age = (t * 1.6 + i * 0.5) % 1;
              return (
                <K.At key={i} x={cx - 70 - age * 120} y={cy + 90 - age * 60 + age * age * 120} s={0.8 * (1 - age)}>
                  <K.SweatDrop t={T} />
                </K.At>
              );
            })}
          {labels.map((l) => (
            <K.At key={l.text} x={l.x} y={l.y} s={pop(t, l.at)} r={-3}>
              <K.Pill t={T} text={l.text} fill={l.fill} w={380} size={54} />
            </K.At>
          ))}
          <path
            d="M520 250 H1380"
            stroke={T.line}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray="4 22"
            opacity={0.35 * ramp(t, labels[1].at, 0.3)}
          />
          <path d="M1620 320 V520" stroke={T.line} strokeWidth={8} strokeLinecap="round" strokeDasharray="4 22" opacity={0.35 * ramp(t, labels[2].at, 0.3)} />
        </>
      }
    />
  );
};

const Reasonable: React.FC<{ t: number }> = ({ t }) => {
  const every = cue.at("Every upgrade");
  const earned = cue.at("It just felt like");
  const items = [
    { icon: "house", label: "Nicer place" },
    { icon: "car", label: "Newer car" },
    { icon: "plate", label: "Small treats" },
  ];
  const pose = poseAt(t, [
    [0, poses.idle],
    [every, { ...poses.point, armF: [100, 120] }],
    [earned + 0.2, poses.pump],
  ]);
  return (
    <Stage
      theme={T}
      zoom={drift(t, CUT.reasonable, CUT.truth)}
      back={
        <>
          <S.RoomShell t={T} />
          <S.Plant t={T} x={130} s={0.8} />
        </>
      }
      front={
        <>
          <Hero t={t} x={430} pose={alive(pose, t)} expression={t < earned ? "smile" : "open"} />
          {items.map((it, i) => {
            const shown = CUT.reasonable + 0.5 + i * 0.3;
            const ok = every + 0.1 + i * 0.32;
            return (
              <g key={it.label}>
                <K.At x={900 + i * 350} y={mix(250, 320, pop(t, shown))} s={1.1 * pop(t, shown)} r={[-3, 2, -2][i]}>
                  <K.ItemCard t={T} icon={it.icon} label={it.label} check={pop(t, ok)} />
                </K.At>
                <K.At x={900 + i * 350} y={590} s={pop(t, ok + 0.1)}>
                  <K.Pill t={T} text="Reasonable" w={300} size={42} />
                </K.At>
              </g>
            );
          })}
          {[
            [660, 200, 0.8],
            [1780, 150, 0.7],
            [1420, 700, 0.6],
          ].map(([x, y, s], i) => (
            <S.Sparkle key={i} x={x} y={y} s={s * pop(t, earned + 0.4 + i * 0.15) * (0.85 + 0.15 * Math.sin(t * 6 + i))} c={i === 1 ? T.accent : T.accent2} />
          ))}
        </>
      }
    />
  );
};

const Truth: React.FC<{ t: number }> = ({ t }) => {
  const first = cue.at("A raise does not");
  const second = cue.at("It just gives");
  const pose = poseAt(t, [
    [0, poses.idle],
    [first - 0.2, { ...poses.point, armF: [112, 142] }],
  ]);
  const line = (text: string, y: number, at: number, fill: string) => {
    const k = ramp(t, at, 0.35);
    return (
      <g opacity={k} transform={`translate(0 ${(1 - k) * 24})`}>
        <K.Txt y={y} size={76} weight={700} fill={fill}>
          {text}
        </K.Txt>
      </g>
    );
  };
  return (
    <Stage
      theme={T}
      zoom={drift(t, CUT.truth, TRAP_ONE_END)}
      back={<S.RoomShell t={T} />}
      front={
        <>
          <Hero t={t} x={280} pose={alive(pose, t)} expression="wonder" />
          <K.At x={1160} y={mix(360, 430, pop(t, CUT.truth + 0.3))} s={pop(t, CUT.truth + 0.3)} r={-1}>
            <K.Panel t={T} w={1160} h={540} />
            <K.At x={-360} y={-270} s={1} r={-4}>
              <K.Pill t={T} text="HARD TRUTH #1" fill={T.accent} w={400} />
            </K.At>
            {line("A raise does not fix", -96, first, T.line)}
            {line("a spending problem.", -6, first + 0.5, T.line)}
            {line("It just gives the problem", 112, second, T.accent)}
            {line("a bigger budget.", 202, second + 0.6, T.accent)}
          </K.At>
        </>
      }
    />
  );
};

export const trapOneScenes: SceneDef[] = [
  { at: CUT.title, C: Title },
  { at: CUT.small, C: SmallApartment },
  { at: CUT.nice, C: NiceApartment },
  { at: CUT.car, C: CarScene },
  { at: CUT.things, C: SmallThings },
  { at: CUT.total, C: Total },
  { at: CUT.race, C: RatRace },
  { at: CUT.reasonable, C: Reasonable },
  { at: CUT.truth, C: Truth },
];
