import React from "react";
import * as K from "../../kit/props";
import { Stage } from "../../kit/Stage";
import { Stickman, poses } from "../../Stickman";
import { T } from "./shared";

export const V01Thumb: React.FC = () => (
  <Stage
    theme={T}
    back={
      <>
        <rect x={-60} y={-60} width={2040} height={1200} fill="url(#wall)" />
        <circle cx={1330} cy={640} r={540} fill={T.accent2} />
      </>
    }
    front={
      <>
        {["GOOD", "SALARY.", "STILL", "BROKE."].map((word, i) => (
          <K.Txt key={word} x={70} y={215 + i * 178} size={190} weight={700} fill={i < 2 ? T.line : T.accent} anchor="start">
            {word}
          </K.Txt>
        ))}
        <K.At x={330} y={935} s={0.6} r={-5}>
          <K.PayCard t={T} amount={4000} />
        </K.At>
        <Stickman theme={T} outfit="scarf" x={1170} floorY={1160} scale={1.75} pose={{ ...poses.point, lean: -4, headTilt: 2, armF: [100, 120] }} expression="wonder" />
        <K.At x={1650} y={550} s={1.12} r={6}>
          <K.BigPhone t={T} time={0} balance="$11.00" />
        </K.At>
      </>
    }
  />
);
