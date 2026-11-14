import React from "react";
import { Stickman, poses } from "./Stickman";
import { dusk, midnight, paper, type Theme } from "./theme";
import * as S from "./scenery";

const font = "'Fredoka', sans-serif";

const Caption: React.FC<{ t: Theme; children: React.ReactNode }> = ({ t, children }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 38, display: "flex", justifyContent: "center" }}>
    <div
      style={{
        fontFamily: font,
        fontWeight: 600,
        fontSize: 54,
        lineHeight: 1,
        color: t.captionText,
        background: t.captionBg,
        padding: "22px 44px 26px",
        borderRadius: 28,
      }}
    >
      {children}
    </div>
  </div>
);

const Tag: React.FC<{ t: Theme; dark: boolean }> = ({ t, dark }) => (
  <div
    style={{
      position: "absolute",
      left: 36,
      top: 30,
      fontFamily: font,
      fontWeight: 600,
      fontSize: 30,
      color: dark ? "#fff" : "#000",
      opacity: 0.55,
    }}
  >
    {t.name}
  </div>
);

const Frame: React.FC<{ t: Theme; dark: boolean; sky?: string[]; caption: React.ReactNode; overlay?: React.ReactNode; children: React.ReactNode }> = ({
  t,
  dark,
  sky,
  caption,
  overlay,
  children,
}) => (
  <div id="frame" style={{ position: "relative", width: S.W, height: S.H, overflow: "hidden" }}>
    <svg width={S.W} height={S.H} viewBox={`0 0 ${S.W} ${S.H}`} style={{ position: "absolute", inset: 0 }}>
      <S.Defs t={t} sky={sky} />
      <g filter="url(#wobble)">{children}</g>
      <S.Finish dark={dark} />
    </svg>
    {overlay}
    <Caption t={t}>{caption}</Caption>
    <Tag t={t} dark={dark} />
  </div>
);

const Hi: React.FC<{ t: Theme; children: React.ReactNode }> = ({ t, children }) => <span style={{ color: t.accent }}>{children}</span>;

export const FrameA = () => {
  const t = midnight;
  return (
    <Frame
      t={t}
      dark
      caption={
        <>
          Small habits don't add up. They <Hi t={t}>compound.</Hi>
        </>
      }
      overlay={
        <div
          style={{
            position: "absolute",
            left: 1432,
            top: 236,
            width: 300,
            transform: "rotate(-4deg)",
            fontFamily: font,
            color: t.line,
            lineHeight: 1,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 104, color: t.accent }}>1%</div>
          <div style={{ fontWeight: 600, fontSize: 46, marginTop: 6 }}>better</div>
          <div style={{ fontWeight: 500, fontSize: 34, marginTop: 10, opacity: 0.75 }}>every day</div>
        </div>
      }
    >
      <S.RoomShell t={t} />
      <S.Window t={t} x={150} y={130} w={400} h={340} night />
      <S.Desk t={t} x={90} w={560} top={640} />
      <S.Laptop t={t} x={300} y={640} />
      <S.Lamp t={t} x={170} y={640} />
      <S.Mug t={t} x={550} y={640} />
      <S.Plant t={t} x={1720} s={0.9} />
      <S.IdeaCard t={t} x={1110} y={190} />
      <S.Sparkle x={1070} y={170} c={t.accent} />
      <S.Sparkle x={1790} y={560} s={0.7} c={t.accent2} />
      <S.Sparkle x={1010} y={300} s={0.5} c={t.line} />
      <Stickman x={860} floorY={S.FLOOR} theme={t} pose={poses.point} outfit="beanie" expression="open" />
    </Frame>
  );
};

export const FrameB = () => {
  const t = paper;
  return (
    <Frame
      t={t}
      dark={false}
      caption={
        <>
          Pay yourself <Hi t={t}>first.</Hi> Spend what's left.
        </>
      }
    >
      <S.RoomShell t={t} />
      <S.Bookshelf t={t} x={110} y={250} w={400} />
      <S.Plant t={t} x={310} y={250} s={0.5} />
      <S.Window t={t} x={1290} y={130} w={440} h={350} night={false} />
      <S.Picture t={t} x={640} y={170} />
      <S.Plant t={t} x={1620} />
      <S.BookStack t={t} x={1290} y={S.FLOOR} />
      <S.Lightbulb t={t} x={1130} y={290} />
      <S.Sparkle x={1010} y={190} s={0.6} c={t.accent2} />
      <S.Sparkle x={1250} y={400} s={0.5} c={t.accent} />
      <Stickman x={880} floorY={S.FLOOR} theme={t} pose={poses.read} outfit="scarf" expression="smile" inHand={<S.OpenBook t={t} />} />
    </Frame>
  );
};

export const FrameC = () => {
  const t = dusk;
  return (
    <Frame
      t={t}
      dark
      sky={["#24183F", "#5B2F6E", "#C4567A", "#FF9A6B", "#FFC97A"]}
      caption={
        <>
          Looking rich and being rich are <Hi t={t}>not</Hi> the same thing.
        </>
      }
      overlay={
        <div
          style={{
            position: "absolute",
            left: 1452,
            top: 196,
            fontFamily: font,
            fontWeight: 700,
            fontSize: 150,
            lineHeight: 1,
            color: t.ink,
          }}
        >
          ?
        </div>
      }
    >
      <S.StreetShell t={t} />
      <S.Tree t={t} x={1690} />
      <S.StreetLamp t={t} x={300} />
      <S.ThoughtBubble t={t} x={1080} y={150} />
      <Stickman x={840} floorY={S.FLOOR} theme={t} pose={poses.walk} outfit="hoodie" expression="wonder" />
    </Frame>
  );
};

export const frames = [
  { id: midnight.id, Component: FrameA },
  { id: paper.id, Component: FrameB },
  { id: dusk.id, Component: FrameC },
];
