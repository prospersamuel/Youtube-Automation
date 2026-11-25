import React from "react";
import * as K from "../../kit/props";
import { ListScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { pop } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, Asker, Clipboard, cue, Hero, para, pip, sequence, T } from "./shared";

const c = cue.at;
export const NARRATION_END = cue.end("I'll see you there");
export const V03_END = NARRATION_END + 10;

const Pass = (t: number, zoom: number) => (
  <Stage
    theme={T}
    zoom={zoom}
    back={
      <>
        <S.StreetShell t={T} />
        <S.StreetLamp t={T} x={1700} />
      </>
    }
    front={
      <>
        {pip(t, 620, [[0, poses.idle], [c("politely passed"), poses.wave], [c("how easy it was"), poses.cheer]], "smile")}
        <Asker t={t} x={1180} pose={poses.read} />
        <K.At x={980} y={520} r={-6}>
          <Clipboard />
        </K.At>
        <K.At x={900} y={200} s={pop(t, c("politely passed"))}>
          <K.Pill t={T} text="No thanks. No guilt." w={600} fill={T.accent2} />
        </K.At>
        <K.At x={900} y={320} s={pop(t, c("started climbing"))}>
          <K.Pill t={T} text="Notice the first step" w={620} fill={T.accent} />
        </K.At>
      </>
    }
  />
);

const EndScreen = (t: number, zoom: number) => {
  const start = para("If this video helped");
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
    { at: para("Let's go back to Pip") - 0.3, render: Pass },
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
            { text: "Small yes, then big yes", at: c("A small yes is often") },
            { text: "Public yeses pull harder", at: c("The pressure to stay") },
            { text: "Gut says no? Listen.", at: c("when your stomach says no") },
          ]}
        />
      ),
    },
    { at: para("If this video helped") - 0.3, render: EndScreen },
  ],
  V03_END
);
