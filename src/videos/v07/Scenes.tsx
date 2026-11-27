import React from "react";
import { CashStack, EndScreen, Other, SectionTitle, WHITE, wavePose } from "../../kit/common";
import * as K from "../../kit/props";
import { ListScene, QuoteScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, cue, Hero, para, pip, sequence, T } from "./shared";

const c = cue.at;
export const NARRATION_END = cue.end("I'll see you there");
export const V07_END = NARRATION_END + 10;

const Fridge: React.FC<{ x: number }> = ({ x }) => (
  <g transform={`translate(${x} 0)`}>
    <rect x={-170} y={220} width={340} height={660} rx={24} fill={WHITE} stroke={T.line} strokeWidth={9} />
    <path d="M-170 470 H170" stroke={T.line} strokeWidth={7} />
    <path d="M130 300 V400 M130 520 V660" stroke={T.line} strokeWidth={10} strokeLinecap="round" />
  </g>
);

const Note: React.FC<{ text: string }> = ({ text }) => (
  <g>
    <rect x={-110} y={-80} width={220} height={160} fill="#F7D774" stroke={T.line} strokeWidth={6} />
    {text.split("\n").map((l, i) => (
      <K.Txt key={l} y={-12 + i * 52} size={44} weight={700} fill={T.line}>
        {l}
      </K.Txt>
    ))}
  </g>
);

// The sticky-note goal: up in January, behind the fridge by March.
const StickyGoal = (t: number, zoom: number) => {
  const stick = c("sticky note");
  const march = c("By March");
  const fall = ramp(t, march + 0.3, 1);
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          <Fridge x={1250} />
          <K.At x={1230} y={mix(380, 790, fall)} s={pop(t, stick)} r={mix(-4, 70, fall)} o={1 - fall * 0.9}>
            <Note text={"SAVE\n$5,000"} />
          </K.At>
          {pip(t, 520, [[0, poses.wave], [stick, poses.pump], [march, poses.slump]], t < march ? "open" : "sad")}
          <K.At x={520} y={160} s={pop(t, c("Every January"))}>
            <K.Pill t={T} text={t < march ? "January" : "March"} w={320} fill={t < march ? T.accent2 : T.accent} />
          </K.At>
          <K.At x={520} y={280} s={pop(t, c("exactly the way it did"))}>
            <K.Pill t={T} text="Savings: same as January" w={640} fill={T.line} />
          </K.At>
        </>
      }
    />
  );
};

// Winners and losers hold the same sign.
const SameGoal = (t: number, zoom: number) => (
  <Stage
    theme={T}
    zoom={zoom}
    back={<S.RoomShell t={T} />}
    front={
      <>
        {[560, 1360].map((x, i) => (
          <g key={x}>
            <Other theme={T} x={x} pose={i === 0 ? "cheer" : "slump"} />
            <K.At x={x} y={300} s={pop(t, c("Millions of people") + i * 0.3)}>
              <K.Pill t={T} text="SAVE MORE" w={320} fill={T.accent2} />
            </K.At>
            <K.At x={x} y={180} s={pop(t, c("The ones who succeed") + i * 0.6)}>
              <K.Pill t={T} text={i === 0 ? "Succeeded" : "Failed"} w={300} fill={i === 0 ? T.line : T.accent} />
            </K.At>
          </g>
        ))}
        <K.At x={960} y={560} s={pop(t, c("wanted the same thing"))}>
          <K.Pill t={T} text="Same goal" w={360} fill={T.line} />
        </K.At>
        <K.At x={960} y={680} s={pop(t, c("something else is deciding"))}>
          <K.Pill t={T} text="So what decides?" w={500} fill={T.accent} />
        </K.At>
      </>
    }
  />
);

const GoalVsSystem = (t: number, zoom: number) => (
  <Stage
    theme={T}
    zoom={zoom}
    back={<S.RoomShell t={T} />}
    front={
      <>
        {pip(t, 230, [[0, aim]], "smile")}
        <K.At x={800} y={400} s={pop(t, c("The goal is the result"))} r={-2}>
          <K.Box t={T} text="GOAL" sub="the result" w={420} />
        </K.At>
        <K.At x={1400} y={400} s={pop(t, c("The system is what"))} r={2}>
          <K.Box t={T} text="SYSTEM" sub="what you do daily" fill={T.accent2} w={460} />
        </K.At>
      </>
    }
  />
);

