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
export const V08_END = NARRATION_END + 10;

// Same company, same bad day: one panics, one is calm.
const JobLoss = (t: number, zoom: number) => {
  const shut = c("company shut down");
  const panic = c("in a panic");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 560, [[0, poses.wave], [shut, poses.slump], [c("six months to find"), poses.idle]], t < shut ? "smile" : t < c("six months to find") ? "sad" : "smile")}
          <Other theme={T} x={1360} outfit="hoodie" pose={t < shut ? "cheer" : "slump"} />
          <K.At x={560} y={210} s={pop(t, c("Pip and his friend"))}>
            <K.Pill t={T} text="Salary: 1x" w={320} fill={T.line} />
          </K.At>
          <K.At x={1360} y={210} s={pop(t, c("twice as much"))}>
            <K.Pill t={T} text="Salary: 2x" w={320} fill={T.accent2} />
          </K.At>
          <K.At x={960} y={80} s={pop(t, shut)}>
            <K.Pill t={T} text="Company shut down" w={560} fill={T.accent} />
          </K.At>
          <K.At x={1360} y={310} s={pop(t, panic)}>
            <K.Pill t={T} text="Panic in a month" w={460} fill={T.accent} />
          </K.At>
          <K.At x={1440} y={410} s={pop(t, panic + 0.3)}>
            <K.SweatDrop t={T} />
          </K.At>
          <K.At x={560} y={310} s={pop(t, c("six months to find"))}>
            <K.Pill t={T} text="Calm for 6 months" w={480} fill={T.accent2} />
          </K.At>
        </>
      }
    />
  );
};

// Two stacks: the big earner keeps almost nothing, Pip's grows.
const Keep = (t: number, zoom: number) => (
  <Stage
    theme={T}
    zoom={zoom}
    back={<S.RoomShell t={T} />}
    front={
      <>
        <Other theme={T} x={430} outfit="hoodie" pose={t > c("spent almost all") ? "slump" : "idle"} />
        {pip(t, 1180, [[0, poses.idle], [c("saved a fifth"), poses.pump]], "smile")}
        <CashStack theme={T} x={720} y={840} n={1} k={pop(t, c("spent almost all"))} w={240} />
        <CashStack theme={T} x={1500} y={840} n={6} k={ramp(t, c("saved a fifth"), 3)} w={240} />
        <K.At x={560} y={160} s={pop(t, c("spent almost all"))}>
          <K.Pill t={T} text="Earned a lot. Kept almost nothing." w={820} fill={T.accent} />
        </K.At>
        <K.At x={1340} y={160} s={pop(t, c("saved a fifth"))}>
          <K.Pill t={T} text="Earned less. Kept a fifth." w={680} fill={T.accent2} />
        </K.At>
        <K.At x={960} y={290} s={pop(t, c("the gap between"))}>
          <K.Pill t={T} text="Wealth = earned minus spent" w={760} fill={T.line} />
        </K.At>
      </>
    }
  />
);

// Four things you can't control, crossed out; one you can.
const Control = (t: number, zoom: number) => {
  const items: [string, string][] = [
    ["Salary", "fully control your salary"],
    ["Economy", "the economy does"],
    ["Your company", "company survives"],
    ["Investments", "how investments perform"],
  ];
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, poses.think], [c("how much of each payday"), aim]], "smile")}
          {items.map(([label, p], i) => {
            const at = c(p);
            return (
              <K.At key={label} x={760 + (i % 2) * 520} y={230 + Math.floor(i / 2) * 200} s={pop(t, at)} o={1 - ramp(t, at + 0.6, 0.4) * 0.45}>
                <K.Box t={T} text={label} w={440} />
                <path d="M-200 -50 L200 50" stroke={T.accent} strokeWidth={12} strokeLinecap="round" opacity={ramp(t, at + 0.4, 0.3)} />
              </K.At>
            );
          })}
          <K.At x={1020} y={700} s={pop(t, c("how much of each payday"))}>
            <K.Box t={T} text="WHAT YOU KEEP" sub="always in your hands" fill={T.accent2} w={640} />
          </K.At>
        </>
      }
    />
  );
};

