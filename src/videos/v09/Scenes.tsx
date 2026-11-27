import React from "react";
import { EndScreen, SectionTitle, WHITE, wavePose } from "../../kit/common";
import * as K from "../../kit/props";
import { ListScene, QuoteScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, cue, Hero, para, pip, sequence, T } from "./shared";

const c = cue.at;
export const NARRATION_END = cue.end("I'll see you there");
export const V09_END = NARRATION_END + 10;

export const Guitar: React.FC = () => (
  <g>
    <path d="M0 -40 L0 -300" stroke="#8A5A2B" strokeWidth={26} strokeLinecap="round" />
    <rect x={-22} y={-340} width={44} height={60} rx={8} fill="#6B4320" stroke={T.line} strokeWidth={6} />
    <ellipse cx={0} cy={40} rx={110} ry={90} fill="#C98B4E" stroke={T.line} strokeWidth={8} />
    <ellipse cx={0} cy={-50} rx={80} ry={66} fill="#C98B4E" stroke={T.line} strokeWidth={8} />
    <circle cx={0} cy={0} r={30} fill={T.line} />
  </g>
);

// Six weeks of practice, then the guitar goes in the corner.
const Practice = (t: number, zoom: number) => {
  const corner = c("puts the guitar in the corner");
  const k = ramp(t, corner, 1);
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          <K.At x={mix(760, 1650, k)} y={mix(640, 750, k)} r={mix(-30, 8, k)}>
            <Guitar />
          </K.At>
          {pip(t, 560, [[0, poses.read], [c("still sounds terrible"), poses.think], [corner, poses.slump]], t < c("still sounds terrible") ? "smile" : "sad")}
          <K.At x={560} y={160} s={pop(t, c("six weeks"))}>
            <K.Pill t={T} text={t < c("At the end of six") ? "Practising daily" : "Week 6"} w={420} fill={T.accent2} />
          </K.At>
          <K.At x={1150} y={250} s={pop(t, c("still sounds terrible"))}>
            <K.Pill t={T} text="No progress?" w={420} fill={T.accent} />
          </K.At>
        </>
      }
    />
  );
};

// A thermometer rises; the ice cube only melts at the last degree.
const Ice = (t: number, zoom: number) => {
  const warm = c("starts to warm up");
  const melt = c("starts to melt");
  const level = ramp(t, warm, melt - warm, (n) => n);
  const m = ramp(t, melt, 2);
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          <rect x={360} y={180} width={90} height={600} rx={45} fill={WHITE} stroke={T.line} strokeWidth={8} />
          <rect x={378} y={760 - 560 * level} width={54} height={560 * level + 10} rx={27} fill={T.accent} />
          <circle cx={405} cy={800} r={70} fill={T.accent} stroke={T.line} strokeWidth={8} />
          <ellipse cx={1150} cy={830} rx={mix(160, 320, m)} ry={mix(10, 30, m)} fill="#BFE3EA" opacity={0.3 + m * 0.6} />
          <rect x={1150 - 150 * (1 - m * 0.6)} y={830 - 300 * (1 - m * 0.7)} width={300 * (1 - m * 0.6)} height={300 * (1 - m * 0.7)} rx={30} fill="#DFF3F7" stroke={T.line} strokeWidth={8} />
          <K.At x={1150} y={200} s={pop(t, c("Every degree before it"))}>
            <K.Pill t={T} text="Every degree counted" w={620} fill={T.accent2} />
          </K.At>
          <K.At x={1150} y={320} s={pop(t, c("nothing on the outside"))}>
            <K.Pill t={T} text="Invisible until the end" w={620} fill={T.line} />
          </K.At>
        </>
      }
    />
  );
};