// Payday: money moves to savings before Pip can spend it.
const Payday = (t: number, zoom: number) => {
  const auto = c("automatically");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, poses.point], [auto, poses.pump]], "open")}
          <K.At x={700} y={380} s={pop(t, c("moves the decision"))} r={-3}>
            <K.Calendar t={T} month="PAYDAY" />
          </K.At>
          <K.At x={980} y={380}>
            <K.Arrow t={T} len={260} k={ramp(t, auto, 0.6)} />
          </K.At>
          <CashStack theme={T} x={1500} y={760} n={7} k={ramp(t, auto + 0.3, 2.5)} />
          <K.At x={1380} y={130} s={pop(t, auto)}>
            <K.Pill t={T} text="Automatic. No willpower." w={720} fill={T.accent2} />
          </K.At>
        </>
      }
    />
  );
};

// A week: four of seven nights cooked at home.
const Week = (t: number, zoom: number) => {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const cooked = [0, 2, 3, 5];
  const at = c("four nights a week");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, aim]], "smile")}
          <K.At x={1140} y={180} s={pop(t, c("cooks dinner"))}>
            <K.Pill t={T} text="Cook at home" w={460} fill={T.accent} />
          </K.At>
          {days.map((d, i) => {
            const on = cooked.includes(i);
            const k = ramp(t, at + 0.2 + i * 0.25, 0.3);
            return (
              <K.At key={i} x={660 + i * 160} y={430} s={pop(t, c("small daily behaviour") + i * 0.08)}>
                <circle r={62} fill={on && k > 0.5 ? T.accent2 : T.surface} stroke={T.line} strokeWidth={7} />
                <K.Txt y={20} size={54} weight={700} fill={on && k > 0.5 ? WHITE : T.line}>
                  {d}
                </K.Txt>
              </K.At>
            );
          })}
          <K.At x={1140} y={650} s={pop(t, c("something he can do today"))}>
            <K.Pill t={T} text="Small. Specific. Today." w={620} fill={T.line} />
          </K.At>
        </>
      }
    />
  );
};

// Weekly yes/no ticks.
const Ticks = (t: number, zoom: number) => {
  const start = c("each week");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, poses.think], [c("almost every time"), poses.cheer]], "open")}
          <K.At x={1140} y={180} s={pop(t, c("measures the system"))}>
            <K.Pill t={T} text="Did I follow my system?" w={700} fill={T.line} />
          </K.At>
          {Array.from({ length: 6 }, (_, i) => {
            const k = start + 0.3 + i * 0.5;
            return (
              <K.At key={i} x={700 + i * 175} y={430} s={pop(t, k)}>
                <rect x={-70} y={-70} width={140} height={140} rx={20} fill={T.surface} stroke={T.line} strokeWidth={7} />
                <K.Txt y={-90} size={30} weight={700} fill={T.line}>
                  {`WK ${i + 1}`}
                </K.Txt>
                <path d="M-34 4 l24 26 l48 -58" stroke={T.accent2} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={ramp(t, k + 0.3, 0.3)} />
              </K.At>
            );
          })}
          <K.At x={1140} y={660} s={pop(t, c("almost every time"))}>
            <K.Pill t={T} text="Easy to say yes to" w={560} fill={T.accent2} />
          </K.At>
        </>
      }
    />
  );
};

