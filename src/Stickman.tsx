import React from "react";
import type { Theme } from "./theme";

type Pt = [number, number];

// Angles in degrees: 0 = straight down, 90 = forward (the way the character faces), 180 = up.
export type Pose = {
  lean: number;
  headTilt: number;
  armF: [number, number];
  armB: [number, number];
  legF: [number, number];
  legB: [number, number];
};

export type Outfit = "beanie" | "scarf" | "hoodie";
export type Expression = "smile" | "open" | "wonder";

const SIZE = { head: 64, torso: 150, armU: 86, armL: 82, legU: 104, legL: 104, stroke: 13 };

const rad = (d: number) => (d * Math.PI) / 180;
const step = (p: Pt, angle: number, len: number): Pt => [
  p[0] + len * Math.sin(rad(angle)),
  p[1] + len * Math.cos(rad(angle)),
];
const hose = (a: Pt, b: Pt, c: Pt) => `M${a[0]} ${a[1]} Q${b[0]} ${b[1]} ${c[0]} ${c[1]}`;

export const poses: Record<string, Pose> = {
  idle: { lean: 0, headTilt: -4, armF: [12, 4], armB: [-12, -4], legF: [11, 4], legB: [-11, -4] },
  point: { lean: 0, headTilt: -6, armF: [106, 156], armB: [-40, 50], legF: [11, 4], legB: [-11, -4] },
  read: { lean: 3, headTilt: 9, armF: [50, 105], armB: [38, 100], legF: [11, 4], legB: [-11, -4] },
  walk: { lean: 7, headTilt: -14, armF: [-34, -4], armB: [38, 78], legF: [30, 4], legB: [-14, -46] },
};