// Expected (straight) vs actual (flat, then up). The gap is the valley.
const Valley = (t: number, zoom: number) => {
  const x0 = 520, x1 = 1760, y0 = 820, y1 = 180;
  const exp = ramp(t, c("a straight line"), 1.2);
  const act = ramp(t, c("results stay flat"), 2.5);
  const pts = Array.from({ length: 41 }, (_, i) => {
    const u = i / 40;
    const y = u < 0.6 ? 0.04 * u : 0.04 * 0.6 + Math.pow((u - 0.6) / 0.4, 2) * 0.96;
    return [mix(x0, x1, u), mix(y0, y1, y)] as const;
  });
  const shown = pts.slice(0, Math.max(2, Math.round(41 * act)));
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          <path d={`M${x0} 140 V${y0} H${x1 + 40}`} stroke={T.line} strokeWidth={8} fill="none" />
          <path d={`M${x0} ${y0} L${mix(x0, x1, exp)} ${mix(y0, y1, exp)}`} stroke={T.line} strokeWidth={8} strokeDasharray="22 18" opacity={0.5} />
          <path d={"M" + shown.map(([x, y]) => `${x} ${y}`).join(" L")} stroke={T.accent} strokeWidth={14} fill="none" strokeLinecap="round" />
          <K.At x={800} y={110} s={pop(t, c("a straight line"))}>
            <K.Pill t={T} text="- - - What we expect" w={480} fill={T.line} />
          </K.At>
          <K.At x={800} y={220} s={pop(t, c("results stay flat"))}>
            <K.Pill t={T} text="What really happens" w={480} fill={T.accent} />
          </K.At>
          <K.At x={1150} y={640} s={pop(t, c("where most people quit"))} r={-3}>
            <K.Pill t={T} text="Most people quit here" w={560} fill={T.accent2} />
          </K.At>
          <K.At x={1150} y={730} s={pop(t, c("It's stored"))} r={2}>
            <K.Pill t={T} text="Stored, not wasted" w={500} fill={T.line} />
          </K.At>
        </>
      }
    />
  );
};

// A chain of marked days on a calendar.
const Chain = (t: number, zoom: number) => {
  const start = c("Put a mark");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, aim]], "smile")}
          <K.At x={1140} y={430} s={pop(t, para("The second move") + 0.2)}>
            <K.Panel t={T} w={1060} h={560} />
            {Array.from({ length: 14 }, (_, i) => {
              const x = -420 + (i % 7) * 140;
              const y = -100 + Math.floor(i / 7) * 180;
              const k = ramp(t, start + 0.3 + i * 0.3, 0.2);
              return (
                <g key={i}>
                  <rect x={x - 55} y={y - 55} width={110} height={110} rx={14} fill={WHITE} stroke={T.line} strokeWidth={5} />
                  <path d={`M${x - 30} ${y - 30} L${x + 30} ${y + 30} M${x + 30} ${y - 30} L${x - 30} ${y + 30}`} stroke={T.accent} strokeWidth={12} strokeLinecap="round" opacity={k} />
                </g>
              );
            })}
          </K.At>
          <K.At x={1140} y={110} s={pop(t, c("proof that the work"))}>
            <K.Pill t={T} text="Proof the work is building" w={720} fill={T.accent2} />
          </K.At>
        </>
      }
    />
  );
};

// Week ten: notes finally come out of the guitar.
const Song = (t: number, zoom: number) => {
  const song = c("sounds like a song");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          <K.At x={760} y={640} r={-30}>
            <Guitar />
          </K.At>
          {pip(t, 560, [[0, poses.read], [song, poses.cheer]], t < song ? "smile" : "open")}
          <K.At x={560} y={160} s={pop(t, para("A few months later"))}>
            <K.Pill t={T} text={t < c("around week ten") ? "Marking every evening" : "Week 10"} w={500} fill={T.accent2} />
          </K.At>
          {[0, 1, 2, 3].map((i) => {
            const age = t - song - i * 0.25;
            if (age < 0) return null;
            return (
              <K.At key={i} x={900 + i * 140 + age * 40} y={420 - age * 60 - (i % 2) * 40} o={Math.max(0, 1 - age / 4)}>
                <K.Txt size={110} weight={700} fill={i % 2 ? T.accent : T.accent2}>
                  ♪
                </K.Txt>
              </K.At>
            );
          })}
        </>
      }
    />
  );
};