// December: the savings counter passes the old goal.
const December = (t: number, zoom: number) => {
  const check = c("checks his savings");
  const n = Math.round(mix(0, 5400, ramp(t, check, 2.5)));
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          <Fridge x={1500} />
          {pip(t, 500, [[0, poses.idle], [check, poses.phone], [c("higher than five thousand"), poses.cheer]], "open")}
          <K.At x={500} y={170} s={pop(t, para("It's December"))}>
            <K.Pill t={T} text="December" w={320} fill={T.accent2} />
          </K.At>
          <K.At x={980} y={330} s={pop(t, check)}>
            <K.Panel t={T} w={420} h={200} />
            <K.Txt y={-30} size={40} weight={700} fill={T.line}>
              SAVINGS
            </K.Txt>
            <K.Txt y={50} size={76} weight={700} fill={T.accent2}>
              {K.money(n)}
            </K.Txt>
          </K.At>
          <K.At x={500} y={240}>
            <K.Confetti t={T} age={t - c("higher than five thousand")} />
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
const title = (at: number, n: number, lines: string[]) => ({
  at: at - 0.3,
  render: (t: number, zoom: number) => <SectionTitle theme={T} t={t} zoom={zoom} at={at - 0.3} n={n} lines={lines} />,
});

const PROBLEMS = para("Goals are not useless") - 0.3;
const problems = (t: number, zoom: number, hero: React.ReactNode) => (
  <ListScene
    theme={T}
    t={t}
    zoom={zoom}
    at={PROBLEMS}
    title="3 PROBLEMS"
    hero={hero}
    rows={[
      { text: "One moment, then it's over", at: c("The first problem") },
      { text: "Happy only at the end", at: c("The second problem") },
      { text: "The bounce back", at: c("The third problem") },
    ]}
  />
);

export const scenes = sequence(
  [
    { at: 0, render: StickyGoal },
    quote(para("Pip isn't bad"), "IN THIS VIDEO", (t) => pip(t, 260, [[0, aim]], "smile"), [
      { text: "Why goals quietly fail", at: c("why most goals") },
      { text: "What to set instead", at: c("what to set instead"), accent: true },
    ]),
    title(para("Here's something strange"), 1, ["Same goal,", "different result"]),
    { at: para("Think about everyone") - 0.3, render: SameGoal },
    { at: para("That something else") - 0.3, render: GoalVsSystem },
    { at: PROBLEMS, render: (t, z) => problems(t, z, pip(t, 250, [[0, aim]], "smile")) },
    { at: para("The third problem") - 0.3, render: (t, z) => problems(t, z, <Hero t={t} x={250} pose={poses.slump} expression="sad" />) },
    quote(para("There's a simple way"), "THE RULE", (t) => pip(t, 260, [[0, poses.point]], "smile"), [
      { text: "You don't rise to your goals.", at: c("You don't rise") },
      { text: "You fall to your system.", at: c("fall to the level"), accent: true },
    ], 64),
    quote(para("When motivation fades"), "WHEN IT FADES", (t) => pip(t, 260, [[0, poses.think]], "wonder"), [
      { text: "Motivation leaves.", at: c("When motivation fades") },
      { text: "Only your system stays.", at: c("whatever you do automatically"), accent: true },
    ]),
    quote(para("That's what happened"), "PIP IN MARCH", (t) => pip(t, 260, [[0, poses.slump]], "sad"), [
      { text: "The goal was still there.", at: c("still on the fridge") },
      { text: "His days hadn't changed.", at: c("nothing in his daily life"), accent: true },
    ]),
    title(para("So let's rebuild"), 2, ["What to set", "instead"]),
    { at: para("First, he moves") - 0.3, render: Payday },
    { at: para("Second, he picks") - 0.3, render: Week },
    { at: para("Third, he measures") - 0.3, render: Ticks },
    quote(para("And fourth, he keeps"), "GOAL VS SYSTEM", (t) => pip(t, 260, [[0, aim]], "smile"), [
      { text: "The goal sets the direction.", at: c("sets the direction") },
      { text: "The system does the driving.", at: c("does the driving"), accent: true },
    ], 64),
    { at: para("Let's go back") - 0.3, render: December },
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
            { text: "Same goals, different systems", at: c("Winners and losers usually") },
            { text: "You fall to your system", at: c("You fall to the level", 1) },
            { text: "Let the system do it", at: c("the best goal") },
          ]}
        />
      ),
    },
    {
      at: para("If this helped") - 0.3,
      render: (t, zoom) => <EndScreen theme={T} t={t} zoom={zoom} start={para("If this helped")} hero={<Hero t={t} x={290} pose={wavePose(t)} expression="open" />} />,
    },
  ],
  V07_END
);
