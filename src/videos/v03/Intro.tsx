import React from "react";
import * as K from "../../kit/props";
import { QuoteScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, Asker, Clipboard, cue, Hero, para, pip, sequence, T, WHITE } from "./shared";
import { SectionTitle } from "./shared";

const c = cue.at;

const Street = () => (
  <>
    <S.StreetShell t={T} />
    <S.StreetLamp t={T} x={1700} />
  </>
);

const Sign = (t: number, zoom: number) => (
  <Stage
    theme={T}
    zoom={zoom}
    back={<Street />}
    front={
      <>
        {pip(t, 620, [[0, poses.idle], [c("signed a clipboard"), poses.point]], "smile")}
        <Asker t={t} x={1180} pose={poses.read} />
        <K.At x={980} y={mix(420, 520, pop(t, c("signed a clipboard") - 0.3))} s={pop(t, c("signed a clipboard") - 0.3)} r={-6}>
          <Clipboard signed={ramp(t, c("ten seconds"), 1)} />
        </K.At>
        <K.At x={900} y={200} s={pop(t, c("ten seconds"))}>
          <K.Pill t={T} text="10 seconds" w={380} fill={T.accent2} />
        </K.At>
      </>
    }
  />
);

// Each ask is one step higher; Pip hops up as it is mentioned.
const Climb = (t: number, zoom: number) => {
  const labels = ["Signature", "Sticker", "$10", "Every Saturday"];
  const ats = [para("A week later") - 0.4, c("small sticker"), c("ten dollar donation"), c("volunteer organiser")];
  const tops = [800, 690, 580, 470];
  const xs = [520, 820, 1120, 1440];
  let idx = 0;
  ats.forEach((a, i) => {
    if (t >= a) idx = i;
  });
  const k = idx === 0 ? 1 : ramp(t, ats[idx], 0.9);
  const px = mix(xs[Math.max(0, idx - 1)], xs[idx], k);
  const py = mix(tops[Math.max(0, idx - 1)], tops[idx], k) - Math.sin(Math.PI * k) * 50;
  const sad = t > c("volunteer organiser");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {xs.map((x, i) => (
            <K.At key={i} x={x} y={tops[i]} s={pop(t, ats[i] - 0.3)}>
              <rect x={-150} y={0} width={300} height={1100} fill={i === 3 ? T.accent : T.surface} stroke={T.line} strokeWidth={8} />
              <K.Txt y={64} size={i === 3 ? 40 : 46} weight={700} fill={i === 3 ? WHITE : T.line}>
                {labels[i]}
              </K.Txt>
            </K.At>
          ))}
          <Hero t={t} x={px} floorY={py} pose={sad ? poses.slump : poses.idle} expression={sad ? "sad" : "smile"} scale={0.8} />
        </>
      }
    />
  );
};

export const introScenes = sequence(
  [
    { at: 0, render: Sign },
    { at: para("A week later") - 0.3, render: Climb },
    {
      at: para("How did a ten") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("How did a ten") - 0.3}
          tag="HOW?"
          hero={pip(t, 260, [[0, poses.think]], "wonder")}
          lines={[
            { text: "A 10-second signature", at: para("How did a ten") },
            { text: "became every Saturday.", at: c("every Saturday"), accent: true },
          ]}
        />
      ),
    },
    {
      at: para("Pip didn't lose") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("Pip didn't lose") - 0.3}
          tag="IN THIS VIDEO"
          hero={pip(t, 260, [[0, aim]], "smile")}
          lines={[
            { text: "How to spot it", at: c("how to spot it") },
            { text: "How to say no", at: c("how to say no"), accent: true },
          ]}
        />
      ),
    },
    {
      at: para("Here's what happened") - 0.3,
      render: (t, zoom) => <SectionTitle t={t} zoom={zoom} at={para("Here's what happened") - 0.3} n={1} lines={["The urge to", "be consistent"]} />,
    },
  ],
  para("Human beings") - 0.3
);
