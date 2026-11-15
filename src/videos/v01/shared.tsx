import React from "react";
import { Easing } from "remotion";
import timingsJson from "../../../videos/01-broke-on-a-good-salary/timings.json";
import { makeCues, type Timings } from "../../kit/cues";
import { blinkAt } from "../../kit/pose";
import { ramp } from "../../kit/time";
import * as S from "../../scenery";
import { Stickman } from "../../Stickman";
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