const quote = (at: number, tag: string, hero: (t: number) => React.ReactNode, lines: { text: string; at: number; accent?: boolean }[], size?: number) => ({
  at: at - 0.3,
  render: (t: number, zoom: number) => <QuoteScene theme={T} t={t} zoom={zoom} at={at - 0.3} tag={tag} hero={hero(t)} lines={lines} size={size} />,
});
const title = (at: number, n: number, lines: string[]) => ({
  at: at - 0.3,
  render: (t: number, zoom: number) => <SectionTitle theme={T} t={t} zoom={zoom} at={at - 0.3} n={n} lines={lines} />,
});

const MOVES = para("So how do you get through") - 0.3;
const moves = (t: number, zoom: number, hero: React.ReactNode) => (
  <ListScene
    theme={T}
    t={t}
    zoom={zoom}
    at={MOVES}
    title="KEEP GOING"
    hero={hero}
    rows={[
      { text: "Expect the flat part", at: c("The first move") },
      { text: "Track the habit", at: c("The second move") },
      { text: "Never miss twice", at: c("The third move") },
      { text: "Judge direction, not distance", at: c("the fourth move") },
    ]}
  />
);

export const scenes = sequence(
  [
    { at: 0, render: Practice },
    quote(para("What Pip didn't know"), "IN THIS VIDEO", (t) => pip(t, 260, [[0, aim]], "smile"), [
      { text: "Why progress feels invisible", at: c("progress feels invisible") },
      { text: "How to keep going", at: c("how to keep going"), accent: true },
    ]),
    { at: para("Imagine an ice cube") - 0.3, render: Ice },
    title(para("Most people expect"), 1, ["The valley of", "disappointment"]),
    { at: para("But real progress") - 0.3, render: Valley },
    title(para("There's a reason the start"), 2, ["Why it feels", "so slow"]),
    quote(para("Small improvements"), "TINY GAINS", (t) => pip(t, 260, [[0, poses.think]], "wonder"), [
      { text: "1% better today", at: c("one percent better") },
      { text: "looks exactly like nothing.", at: c("not improving at all"), accent: true },
    ]),
    quote(para("This is true for fitness"), "EVERYTHING", (t) => pip(t, 260, [[0, aim]], "smile"), [
      { text: "Fitness. Savings. Skills.", at: c("for fitness") },
      { text: "The start always looks empty.", at: c("nothing is happening"), accent: true },
    ]),
    { at: MOVES, render: (t, z) => moves(t, z, pip(t, 250, [[0, aim]], "smile")) },
    { at: para("The second move") - 0.3, render: Chain },
    { at: para("The third move") - 0.3, render: (t, z) => moves(t, z, pip(t, 250, [[0, poses.pump]], "open")) },
    { at: para("Let's go back") - 0.3, render: Song },
    quote(para("Nothing magical"), "WHAT HAPPENED", (t) => pip(t, 260, [[0, poses.cheer]], "open"), [
      { text: "Nothing magical that week.", at: para("Nothing magical") },
      { text: "The early weeks showed up.", at: c("finally showed up"), accent: true },
    ]),
    {
      at: para("So here's what") - 0.3,
      render: (t, zoom) => (
        <ListScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("So here's what") - 0.3}
          title="REMEMBER"
          hero={pip(t, 250, [[0, aim]], "smile")}
          rows={[
            { text: "Progress is stored first", at: c("Progress is stored") },
            { text: "The valley is normal", at: c("The valley of disappointment is") },
            { text: "Keep showing up", at: c("keep showing up") },
          ]}
        />
      ),
    },
    {
      at: para("If this helped") - 0.3,
      render: (t, zoom) => <EndScreen theme={T} t={t} zoom={zoom} start={para("If this helped")} hero={<Hero t={t} x={290} pose={wavePose(t)} expression="open" />} />,
    },
  ],
  V09_END
);
