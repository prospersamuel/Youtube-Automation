import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Captions } from "../../kit/Captions";
import { Wipe } from "../../kit/Stage";
import { useT } from "../../kit/time";
import { closeScenes, V05_END } from "./Close";
import { spotScenes } from "./Spot";
import { hookScenes } from "./Hook";

import { T, timings, type SceneDef } from "./shared";


const scenes: SceneDef[] = [...hookScenes, ...spotScenes, ...closeScenes];

export { V05_END };

export const V05: React.FC = () => {
  const t = useT();
  let current = scenes[0];
  for (const scene of scenes) if (t >= scene.at) current = scene;
  return (
    <AbsoluteFill style={{ background: T.wall2 }}>
      <Audio src={staticFile("v05/narration.mp3")} />
      <Audio src={staticFile("music/calm-pad.mp3")} />
      <current.C t={t} />
      {scenes.slice(1).map((s) => (
        <Wipe key={s.at} t={t} at={s.at} theme={T} />
      ))}
      <Captions timings={timings} theme={T} />
    </AbsoluteFill>
  );
};
