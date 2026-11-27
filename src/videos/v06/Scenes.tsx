import React from "react";
import { CashStack, EndScreen, Other, SectionTitle, wavePose } from "../../kit/common";
import * as K from "../../kit/props";
import { ListScene, QuoteScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, cue, Hero, para, pip, sequence, T } from "./shared";

const c = cue.at;
export const NARRATION_END = cue.end("I'll see you there");
export const V06_END = NARRATION_END + 10;

const Flag: React.FC<{ label: string; fill: string }> = ({ label, fill }) => (
  <g>
    <path d="M0 0 V-300" stroke={T.line} strokeWidth={10} strokeLinecap="round" />
    <path d="M0 -300 L170 -255 L0 -210 Z" fill={fill} stroke={T.line} strokeWidth={7} strokeLinejoin="round" />
    <K.At x={0} y={-350}>
      <K.Pill t={T} text={label} w={260} fill={fill} />
    </K.At>
  </g>
);

// Pip walks toward a target; every time he arrives, the flag runs ahead.
const Goalpost = (t: number, zoom: number) => {
  const reach = c("got to five thousand");
  const jump = c("magic number was eight");
  const px = mix(320, 900, ramp(t, reach - 0.6, 1.2));
  const fx = mix(1050, 1650, ramp(t, jump, 1));
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          <K.At x={320} y={160} s={pop(t, c("three thousand"))}>
            <K.Pill t={T} text="Earns $3,000" w={360} fill={T.line} />
          </K.At>
          <K.At x={fx} y={S.FLOOR}>
            <Flag label={t >= jump ? "$8,000" : "$5,000"} fill={t >= jump ? T.accent : T.accent2} />
          </K.At>
          <Hero t={t} x={px} pose={t > reach + 0.6 ? (t > jump ? poses.slump : poses.cheer) : poses.walk} expression={t > jump ? "sad" : "open"} />
          <K.At x={1200} y={200} s={pop(t, c("bigger flat"))} r={-3}>
            <K.Pill t={T} text="Friend's bigger flat" w={520} />
          </K.At>
          <K.At x={1200} y={310} s={pop(t, c("new car"))} r={2}>
            <K.Pill t={T} text="Colleague's new car" w={520} />
          </K.At>
        </>
      }
    />
  );
};

// What Pip wrote down: a good month costs less than he earns.
const Budget = (t: number, zoom: number) => {
  const start = para("He sat down");
  const rows = ["Rent", "Food", "Savings", "A few joys"];
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 300, [[0, poses.read], [c("already earning it"), poses.cheer]], "open")}
          <K.At x={1150} y={420} s={pop(t, start + 0.2)} r={-2}>
            <K.Panel t={T} w={720} h={560} />
            <K.Txt y={-200} size={54} weight={700} fill={T.accent}>
              A GOOD MONTH
            </K.Txt>
            {rows.map((r, i) => (
              <g key={r} opacity={ramp(t, start + 0.8 + i * 0.6, 0.3)}>
                <K.Txt x={-280} y={-90 + i * 80} size={46} weight={600} fill={T.line} anchor="start">
                  {r}
                </K.Txt>
                <rect x={80} y={-112 + i * 80} width={200} height={26} rx={13} fill={T.line} opacity={0.2} />
              </g>
            ))}
          </K.At>
          <K.At x={1150} y={760} s={pop(t, c("already earning it"))}>
            <K.Pill t={T} text="Already earning it" w={600} fill={T.accent2} />
          </K.At>
          <K.At x={300} y={300}>
            <K.Confetti t={T} age={t - c("already earning it")} />
          </K.At>
        </>
      }
    />
  );
};

// A ladder that never ends: Pip climbs, others are always higher.
const Ladder = (t: number, zoom: number) => {
  const climb1 = c("When he earns more");
  const climb2 = c("climbs a rung");
  const lift = ramp(t, climb1, 1) * 120 + ramp(t, climb2, 1) * 120;
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          <path d="M1020 -80 V880 M1220 -80 V880" stroke={T.line} strokeWidth={14} strokeLinecap="round" />
          {Array.from({ length: 11 }, (_, i) => (
            <path key={i} d={`M1020 ${860 - i * 90} H1220`} stroke={T.line} strokeWidth={10} strokeLinecap="round" />
          ))}
          <g opacity={0.55}>
            <Other theme={T} x={1120} floorY={200} scale={0.7} pose="cheer" />
          </g>
          <Hero t={t} x={1120} floorY={860 - lift} scale={0.75} pose={poses.cheer} expression={t > c("always someone further up") ? "wonder" : "open"} />
          <K.At x={480} y={330} s={pop(t, c("always someone further up"))} r={-2}>
            <K.Pill t={T} text="Always someone higher" w={640} fill={T.line} />
          </K.At>
          <K.At x={480} y={470} s={pop(t, c("same distance"))} r={2}>
            <K.Pill t={T} text="Same distance to the top" w={640} fill={T.accent2} />
          </K.At>
          <K.At x={480} y={610} s={pop(t, c("ladder with no top"))}>
            <K.Pill t={T} text="There is no top" w={640} fill={T.accent} />
          </K.At>
        </>
      }
    />
  );
};

