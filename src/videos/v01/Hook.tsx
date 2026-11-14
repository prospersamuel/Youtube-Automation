import React from "react";
import { AbsoluteFill, Audio, Easing, staticFile } from "remotion";
import timingsJson from "../../../videos/01-broke-on-a-good-salary/timings.json";
import { Captions } from "../../kit/Captions";
import { makeCues, type Timings } from "../../kit/cues";
import { alive, blinkAt, mixPose, poseAt } from "../../kit/pose";
import * as K from "../../kit/props";
import { Stage, Wipe } from "../../kit/Stage";
import { mix, pop, ramp, useT } from "../../kit/time";
import * as S from "../../scenery";
import { Stickman, poses } from "../../Stickman";
import { paper as T } from "../../theme";

const timings = timingsJson as Timings;
const cue = makeCues(timings);

const CUT = {
  later: cue.at("Six months later") - 0.25,
  where: cue.at("So where did") - 0.2,
  millions: cue.at("Prosper's problem") - 0.2,
  traps: cue.at("He has walked") - 0.2,
};
export const HOOK_END = cue.end("get you out") + 1;

const drift = (t: number, from: number, to: number) => 1 + 0.025 * ramp(t, from, to - from, Easing.linear);

const Prosper: React.FC<Omit<React.ComponentProps<typeof Stickman>, "theme" | "outfit" | "floorY"> & { floorY?: number; t: number }> = ({ t, floorY = S.FLOOR, ...rest }) => (
  <Stickman theme={T} outfit="scarf" floorY={floorY} blink={blinkAt(t)} {...rest} />
);

const Raise: React.FC<{ t: number }> = ({ t }) => {
  const card = cue.at("just got a raise");
  const roll = cue.at("four thousand");
  const thrilled = cue.at("He's thrilled");
  const easier = cue.at("This is when");
  const pose = poseAt(t, [
    [0, poses.wave],
    [card - 0.1, { ...poses.idle, headTilt: -9 }],
    [thrilled, poses.cheer],
    [easier, poses.pump],
  ]);
  const waving = 1 - ramp(t, card - 0.3, 0.3);
  pose.armF = [pose.armF[0], pose.armF[1] + Math.sin(t * 15) * 20 * waving];
  const hop = t > thrilled && t < thrilled + 1.35 ? Math.abs(Math.sin(((t - thrilled) * Math.PI) / 0.45)) * 46 : 0;
  const rolled = ramp(t, roll, 0.55);
  return (
    <Stage
      theme={T}
      zoom={drift(t, 0, CUT.later)}
      back={
        <>
          <S.RoomShell t={T} />
          <S.Window t={T} x={150} y={130} w={400} h={330} night={false} />
          <S.Desk t={T} x={90} w={560} top={640} />
          <S.Laptop t={T} x={300} y={640} />
          <S.Mug t={T} x={550} y={640} />
          <S.Plant t={T} x={1770} s={0.85} />
        </>
      }
      front={
        <>
          <Prosper t={t} x={860} pose={alive(pose, t)} lift={hop} expression={t < roll ? "smile" : t < thrilled ? "wonder" : "open"} />
          <K.At x={1045} y={318} s={pop(t, 0.15) * (1 - ramp(t, card + 0.4, 0.25))} r={-4}>
            <K.NameTag t={T} text="Prosper" />
          </K.At>
          <K.At x={1370 + 900 * (1 - ramp(t, card, 0.5))} y={360} s={(t < card ? 0 : 0.6 + 0.4 * pop(t, card)) * (1 + 0.1 * Math.sin(Math.PI * ramp(t, roll, 0.6)))} r={-3}>
            <K.PayCard t={T} amount={Math.round(mix(3000, 4000, rolled) / 10) * 10} badge={pop(t, roll + 0.55)} />
          </K.At>
          <g transform="translate(860 330)">
            <K.Confetti t={T} age={t - thrilled} />
          </g>
          {[
            [640, 250, 0.9],
            [1090, 600, 0.7],
            [700, 560, 0.6],
          ].map(([x, y, s], i) => (
            <S.Sparkle key={i} x={x} y={y} s={s * pop(t, easier + 0.25 + i * 0.18) * (0.85 + 0.15 * Math.sin(t * 6 + i))} c={i === 1 ? T.accent2 : T.accent} />
          ))}
        </>
      }
    />
  );
};

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"];

