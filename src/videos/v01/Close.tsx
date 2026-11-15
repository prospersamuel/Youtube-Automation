import React from "react";
import { Easing } from "remotion";
import * as K from "../../kit/props";
import { CardRowScene, ListScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, cue, Hero, para, pip, sequence, stride, T } from "./shared";
import { Street } from "./TrapOne";
import { PhonePerson } from "./TrapTwo";
import { WAY_OUT_END } from "./WayOut";

const c = cue.at;
const MONTHS = ["JUL", "JUN", "MAY", "APR", "MAR", "FEB", "JAN"];

export const NARRATION_END = cue.end("I'll see you there");
export const V01_END = NARRATION_END + 10;

const DeskRoom = (
  <>
    <S.RoomShell t={T} />
    <S.Window t={T} x={150} y={130} w={400} h={330} night={false} />
    <S.Desk t={T} x={90} w={560} top={640} />
    <S.Laptop t={T} x={300} y={640} />
    <S.Mug t={T} x={550} y={640} />
  </>
);

const Rewind = (t: number, zoom: number) => {
  const from = WAY_OUT_END + 0.8;
  const turned = Math.max(0, Math.min(6, Math.floor((t - from) / 0.22) + 1));
  const turning = t >= from && turned <= 6 ? ((t - from) % 0.22) / 0.2 : 1;
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={DeskRoom}
      front={
        <>
          {pip(t, 860, [[0, poses.think]], "wonder")}
          <K.At x={1400} y={470} s={1.1 * pop(t, WAY_OUT_END + 0.5)} r={2}>
            <K.Calendar t={T} month={MONTHS[turned]} flip={turned < 6 || turning < 1 ? turning : 1} />
          </K.At>
          <K.At x={1400} y={130} s={pop(t, WAY_OUT_END + 0.6) * (1 + 0.05 * Math.sin(t * 10))}>
            <K.Pill t={T} text="◀◀  REWIND" fill={T.accent} w={360} />
          </K.At>
        </>
      }
    />
  );
};

const PayDay = (t: number, zoom: number) => {
  const card = c("Same four thousand");
  const five = c("five hundred disappears");
  const fill = ramp(t, five + 0.4, 1.4);
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={DeskRoom}
      front={
        <>
          {pip(t, 800, [[0, poses.idle], [five, aim]], "smile")}
          <K.At x={1240} y={mix(200, 260, pop(t, card))} s={0.8 * pop(t, card)} r={-3}>
            <K.PayCard t={T} amount={4000} />
          </K.At>
          {[0, 1, 2, 3, 4].map((i) => {
            const k = ramp(t, five + 0.2 + i * 0.22, 0.7, Easing.inOut(Easing.quad));
            return k <= 0 || k >= 1 ? null : (
              <K.At key={i} x={mix(1400, 1700, k)} y={mix(330, 300, k) - Math.sin(Math.PI * k) * 110}>
                <K.Coin t={T} />
              </K.At>
            );
          })}
          <K.At x={1700} y={mix(480, 540, pop(t, five - 0.3))} s={0.8 * pop(t, five - 0.3)}>
            <K.Meter t={T} level={0.5 * fill} label="SAVINGS" value={K.money(Math.round((500 * fill) / 10) * 10)} />
          </K.At>
          <K.At x={1240} y={520} s={pop(t, c("before he ever sees it"))} r={-2}>
            <K.Pill t={T} text="Before he sees it" fill={T.line} w={460} />
          </K.At>
        </>
      }
    />
  );
};

const PhoneUp = (t: number, zoom: number) => {
  const start = para("On the twenty-sixth of the month he opens");
  const first = c("for the first time");
  const up = c("the number is going up");
  const value = mix(11, 3011, ramp(t, first + 0.2, 1.5));
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={
        <>
          <S.RoomShell t={T} />
          <S.Bookshelf t={T} x={110} y={250} w={400} />
          <S.Plant t={T} x={310} y={250} s={0.5} />
          <S.Picture t={T} x={610} y={150} />
          <S.Plant t={T} x={1760} s={0.85} />
        </>
      }
      front={
        <>
          {pip(t, 780, [[0, poses.phone], [up + 0.2, poses.cheer]], t < first ? "smile" : "open", { inHand: <K.HandPhone t={T} /> })}
          <K.At x={1330} y={mix(1500, 480, pop(t, start + 0.5, 0.7))} r={3}>
            <K.BigPhone t={T} time={t} balance={t >= first ? `${K.money(value)}.00` : undefined} balancePop={pop(t, first)} good balanceSize={64} />
          </K.At>
          <K.At x={1330} y={70} s={pop(t, up)} r={-2}>
            <K.Pill t={T} text="▲  Going up" w={380} />
          </K.At>
        </>
      }
    />
  );
};

const Unnoticed = (t: number, zoom: number) => {
  const start = para("Nobody on the street can tell") - 0.3;
  const end = para("Because the best thing money buys") - 0.3;
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<Street />}
      front={
        <>
          <K.At x={1500} y={S.FLOOR + 36}>
            <K.Car t={T} />
          </K.At>
          <PhonePerson t={t} x={430} seed={3} />
          <PhonePerson t={t} x={1090} seed={8} facing={-1} />
          <Hero t={t} x={mix(-80, 1780, ramp(t, start, end - start, Easing.linear))} pose={stride(t * 7, 7, 30)} expression="smile" />
          <K.At x={960} y={140} s={pop(t, c("He doesn't look any richer"))} r={-2}>
            <K.Pill t={T} text="Looks the same" fill={T.line} w={440} />
          </K.At>
          <K.At x={960} y={250} s={pop(t, c("exactly the point"))} r={2}>
            <K.Pill t={T} text="That's the point" w={440} />
          </K.At>
        </>
      }
    />
  );
};

