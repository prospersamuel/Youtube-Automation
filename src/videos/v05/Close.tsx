import React from "react";
import * as K from "../../kit/props";
import { ListScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, Asker, cue, Hero, para, pip, sequence, T, WHITE } from "./shared";

const c = cue.at;
export const NARRATION_END = cue.end("I'll see you there");
export const V05_END = NARRATION_END + 10;
const STEADY = para("So how do you stay") - 0.3;

const steady = (t: number, zoom: number, hero: React.ReactNode) => (
  <ListScene
    theme={T}
    t={t}
    zoom={zoom}
    at={STEADY}
    title="STAY STEADY"
    hero={hero}
    rows={[
      { text: "Say it once, then stop", at: c("The first move") },
      { text: "Count to five", at: c("The second move") },
      { text: "Decide what stays private", at: c("The third move") },
      { text: "Get comfortable with quiet", at: c("the fourth move") },
    ]}
  />
);

// Five slow beats while Pip stays calm.
const Count = (t: number, zoom: number) => {
  const start = c("count slowly to five");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 300, [[0, poses.idle]], "smile")}
          {[1, 2, 3, 4, 5].map((n, i) => (
            <K.At key={n} x={700 + i * 230} y={380} s={pop(t, start + 0.2 + i * 0.6)}>
              <circle r={90} fill={i === 4 ? T.accent2 : T.surface} stroke={T.line} strokeWidth={8} />
              <K.Txt y={36} size={100} weight={700} fill={i === 4 ? WHITE : T.line}>
                {n}
              </K.Txt>
            </K.At>
          ))}
          <K.At x={1160} y={680} s={pop(t, c("speaks first"))}>
            <K.Pill t={T} text="They usually speak first" w={720} fill={T.accent} />
          </K.At>
        </>
      }
    />
  );
};

const Laptop = (t: number, zoom: number) => {
  const names = c("names his price");
  const paid = c("pays the full price");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 480, [[0, poses.idle], [names, poses.point], [names + 1.2, poses.idle], [paid, poses.cheer]], t < paid ? "smile" : "open")}
          <Asker t={t} x={1440} pose={poses.think} />
          <rect x={840} y={700} width={280} height={180} fill={T.accent} stroke={T.line} strokeWidth={8} />
          <S.Laptop t={T} x={860} y={700} />
          <K.At x={960} y={240} s={pop(t, names) * (1 - ramp(t, paid, 0.2))} r={-3}>
            <rect x={-170} y={-55} width={340} height={110} rx={20} fill={T.accent2} stroke={T.line} strokeWidth={8} />
            <K.Txt y={22} size={60} weight={700} fill={WHITE}>
              His price
            </K.Txt>
          </K.At>
          <K.At x={960} y={420} s={pop(t, c("counts slowly"))}>
            <K.Pill t={T} text="Count... 1, 2, 3, 4, 5" w={600} fill={T.line} />
          </K.At>
          <K.At x={960} y={240} s={pop(t, paid)} r={6}>
            <K.Stamp t={T} text="FULL PRICE" />
          </K.At>
          <K.At x={960} y={200}>
            <K.Confetti t={T} age={t - paid} />
          </K.At>
        </>
      }
    />
  );
};

const EndScreen = (t: number, zoom: number) => {
  const start = para("If this helped");
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

export const closeScenes = sequence(
  [
    { at: STEADY, render: (t, z) => steady(t, z, pip(t, 250, [[0, poses.think], [c("The first move"), aim]], "smile")) },
    { at: para("The second move") - 0.3, render: Count },
    { at: para("The third move") - 0.3, render: (t, z) => steady(t, z, pip(t, 250, [[0, poses.point]], "smile")) },
    { at: para("And the fourth move") - 0.3, render: (t, z) => steady(t, z, pip(t, 250, [[0, poses.pump]], "open")) },
    { at: para("Let's go back") - 0.3, render: Laptop },
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
            { text: "Silence makes people talk", at: c("Silence makes most") },
            { text: "Notice who does the work", at: c("notice who is doing") },
            { text: "Say it, then stop", at: c("said what you need") },
          ]}
        />
      ),
    },
    { at: para("If this helped") - 0.3, render: EndScreen },
  ],
  V05_END
);
