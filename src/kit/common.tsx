import React from "react";
import * as S from "../scenery";
import { Stickman, poses } from "../Stickman";
import type { Theme } from "../theme";
import * as K from "./props";
import { Stage } from "./Stage";
import { mix, pop } from "./time";

export const WHITE = "#FFFDF8";
const GREEN = "#7CC47F";
const DARK = "#4E9A5A";

// "PART n" pill drops in, then the section name.
export const SectionTitle: React.FC<{ theme: Theme; t: number; zoom: number; at: number; n: number; lines: string[] }> = ({ theme, t, zoom, at, n, lines }) => (
  <Stage
    theme={theme}
    zoom={zoom}
    back={<S.RoomShell t={theme} />}
    front={
      <>
        <K.At x={960} y={mix(-100, 300, pop(t, at + 0.2))} r={-3}>
          <K.Pill t={theme} text={`PART ${n}`} w={360} size={56} fill={theme.accent} />
        </K.At>
        {lines.map((line, i) => (
          <K.At key={line} x={960} y={500 + i * 140} s={pop(t, at + 0.45 + i * 0.12)}>
            <K.Txt size={120} weight={700} fill={theme.line}>
              {line}
            </K.Txt>
          </K.At>
        ))}
      </>
    }
  />
);

// Last 10 seconds: dashed slots for YouTube's end-screen elements.
export const EndScreen: React.FC<{ theme: Theme; t: number; zoom: number; start: number; hero: React.ReactNode }> = ({ theme, t, zoom, start, hero }) => (
  <Stage
    theme={theme}
    zoom={zoom}
    back={<S.RoomShell t={theme} />}
    front={
      <>
        {hero}
        <K.At x={960} y={120} s={pop(t, start + 0.3)}>
          <K.Txt y={40} size={112} weight={700} fill={theme.line}>
            Read It Once
          </K.Txt>
        </K.At>
        <K.At x={720} y={500} s={pop(t, start + 0.6)}>
          <circle r={122} fill={theme.surface} stroke={theme.line} strokeWidth={9} strokeDasharray="20 16" />
          <K.Txt y={196} size={50} weight={700} fill={theme.accent}>
            Subscribe
          </K.Txt>
        </K.At>
        <K.At x={1380} y={500} s={pop(t, start + 0.8)}>
          <rect x={-360} y={-202} width={720} height={404} rx={24} fill={theme.surface} stroke={theme.line} strokeWidth={9} strokeDasharray="20 16" />
          <K.Txt y={-236} size={50} weight={700} fill={theme.accent2}>
            Watch next
          </K.Txt>
        </K.At>
      </>
    }
  />
);

export const wavePose = (t: number) => ({ ...poses.wave, armF: [poses.wave.armF[0], poses.wave.armF[1] + Math.sin(t * 9) * 16] as [number, number] });

export const Bill: React.FC<{ theme: Theme; w?: number }> = ({ theme, w = 300 }) => (
  <g>
    <rect x={-w / 2} y={-34} width={w} height={68} rx={8} fill={GREEN} stroke={theme.line} strokeWidth={6} />
    <rect x={-w / 2 + 16} y={-22} width={w - 32} height={44} rx={6} fill="none" stroke={DARK} strokeWidth={4} />
    <circle r={20} fill={DARK} />
    <K.Txt y={10} size={30} weight={700} fill={GREEN}>
      $
    </K.Txt>
  </g>
);

// A stack of n bills, bottom at (x, y). `k` (0..1) grows it bill by bill.
export const CashStack: React.FC<{ theme: Theme; x: number; y: number; n: number; k?: number; w?: number }> = ({ theme, x, y, n, k = 1, w = 300 }) => (
  <g>
    {Array.from({ length: Math.round(n * k) }, (_, i) => (
      <K.At key={i} x={x + ((i * 37) % 23) - 11} y={y - i * 62} r={((i * 53) % 9) - 4}>
        <Bill theme={theme} w={w} />
      </K.At>
    ))}
  </g>
);

export const Bubble: React.FC<{ theme: Theme; text: string; w?: number; fill?: string; size?: number; flip?: boolean }> = ({ theme, text, w = 380, fill, size = 44, flip }) => (
  <g transform={flip ? "scale(-1 1)" : undefined}>
    <path d="M-40 40 L-90 95 L10 40 Z" fill={fill ?? theme.surface} stroke={theme.line} strokeWidth={7} strokeLinejoin="round" />
    <rect x={-w / 2} y={-50} width={w} height={100} rx={40} fill={fill ?? theme.surface} stroke={theme.line} strokeWidth={7} />
    <rect x={-60} y={34} width={64} height={14} fill={fill ?? theme.surface} />
    <g transform={flip ? "scale(-1 1)" : undefined}>
      <K.Txt y={size * 0.35} size={size} weight={700} fill={fill ? WHITE : theme.line}>
        {text}
      </K.Txt>
    </g>
  </g>
);

// A background person (no scarf).
export const Other: React.FC<{ theme: Theme; x: number; floorY?: number; pose?: keyof typeof poses; scale?: number; outfit?: "plain" | "hoodie" }> = ({
  theme,
  x,
  floorY = S.FLOOR,
  pose = "idle",
  scale = 1,
  outfit = "plain",
}) => <Stickman theme={theme} outfit={outfit} x={x} floorY={floorY} scale={scale} pose={poses[pose]} expression="smile" />;
