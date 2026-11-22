import React from "react";
import * as K from "../../kit/props";
import { Stage } from "../../kit/Stage";
import { Stickman, poses } from "../../Stickman";
import { T } from "./shared";

export const V02Thumb: React.FC = () => (
  <Stage
    theme={T}
    back={
      <>
        <rect x={-60} y={-60} width={2040} height={1200} fill="url(#wall)" />
        <circle cx={1330} cy={600} r={540} fill={T.accent2} />
      </>
    }
    front={
      <>
        {["THE", "2-MINUTE", "RULE."].map((word, i) => (
          <K.Txt key={word} x={70} y={230 + i * 215} size={i === 1 ? 200 : 230} weight={700} fill={i === 2 ? T.accent : T.line} anchor="start">
            {word}
          </K.Txt>
        ))}
        <K.At x={1500} y={470} s={1.05} r={5}>
          <circle r={250} fill={T.surface} stroke={T.line} strokeWidth={14} />
          <path d="M0 0 L0 -230 A230 230 0 0 1 199 -115 Z" fill={T.accent} />
          <path d="M0 0 L199 -115" stroke={T.line} strokeWidth={14} strokeLinecap="round" />
          <circle r={18} fill={T.line} />
        </K.At>
        <Stickman theme={T} outfit="scarf" x={1060} floorY={1160} scale={1.75} pose={{ ...poses.point, lean: -4, headTilt: 2, armF: [100, 120] }} expression="open" />
      </>
    }
  />
);