const Later: React.FC<{ t: number }> = ({ t }) => {
  const flips = cue.at("Six months later") + 0.1;
  const day = cue.at("twenty-sixth");
  const opens = cue.at("Prosper opens");
  const eleven = cue.at("eleven dollars");
  const same = cue.at("Exactly like");
  const stamp = cue.at("before the raise");
  const calendarOut = ramp(t, opens - 0.4, 0.35, Easing.in(Easing.cubic));
  const turned = Math.max(0, Math.min(6, Math.floor((t - flips) / 0.2) + 1));
  const turning = t >= flips && turned <= 6 ? ((t - flips) % 0.2) / 0.18 : 1;
  const pose = poseAt(t, [
    [0, poses.idle],
    [opens - 0.2, poses.phone],
    [eleven + 0.05, { ...poses.phone, lean: -5, headTilt: 4 }],
    [same, mixPose(poses.slump, poses.phone, 0.25)],
  ]);
  return (
    <Stage
      theme={T}
      zoom={drift(t, CUT.later, CUT.where)}
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
          <g opacity={calendarOut}>
          <Prosper
            t={t}
            x={780}
            pose={alive(pose, t)}
            lift={30 * Math.sin(Math.PI * ramp(t, eleven, 0.3))}
            expression={t < eleven ? "smile" : t < same ? "wonder" : "sad"}
            inHand={t > opens - 0.2 ? <K.HandPhone t={T} /> : undefined}
          />
          </g>
          <K.At x={905} y={mix(380, 440, ramp(t, eleven + 0.25, 0.9, Easing.in(Easing.quad)))} s={pop(t, eleven + 0.25) * (1 - ramp(t, eleven + 1.0, 0.2))}>
            <K.SweatDrop t={T} />
          </K.At>
          <K.At x={1330} y={mix(1500, 470, pop(t, opens + 0.1, 0.7))} r={3}>
            <K.BigPhone t={T} time={t} balance={t >= eleven ? "$11.00" : undefined} balancePop={pop(t, eleven)} />
          </K.At>
          <K.At x={1330} y={700} s={mix(2.4, 1, ramp(t, stamp, 0.16, Easing.in(Easing.cubic)))} o={ramp(t, stamp, 0.08)} r={-9}>
            <K.Stamp t={T} text="SAME AS BEFORE" />
          </K.At>
          <rect x={-60} y={-60} width={S.W + 120} height={S.H + 120} fill={T.wall} opacity={0.82 * (1 - calendarOut)} />
          <K.At x={960} y={mix(450, -420, calendarOut)} s={1.3} r={-2}>
            <K.Calendar
              t={T}
              month={MONTHS[turned]}
              day={turned === 6 && t >= day ? "26" : undefined}
              dayPop={pop(t, day)}
              flip={turned < 6 || turning < 1 ? turning : 1}
              circle={ramp(t, day + 0.3, 0.45)}
            />
          </K.At>
        </>
      }
    />
  );
};

const Where: React.FC<{ t: number }> = ({ t }) => {
  const extra = cue.at("an extra thousand");
  const go = cue.at("go?");
  const cards = [
    { icon: "mask" as const, label: "Robbed?", show: cue.at("Nobody robbed"), cross: cue.at("robbed him") + 0.3 },
    { icon: "dice" as const, label: "Gambled?", show: cue.at("He didn't gamble"), cross: cue.at("gamble it") + 0.25 },
    { icon: "calculator" as const, label: "Bad at maths?", show: cue.at("he's not bad"), cross: cue.at("maths") + 0.1 },
  ];
  const fly = ramp(t, extra, go - extra, Easing.inOut(Easing.quad));
  const pose = poseAt(t, [
    [0, poses.think],
    [cards[2].cross + 0.2, { ...poses.think, armF: [70, 130], armB: [-70, -130], headTilt: 6 }],
  ]);
  return (
    <Stage
      theme={T}
      zoom={drift(t, CUT.where, CUT.millions)}
      back={
        <>
          <S.RoomShell t={T} />
          <S.Plant t={T} x={130} s={0.8} />
        </>
      }
      front={
        <>
          <Prosper t={t} x={440} pose={alive(pose, t)} expression="wonder" />
          <K.At x={mix(640, 1120, fly)} y={mix(340, 150, fly) + Math.sin(t * 9) * 10} s={pop(t, extra) * (1 - ramp(t, go, 0.22))} r={-6}>
            <K.WingedMoney t={T} flap={Math.sin(t * 26) * 20} text="$1,000" />
          </K.At>
          {[0, 1, 2].map((i) => (
            <K.At key={i} x={1040 + i * 90} y={[190, 140, 200][i]} s={pop(t, go + 0.1 + i * 0.09) * (1 - ramp(t, cards[0].show - 0.25, 0.2))} r={[-12, 4, 14][i]}>
              <K.Txt size={130} weight={700} fill={T.accent}>
                ?
              </K.Txt>
            </K.At>
          ))}
          {cards.map((c, i) => (
            <K.At key={c.label} x={900 + i * 350} y={mix(360, 430, pop(t, c.show))} s={1.14 * pop(t, c.show)} r={[-3, 2, -2][i]}>
              <K.IconCard t={T} icon={c.icon} label={c.label} cross={ramp(t, c.cross, 0.3)} />
            </K.At>
          ))}
        </>
      }
    />
  );
};

