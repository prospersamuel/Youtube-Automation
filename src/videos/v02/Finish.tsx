import React from "react";
import * as K from "../../kit/props";
import { ListScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, cue, Hero, para, pip, sequence, T } from "./shared";

const c = cue.at;
const TRY = para("Here's how to use this") - 0.3;
export const NARRATION_END = cue.end("I'll see you there");
export const V02_END = NARRATION_END + 10;

const tryIt = (t: number, zoom: number, extra?: React.ReactNode, pose = aim) => (
  <ListScene
    theme={T}
    t={t}
    zoom={zoom}
    at={TRY}
    title="TRY IT TODAY"
    hero={pip(t, 250, [[0, pose]], "smile")}
    extra={extra}
    rows={[
      { text: "Pick one habit", at: c("Step one") },
      { text: "Shrink it under 2 min", at: c("Step two") },
      { text: "Attach it to a routine", at: c("Step three") },
      { text: "Stay small for 2 weeks", at: c("step four") },
    ]}
  />
);

const Back = (t: number, zoom: number) => (
  <Stage
    theme={T}
    zoom={zoom}
    back={<S.RoomShell t={T} />}
    front={
      <>
        {pip(t, 520, [[0, poses.idle], [c("puts them on"), poses.pump]], "smile")}
        <K.At x={1300} y={440} s={pop(t, para("Let's go back"))} r={3}>
          <K.Calendar t={T} month="JAN" />
        </K.At>
        <K.At x={1300} y={800} s={pop(t, c("no big plan"))}>
          <K.Pill t={T} text="No big plan. Just shoes." w={640} />
        </K.At>
      </>
    }
  />
);

const March = (t: number, zoom: number) => (
  <Stage
    theme={T}
    zoom={zoom}
    back={<S.RoomShell t={T} />}
    front={
      <>
        {pip(t, 520, [[0, poses.cheer]], "open")}
        <K.At x={1300} y={440} s={1.1} r={-3}>
          <K.Calendar t={T} month="MAR" />
        </K.At>
        <K.At x={1300} y={800} s={pop(t, c("Nobody gave"))}>
          <K.Pill t={T} text="Someone who shows up" w={680} fill={T.accent2} />
        </K.At>
        <K.At x={520} y={300}>
          <K.Confetti t={T} age={t - c("But Pip noticed")} />
        </K.At>
      </>
    }
  />
);

const EndScreen = (t: number, zoom: number) => {
  const start = para("If you try");
  const pose = { ...poses.wave, armF: [poses.wave.armF[0], poses.wave.armF[1] + Math.sin(t * 9) * 16] as [number, number] };
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          <Hero t={t} x={290} pose={pose} expression="open" />
          <K.At x={960} y={120} s={pop(t, start + 0.3)}>
            <K.Txt y={40} size={112} weight={700} fill={T.line}>
              Read It Once
            </K.Txt>
          </K.At>
          <K.At x={720} y={500} s={pop(t, start + 0.6)}>
            <circle r={122} fill={T.surface} stroke={T.line} strokeWidth={9} strokeDasharray="20 16" />
            <K.Txt y={196} size={50} weight={700} fill={T.accent}>
              Subscribe
            </K.Txt>
          </K.At>
          <K.At x={1380} y={500} s={pop(t, start + 0.8)}>
            <rect x={-360} y={-202} width={720} height={404} rx={24} fill={T.surface} stroke={T.line} strokeWidth={9} strokeDasharray="20 16" />
            <K.Txt y={-236} size={50} weight={700} fill={T.accent2}>
              Watch next
            </K.Txt>
          </K.At>
        </>
      }
    />
  );
};

export const finishScenes = sequence(
  [
    { at: TRY, render: (t, z) => tryIt(t, z) },
    {
      at: para("Step three") - 0.3,
      render: (t, z) =>
        tryIt(
          t,
          z,
          <>
            <K.At x={1170} y={880} s={pop(t, c("After I pour"))}>
              <K.Pill t={T} text="After coffee → shoes on" w={700} />
            </K.At>
          </>,
          poses.pump
        ),
    },
    { at: para("Let's go back") - 0.3, render: Back },
    { at: para("By March") - 0.3, render: March },
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
            { text: "Make starting tiny.", at: c("Starting is the hard part, so") },
            { text: "Show up first, improve later.", at: c("Show up first") },
            { text: "Small habits build big goals.", at: c("small habits aren't") },
          ]}
        />
      ),
    },
    { at: para("If you try") - 0.3, render: EndScreen },
  ],
  V02_END
);
