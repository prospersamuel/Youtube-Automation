import React from "react";
import { CashStack } from "../../kit/common";
import * as K from "../../kit/props";
import { Stage } from "../../kit/Stage";
import { Stickman, poses } from "../../Stickman";
import { T } from "./shared";

// Viewer stake: you can earn less and still end up with more.
export const V08Thumb: React.FC = () => (
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
        <K.Txt x={70} y={330} size={180} weight={700} fill={T.line} anchor="start">
          EARN LESS.
        </K.Txt>
        <K.Txt x={70} y={600} size={180} weight={700} fill={T.accent} anchor="start">
          HAVE MORE.
        </K.Txt>
        <Stickman theme={T} outfit="scarf" x={1420} floorY={1160} scale={1.5} pose={{ ...poses.point, armF: [100, 120] }} expression="open" />
        <CashStack theme={T} x={1740} y={1030} n={11} w={260} />
      </>
    }
  />
);
