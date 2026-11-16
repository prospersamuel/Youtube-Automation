import React from "react";
import { Composition, Still } from "remotion";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import { FPS } from "./kit/time";
import { V01, V01_END } from "./videos/v01";
import { V01Thumb } from "./videos/v01/Thumbnail";

export const Root: React.FC = () => (
  <>
    <Composition id="V01" component={V01} durationInFrames={Math.round(V01_END * FPS)} fps={FPS} width={1920} height={1080} />
    <Still id="V01Thumb" component={V01Thumb} width={1920} height={1080} />
  </>
);
