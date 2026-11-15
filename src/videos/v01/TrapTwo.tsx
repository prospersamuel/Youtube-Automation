import React from "react";
import { Easing } from "remotion";
import { alive, blinkAt, poseAt } from "../../kit/pose";
import * as K from "../../kit/props";
import { CardRowScene, QuoteScene, TitleScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { Stickman, poses } from "../../Stickman";
import { cue, para, pip, sequence, T } from "./shared";
import { Street, Tag, TRAP_ONE_END } from "./TrapOne";

const c = cue.at;
const WHITE = "#FFFDF8";
const VALET = { ...T, accent: T.accent2, accent2: T.accent };

export const TRAP_TWO_END = cue.end("from their phones") + 0.4;

export const PhonePerson: React.FC<{ t: number; x: number; seed: number; facing?: 1 | -1; scale?: number }> = ({ t, x, seed, facing = 1, scale = 0.9 }) => (
  <Stickman
    theme={T}
    outfit="plain"
    x={x}
    floorY={S.FLOOR}
    scale={scale}
    facing={facing}
    pose={alive(poses.phone, t, seed)}
    expression="smile"
    blink={blinkAt(t, seed)}
    inHand={<K.HandPhone t={T} />}
  />
);

const Show = (t: number, zoom: number) => {
  const lights = c("It was for the audience");
  const on = ramp(t, lights, 0.25);
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={
        <>
          <rect x={-60} y={-60} width={S.W + 120} height={S.H + 120} fill="url(#wall)" />
          <rect x={-60} y={800} width={S.W + 120} height={S.H} fill={T.floor} />
          <path d={`M-60 800 H${S.W + 60}`} stroke={T.line} strokeWidth={7} />
          <path d="M960 -60 L560 830 H1360 Z" fill={WHITE} opacity={0.5 * on} />
          <ellipse cx={960} cy={830} rx={400} ry={46} fill={WHITE} opacity={0.6 * on} />
          {[-60, 1700].map((x) => (
            <g key={x}>
              <rect x={x} y={-60} width={280} height={890} fill={T.accent} stroke={T.line} strokeWidth={8} />
              {[70, 140, 210].map((dx) => (
                <path key={dx} d={`M${x + dx} -60 V826`} stroke={T.line} strokeWidth={5} opacity={0.3} />
              ))}
            </g>
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i} cx={80 + i * 160} cy={92} r={46} fill={T.accent} stroke={T.line} strokeWidth={8} />
          ))}
          <rect x={-60} y={-60} width={S.W + 120} height={150} fill={T.accent} />
        </>
      }
      front={
        <>
          {pip(t, 960, [[0, poses.idle], [lights, poses.cheer]], t < lights ? "wonder" : "open", { floorY: 820 })}
          {Array.from({ length: 9 }, (_, i) => (
            <K.At key={i} x={110 + i * 212} y={mix(1140, 965 + (i % 2) * 22, pop(t, lights + 0.1 + i * 0.05))}>
              <circle r={58} fill={T.line} />
            </K.At>
          ))}
        </>
      }
    />
  );
};

