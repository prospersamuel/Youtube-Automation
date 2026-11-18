import React from "react";
import * as K from "../../kit/props";
import { QuoteScene, TitleScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, cue, para, pip, sequence, T } from "./shared";

const c = cue.at;

const Plan = (t: number, zoom: number) => (
  <Stage
    theme={T}
    zoom={zoom}
    back={<S.RoomShell t={T} />}
    front={
      <>
        {pip(t, 520, [[0, poses.idle], [c("get fit"), poses.pump]], "open")}
        <K.At x={1300} y={mix(100, 430, pop(t, 0.5))} s={1.15} r={3}>
          <K.Calendar t={T} month="JAN" />
        </K.At>
        <K.At x={1300} y={780} s={pop(t, c("get fit"))}>
          <K.Pill t={T} text="This year: get fit!" w={560} />
        </K.At>
      </>
    }
  />
);

const Days = (t: number, zoom: number) => {
  const marks = [c("Day one"), c("Day two"), c("it rains", 0) , c("he's tired"), c("By day nine")];
  const days = [1, 2, 3, 4, 9];
  const slump = c("By day nine");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 330, [[0, poses.cheer], [c("Day two"), poses.pump], [c("Day four"), poses.idle], [slump, poses.slump]], t < slump ? "open" : "sad")}
          {days.map((d, i) => {
            const x = 740 + i * 220;
            const k = pop(t, marks[i]);
            const ok = i < 2;
            return (
              <K.At key={d} x={x} y={470} s={k}>
                <rect x={-90} y={-100} width={180} height={200} rx={24} fill={T.surface} stroke={T.line} strokeWidth={8} />
                <K.Txt y={-30} size={40} weight={700} fill={T.line}>
                  DAY {d}
                </K.Txt>
                {ok ? (
                  <path d="M-38 30 l26 28 l52 -62" stroke={T.accent2} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                ) : (
                  <path d="M-34 -4 L34 64 M34 -4 L-34 64" stroke={T.accent} strokeWidth={16} strokeLinecap="round" />
                )}
              </K.At>
            );
          })}
          <K.At x={1100} y={800} s={pop(t, c("Does that sound"))}>
            <K.Pill t={T} text="Sound familiar?" w={520} fill={T.accent} />
          </K.At>
        </>
      }
    />
  );
};

export const introScenes = sequence(
  [
    { at: 0, render: Plan },
    { at: para("Day one, he runs") - 0.3, render: Days },
    {
      at: para("Here's the strange part") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("Here's the strange part") - 0.3}
          tag="THE REAL PROBLEM"
          hero={pip(t, 260, [[0, poses.think]], "wonder")}
          lines={[
            { text: "Pip isn't lazy.", at: c("isn't lazy") },
            { text: "He started big.", at: c("He started big"), accent: true },
          ]}
        />
      ),
    },
    {
      at: para("In this video") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("In this video") - 0.3}
          tag="THE FIX"
          hero={pip(t, 260, [[0, aim]], "smile")}
          lines={[
            { text: "One tiny rule.", at: c("one tiny rule") },
            { text: "Two minutes.", at: c("It takes two minutes"), accent: true },
          ]}
        />
      ),
    },
    {
      at: para("Let's look") - 0.3,
      render: (t, zoom) => (
        <TitleScene theme={T} t={t} zoom={zoom} at={para("Let's look") - 0.3} n={1} lines={["Why big starts", "fail"]} size={100} />
      ),
    },
  ],
  para("On day one") - 0.3
);
