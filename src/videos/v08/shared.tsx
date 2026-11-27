import React from "react";
import { Easing } from "remotion";
import timingsJson from "../../../videos/08-saving-beats-salary/timings.json";
import { makeCues, type Timings } from "../../kit/cues";
import { alive, blinkAt, poseAt } from "../../kit/pose";
import { ramp } from "../../kit/time";
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
