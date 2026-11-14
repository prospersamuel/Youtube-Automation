import React from "react";
import { Stickman, poses } from "./Stickman";
import { paper as t } from "./theme";
import * as S from "./scenery";

const font = "'Fredoka', sans-serif";

const Avatar: React.FC<{ bg: string }> = ({ bg }) => (
  <div id="frame" style={{ position: "relative", width: 800, height: 800, overflow: "hidden", background: bg }}>
    <svg width={800} height={800} viewBox="0 0 800 800">
      <S.Defs t={t} />
      <circle cx={400} cy={380} r={330} fill="#fff" opacity={0.12} />
      <g filter="url(#wobble)">
        <Stickman x={388} floorY={1640} theme={t} pose={{ ...poses.idle, armF: [38, 8], armB: [-38, -8] }} outfit="scarf" expression="open" scale={3} />
      </g>
      <rect width={800} height={800} filter="url(#grain)" opacity={0.14} style={{ mixBlendMode: "soft-light" }} />
    </svg>
  </div>
);

const BANNER_FLOOR = 690;

const Banner: React.FC = () => (
  <div id="frame" style={{ position: "relative", width: S.W, height: S.H, overflow: "hidden", background: t.floor }}>
    <svg width={S.W} height={S.H} viewBox={`0 0 ${S.W} ${S.H}`} style={{ position: "absolute", inset: 0 }}>
      <S.Defs t={t} />
      <g filter="url(#wobble)">
        <rect x={-60} y={-60} width={S.W + 120} height={BANNER_FLOOR + 60} fill="url(#wall)" />
        <rect x={-60} y={BANNER_FLOOR} width={S.W + 120} height={S.H} fill={t.floor} />
        <path d={`M-60 ${BANNER_FLOOR - 24} H${S.W + 60}`} stroke={t.line} strokeWidth={4} opacity={0.25} />
        <path d={`M-60 ${BANNER_FLOOR} H${S.W + 60}`} stroke={t.line} strokeWidth={7} />

        <S.Window t={t} x={1450} y={60} w={340} h={250} night={false} />
        <S.Picture t={t} x={150} y={110} />
        <g transform="translate(1010 210) scale(0.8)">
          <S.Lightbulb t={t} x={0} y={0} />
        </g>
        <S.Sparkle x={880} y={150} s={0.7} c={t.accent2} />
        <S.Sparkle x={1150} y={290} s={0.5} c={t.accent} />

        <S.BookStack t={t} x={110} y={BANNER_FLOOR} />
        <S.Plant t={t} x={182} y={BANNER_FLOOR - 78} s={0.42} />
        <S.Plant t={t} x={1740} y={BANNER_FLOOR} s={0.78} />
        <S.Sparkle x={300} y={450} s={0.6} c={t.accent} />
        <S.Sparkle x={1600} y={420} s={0.6} c={t.accent2} />

        <Stickman x={498} floorY={BANNER_FLOOR} theme={t} pose={poses.read} outfit="scarf" expression="smile" scale={0.6} inHand={<S.OpenBook t={t} />} />
      </g>
      <S.Finish dark={false} />
    </svg>
    <div style={{ position: "absolute", left: 690, top: 436, fontFamily: font, color: t.line, lineHeight: 1, whiteSpace: "nowrap" }}>
      <div style={{ fontWeight: 700, fontSize: 118, letterSpacing: -1 }}>
        Read It{" "}
        <span
          style={{
            color: t.accent,
            textDecoration: "underline wavy",
            textDecorationColor: t.accent2,
            textDecorationThickness: 7,
            textUnderlineOffset: 14,
          }}
        >
          Once
        </span>
      </div>
      <div style={{ fontWeight: 500, fontSize: 37, marginTop: 44, opacity: 0.8 }}>Big ideas from great books, explained simply.</div>
    </div>
  </div>
);

export const branding = [
  { id: "profile-teal", Component: () => <Avatar bg={t.accent2} />, dir: "branding", width: 800, height: 800 },
  { id: "profile-cream", Component: () => <Avatar bg={t.wall2} />, dir: "branding", width: 800, height: 800 },
  { id: "banner", Component: Banner, dir: "branding", width: S.W, height: S.H, scale: 4 / 3 },
];
