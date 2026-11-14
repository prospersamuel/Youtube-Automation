import type { Pose } from "../Stickman";
import { mix, pop } from "./time";

const pair = (a: [number, number], b: [number, number], k: number): [number, number] => [mix(a[0], b[0], k), mix(a[1], b[1], k)];

export const mixPose = (a: Pose, b: Pose, k: number): Pose => ({
  lean: mix(a.lean, b.lean, k),
  headTilt: mix(a.headTilt, b.headTilt, k),
  armF: pair(a.armF, b.armF, k),
  armB: pair(a.armB, b.armB, k),
  legF: pair(a.legF, b.legF, k),
  legB: pair(a.legB, b.legB, k),
});

// Springs from one keyed pose to the next: [[time, pose], ...] in ascending time.
export const poseAt = (t: number, keys: [number, Pose][]): Pose => {
  let p = keys[0][1];
  for (const [at, next] of keys.slice(1)) {
    if (t <= at) break;
    p = mixPose(p, next, pop(t, at, 0.75));
  }
  return p;
};

// Small breathing and swaying so a held pose never looks frozen.
export const alive = (p: Pose, t: number, phase = 0, amount = 1): Pose => {
  const s = (speed: number, offset = 0) => Math.sin(t * speed + phase + offset) * amount;
  return {
    ...p,
    lean: p.lean + s(1.4) * 0.8,
    headTilt: p.headTilt + s(0.9, 1) * 1.6,
    armF: [p.armF[0] + s(1.7) * 2, p.armF[1] + s(1.7, 0.6) * 3],
    armB: [p.armB[0] + s(1.5, 2) * 2, p.armB[1] + s(1.5, 2.6) * 3],
  };
};

export const blinkAt = (t: number, phase = 0) => {
  const c = (t + phase) % 3.4;
  return c > 3.25 ? Math.sin(((c - 3.25) / 0.15) * Math.PI) : 0;
};
