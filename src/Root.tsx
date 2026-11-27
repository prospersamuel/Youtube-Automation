import React from "react";
import { Composition, Still } from "remotion";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import { FPS } from "./kit/time";
import { V01, V01_END } from "./videos/v01";
import { V01Thumb } from "./videos/v01/Thumbnail";
import { V02, V02_END } from "./videos/v02";
import { V02Thumb } from "./videos/v02/Thumbnail";
import { V03, V03_END } from "./videos/v03";
import { V03Thumb } from "./videos/v03/Thumbnail";
import { V04, V04_END } from "./videos/v04";
import { V04Thumb, V04ThumbB } from "./videos/v04/Thumbnail";
import { V05, V05_END } from "./videos/v05";
import { V05Thumb } from "./videos/v05/Thumbnail";
import { V06, V06_END } from "./videos/v06";
import { V06Thumb } from "./videos/v06/Thumbnail";
import { V07, V07_END } from "./videos/v07";
import { V07Thumb } from "./videos/v07/Thumbnail";

export const Root: React.FC = () => (
  <>
    <Composition id="V01" component={V01} durationInFrames={Math.round(V01_END * FPS)} fps={FPS} width={1920} height={1080} />
    <Composition id="V02" component={V02} durationInFrames={Math.round(V02_END * FPS)} fps={FPS} width={1920} height={1080} />
    <Still id="V01Thumb" component={V01Thumb} width={1920} height={1080} />
    <Still id="V02Thumb" component={V02Thumb} width={1920} height={1080} />
    <Composition id="V03" component={V03} durationInFrames={Math.round(V03_END * FPS)} fps={FPS} width={1920} height={1080} />
    <Still id="V03Thumb" component={V03Thumb} width={1920} height={1080} />
    <Composition id="V04" component={V04} durationInFrames={Math.round(V04_END * FPS)} fps={FPS} width={1920} height={1080} />
    <Still id="V04Thumb" component={V04Thumb} width={1920} height={1080} />
    <Still id="V04ThumbB" component={V04ThumbB} width={1920} height={1080} />
    <Composition id="V05" component={V05} durationInFrames={Math.round(V05_END * FPS)} fps={FPS} width={1920} height={1080} />
    <Still id="V05Thumb" component={V05Thumb} width={1920} height={1080} />
    <Composition id="V06" component={V06} durationInFrames={Math.round(V06_END * FPS)} fps={FPS} width={1920} height={1080} />
    <Still id="V06Thumb" component={V06Thumb} width={1920} height={1080} />
    <Composition id="V07" component={V07} durationInFrames={Math.round(V07_END * FPS)} fps={FPS} width={1920} height={1080} />
    <Still id="V07Thumb" component={V07Thumb} width={1920} height={1080} />
  </>
);