const quote = (at: number, tag: string, hero: (t: number) => React.ReactNode, lines: { text: string; at: number; accent?: boolean }[], size?: number) => ({
  at: at - 0.3,
  render: (t: number, zoom: number) => <QuoteScene theme={T} t={t} zoom={zoom} at={at - 0.3} tag={tag} hero={hero(t)} lines={lines} size={size} />,
});

const STEPS = para("So how do you set") - 0.3;
const steps = (t: number, zoom: number, hero: React.ReactNode) => (
  <ListScene
    theme={T}
    t={t}
    zoom={zoom}
    at={STEPS}
    title="YOUR ENOUGH"
    hero={hero}
    rows={[
      { text: "Price your good life", at: c("The first step") },
      { text: "Spot borrowed wants", at: c("The second step") },
      { text: "Pick what you'll never risk", at: c("The third step") },
      { text: "Grow savings, not lifestyle", at: c("the fourth step") },
    ]}
  />
);

export const scenes = sequence(
  [
    { at: 0, render: Goalpost },
    quote(para("Pip's income went up"), "SAME FEELING", (t) => pip(t, 260, [[0, poses.slump]], "sad"), [
      { text: "Income: up by half", at: c("more than half") },
      { text: "Stress: exactly the same", at: c("exactly as stressed"), accent: true },
    ]),
    quote(para("This is one of the most"), "IN THIS VIDEO", (t) => pip(t, 260, [[0, aim]], "smile"), [
      { text: "Why the finish line moves", at: c("why the finish line") },
      { text: "How to set one that stays", at: c("stays put"), accent: true },
    ], 64),
    { at: para("Here's what happened") - 0.3, render: (t, zoom) => <SectionTitle theme={T} t={t} zoom={zoom} at={para("Here's what happened") - 0.3} n={1} lines={["The moving", "goalpost"]} /> },
    quote(para("Every time his income"), "WHAT CHANGED", (t) => pip(t, 260, [[0, poses.point]], "smile"), [
      { text: "Better food becomes normal", at: c("Better food") },
      { text: "A nicer flat becomes home", at: c("A nicer flat") },
      { text: "Extra money becomes the floor", at: c("the new floor"), accent: true },
    ], 60),
    quote(para("This is why so many"), "NOT YOUR FAULT", (t) => pip(t, 260, [[0, poses.think]], "wonder"), [
      { text: "You didn't miss the goal.", at: c("didn't fail") },
      { text: "The goal kept running away.", at: c("running away"), accent: true },
    ], 64),
    { at: para("There's a second force") - 0.3, render: (t, zoom) => <SectionTitle theme={T} t={t} zoom={zoom} at={para("There's a second force") - 0.3} n={2} lines={["A ladder", "with no top"]} /> },
    { at: para("Pip doesn't measure") - 0.3, render: Ladder },
    quote(para("Wanting more can feel"), "THE REAL DANGER", (t) => pip(t, 260, [[0, poses.think]], "wonder"), [
      { text: "Borrowing to keep up", at: c("borrow to keep up") },
      { text: "Get-rich-quick bets", at: c("get-rich-quick") },
      { text: "Risking what keeps you safe", at: c("on the line"), accent: true },
    ], 60),
    quote(para("There are stories"), "IT HAPPENS", (t) => pip(t, 260, [[0, poses.slump]], "sad"), [
      { text: "They had everything they needed.", at: c("had everything they needed") },
      { text: "They risked it for more.", at: c("risked it for"), accent: true },
    ], 58),
    {
      at: para("That is the core") - 0.3,
      render: (t, zoom) => (
        <Stage
          theme={T}
          zoom={zoom}
          back={<S.RoomShell t={T} />}
          front={
            <>
              {pip(t, 260, [[0, aim]], "smile")}
              <CashStack theme={T} x={1600} y={820} n={7} k={ramp(t, para("That is the core"), 1.2)} />
              <K.At x={900} y={330} s={pop(t, c("Never risk"))}>
                <K.Txt size={92} weight={700} fill={T.line}>
                  Never risk what you need
                </K.Txt>
              </K.At>
              <K.At x={900} y={470} s={pop(t, c("don't have and don't need"))}>
                <K.Txt size={92} weight={700} fill={T.accent}>
                  for what you don't.
                </K.Txt>
              </K.At>
            </>
          }
        />
      ),
    },
    { at: STEPS, render: (t, z) => steps(t, z, pip(t, 250, [[0, aim]], "smile")) },
    { at: para("The third step") - 0.3, render: (t, z) => steps(t, z, pip(t, 250, [[0, poses.pump]], "open")) },
    { at: para("Let's go back") - 0.3, render: Budget },
    quote(para("Nothing about his income"), "PIP FEELS RICH", (t) => pip(t, 260, [[0, poses.cheer]], "open"), [
      { text: "Same income.", at: para("Nothing about his income") },
      { text: "Now he knows his enough.", at: c("what enough looked like"), accent: true },
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
            { text: "Fix the goalpost yourself", at: c("The goalpost moves every") },
            { text: "Comparison has no top", at: c("Comparison is a ladder", 1) },
            { text: "Never risk what you need", at: c("never risk what you need") },
          ]}
        />
      ),
    },
    {
      at: para("If this helped") - 0.3,
      render: (t, zoom) => <EndScreen theme={T} t={t} zoom={zoom} start={para("If this helped")} hero={<Hero t={t} x={290} pose={wavePose(t)} expression="open" />} />,
    },
  ],
  V06_END
);
