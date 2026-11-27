import React from "react";
import { CashStack } from "../../kit/common";
import * as K from "../../kit/props";
import { Stage } from "../../kit/Stage";
import { Stickman, poses } from "../../Stickman";
import { T } from "./shared";

// Viewer stake: your goals are why you're stuck. Systems pay.
export const V07Thumb: React.FC = () => (
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
        <K.Txt x={70} y={290} size={200} weight={700} fill={T.line} anchor="start">
          STOP
        </K.Txt>
        <K.Txt x={70} y={520} size={200} weight={700} fill={T.line} anchor="start">
          SETTING
        </K.Txt>
        <K.Txt x={70} y={760} size={200} weight={700} fill={T.accent} anchor="start">
          GOALS.
        </K.Txt>
        <K.At x={1260} y={260} r={-8} s={1.3}>
          <rect x={-110} y={-80} width={220} height={160} fill="#F7D774" stroke={T.line} strokeWidth={6} />
          <K.Txt y={-12} size={44} weight={700} fill={T.line}>
            SAVE
          </K.Txt>
          <K.Txt y={40} size={44} weight={700} fill={T.line}>
            $5,000
          </K.Txt>
          <path d="M-120 -90 L120 90 M120 -90 L-120 90" stroke={T.accent} strokeWidth={18} strokeLinecap="round" />
        </K.At>
        <Stickman theme={T} outfit="scarf" x={1430} floorY={1160} scale={1.6} pose={{ ...poses.cheer, headTilt: -8 }} expression="open" />
        <CashStack theme={T} x={1740} y={1030} n={8} w={260} />
      </>
    }
  />
);
