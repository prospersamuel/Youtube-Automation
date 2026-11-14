import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import * as S from "../scenery";
import type { Theme } from "../theme";
import { mix, ramp } from "./time";

// One scene: `back` is drawn with a steady hand-drawn wobble, `front` with a line that "boils" a few times a second.
export const Stage: React.FC<{ theme: Theme; back: React.ReactNode; front?: React.ReactNode; zoom?: number }> = ({ theme, back, front, zoom = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: theme.wall2, transform: `scale(${zoom})` }}>
      <svg width={S.W} height={S.H} viewBox={`0 0 ${S.W} ${S.H}`}>
        <S.Defs t={theme} />
        <defs>
          <filter id="boil" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed={20 + (Math.floor(frame / 6) % 4)} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="4" />
          </filter>
        </defs>
        <g filter="url(#wobble)">{back}</g>
        <g filter="url(#boil)">{front}</g>
        <S.Finish dark={false} />
      </svg>
    </AbsoluteFill>
  );
};

// A slanted two-colour band that sweeps across; the scene changes while it covers the frame.
export const Wipe: React.FC<{ t: number; at: number; theme: Theme }> = ({ t, at, theme }) => {
  const k = ramp(t, at - 0.34, 0.68, Easing.inOut(Easing.cubic));
  if (k <= 0 || k >= 1) return null;
  return (
    <AbsoluteFill>
      <svg width={S.W} height={S.H} viewBox={`0 0 ${S.W} ${S.H}`}>
        <g transform={`translate(${mix(-2900, 2300, k)} 0) skewX(-12)`}>
          <rect x={-110} y={-60} width={2720} height={1200} fill={theme.accent} />
          <rect x={0} y={-60} width={2500} height={1200} fill={theme.accent2} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