export const Stickman: React.FC<{
  x: number;
  floorY: number;
  theme: Theme;
  pose: Pose;
  outfit: Outfit;
  expression?: Expression;
  facing?: 1 | -1;
  scale?: number;
  inHand?: React.ReactNode;
}> = ({ x, floorY, theme, pose, outfit, expression = "smile", facing = 1, scale = 1, inHand }) => {
  const t = theme;
  const hip: Pt = [0, 0];
  const up = 180 - pose.lean;
  const neck = step(hip, up, SIZE.torso);
  const shoulder = step(hip, up, SIZE.torso - 40);
  const headC = step(neck, up, 50);

  const limb = (from: Pt, [a1, a2]: [number, number], l1: number, l2: number) => {
    const mid = step(from, a1, l1);
    const end = step(mid, a2, l2);
    return { from, mid, end };
  };
  const armF = limb(shoulder, pose.armF, SIZE.armU, SIZE.armL);
  const armB = limb(shoulder, pose.armB, SIZE.armU, SIZE.armL);
  const legF = limb(hip, pose.legF, SIZE.legU, SIZE.legL);
  const legB = limb(hip, pose.legB, SIZE.legU, SIZE.legL);
  const lowest = Math.max(legF.end[1], legB.end[1]) + 13;

  const stroke = { stroke: t.line, strokeWidth: SIZE.stroke, strokeLinecap: "round" as const, fill: "none" };
  const hoodie = outfit === "hoodie";

  const Arm = ({ l }: { l: ReturnType<typeof limb> }) => (
    <g>
      {hoodie ? (
        <>
          <path d={hose(l.from, l.mid, l.end)} {...stroke} strokeWidth={30} />
          <path d={hose(l.from, l.mid, l.end)} {...stroke} stroke={t.accent} strokeWidth={17} />
        </>
      ) : (
        <path d={hose(l.from, l.mid, l.end)} {...stroke} />
      )}
      <circle cx={l.end[0]} cy={l.end[1]} r={15} fill={t.skin} stroke={t.line} strokeWidth={7} />
    </g>
  );

  const Leg = ({ l }: { l: ReturnType<typeof limb> }) => {
    const tilt = l.end[1] < lowest - 20 ? 28 : 0;
    return (
      <g>
        <path d={hose(l.from, l.mid, l.end)} {...stroke} />
        <rect
          x={l.end[0] - 16}
          y={l.end[1] - 11}
          width={54}
          height={24}
          rx={12}
          fill={hoodie ? t.accent2 : t.accent}
          stroke={t.line}
          strokeWidth={7}
          transform={`rotate(${tilt} ${l.end[0]} ${l.end[1]})`}
        />
      </g>
    );
  };

  const look = 12;
  const faceY = outfit === "beanie" ? 8 : 2;
  const mouthY = faceY + 26;
  const Face = () => (
    <g>
      <circle cx={look - 36} cy={faceY + 18} r={10} fill={t.accent2} opacity={0.45} />
      <circle cx={look + 36} cy={faceY + 18} r={10} fill={t.accent2} opacity={0.45} />
      <ellipse cx={look - 19} cy={faceY - 4} rx={6.5} ry={9.5} fill={t.ink} />
      <ellipse cx={look + 19} cy={faceY - 4} rx={6.5} ry={9.5} fill={t.ink} />
      {expression === "wonder" && (
        <path
          d={`M${look - 30} ${faceY - 24} q10 -9 20 -3 M${look + 10} ${faceY - 28} q10 -6 20 3`}
          stroke={t.ink}
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
        />
      )}
      {expression === "smile" && (
        <path
          d={`M${look - 20} ${mouthY} Q${look} ${mouthY + 20} ${look + 20} ${mouthY}`}
          stroke={t.ink}
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
        />
      )}
      {expression === "open" && (
        <g>
          <path
            d={`M${look - 22} ${mouthY - 4} Q${look} ${mouthY + 34} ${look + 22} ${mouthY - 4} Z`}
            fill={t.ink}
            stroke={t.ink}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          <ellipse cx={look + 1} cy={mouthY + 11} rx={8} ry={4.5} fill="#FF7E8F" />
        </g>
      )}
      {expression === "wonder" && <ellipse cx={look + 2} cy={mouthY + 4} rx={8} ry={10} fill={t.ink} />}
    </g>
  );

  return (
    <g>
      <ellipse cx={x} cy={floorY + 16} rx={120 * scale} ry={14 * scale} fill="#000" opacity={0.22} />
      <g transform={`translate(${x} ${floorY - lowest * scale}) scale(${facing * scale} ${scale})`}>
      <Arm l={armB} />
      <Leg l={legB} />
      <Leg l={legF} />

      {hoodie && (
        <circle cx={headC[0] - 12} cy={headC[1] + 10} r={76} fill={t.accent} stroke={t.line} strokeWidth={8} />
      )}

      {hoodie ? (
        <g transform={`rotate(${pose.lean})`}>
          <rect x={-44} y={-SIZE.torso - 2} width={88} height={SIZE.torso + 16} rx={32} fill={t.accent} stroke={t.line} strokeWidth={8} />
          <path d="M-20 -34 q20 12 40 0" stroke={t.line} strokeWidth={6} strokeLinecap="round" fill="none" />
          <path d={`M-10 ${-SIZE.torso + 26} v26 M12 ${-SIZE.torso + 26} v20`} stroke={t.line} strokeWidth={5} strokeLinecap="round" />
        </g>
      ) : (
        <path d={`M0 0 L${neck[0]} ${neck[1]}`} {...stroke} />
      )}

      {outfit === "scarf" && (
        <g>
          <path
            d={`M${neck[0] - 18} ${neck[1] + 20} q-46 6 -70 46 q-10 20 -34 24`}
            stroke={t.line}
            strokeWidth={34}
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M${neck[0] - 18} ${neck[1] + 20} q-46 6 -70 46 q-10 20 -34 24`}
            stroke={t.accent}
            strokeWidth={20}
            strokeLinecap="round"
            fill="none"
          />
        </g>
      )}

      <g transform={`translate(${headC[0]} ${headC[1]}) rotate(${pose.headTilt})`}>
        <ellipse cx={0} cy={0} rx={SIZE.head + 2} ry={SIZE.head - 2} fill={t.skin} stroke={t.line} strokeWidth={9} />
        <Face />
        {outfit === "beanie" && (
          <g transform="rotate(-6)">
            <circle cx={0} cy={-88} r={15} fill={t.accent2} stroke={t.line} strokeWidth={7} />
            <path d="M-68 -24 C-68 -100 68 -100 68 -24 Z" fill={t.accent} stroke={t.line} strokeWidth={8} strokeLinejoin="round" />
            <rect x={-74} y={-38} width={148} height={28} rx={14} fill={t.accent} stroke={t.line} strokeWidth={8} />
            <path d="M-40 -32 v16 M-14 -32 v16 M12 -32 v16 M38 -32 v16" stroke={t.line} strokeWidth={4} strokeLinecap="round" opacity={0.55} />
          </g>
        )}
        {outfit === "scarf" && (
          <path
            d="M-44 -46 C-30 -92 34 -96 56 -40 C30 -62 -6 -64 -44 -46 Z"
            fill={t.line}
            stroke={t.line}
            strokeWidth={6}
            strokeLinejoin="round"
          />
        )}
      </g>

      {outfit === "scarf" && (
        <rect
          x={neck[0] - 38}
          y={neck[1] + 4}
          width={76}
          height={30}
          rx={15}
          fill={t.accent}
          stroke={t.line}
          strokeWidth={7}
          transform={`rotate(${pose.lean - 4} ${neck[0]} ${neck[1]})`}
        />
      )}

      {inHand && <g transform={`translate(${armF.end[0]} ${armF.end[1]})`}>{inHand}</g>}
      <Arm l={armF} />
      </g>
    </g>
  );
};
