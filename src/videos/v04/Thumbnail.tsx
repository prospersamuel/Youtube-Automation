import React from "react";
import * as K from "../../kit/props";
import { Stage } from "../../kit/Stage";
import { Stickman, poses } from "../../Stickman";
import { T } from "./shared";

export const V04Thumb: React.FC = () => (
  <Stage
    theme={T}
    back={
      <>
        <rect x={-60} y={-60} width={2040} height={1200} fill="url(#wall)" />
        <circle cx={1380} cy={600} r={540} fill={T.accent2} />
      </>
    }
    front={
      <>
        <K.Txt x={70} y={250} size={170} weight={700} fill={T.line} anchor="start">
          $20: EMPTY
        </K.Txt>
        <K.Txt x={70} y={450} size={170} weight={700} fill={T.accent} anchor="start">
          $60: FULL
        </K.Txt>
        <K.Txt x={70} y={640} size={110} weight={700} fill={T.line} anchor="start">
          Same tutor.
        </K.Txt>
        <K.Txt x={70} y={780} size={110} weight={700} fill={T.line} anchor="start">
          Better offer.
        </K.Txt>
        <Stickman theme={T} outfit="scarf" x={1450} floorY={1160} scale={1.75} pose={{ ...poses.cheer, headTilt: -8 }} expression="open" />
      </>
    }
  />
);