const Morning = (t: number, zoom: number) => {
  const say = c("I can do whatever");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={
        <>
          <S.RoomShell t={T} />
          <S.Window t={T} x={140} y={120} w={520} h={380} night={false} />
          <S.Plant t={T} x={1790} s={0.8} />
        </>
      }
      front={
        <>
          {pip(t, 900, [[0, poses.cheer], [say + 1.6, poses.pump]], "open")}
          <K.At x={1390} y={250} s={pop(t, say)}>
            <K.ThoughtCloud t={T} w={640} h={230}>
              <K.Txt y={-12} size={56} weight={700} fill={T.line}>
                I can do whatever
              </K.Txt>
              <K.Txt y={58} size={56} weight={700} fill={T.accent}>
                I want today.
              </K.Txt>
            </K.ThoughtCloud>
          </K.At>
          <K.At x={1390} y={600} s={pop(t, c("control over your own time"))} r={-2}>
            <K.Pill t={T} text="Control over your time" w={620} />
          </K.At>
          {[
            [700, 250, 0.8],
            [1130, 560, 0.6],
          ].map(([x, y, s], i) => (
            <S.Sparkle key={i} x={x} y={y} s={s * pop(t, say + 0.4 + i * 0.2) * (0.85 + 0.15 * Math.sin(t * 6 + i))} c={i ? T.accent2 : T.accent} />
          ))}
        </>
      }
    />
  );
};

const EndScreen = (t: number, zoom: number) => {
  const start = para("If this changed");
  const pose = { ...poses.wave, armF: [poses.wave.armF[0], poses.wave.armF[1] + Math.sin(t * 9) * 16] as [number, number] };
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          <Hero t={t} x={290} pose={pose} expression="open" />
          <K.At x={960} y={120} s={pop(t, start + 0.3)}>
            <K.Txt y={40} size={112} weight={700} fill={T.line}>
              Read It Once
            </K.Txt>
          </K.At>
          <K.At x={720} y={500} s={pop(t, start + 0.6)}>
            <circle r={122} fill={T.surface} stroke={T.line} strokeWidth={9} strokeDasharray="20 16" />
            <K.Txt y={196} size={50} weight={700} fill={T.accent}>
              Subscribe
            </K.Txt>
          </K.At>
          <K.At x={1380} y={500} s={pop(t, start + 0.8)}>
            <rect x={-360} y={-202} width={720} height={404} rx={24} fill={T.surface} stroke={T.line} strokeWidth={9} strokeDasharray="20 16" />
            <K.Txt y={-236} size={50} weight={700} fill={T.accent2}>
              Watch next
            </K.Txt>
          </K.At>
        </>
      }
    />
  );
};

export const closeScenes = sequence(
  [
    { at: WAY_OUT_END, render: Rewind },
    { at: para("Same job.") - 0.3, render: PayDay },
    {
      at: c("He keeps the car") - 0.3,
      render: (t, zoom) => (
        <CardRowScene
          theme={T}
          t={t}
          zoom={zoom}
          hero={pip(t, 430, [[0, poses.pump]], "open")}
          cards={[
            { icon: "oldcar", label: "Same car", at: c("He keeps the car"), check: c("He keeps the car") + 0.7 },
            { icon: "house", label: "Same place", at: c("He stays in his apartment"), check: c("He stays in his apartment") + 0.7 },
          ]}
        />
      ),
    },
    { at: para("On the twenty-sixth of the month he opens") - 0.3, render: PhoneUp },
    { at: para("Nobody on the street can tell") - 0.3, render: Unnoticed },
    {
      at: para("Because the best thing money buys") - 0.3,
      render: (t, zoom) => (
        <CardRowScene
          theme={T}
          t={t}
          zoom={zoom}
          hero={pip(t, 430, [[0, poses.think]], "wonder")}
          cards={[
            { icon: "car", label: "A car", at: c("isn't a car"), cross: c("isn't a car") + 0.5 },
            { icon: "watch", label: "A watch", at: c("or a watch"), cross: c("or a watch") + 0.5 },
            { icon: "chat", label: "Opinions", at: c("other people's opinions"), cross: c("other people's opinions") + 0.8 },
          ]}
        />
      ),
    },
    { at: c("The highest form of wealth") - 0.3, render: Morning },
    {
      at: para("So here's what to remember") - 0.3,
      render: (t, zoom) => (
        <ListScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("So here's what to remember") - 0.3}
          title="REMEMBER"
          hero={pip(t, 260, [[0, aim]], "smile")}
          rows={[
            { text: "A raise won't fix overspending.", at: c("A raise won't save you") },
            { text: "Nobody is that impressed.", at: c("Nobody is as impressed") },
            { text: "Wealth is what you don't see.", at: c("real wealth is what") },
          ]}
        />
      ),
    },
    { at: para("If this changed") - 0.3, render: EndScreen },
  ],
  V01_END
);
