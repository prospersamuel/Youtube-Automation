import React from "react";
import * as S from "../scenery";
import type { Theme } from "../theme";
import * as K from "./props";
import { Stage } from "./Stage";
import { mix, pop, ramp } from "./time";

type Common = { theme: Theme; t: number; zoom?: number; hero?: React.ReactNode; extra?: React.ReactNode; back?: React.ReactNode };

const Room: React.FC<{ theme: Theme; plant?: boolean }> = ({ theme, plant }) => (
  <>
    <S.RoomShell t={theme} />
    {plant && <S.Plant t={theme} x={130} s={0.8} />}
  </>
);

// A numbered trap/move card drops in beside the section's name.
export const TitleScene: React.FC<Common & { at: number; n: number; move?: boolean; lines: string[]; size?: number }> = ({
  theme,
  t,
  zoom,
  at,
  n,
  move,
  lines,
  size = 124,
  extra,
}) => (
  <Stage
    theme={theme}
    zoom={zoom}
    back={<Room theme={theme} />}
    front={
      <>
        <K.At x={430} y={mix(-320, 450, pop(t, at + 0.25, 0.9))} s={1.3} r={-4}>
          <K.TrapCard t={theme} n={n} flip={move ? 1 : 0} />
        </K.At>
        {lines.map((line, i) => (
          <K.At key={line} x={720} y={490 + (i - (lines.length - 1) / 2) * size * 1.15} s={pop(t, at + 0.45 + i * 0.12)}>
            <K.Txt size={size} weight={700} fill={theme.line} anchor="start">
              {line}
            </K.Txt>
          </K.At>
        ))}
        {extra}
      </>
    }
  />
);

export type CardSpec = { icon: string; label: string; at: number; check?: number; cross?: number; pill?: { text: string; at: number; fill?: string } };

// The hero on the left and two or three picture cards popping in on the right.
export const CardRowScene: React.FC<Common & { header?: { text: string; at: number; fill?: string; w?: number }; cards: CardSpec[] }> = ({
  theme,
  t,
  zoom,
  hero,
  header,
  cards,
  extra,
  back,
}) => {
  const gap = cards.length === 2 ? 440 : 350;
  const x0 = 1250 - ((cards.length - 1) * gap) / 2;
  const top = header ? 70 : 0;
  return (
    <Stage
      theme={theme}
      zoom={zoom}
      back={back ?? <Room theme={theme} plant />}
      front={
        <>
          {hero}
          {header && (
            <K.At x={1250} y={104} s={pop(t, header.at)} r={-2}>
              <K.Pill t={theme} text={header.text} fill={header.fill} w={header.w ?? 520} size={50} />
            </K.At>
          )}
          {cards.map((c, i) => (
            <g key={c.label}>
              <K.At x={x0 + i * gap} y={mix(250, 320, pop(t, c.at)) + top} s={1.1 * pop(t, c.at)} r={[-3, 2, -2][i % 3]}>
                <K.ItemCard
                  t={theme}
                  icon={c.icon}
                  label={c.label}
                  check={c.check === undefined ? 0 : pop(t, c.check)}
                  cross={c.cross === undefined ? 0 : ramp(t, c.cross, 0.3)}
                />
              </K.At>
              {c.pill && (
                <K.At x={x0 + i * gap} y={592 + top} s={pop(t, c.pill.at)}>
                  <K.Pill t={theme} text={c.pill.text} fill={c.pill.fill} w={cards.length === 2 ? 410 : 320} size={38} />
                </K.At>
              )}
            </g>
          ))}
          {extra}
        </>
      }
    />
  );
};

// The hero beside a card whose lines appear as they are spoken.
export const QuoteScene: React.FC<Common & { at: number; tag?: string; lines: { text: string; at: number; accent?: boolean }[]; size?: number }> = ({
  theme,
  t,
  zoom,
  hero,
  at,
  tag,
  lines,
  size = 76,
  extra,
  back,
}) => {
  const step = size * 1.22;
  const h = 190 + lines.length * step;
  return (
    <Stage
      theme={theme}
      zoom={zoom}
      back={back ?? <Room theme={theme} />}
      front={
        <>
          {hero}
          <K.At x={1160} y={mix(360, 430, pop(t, at + 0.3))} s={pop(t, at + 0.3)} r={-1}>
            <K.Panel t={theme} w={1160} h={h} />
            {tag && (
              <K.At x={-360} y={-h / 2} r={-4}>
                <K.Pill t={theme} text={tag} fill={theme.accent} w={420} />
              </K.At>
            )}
            {lines.map((l, i) => {
              const k = ramp(t, l.at, 0.35);
              return (
                <g key={l.text} opacity={k} transform={`translate(0 ${(1 - k) * 24})`}>
                  <K.Txt y={(i - (lines.length - 1) / 2) * step + size * 0.34 + (tag ? 14 : 0)} size={size} weight={700} fill={l.accent ? theme.accent : theme.line}>
                    {l.text}
                  </K.Txt>
                </g>
              );
            })}
          </K.At>
          {extra}
        </>
      }
    />
  );
};

// The hero beside a numbered list; each row can earn a tick.
export const ListScene: React.FC<Common & { at: number; title: string; rows: { text: string; at: number; check?: number }[] }> = ({
  theme,
  t,
  zoom,
  hero,
  at,
  title,
  rows,
  extra,
}) => {
  const h = 130 + rows.length * 140;
  return (
    <Stage
      theme={theme}
      zoom={zoom}
      back={<Room theme={theme} />}
      front={
        <>
          {hero}
          <K.At x={1170} y={mix(360, 430, pop(t, at + 0.3))} s={pop(t, at + 0.3)} r={-1}>
            <K.Panel t={theme} w={1200} h={h} />
            <K.At x={-380} y={-h / 2} r={-4}>
              <K.Pill t={theme} text={title} fill={theme.accent} w={400} />
            </K.At>
            {rows.map((r, i) => {
              const k = ramp(t, r.at, 0.35);
              const y = (i - (rows.length - 1) / 2) * 140 + 26;
              return (
                <g key={r.text} opacity={k} transform={`translate(${(1 - k) * 40} ${y})`}>
                  <circle cx={-520} cy={0} r={40} fill={theme.accent2} stroke={theme.line} strokeWidth={7} />
                  <K.Txt x={-520} y={17} size={48} weight={700} fill="#FFFDF8">
                    {i + 1}
                  </K.Txt>
                  <K.Txt x={-450} y={18} size={52} weight={600} fill={theme.line} anchor="start">
                    {r.text}
                  </K.Txt>
                  {r.check !== undefined && (
                    <K.At x={530} y={0} s={pop(t, r.check)} r={8}>
                      <circle r={38} fill={theme.accent} stroke={theme.line} strokeWidth={7} />
                      <path d="M-17 2 l12 12 l24 -27" stroke="#FFFDF8" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </K.At>
                  )}
                </g>
              );
            })}
          </K.At>
          {extra}
        </>
      }
    />
  );
};
