import React from "react";
import * as K from "../../kit/props";
import { Stage } from "../../kit/Stage";
import { Stickman, poses } from "../../Stickman";
import { Bubble, T } from "./shared";

// Speaks to the viewer: you talk too much, and it costs you money.
export const V05Thumb: React.FC = () => (
  <Stage
    theme={T}
    back={
      <>
        <rect x={-60} y={-60} width={2040} height={1200} fill="url(#wall)" />
        <circle cx={1450} cy={620} r={560} fill={T.accent2} />
      </>
    }
    front={
      <>
        <K.Txt x={70} y={300} size={250} weight={700} fill={T.line} anchor="start">
          YOU
        </K.Txt>
        <K.Txt x={70} y={540} size={250} weight={700} fill={T.line} anchor="start">
          TALK
        </K.Txt>
        <K.Txt x={70} y={800} size={210} weight={700} fill={T.accent} anchor="start">
          TOO MUCH.
        </K.Txt>
        <Stickman theme={T} outfit="scarf" x={1430} floorY={1160} scale={1.7} pose={{ ...poses.wave, headTilt: -6 }} expression="open" />
        <K.At x={1620} y={220} s={1.2} r={-4}>
          <Bubble text="blah blah blah" w={420} size={48} />
        </K.At>
        <K.At x={1690} y={700} s={0.95} r={-14}>
          <K.WingedMoney t={T} flap={10} text="$500" />
        </K.At>
      </>
    }
  />
);
