import React from "react";
import { CashStack } from "../../kit/common";
import * as K from "../../kit/props";
import { Stage } from "../../kit/Stage";
import { Stickman, poses } from "../../Stickman";
import { T } from "./shared";

// Viewer stake: you think more money will fix it. It won't.
export const V06Thumb: React.FC = () => (
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
        <K.Txt x={70} y={300} size={165} weight={700} fill={T.line} anchor="start">
          MORE MONEY
        </K.Txt>
        <K.Txt x={70} y={540} size={165} weight={700} fill={T.line} anchor="start">
          WON'T
        </K.Txt>
        <K.Txt x={70} y={780} size={165} weight={700} fill={T.accent} anchor="start">
          FIX IT.
        </K.Txt>
        <CashStack theme={T} x={1600} y={1030} n={6} />
        <Stickman theme={T} outfit="scarf" x={1600} floorY={700} scale={1.15} pose={{ ...poses.slump, headTilt: 14 }} expression="sad" />
      </>
    }
  />
);
