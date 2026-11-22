import React from "react";
import { Easing } from "remotion";
import timingsJson from "../../../videos/03-why-you-say-yes/timings.json";
import { makeCues, type Timings } from "../../kit/cues";
import { alive, blinkAt, poseAt } from "../../kit/pose";
import * as K from "../../kit/props";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { Stickman, poses, type Expression, type Pose } from "../../Stickman";
import { paper } from "../../theme";

export const T = paper;
export const timings = timingsJson as Timings;
export const cue = makeCues(timings);

export type SceneDef = { at: number; C: React.FC<{ t: number }> };

// A slow push-in over the life of a scene.
export const drift = (t: number, from: number, to: number) => 1 + 0.025 * ramp(t, from, to - from, Easing.linear);

export const Hero: React.FC<Omit<React.ComponentProps<typeof Stickman>, "theme" | "outfit" | "floorY"> & { floorY?: number; t: number }> = ({
  t,
  floorY = S.FLOOR,
  ...rest
}) => <Stickman theme={T} outfit="scarf" floorY={floorY} blink={blinkAt(t)} {...rest} />;

export const para = (prefix: string) => {
  const found = timings.paragraphs.find((p) => p.text.startsWith(prefix));
  if (!found) throw new Error(`Paragraph not found in narration: "${prefix}"`);
  return found.start;
};

// Turns an ordered list of scene starts into scene definitions; each scene gets its slow zoom for free.
export const sequence = (items: { at: number; render: (t: number, zoom: number) => React.ReactElement }[], end: number): SceneDef[] =>
  items.map((item, i) => {
    const to = items[i + 1]?.at ?? end;
    const C: React.FC<{ t: number }> = ({ t }) => item.render(t, drift(t, item.at, to));
    return { at: item.at, C };
  });

export const pip = (
  t: number,
  x: number,
  keys: [number, Pose][],
  expression: Expression = "smile",
  rest: Partial<React.ComponentProps<typeof Hero>> = {}
) => <Hero t={t} x={x} pose={alive(poseAt(t, keys), t)} expression={expression} {...rest} />;

export const aim: Pose = { ...poses.point, armF: [100, 120] };

export const stride = (phase: number, lean = 12, swing = 42): Pose => {
  const a = Math.sin(phase);
  return {
    lean,
    headTilt: -6,
    armF: [-swing * a, -swing * a + 70],
    armB: [swing * a, swing * a + 70],
    legF: [swing * a, swing * a - 46 * Math.max(0, -Math.cos(phase))],
    legB: [-swing * a, -swing * a - 46 * Math.max(0, Math.cos(phase))],
  };
};

export const WHITE = "#FFFDF8";

// The clipboard woman from the hook.
export const Asker: React.FC<{ t: number; x: number; pose?: Pose; facing?: 1 | -1 }> = ({ t, x, pose = poses.idle, facing = -1 }) => (
  <Stickman theme={T} outfit="hoodie" x={x} floorY={S.FLOOR} facing={facing} pose={alive(pose, t, 1.3)} expression="smile" blink={blinkAt(t, 0.9)} />
);

export const Clipboard: React.FC<{ signed?: number }> = ({ signed = 0 }) => (
  <g>
    <rect x={-80} y={-105} width={160} height={210} rx={14} fill="#C98B4E" stroke={T.line} strokeWidth={7} />
    <rect x={-62} y={-80} width={124} height={170} rx={6} fill={WHITE} stroke={T.line} strokeWidth={5} />
    <rect x={-34} y={-118} width={68} height={30} rx={8} fill="#9AA0A6" stroke={T.line} strokeWidth={6} />
    {[-50, -20, 10].map((y) => (
      <path key={y} d={`M-42 ${y} H42`} stroke={T.line} strokeWidth={5} opacity={0.3} />
    ))}
    <path d="M-40 55 q15 -25 25 0 t25 0 t25 -5" stroke={T.accent2} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray="120" strokeDashoffset={120 * (1 - signed)} />
  </g>
);

// A simple house front for the sign experiment.
export const House: React.FC<{ x: number; y: number; sticker?: number; sign?: number }> = ({ x, y, sticker = 0, sign = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-230 -20 L0 -200 L230 -20 Z" fill={T.accent} stroke={T.line} strokeWidth={8} strokeLinejoin="round" />
    <rect x={-200} y={-20} width={400} height={280} fill={T.surface} stroke={T.line} strokeWidth={8} />
    <rect x={-150} y={30} width={110} height={90} fill="#BFE3EA" stroke={T.line} strokeWidth={6} />
    <rect x={50} y={130} width={90} height={130} fill={T.accent2} stroke={T.line} strokeWidth={6} />
    {sticker > 0 && (
      <g transform={`translate(-95 75) scale(${sticker})`}>
        <rect x={-30} y={-20} width={60} height={40} rx={6} fill="#F2B84B" stroke={T.line} strokeWidth={4} />
      </g>
    )}
    {sign > 0 && (
      <g transform={`translate(0 150) scale(${sign})`}>
        <path d="M-30 60 V180 M30 60 V180" stroke={T.line} strokeWidth={10} />
        <rect x={-260} y={-150} width={520} height={220} rx={10} fill={WHITE} stroke={T.line} strokeWidth={9} />
        <text x={0} y={-60} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={64} fill={T.accent}>
          DRIVE
        </text>
        <text x={0} y={20} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={64} fill={T.accent}>
          CAREFULLY
        </text>
      </g>
    )}
  </g>
);

// Section card: "PART n" pill drops in, then the section name.
export const SectionTitle: React.FC<{ t: number; zoom: number; at: number; n: number; lines: string[] }> = ({ t, zoom, at, n, lines }) => (
  <Stage
    theme={T}
    zoom={zoom}
    back={<S.RoomShell t={T} />}
    front={
      <>
        <K.At x={960} y={mix(-100, 300, pop(t, at + 0.2))} r={-3}>
          <K.Pill t={T} text={`PART ${n}`} w={360} size={56} fill={T.accent} />
        </K.At>
        {lines.map((line, i) => (
          <K.At key={line} x={960} y={500 + i * 140} s={pop(t, at + 0.45 + i * 0.12)}>
            <K.Txt size={120} weight={700} fill={T.line}>
              {line}
            </K.Txt>
          </K.At>
        ))}
      </>
    }
  />
);
