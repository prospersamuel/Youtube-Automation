import React from "react";
import * as K from "../../kit/props";
import { ListScene, QuoteScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, cue, para, pip, SectionTitle, sequence, T, WHITE } from "./shared";

const c = cue.at;
const REBUILD = para("Let's rebuild") - 0.3;

// Value = (dream outcome x likelihood) / (wait x effort), built up as each part is named.
const Equation = (t: number, zoom: number) => {
  const parts: { label: string; at: number; x: number; y: number; fill: string }[] = [
    { label: "Dream outcome", at: c("the dream outcome"), x: 920, y: 300, fill: T.accent2 },
    { label: "Likelihood", at: c("how likely it feels"), x: 1450, y: 300, fill: T.accent2 },
    { label: "Wait", at: c("how long the buyer"), x: 920, y: 620, fill: T.accent },
    { label: "Effort", at: c("effort and sacrifice"), x: 1450, y: 620, fill: T.accent },
  ];
  const up = c("the result is bigger");
  const down = c("the wait is shorter");
  const most = c("Most people only");
  const gains = c("real gains");
  const arrow = (x: number, y: number, dir: 1 | -1, k: number) => (
    <K.At x={x} y={y} s={pop(t, k)}>
      <path d={`M0 ${dir * 30} V${-dir * 30} M-22 ${-dir * 10} L0 ${-dir * 32} L22 ${-dir * 10}`} stroke={dir === 1 ? T.accent2 : T.accent} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </K.At>
  );
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, poses.point], [most, poses.think], [gains, aim]], "smile")}
          <K.At x={570} y={470} s={pop(t, para("Two parts make") - 0.2)}>
            <K.Txt y={30} size={88} weight={700} fill={T.line}>
              VALUE =
            </K.Txt>
          </K.At>
          <path d="M720 460 H1700" stroke={T.line} strokeWidth={10} strokeLinecap="round" opacity={ramp(t, para("Two parts make") - 0.2, 0.4)} />
          <K.Txt x={1185} y={330} size={80} weight={700} fill={T.line} opacity={ramp(t, c("how likely it feels"), 0.3)}>
            ×
          </K.Txt>
          <K.At x={1185} y={0}>
            <K.Txt y={650} size={80} weight={700} fill={T.line} opacity={ramp(t, c("effort and sacrifice"), 0.3)}>
              ×
            </K.Txt>
          </K.At>
          {parts.map((p) => (
            <K.At key={p.label} x={p.x} y={p.y} s={pop(t, p.at)}>
              <rect x={-210} y={-60} width={420} height={120} rx={24} fill={p.fill} stroke={T.line} strokeWidth={8} />
              <K.Txt y={18} size={50} weight={700} fill={WHITE}>
                {p.label}
              </K.Txt>
            </K.At>
          ))}
          {arrow(1720, 300, 1, up)}
          {arrow(1720, 620, -1, down)}
          <K.At x={920} y={160} s={pop(t, most)} r={-3}>
            <K.Pill t={T} text="Everyone pushes this" w={520} fill={T.line} />
          </K.At>
          <K.At x={1450} y={780} s={pop(t, gains)} r={2}>
            <K.Pill t={T} text="Gains hide here too" w={520} fill={T.line} />
          </K.At>
        </>
      }
    />
  );
};

const newOffer = (t: number, zoom: number, hero: React.ReactNode) => (
  <ListScene
    theme={T}
    t={t}
    zoom={zoom}
    at={REBUILD}
    title="NEW OFFER"
    hero={hero}
    rows={[
      { text: "Grade up a level in one term", at: c("First, the dream outcome") },
      { text: "Proof from past students", at: c("Second, likelihood") },
      { text: "Friday progress updates", at: c("Third, the waiting time") },
      { text: "He comes to you, brings it all", at: c("And fourth, effort") },
    ]}
  />
);

// Three report cards: before grade crossed out, after grade circled.
const Proof = (t: number, zoom: number) => {
  const cards = [
    ["C", "B"],
    ["D", "B"],
    ["C", "A"],
  ];
  const at = c("before and after");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, aim]], "smile")}
          {cards.map(([a, b], i) => {
            const k = at + i * 0.5;
            return (
              <K.At key={i} x={720 + i * 400} y={400} s={pop(t, k)} r={[-4, 2, -2][i]}>
                <K.Panel t={T} w={320} h={360} />
                <K.Txt y={-110} size={38} weight={700} fill={T.line}>
                  REPORT
                </K.Txt>
                <K.Txt x={-70} y={40} size={110} weight={700} fill={T.line} opacity={0.45}>
                  {a}
                </K.Txt>
                <path d="M-110 -20 L-30 50" stroke={T.accent} strokeWidth={10} strokeLinecap="round" opacity={ramp(t, k + 0.6, 0.3)} />
                <K.Txt x={75} y={40} size={110} weight={700} fill={T.accent2} opacity={ramp(t, k + 0.8, 0.3)}>
                  {b}
                </K.Txt>
              </K.At>
            );
          })}
          <K.At x={1120} y={760} s={pop(t, c("already happened"))}>
            <K.Pill t={T} text="Not a promise. Proof." w={640} fill={T.accent} />
          </K.At>
        </>
      }
    />
  );
};

const Fridays = (t: number, zoom: number) => {
  const start = c("every Friday");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, poses.point], [c("see progress"), poses.pump]], "open")}
          {Array.from({ length: 5 }, (_, i) => {
            const k = start + 0.3 + i * 0.45;
            return (
              <K.At key={i} x={640 + i * 250} y={400} s={pop(t, k)} r={[-3, 2, -2, 3, -1][i]}>
                <rect x={-100} y={-120} width={200} height={240} rx={20} fill={T.surface} stroke={T.line} strokeWidth={8} />
                <rect x={-100} y={-120} width={200} height={64} rx={20} fill={T.accent} stroke={T.line} strokeWidth={8} />
                <K.Txt y={-72} size={38} weight={700} fill={WHITE}>
                  FRI
                </K.Txt>
                <path d="M-40 20 l26 28 l52 -62" stroke={T.accent2} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={ramp(t, k + 0.4, 0.3)} />
              </K.At>
            );
          })}
          <K.At x={1140} y={720} s={pop(t, c("see progress"))}>
            <K.Pill t={T} text="Progress from week one" w={680} fill={T.accent2} />
          </K.At>
        </>
      }
    />
  );
};

export const equationScenes = sequence(
  [
    {
      at: para("So how do you make") - 0.3,
      render: (t, zoom) => <SectionTitle t={t} zoom={zoom} at={para("So how do you make") - 0.3} n={2} lines={["The value", "equation"]} />,
    },
    { at: para("Two parts make") - 0.3, render: Equation },
    { at: REBUILD, render: (t, z) => newOffer(t, z, pip(t, 250, [[0, aim]], "smile")) },
    { at: para("Second, likelihood") - 0.3, render: Proof },
    { at: para("Third, the waiting") - 0.3, render: Fridays },
    { at: para("And fourth, effort") - 0.3, render: (t, z) => newOffer(t, z, pip(t, 250, [[0, poses.pump]], "open")) },
    {
      at: para("Same tutor") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("Same tutor") - 0.3}
          tag="SAME PIP"
          hero={pip(t, 260, [[0, poses.cheer]], "open")}
          lines={[
            { text: "Same tutor. Same maths.", at: para("Same tutor") },
            { text: "A different offer.", at: c("completely different"), accent: true },
          ]}
        />
      ),
    },
  ],
  para("There's one more piece") - 0.3
);
