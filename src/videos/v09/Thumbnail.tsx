import React from "react";
import * as K from "../../kit/props";
import { Stage } from "../../kit/Stage";
import { Stickman, poses } from "../../Stickman";
import { T } from "./shared";

// Viewer stake: you stop right before the payoff.
export const V09Thumb: React.FC = () => {
  const pts = Array.from({ length: 31 }, (_, i) => {
    const u = i / 30;
    const y = u < 0.65 ? 0.03 * u : 0.03 * 0.65 + Math.pow((u - 0.65) / 0.35, 2.2) * 0.97;
    return `${1000 + u * 820} ${980 - y * 760}`;
  });
  return (
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
          <K.Txt x={70} y={300} size={210} weight={700} fill={T.line} anchor="start">
            YOU QUIT
          </K.Txt>
          <K.Txt x={70} y={540} size={210} weight={700} fill={T.line} anchor="start">
            TOO
          </K.Txt>
          <K.Txt x={70} y={780} size={210} weight={700} fill={T.accent} anchor="start">
            EARLY.
          </K.Txt>
          <path d={"M" + pts.join(" L")} stroke={T.accent} strokeWidth={22} fill="none" strokeLinecap="round" />
          <circle cx={1820} cy={220} r={40} fill="#F2B84B" stroke={T.line} strokeWidth={8} />
          <Stickman theme={T} outfit="scarf" x={1330} floorY={980} scale={1.15} facing={-1} pose={poses.walk} expression="sad" />
        </>
      }
    />
  );
};
