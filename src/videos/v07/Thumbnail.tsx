import React from "react";
import * as K from "../../kit/props";
import { Stage } from "../../kit/Stage";
import { Stickman, poses } from "../../Stickman";
import { T } from "./shared";

// Viewer stake: YOUR new-year goals will fail (missed target, unticked goal list, March on the calendar).
const Box: React.FC<{ y: number; label: string }> = ({ y, label }) => (
  <>
    <rect x={-150} y={y - 26} width={44} height={44} fill="none" stroke={T.line} strokeWidth={5} />
    <K.Txt x={-90} y={y + 12} size={40} weight={700} fill={T.line} anchor="start">
      {label}
    </K.Txt>
  </>
);

export const V07Thumb: React.FC = () => (
  <Stage
    theme={T}
    back={
      <>
        <rect x={-60} y={-60} width={2040} height={1200} fill="url(#wall)" />
        <circle cx={1450} cy={560} r={560} fill={T.accent2} />
      </>
    }
    front={
      <>
        <K.Txt x={70} y={300} size={190} weight={700} fill={T.line} anchor="start">
          YOUR
        </K.Txt>
        <K.Txt x={70} y={520} size={190} weight={700} fill={T.line} anchor="start">
          GOALS
        </K.Txt>
        <K.Txt x={70} y={760} size={190} weight={700} fill={T.accent} anchor="start">
          FAIL.
        </K.Txt>
        {/* target with arrows that missed */}
        <K.At x={1520} y={300} s={0.85}>
          {[230, 175, 120, 65].map((r, i) => (
            <circle key={r} r={r} fill={i % 2 ? WHITE_ : T.accent} stroke={T.line} strokeWidth={6} />
          ))}
          <circle r={22} fill={T.line} />
          {[
            [250, -150, 20],
            [-260, 120, -160],
            [210, 200, 35],
          ].map(([x, y, a], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
              <line x1={0} y1={0} x2={160} y2={0} stroke={T.line} strokeWidth={14} strokeLinecap="round" />
              <path d="M150 0 L185 -22 M150 0 L185 22" stroke={T.line} strokeWidth={12} strokeLinecap="round" />
            </g>
          ))}
        </K.At>
        {/* goal list sticky note, nothing ticked, peeling */}
        <K.At x={1700} y={760} r={10} s={1}>
          <rect x={-175} y={-150} width={350} height={320} fill="#F7D774" stroke={T.line} strokeWidth={6} />
          <K.Txt y={-90} size={46} weight={700} fill={T.accent}>
            MY GOALS
          </K.Txt>
          <Box y={-20} label="GET FIT" />
          <Box y={50} label="READ MORE" />
          <Box y={120} label="SAVE MORE" />
        </K.At>
        {/* calendar: MARCH */}
        <K.At x={880} y={860} r={-6}>
          <rect x={-110} y={-100} width={220} height={200} fill={WHITE_} stroke={T.line} strokeWidth={6} />
          <rect x={-110} y={-100} width={220} height={60} fill={T.accent} stroke={T.line} strokeWidth={6} />
          <K.Txt y={-55} size={40} weight={700} fill={WHITE_}>
            MARCH
          </K.Txt>
          <K.Txt y={60} size={100} weight={700} fill={T.line}>
            1
          </K.Txt>
        </K.At>
        <Stickman theme={T} outfit="scarf" x={1170} floorY={1160} scale={1.35} pose={poses.slump} expression="sad" />
      </>
    }
  />
);

const WHITE_ = "#FFFDF8";
