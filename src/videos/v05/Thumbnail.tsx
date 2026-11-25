import React from "react";
import * as K from "../../kit/props";
import { Stage } from "../../kit/Stage";
import { Stickman, poses } from "../../Stickman";
import { Bubble, T } from "./shared";

export const V05Thumb: React.FC = () => (
  <Stage
    theme={T}
    back={
      <>
        <rect x={-60} y={-60} width={2040} height={1200} fill="url(#wall)" />
        <circle cx={1450} cy={600} r={560} fill={T.accent2} />
      </>
    }
    front={
      <>
        <K.Txt x={70} y={290} size={220} weight={700} fill={T.line} anchor="start">
          SILENCE
        </K.Txt>
        <K.Txt x={70} y={520} size={170} weight={700} fill={T.line} anchor="start">
          COST HIM
        </K.Txt>
        <K.Txt x={70} y={770} size={260} weight={700} fill={T.accent} anchor="start">
          $500.
        </K.Txt>
        <Stickman theme={T} outfit="scarf" x={1430} floorY={1160} scale={1.75} pose={{ ...poses.slump, headTilt: 10 }} expression="sad" />
        <K.At x={1700} y={250} s={1.6}>
          <Bubble text="..." w={240} size={90} flip />
        </K.At>
      </>
    }
  />
);
