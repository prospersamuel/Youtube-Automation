import React from "react";
import * as K from "../../kit/props";
import { QuoteScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, cue, House, para, pip, sequence, T } from "./shared";
import { SectionTitle } from "./shared";

const c = cue.at;

const LineUp = (t: number, zoom: number) => {
  const items: [string, string][] = [
    ["WORDS", "our words"],
    ["BELIEFS", "our beliefs"],
    ["ACTIONS", "our actions"],
  ];
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, aim]], "smile")}
          {items.map(([label, phrase], i) => (
            <K.At key={label} x={720 + i * 420} y={420} s={pop(t, c(phrase))}>
              <K.Box t={T} text={label} w={340} fill={i === 1 ? T.accent2 : undefined} />
            </K.At>
          ))}
          {[0, 1].map((i) => (
            <K.At key={i} x={720 + i * 420 + 180} y={420}>
              <K.Txt y={22} size={80} weight={700} fill={T.line} opacity={ramp(t, c("line up"), 0.3)}>
                =
              </K.Txt>
            </K.At>
          ))}
          <K.At x={1140} y={760} s={pop(t, c("look unreliable"))}>
            <K.Pill t={T} text="Contradicting yourself feels bad" w={860} fill={T.accent} />
          </K.At>
        </>
      }
    />
  );
};

// Two streets, side by side: the big sign alone, and the big sign after a tiny sticker.
const Experiment = (t: number, zoom: number) => {
  const bigA = c("huge, ugly sign");
  const sticker = c("tiny postcard-sized");
  const bigB = c("Two weeks later");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={
        <>
          <rect x={-60} y={-60} width={S.W + 120} height={S.H + 120} fill="url(#wall)" />
          <rect x={-60} y={760} width={S.W + 120} height={S.H} fill={T.floor} />
          <path d={`M-60 760 H${S.W + 60}`} stroke={T.line} strokeWidth={7} />
          <path d={`M${S.W / 2} 40 V760`} stroke={T.line} strokeWidth={6} strokeDasharray="24 18" opacity={0.4} />
        </>
      }
      front={
        <>
          <K.At x={480} y={70} s={pop(t, para("Researchers went") - 0.2)}>
            <K.Pill t={T} text="Street A" w={300} />
          </K.At>
          <K.At x={1440} y={70} s={pop(t, para("Then they tried") - 0.2)}>
            <K.Pill t={T} text="Street B" w={300} />
          </K.At>
          <g opacity={ramp(t, para("Researchers went") - 0.2, 0.4)}>
            <House x={480} y={480} sign={pop(t, bigA)} />
          </g>
          <g opacity={ramp(t, para("Then they tried") - 0.2, 0.4)}>
            <House x={1440} y={480} sticker={pop(t, sticker)} sign={pop(t, bigB)} />
          </g>
          <K.At x={480} y={850} s={pop(t, c("one person in six"))}>
            <K.Pill t={T} text="1 in 6 said yes" w={480} fill={T.accent} />
          </K.At>
          <K.At x={1440} y={850} s={pop(t, c("three out of four"))}>
            <K.Pill t={T} text="3 in 4 said yes" w={480} fill={T.accent2} />
          </K.At>
          <K.At x={960} y={180} s={pop(t, c("The only difference"))}>
            <K.Pill t={T} text="Only difference: a small yes first" w={1000} fill={T.line} />
          </K.At>
        </>
      }
    />
  );
};

export const consistencyScenes = sequence(
  [
    { at: para("Human beings") - 0.3, render: LineUp },
    {
      at: para("For most of life") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("For most of life") - 0.3}
          tag="USUALLY USEFUL"
          hero={pip(t, 260, [[0, poses.pump]], "open")}
          lines={[
            { text: "No flip-flopping", at: c("changing your mind every") },
            { text: "You're trustworthy", at: c("trustworthy"), accent: true },
          ]}
        />
      ),
    },
    {
      at: para("But it also gives") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("But it also gives") - 0.3}
          tag="THE SHORTCUT"
          hero={pip(t, 260, [[0, poses.think]], "wonder")}
          lines={[
            { text: "Don't think it over.", at: c("Instead of thinking") },
            { text: "Repeat last time.", at: c("what you did last time"), accent: true },
          ]}
        />
      ),
    },
    {
      at: para("Which means") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("Which means") - 0.3}
          tag="SO..."
          hero={pip(t, 260, [[0, aim]], "smile")}
          lines={[
            { text: "One small yes", at: c("one small yes") },
            { text: "= a head start on the next", at: c("head start"), accent: true },
          ]}
          size={66}
        />
      ),
    },
    {
      at: para("There's a famous") - 0.3,
      render: (t, zoom) => <SectionTitle t={t} zoom={zoom} at={para("There's a famous") - 0.3} n={2} lines={["The ladder"]} />,
    },
    { at: para("Researchers went") - 0.3, render: Experiment },
    {
      at: para("That's the ladder") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("That's the ladder") - 0.3}
          tag="THE LADDER"
          hero={pip(t, 260, [[0, poses.point]], "smile")}
          lines={[
            { text: "Never all at once.", at: c("Nobody asks you") },
            { text: "One low step at a time.", at: c("one low step"), accent: true },
          ]}
        />
      ),
    },
    {
      at: para("So why does a tiny") - 0.3,
      render: (t, zoom) => <SectionTitle t={t} zoom={zoom} at={para("So why does a tiny") - 0.3} n={3} lines={["Why small yeses", "stick"]} />,
    },
  ],
  para("Because of what") - 0.3
);
