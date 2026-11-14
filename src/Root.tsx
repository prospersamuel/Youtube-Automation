import React from "react";
import { AbsoluteFill, Composition, interpolate, useCurrentFrame } from "remotion";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import { FrameB } from "./StyleFrame";

const Smoke: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, 60], [1, 1.06])})` }}>
      <FrameB />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => <Composition id="Smoke" component={Smoke} durationInFrames={60} fps={30} width={1920} height={1080} />;
