import React from "react";
import * as K from "../../kit/props";
import { QuoteScene, TitleScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, cue, para, pip, sequence, T } from "./shared";

const c = cue.at;
const WHITE = "#FFFDF8";

const Motivation = (t: number, zoom: number) => {
  const spike = c("it spikes");
  const gone = c("it's gone");
  const level = ramp(t, c("full of motivation"), 1.2) * (1 - ramp(t, gone, 1.6) * 0.9);
  const w = 760;
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 300, [[0, poses.cheer], [gone, poses.slump]], t < gone ? "open" : "sad")}
          <K.At x={1230} y={440} s={pop(t, para("On day one"))}>
            <K.Panel t={T} w={900} h={360} />
            <K.Txt y={-100} size={56} weight={700} fill={T.line}>
              MOTIVATION
            </K.Txt>
            <rect x={-w / 2} y={-40} width={w} height={90} rx={45} fill={T.wall2} stroke={T.line} strokeWidth={8} />
            <rect x={-w / 2 + 6} y={-34} width={Math.max(0, (w - 12) * level)} height={78} rx={39} fill={T.accent} />
            <K.Txt y={150} size={48} weight={600} fill={T.line}>
              {ramp(t, gone, 0.5) > 0.5 ? "Gone." : t > spike ? "Spiking..." : "Day one"}
            </K.Txt>
          </K.At>
        </>
      }
    />
  );
};

const Rain = (t: number, zoom: number) => (
  <QuoteScene
    theme={T}
    t={t}
    zoom={zoom}
    at={para("On day four") - 0.3}
    tag="DAY 4"
    hero={pip(t, 260, [[0, poses.slump]], "sad")}
    size={64}
    lines={[
      { text: "Run 5 km right now?", at: c("Do I want to run") },
      { text: "In the rain. Tired.", at: c("in the rain") },
      { text: "Honest answer: no.", at: c("is almost always no"), accent: true },
    ]}
  />
);

const Hard = (t: number, zoom: number) => {
  const hardAt = c("is starting it");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 260, [[0, poses.idle], [hardAt, poses.think]], "wonder")}
          <K.At x={880} y={450} s={pop(t, hardAt)} r={-2}>
            <K.Box t={T} text="START" sub="the hard part" fill={T.accent} w={380} />
          </K.At>
          <K.At x={1110} y={450}>
            <K.Arrow t={T} len={120} k={ramp(t, c("Once Pip is outside"), 0.5)} />
          </K.At>
          <K.At x={1500} y={450} s={pop(t, c("Once Pip is outside"))} r={2}>
            <K.Box t={T} text="KEEP GOING" sub="easy once moving" w={420} />
          </K.At>
        </>
      }
    />
  );
};

const Clock = (t: number, zoom: number) => {
  const two = c("less than two minutes");
  const sweep = ramp(t, two, 1.4);
  const a = sweep * (Math.PI / 3); // 2 of 12 "minutes"
  const px = 190 * Math.sin(a);
  const py = -190 * Math.cos(a);
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 300, [[0, poses.point]], "open")}
          <K.At x={1260} y={440} s={pop(t, para("Here's the rule"))}>
            <circle r={210} fill={T.surface} stroke={T.line} strokeWidth={10} />
            <path d={`M0 0 L0 -190 A190 190 0 0 1 ${px} ${py} Z`} fill={T.accent} opacity={0.9} />
            <path d={`M0 0 L${px} ${py}`} stroke={T.line} strokeWidth={10} strokeLinecap="round" />
            <circle r={14} fill={T.line} />
          </K.At>
          <K.At x={1260} y={800} s={pop(t, two)}>
            <K.Pill t={T} text="Under 2 minutes" w={600} fill={T.accent2} />
          </K.At>
        </>
      }
    />
  );
};

const Shrink = (t: number, zoom: number) => {
  const rows: [string, string, string][] = [
    ["Run 5 km", "Put on shoes", "put on my running shoes"],
    ["Read a chapter", "Read one page", "read one page"],
    ["Write for an hour", "Write one sentence", "write one sentence"],
    ["Meditate 20 min", "3 slow breaths", "three slow breaths"],
  ];
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, aim]], "smile")}
          <K.At x={1170} y={440} s={pop(t, para("That's it. Not") - 0.2)} r={-1}>
            <K.Panel t={T} w={1340} h={720} />
            {rows.map(([big, small, cue_], i) => {
              const k = ramp(t, c(cue_) - 0.3, 0.35);
              const y = (i - 1.5) * 150 + 18;
              return (
                <g key={big} opacity={k} transform={`translate(${(1 - k) * 40} ${y})`}>
                  <K.Txt x={-600} size={46} weight={600} fill={T.line} opacity={0.5} anchor="start">
                    {big}
                  </K.Txt>
                  <K.At x={-190} y={-14}>
                    <K.Arrow t={T} len={110} />
                  </K.At>
                  <K.Txt x={-40} size={52} weight={700} fill={T.accent} anchor="start">
                    {small}
                  </K.Txt>
                </g>
              );
            })}
          </K.At>
        </>
      }
    />
  );
};

export const ruleScenes = sequence(
  [
    { at: para("On day one") - 0.3, render: Motivation },
    { at: para("On day four") - 0.3, render: Rain },
    { at: para("That's the real problem") - 0.3, render: Hard },
    {
      at: para("So if starting") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("So if starting") - 0.3}
          tag="THE QUESTION"
          hero={pip(t, 260, [[0, poses.think]], "wonder")}
          lines={[
            { text: "Make starting", at: c("what if we made") },
            { text: "impossible to fail.", at: c("almost impossible"), accent: true },
          ]}
        />
      ),
    },
    { at: para("Here's the rule") - 0.3, render: Clock },
    { at: para("That's it. Not") - 0.3, render: Shrink },
    {
      at: para("It sounds almost silly") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("It sounds almost silly") - 0.3}
          tag="SILLY?"
          hero={pip(t, 260, [[0, poses.idle], [c("But watch"), poses.pump]], "open")}
          lines={[
            { text: "Shoes on. That's a workout?", at: c("Pip would be") },
            { text: "Now watch what happens.", at: c("But watch"), accent: true },
          ]}
          size={66}
        />
      ),
    },
  ],
  para("There are three reasons") - 0.3
);
