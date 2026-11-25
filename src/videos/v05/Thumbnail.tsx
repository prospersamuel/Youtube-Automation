import React from "react";
import * as K from "../../kit/props";
import { Stage } from "../../kit/Stage";
import { Stickman, poses } from "../../Stickman";
import { T } from "./shared";

const GREEN = "#7CC47F";
const DARK = "#4E9A5A";

// One banknote, drawn around its centre.
const Bill: React.FC<{ w?: number }> = ({ w = 300 }) => (
  <g>
    <rect x={-w / 2} y={-34} width={w} height={68} rx={8} fill={GREEN} stroke={T.line} strokeWidth={6} />
    <rect x={-w / 2 + 16} y={-22} width={w - 32} height={44} rx={6} fill="none" stroke={DARK} strokeWidth={4} />
    <circle r={20} fill={DARK} />
    <K.Txt y={10} size={30} weight={700} fill={GREEN}>
      $
    </K.Txt>
  </g>
);

// Value-first: talking less is worth money to you.
export const V05Thumb: React.FC = () => (
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
        <K.Txt x={70} y={330} size={205} weight={700} fill={T.line} anchor="start">
          SAY LESS.
        </K.Txt>
        <K.Txt x={70} y={610} size={205} weight={700} fill={T.accent} anchor="start">
          GET PAID.
        </K.Txt>
        <Stickman theme={T} outfit="scarf" x={1330} floorY={1160} scale={1.7} pose={{ ...poses.think, headTilt: -4 }} expression="smile" />
        {Array.from({ length: 11 }, (_, i) => (
          <K.At key={i} x={1700 + ((i * 37) % 23) - 11} y={1020 - i * 62} r={((i * 53) % 9) - 4}>
            <Bill />
          </K.At>
        ))}
        <K.At x={1560} y={200} r={-18} s={0.9}>
          <Bill />
        </K.At>
        <K.At x={1830} y={180} r={14} s={0.8}>
          <Bill />
        </K.At>
      </>
    }
  />
);
