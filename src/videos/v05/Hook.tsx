import React from "react";
import * as K from "../../kit/props";
import { QuoteScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, Asker, Bubble, Car, cue, para, pip, SectionTitle, sequence, T, WHITE } from "./shared";

const c = cue.at;

const Street = () => (
  <>
    <S.StreetShell t={T} />
    <S.StreetLamp t={T} x={1780} />
  </>
);

// Pip keeps talking; the buyer says nothing; the price drops.
const Sale = (t: number, zoom: number) => {
  const talk = para("So Pip fills");
  const drop = c("knock off five hundred");
  const items: [string, string][] = [
    ["New tyres!", "the new tyres"],
    ["A small scratch...", "the small scratch"],
    ["Need it by Friday", "by Friday"],
    ["-$500?", "knock off five hundred"],
  ];
  const shown = items.filter(([, p]) => t >= c(p)).length;
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<Street />}
      front={
        <>
          <Car x={960} />
          {pip(t, 420, [[0, poses.wave], [talk, poses.point], [drop, poses.slump]], t < drop ? "open" : "sad")}
          <Asker t={t} x={1560} pose={poses.idle} />
          <K.At x={960} y={mix(-120, 560, pop(t, c("four thousand")))} r={-3}>
            <rect x={-200} y={-60} width={400} height={120} rx={20} fill={t >= drop ? T.accent : T.accent2} stroke={T.line} strokeWidth={8} />
            <K.Txt y={24} size={70} weight={700} fill={WHITE}>
              {t >= drop ? "$3,500" : "$4,000"}
            </K.Txt>
          </K.At>
          {items.slice(0, shown).map(([text], i) => {
            const k = pop(t, c(items[i][1]));
            const age = shown - 1 - i;
            if (age > 1) return null;
            const y = 300 - age * 115;
            return (
              <K.At key={text} x={600} y={y} s={k} o={age === 0 ? 1 : 0.5}>
                <Bubble text={text} w={420} fill={i === 3 ? T.accent : undefined} />
              </K.At>
            );
          })}
          <K.At x={1520} y={300} s={pop(t, c("says almost nothing"))} o={0.9}>
            <Bubble text="..." w={160} flip />
          </K.At>
          <K.At x={1200} y={120} s={pop(t, c("never asked"))}>
            <K.Pill t={T} text="He never asked" w={460} fill={T.line} />
          </K.At>
        </>
      }
    />
  );
};

const Gap = (t: number, zoom: number) => {
  const fills: [string, string][] = [
    ["Doubts", "doubts"],
    ["Extra details", "extra details"],
    ["Apologies", "apologies"],
    ["Unplanned offers", "offers we never planned"],
  ];
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, poses.think], [c("we fill the gap"), poses.point]], "wonder")}
          <K.At x={1150} y={160} s={pop(t, para("Most people find") + 0.3)}>
            <K.Pill t={T} text="A few seconds of quiet" w={620} fill={T.line} />
          </K.At>
          <K.At x={1150} y={270} s={pop(t, c("feel like a minute"))}>
            <K.Pill t={T} text="feels like a minute" w={620} fill={T.accent} />
          </K.At>
          <g opacity={ramp(t, c("we fill the gap"), 0.4)}>
            <K.At x={1150} y={430}>
              <K.Txt size={50} weight={700} fill={T.line}>
                We fill it with:
              </K.Txt>
            </K.At>
          </g>
          {fills.map(([label, p], i) => (
            <K.At key={label} x={820 + (i % 2) * 660} y={560 + Math.floor(i / 2) * 200} s={pop(t, c(p))} r={[-2, 2, 1, -1][i]}>
              <K.Box t={T} text={label} w={560} fill={i === 3 ? T.accent : undefined} />
            </K.At>
          ))}
        </>
      }
    />
  );
};

export const hookScenes = sequence(
  [
    { at: 0, render: Sale },
    {
      at: para("In this video") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("In this video") - 0.3}
          tag="IN THIS VIDEO"
          hero={pip(t, 260, [[0, aim]], "smile")}
          lines={[
            { text: "Why silence works", at: c("why silence has") },
            { text: "How to spot it", at: c("how to spot when") },
            { text: "How to protect yourself", at: c("how to protect yourself"), accent: true },
          ]}
          size={66}
        />
      ),
    },
    {
      at: para("Here's what happened") - 0.3,
      render: (t, zoom) => <SectionTitle t={t} zoom={zoom} at={para("Here's what happened") - 0.3} n={1} lines={["Why silence", "works on us"]} />,
    },
    { at: para("Most people find") - 0.3, render: Gap },
    {
      at: para("The quiet person") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("The quiet person") - 0.3}
          tag="THE QUIET ONE"
          hero={pip(t, 260, [[0, poses.idle]], "smile")}
          lines={[
            { text: "They just wait.", at: c("They just have to wait") },
            { text: "You do the work.", at: c("does the work"), accent: true },
          ]}
        />
      ),
    },
  ],
  para("There's an old idea") - 0.3
);
