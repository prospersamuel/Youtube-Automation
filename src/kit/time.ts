import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const FPS = 30;

export const useT = () => useCurrentFrame() / useVideoConfig().fps;

export const mix = (a: number, b: number, k: number) => a + (b - a) * k;

export const ramp = (t: number, start: number, dur: number, easing: (n: number) => number = Easing.out(Easing.cubic)) =>
  interpolate(t, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// 0 before `start`, then springs to 1 with a little overshoot.
export const pop = (t: number, start: number, bounce = 1) =>
  t <= start ? 0 : spring({ frame: (t - start) * FPS, fps: FPS, config: { damping: 12 / bounce, stiffness: 180, mass: 0.7 } });