const Close = (t: number, zoom: number) => (
  <Stage
    theme={T}
    zoom={zoom}
    back={<S.RoomShell t={T} />}
    front={
      <>
        {pip(t, 560, [[0, poses.idle], [c("panic and calm"), poses.cheer]], "smile")}
        <CashStack theme={T} x={860} y={840} n={6} w={240} />
        <Other theme={T} x={1400} outfit="hoodie" pose="slump" />
        <K.At x={1480} y={400}>
          <K.SweatDrop t={T} />
        </K.At>
        <K.At x={560} y={170} s={pop(t, c("a little more"))}>
          <K.Pill t={T} text="Kept a little more" w={500} fill={T.accent2} />
        </K.At>
        <K.At x={960} y={290} s={pop(t, c("panic and calm"))}>
          <K.Pill t={T} text="The gap = panic vs calm" w={680} fill={T.line} />
        </K.At>
      </>
    }
  />
);

const quote = (at: number, tag: string, hero: (t: number) => React.ReactNode, lines: { text: string; at: number; accent?: boolean }[], size?: number) => ({
  at: at - 0.3,
  render: (t: number, zoom: number) => <QuoteScene theme={T} t={t} zoom={zoom} at={at - 0.3} tag={tag} hero={hero(t)} lines={lines} size={size} />,
});
const title = (at: number, n: number, lines: string[]) => ({
  at: at - 0.3,
  render: (t: number, zoom: number) => <SectionTitle theme={T} t={t} zoom={zoom} at={at - 0.3} n={n} lines={lines} />,
});

const MOVES = para("So how do you widen") - 0.3;
const moves = (t: number, zoom: number, hero: React.ReactNode) => (
  <ListScene
    theme={T}
    t={t}
    zoom={zoom}
    at={MOVES}
    title="KEEP MORE"
    hero={hero}
    rows={[
      { text: "Spend less on impressing", at: c("The first move") },
      { text: "Save first, spend the rest", at: c("The second move") },
      { text: "Raise savings with income", at: c("The third move") },
      { text: "Start small, start now", at: c("the fourth move") },
    ]}
  />
);

export const scenes = sequence(
  [
    { at: 0, render: JobLoss },
    quote(para("The friend earned double"), "IN THIS VIDEO", (t) => pip(t, 260, [[0, aim]], "smile"), [
      { text: "Why keeping beats earning", at: c("amount you keep") },
      { text: "How to keep more", at: c("how to keep more"), accent: true },
    ]),
    title(para("Here's what was really"), 1, ["Wealth is", "what you keep"]),
    { at: para("Pip's friend earned") - 0.3, render: Keep },
    title(para("There's another reason"), 2, ["The part you", "control"]),
    { at: para("You can't fully") - 0.3, render: Control },
    quote(para("Many people think"), "NO LABEL NEEDED", (t) => pip(t, 260, [[0, poses.think]], "wonder"), [
      { text: "Not just for a house or a car,", at: c("A house") },
      { text: "but for what you can't predict.", at: c("can't predict"), accent: true },
    ], 64),
    quote(para("That's what Pip's savings"), "WHAT SAVINGS BUY", (t) => pip(t, 260, [[0, poses.pump]], "open"), [
      { text: "Time to choose.", at: c("Time to choose") },
      { text: "The freedom to say no.", at: c("freedom to say no"), accent: true },
    ]),
    quote(para("Savings that aren't"), "OPTIONS", (t) => pip(t, 260, [[0, aim]], "smile"), [
      { text: "Savings for nothing in particular", at: para("Savings that aren't") },
      { text: "are for everything you can't see coming.", at: c("can't see coming"), accent: true },
    ], 56),
    { at: MOVES, render: (t, z) => moves(t, z, pip(t, 250, [[0, aim]], "smile")) },
    { at: para("The third move") - 0.3, render: (t, z) => moves(t, z, pip(t, 250, [[0, poses.pump]], "open")) },
    { at: para("Let's go back") - 0.3, render: Close },
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
            { text: "Wealth is what you keep", at: c("Wealth is what you keep") },
            { text: "Saving is yours to control", at: c("one part of money") },
            { text: "Savings buy options", at: c("savings without a label") },
          ]}
        />
      ),
    },
    {
      at: para("If this helped") - 0.3,
      render: (t, zoom) => <EndScreen theme={T} t={t} zoom={zoom} start={para("If this helped")} hero={<Hero t={t} x={290} pose={wavePose(t)} expression="open" />} />,
    },
  ],
  V08_END
);
