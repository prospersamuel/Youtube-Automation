import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Captions } from "../../kit/Captions";
import { Wipe } from "../../kit/Stage";
import { useT } from "../../kit/time";
import { hookScenes } from "./Hook";
import { T, timings, type SceneDef } from "./shared";
import { trapOneScenes } from "./TrapOne";
import { QUICK_TEST_END, quickTestScenes, trapThreeScenes } from "./TrapThree";
import { trapTwoScenes } from "./TrapTwo";

const scenes: SceneDef[] = [...hookScenes, ...trapOneScenes, ...trapTwoScenes, ...trapThreeScenes, ...quickTestScenes];

// Grows as sections are built; the finished video runs to the end of the narration.
export const V01_END = QUICK_TEST_END;

export const V01: React.FC = () => {
  const t = useT();
  let current = scenes[0];
  for (const scene of scenes) if (t >= scene.at) current = scene;
  return (
    <AbsoluteFill style={{ background: T.wall2 }}>
      <Audio src={staticFile("v01/narration.mp3")} />
      <current.C t={t} />
      {scenes.slice(1).map((s) => (
        <Wipe key={s.at} t={t} at={s.at} theme={T} />
      ))}
      <Captions timings={timings} theme={T} />
    </AbsoluteFill>
  );
};