const CROWD = [
  { floor: 610, scale: 0.34, count: 11, opacity: 0.45 },
  { floor: 745, scale: 0.44, count: 9, opacity: 0.7 },
  { floor: 880, scale: 0.54, count: 7, opacity: 1 },
];

const Millions: React.FC<{ t: number }> = ({ t }) => {
  const crowd = cue.at("millions of people") - 0.3;
  const card = cue.at("it has almost");
  const strike = cue.at("nothing to do");
  return (
    <Stage
      theme={T}
      zoom={drift(t, CUT.millions, CUT.traps)}
      back={
        <>
          <rect x={-60} y={-60} width={S.W + 120} height={S.H + 120} fill="url(#wall)" />
          <rect x={-60} y={540} width={S.W + 120} height={S.H} fill={T.floor} />
          <path d={`M-60 540 H${S.W + 60}`} stroke={T.line} strokeWidth={7} />
        </>
      }
      front={
        <>
          {CROWD.map((row, r) => (
            <g key={r} opacity={row.opacity}>
              {Array.from({ length: row.count }, (_, i) => {
                const x = ((i + 0.5) / row.count) * S.W + (r % 2 ? 0 : 30);
                if (r === 2 && i === 3) return null;
                const seed = r * 31 + i * 7;
                const base = [poses.slump, poses.idle, mixPose(poses.slump, poses.idle, 0.5)][seed % 3];
                const size = row.scale * pop(t, crowd + (Math.abs(x - 960) / 960) * 1.1 + (seed % 5) * 0.04);
                return size < 0.01 ? null : (
                  <Stickman
                    key={i}
                    theme={T}
                    outfit="plain"
                    x={x}
                    floorY={row.floor}
                    scale={size}
                    pose={alive(base, t, seed)}
                    expression="sad"
                    blink={blinkAt(t, seed)}
                    facing={seed % 2 ? 1 : -1}
                  />
                );
              })}
            </g>
          ))}
          <Prosper t={t} x={960} floorY={905} pose={alive(mixPose(poses.slump, poses.idle, 0.35), t)} expression="sad" />
          <K.At x={960} y={mix(140, 205, pop(t, card))} s={0.74 * pop(t, card)} r={-2}>
            <K.PayCard t={T} amount={4000} strike={ramp(t, strike, 0.4)} />
          </K.At>
        </>
      }
    />
  );
};

const Traps: React.FC<{ t: number }> = ({ t }) => {
  const drop = cue.at("three money traps");
  const which = cue.at("which ones");
  const moves = cue.at("three moves") - 0.1;
  const happy = moves + 0.75;
  const pose = poseAt(t, [
    [0, { ...poses.idle, lean: -5, headTilt: -10 }],
    [cue.at("By the end"), poses.think],
    [happy, poses.pump],
  ]);
  return (
    <Stage
      theme={T}
      zoom={drift(t, CUT.traps, HOOK_END)}
      back={
        <>
          <S.RoomShell t={T} />
          <S.Picture t={T} x={90} y={150} />
        </>
      }
      front={
        <>
          <Prosper t={t} x={340} pose={alive(pose, t)} expression={t < happy ? "wonder" : "open"} />
          {[0, 1, 2].map((i) => {
            const flip = ramp(t, moves + i * 0.22, 0.5, Easing.inOut(Easing.cubic));
            const ask = which + i * 0.24;
            return (
              <K.At
                key={i}
                x={820 + i * 360}
                y={mix(-320, 440, pop(t, drop + i * 0.22, 0.9))}
                s={1 + 0.07 * Math.sin(Math.PI * ramp(t, ask, 0.4))}
                r={[-4, 2, -3][i] * (1 - flip)}
              >
                <K.TrapCard t={T} n={i + 1} flip={flip} question={pop(t, ask)} />
              </K.At>
            );
          })}
          {[
            [690, 190, 0.8],
            [1360, 150, 0.6],
            [1760, 250, 0.9],
          ].map(([x, y, s], i) => (
            <S.Sparkle key={i} x={x} y={y} s={s * pop(t, happy + i * 0.15) * (0.85 + 0.15 * Math.sin(t * 6 + i))} c={i === 1 ? T.accent : T.accent2} />
          ))}
        </>
      }
    />
  );
};

export const V01Hook: React.FC = () => {
  const t = useT();
  const Scene = t < CUT.later ? Raise : t < CUT.where ? Later : t < CUT.millions ? Where : t < CUT.traps ? Millions : Traps;
  return (
    <AbsoluteFill style={{ background: T.wall2 }}>
      <Audio src={staticFile("v01/narration.mp3")} />
      <Scene t={t} />
      {Object.values(CUT).map((at) => (
        <Wipe key={at} t={t} at={at} theme={T} />
      ))}
      <Captions timings={timings} theme={T} />
    </AbsoluteFill>
  );
};
