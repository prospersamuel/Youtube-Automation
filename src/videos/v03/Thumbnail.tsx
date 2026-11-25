import React from "react";
import * as K from "../../kit/props";
import { Stage } from "../../kit/Stage";
import { Stickman, poses } from "../../Stickman";
import { Clipboard, T } from "./shared";

export const V03Thumb: React.FC = () => (
  <Stage
    theme={T}
    back={
      <>
        <rect x={-60} y={-60} width={2040} height={1200} fill="url(#wall)" />
        <circle cx={1360} cy={600} r={540} fill={T.accent2} />
      </>
    }
    front={
      <>
        {["YOU SAID", "YES.", "YOU MEANT", "NO."].map((word, i) => (
          <K.Txt key={word} x={70} y={215 + i * 200} size={i % 2 ? 210 : 150} weight={700} fill={i === 3 ? T.accent : T.line} anchor="start">
            {word}
          </K.Txt>
        ))}
        <Stickman theme={T} outfit="scarf" x={1180} floorY={1160} scale={1.75} pose={{ ...poses.slump, headTilt: 6 }} expression="sad" />
        <K.At x={1610} y={520} s={1.6} r={8}>
          <Clipboard signed={1} />
        </K.At>
      </>
    }
  />
);
