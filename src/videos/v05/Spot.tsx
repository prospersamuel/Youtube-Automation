import React from "react";
import * as K from "../../kit/props";
import { ListScene, QuoteScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, Asker, Bubble, Car, cue, Hero, para, pip, SectionTitle, sequence, T } from "./shared";

const c = cue.at;
const SIGNS = para("Sign one") - 0.3;

// The one sentence that gave the game away floats over to the buyer.
const Leak = (t: number, zoom: number) => {
  const say = c("needed the money by Friday");
  const k = ramp(t, say + 0.6, 1.4);
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={
        <>
          <S.StreetShell t={T} />
        </>
      }
      front={
        <>
          <Car x={960} />
          {pip(t, 420, [[0, poses.point], [c("time was on his side"), poses.slump]], t < c("time was on his side") ? "open" : "sad")}
          <Asker t={t} x={1560} pose={t > c("time was on his side") ? poses.cheer : poses.idle} />
          <K.At x={mix(600, 1480, k)} y={mix(300, 290, k) - Math.sin(Math.PI * k) * 120} s={pop(t, say)}>
            <Bubble text="Need it by Friday" w={440} fill={T.accent} />
          </K.At>
          <K.At x={960} y={150} s={pop(t, c("Every extra sentence"))}>
            <K.Pill t={T} text="Every sentence is information" w={840} fill={T.line} />
          </K.At>
          <K.At x={900} y={260} s={pop(t, c("time was on his side"))}>
            <K.Pill t={T} text="Time is on his side" w={560} fill={T.accent2} />
          </K.At>
        </>
      }
    />
  );
};

// A long ramble vs a few heavy words.
const Weight = (t: number, zoom: number) => {
  const few = para("People who speak less");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, poses.point], [few, poses.idle]], "smile")}
          <K.At x={850} y={330} s={pop(t, c("over-explains"))} r={-2}>
            <K.Panel t={T} w={560} h={360} />
            <K.Txt y={-110} size={42} weight={700} fill={T.accent}>
              OVER-EXPLAINING
            </K.Txt>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={-220} y={-60 + i * 50} width={[440, 400, 430, 380, 300][i]} height={24} rx={12} fill={T.line} opacity={0.25} />
            ))}
          </K.At>
          <K.At x={850} y={640} s={pop(t, c("don't quite believe"))}>
            <K.Pill t={T} text="Sounds unsure" w={440} fill={T.accent} />
          </K.At>
          <K.At x={1480} y={330} s={pop(t, few)} r={2}>
            <K.Panel t={T} w={480} h={360} />
            <K.Txt y={-110} size={42} weight={700} fill={T.accent2}>
              FEW WORDS
            </K.Txt>
            <rect x={-120} y={10} width={240} height={34} rx={17} fill={T.line} opacity={0.6} />
          </K.At>
          <K.At x={1480} y={640} s={pop(t, c("carry more weight"))}>
            <K.Pill t={T} text="More weight" w={400} fill={T.accent2} />
          </K.At>
        </>
      }
    />
  );
};

const signs = (t: number, zoom: number, hero: React.ReactNode) => (
  <ListScene
    theme={T}
    t={t}
    zoom={zoom}
    at={SIGNS}
    title="3 SIGNS"
    hero={hero}
    rows={[
      { text: "Silence right after your offer", at: c("Sign one") },
      { text: "Short question, then nothing", at: c("Sign two") },
      { text: "You make every move", at: c("Sign three") },
    ]}
  />
);

export const spotScenes = sequence(
  [
    {
      at: para("There's an old idea") - 0.3,
      render: (t, zoom) => <SectionTitle t={t} zoom={zoom} at={para("There's an old idea") - 0.3} n={2} lines={["Say more,", "give more away"]} />,
    },
    { at: para("Every extra sentence") - 0.3, render: Leak },
    { at: para("And every extra") - 0.3, render: Weight },
    {
      at: para("Silence is not always") - 0.3,
      render: (t, zoom) => <SectionTitle t={t} zoom={zoom} at={para("Silence is not always") - 0.3} n={3} lines={["How to", "spot it"]} />,
    },
    { at: SIGNS, render: (t, z) => signs(t, z, pip(t, 250, [[0, aim]], "smile")) },
    { at: para("Sign three") - 0.3, render: (t, z) => signs(t, z, <Hero t={t} x={250} pose={poses.think} expression="wonder" />) },
    {
      at: para("When you see these") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("When you see these") - 0.3}
          tag="REMEMBER"
          hero={pip(t, 260, [[0, poses.point]], "smile")}
          size={64}
          lines={[
            { text: "Not a villain.", at: c("is a villain") },
            { text: "You're bargaining with yourself.", at: c("negotiating against yourself"), accent: true },
          ]}
        />
      ),
    },
  ],
  para("So how do you stay") - 0.3
);
