import React from "react";
import { Composition } from "remotion";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import { FPS } from "./kit/time";
import { HOOK_END, V01Hook } from "./videos/v01/Hook";

export const Root: React.FC = () => (
  <Composition id="V01Hook" component={V01Hook} durationInFrames={Math.round(HOOK_END * FPS)} fps={FPS} width={1920} height={1080} />
);
