import React from "react";
import * as K from "../../kit/props";
import { Stage } from "../../kit/Stage";
import { Stickman, poses } from "../../Stickman";
import { T, WHITE } from "./shared";

const Tag: React.FC<{ price: string; fill: string; w: number; size: number }> = ({ price, fill, w, size }) => (
  <g>
    <path d={`M${-w / 2} ${-w * 0.28} H${w / 2 - 60} L${w / 2} 0 L${w / 2 - 60} ${w * 0.28} H${-w / 2} Z`} fill={fill} stroke={T.line} strokeWidth={10} strokeLinejoin="round" />
    <circle cx={w / 2 - 70} cy={0} r={16} fill={T.surface} stroke={T.line} strokeWidth={6} />
    <K.Txt x={-30} y={size * 0.35} size={size} weight={700} fill={WHITE}>
      {price}
    </K.Txt>
  </g>
);

const Back = ({ cx }: { cx: number }) => (
  <>
    <rect x={-60} y={-60} width={2040} height={1200} fill="url(#wall)" />
    <circle cx={cx} cy={600} r={560} fill={T.accent2} />
  </>
);

// Option A: a 3x price that still sells out.
export const V04Thumb: React.FC = () => (
  <Stage
    theme={T}
    back={<Back cx={1450} />}
    front={
      <>
        <K.Txt x={70} y={250} size={190} weight={700} fill={T.line} anchor="start">
          3X THE PRICE.
        </K.Txt>
        <K.Txt x={70} y={460} size={190} weight={700} fill={T.accent} anchor="start">
          SOLD OUT.
        </K.Txt>
        <K.At x={330} y={760} r={-8}>
          <Tag price="$20" fill={T.line} w={420} size={120} />
          <path d="M-200 -90 L180 90" stroke={T.accent} strokeWidth={26} strokeLinecap="round" />
        </K.At>
        <K.At x={1110} y={760} r={6}>
          <Tag price="$60" fill={T.accent} w={580} size={180} />
        </K.At>
        <Stickman theme={T} outfit="scarf" x={1680} floorY={1160} scale={1.7} pose={{ ...poses.cheer, headTilt: -8 }} expression="open" />
      </>
    }
  />
);

// Option B: an offer so good nobody refuses.
export const V04ThumbB: React.FC = () => (
  <Stage
    theme={T}
    back={<Back cx={1360} />}
    front={
      <>
        {["THEY", "CAN'T", "SAY NO."].map((w, i) => (
          <K.Txt key={w} x={70} y={260 + i * 230} size={205} weight={700} fill={i === 2 ? T.accent : T.line} anchor="start">
            {w}
          </K.Txt>
        ))}
        <Stickman theme={T} outfit="scarf" x={1330} floorY={1160} scale={1.75} pose={{ ...poses.cheer, headTilt: -8 }} expression="open" />
        <K.At x={1690} y={400} r={8} s={1.1}>
          <K.Panel t={T} w={420} h={300} />
          <K.Txt y={-60} size={64} weight={700} fill={T.line}>
            THE OFFER
          </K.Txt>
          <K.At x={0} y={50} s={0.85} r={-8}>
            <K.Stamp t={T} text="GUARANTEED" />
          </K.At>
        </K.At>
      </>
    }
  />
);