const Valet = (t: number, zoom: number) => {
  const first = c("pull up");
  const second = c("Lamborghinis");
  const strange = c("he noticed something strange");
  const never = c("he almost never thought");
  const thought = c("He thought");
  const road = S.FLOOR + 36;
  const in1 = pop(t, first, 0.6);
  const out1 = ramp(t, second + 0.1, 0.8, Easing.in(Easing.cubic));
  const in2 = pop(t, second + 0.7, 0.6);
  const pose = poseAt(t, [
    [0, poses.idle],
    [strange, poses.think],
  ]);
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={
        <>
          <Street />
          <rect x={720} y={372} width={220} height={84} rx={12} fill={T.accent} stroke={T.line} strokeWidth={7} />
          <K.Txt x={830} y={432} size={54} weight={700} fill={WHITE} spacing={4}>
            HOTEL
          </K.Txt>
          <rect x={770} y={690} width={120} height={190} rx={8} fill={T.accent2} stroke={T.line} strokeWidth={7} />
        </>
      }
      front={
        <>
          <Stickman theme={VALET} outfit="beanie" x={520} floorY={S.FLOOR} pose={alive(pose, t)} expression={t < thought ? "smile" : "wonder"} blink={blinkAt(t)} />
          <K.At x={mix(mix(2700, 1280, in1), -700, out1)} y={road} s={t > first ? 1 : 0}>
            <K.Car t={T} sleek spin={-(in1 + out1) * 900} />
          </K.At>
          <K.At x={mix(2700, 1280, in2)} y={road} s={t > second + 0.7 ? 1 : 0}>
            <K.Car t={T} sleek fill="#F2B84B" spin={-in2 * 900} />
          </K.At>
          <K.At x={910} y={230} s={pop(t, never + 0.2) * (1 - ramp(t, thought, 0.2))}>
            <K.ThoughtCloud t={T} w={600} h={210}>
              <K.Txt y={-14} size={48} weight={700} fill={T.line}>
                Wow, that driver
              </K.Txt>
              <K.Txt y={50} size={48} weight={700} fill={T.line}>
                is impressive.
              </K.Txt>
              <g transform="scale(1.7 0.8)">
                <K.CrossOut t={T} k={ramp(t, thought - 0.55, 0.3)} />
              </g>
            </K.ThoughtCloud>
          </K.At>
          <K.At x={920} y={220} s={pop(t, thought + 0.3)}>
            <K.ThoughtCloud t={T} w={640} h={270}>
              <K.Txt y={-50} size={48} weight={700} fill={T.line}>
                If I had that car,
              </K.Txt>
              <K.Txt y={12} size={48} weight={700} fill={T.line}>
                people would think
              </K.Txt>
              <K.Txt y={76} size={52} weight={700} fill={T.accent}>
                I'm impressive.
              </K.Txt>
            </K.ThoughtCloud>
          </K.At>
        </>
      }
    />
  );
};

const Phones = (t: number, zoom: number) => {
  const start = para("Pip is spending");
  const never = c("never looked up");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<Street />}
      front={
        <>
          <K.At x={1270} y={S.FLOOR + 36}>
            <K.Car t={T} sleek />
          </K.At>
          <PhonePerson t={t} x={240} seed={3} />
          <PhonePerson t={t} x={520} seed={8} facing={-1} />
          <PhonePerson t={t} x={1720} seed={5} facing={-1} />
          {pip(t, 900, [[0, poses.pump], [never + 0.6, poses.slump]], t < never + 0.6 ? "open" : "sad")}
          <Tag t={t} at={start + 1} x={1270} y={110} amount="$350" note="every month" />
        </>
      }
    />
  );
};

export const trapTwoScenes = sequence(
  [
    { at: TRAP_ONE_END, render: (t, zoom) => <TitleScene theme={T} t={t} zoom={zoom} at={TRAP_ONE_END} n={2} lines={["The show"]} /> },
    {
      at: c("His old apartment kept") - 0.3,
      render: (t, zoom) => (
        <CardRowScene
          theme={T}
          t={t}
          zoom={zoom}
          hero={pip(t, 430, [[0, poses.think]], "wonder")}
          cards={[
            { icon: "house", label: "Kept him dry", at: c("His old apartment kept"), check: c("kept the rain out") + 0.5 },
            { icon: "oldcar", label: "Got him there", at: c("His old car got"), check: c("got him to work") + 0.5 },
          ]}
        />
      ),
    },
    { at: para("Be honest") - 0.3, render: Show },
    { at: para("A writer who once") - 0.3, render: Valet },
    {
      at: para("Think about what that means") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("Think about what that means") - 0.3}
          size={66}
          hero={pip(t, 280, [[0, poses.think]], "wonder")}
          lines={[
            { text: "Nobody is admiring the driver.", at: c("Nobody is admiring") },
            { text: "They're imagining themselves", at: c("They're imagining"), accent: true },
            { text: "in the seat.", at: c("They're imagining") + 0.6, accent: true },
          ]}
        />
      ),
    },
    {
      at: para("So the things we buy") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("So the things we buy") - 0.3}
          tag="THE DEAL"
          hero={pip(t, 280, [[0, poses.idle], [c("it never arrives"), poses.slump]], t < c("it never arrives") ? "wonder" : "sad")}
          lines={[
            { text: "Buying respect barely works.", at: c("barely work") - 0.6 },
            { text: "You pay: full price.", at: c("You pay full price") },
            { text: "You get: nothing.", at: c("it never arrives"), accent: true },
          ]}
        />
      ),
    },
    { at: para("Pip is spending") - 0.3, render: Phones },
  ],
  TRAP_TWO_END
);
