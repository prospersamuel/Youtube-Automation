import React from "react";
import { Easing } from "remotion";
import * as K from "../../kit/props";
import { CardRowScene, TitleScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, cue, para, pip, sequence, T } from "./shared";
import { Street } from "./TrapOne";
import { QUICK_TEST_END } from "./TrapThree";

const c = cue.at;
const Room = <S.RoomShell t={T} />;

export const WAY_OUT_END = cue.end("paid for by the assets") + 0.4;

const Intro = (t: number, zoom: number) => {
  const moves = c("Here are three moves");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={Room}
      front={
        <>
          <K.At x={960} y={170} s={pop(t, QUICK_TEST_END + 0.4)}>
            <K.Txt y={40} size={130} weight={700} fill={T.line}>
              The way out
            </K.Txt>
          </K.At>
          {[0, 1, 2].map((i) => (
            <K.At key={i} x={620 + i * 340} y={mix(-320, 540, pop(t, moves + i * 0.2, 0.9))} s={0.92} r={[-4, 2, -3][i]}>
              <K.TrapCard t={T} n={i + 1} flip={1} />
            </K.At>
          ))}
          <K.At x={960} y={812} s={pop(t, c("None of them need"))}>
            <K.Pill t={T} text="No bigger salary needed" fill={T.accent} w={640} />
          </K.At>
        </>
      }
    />
  );
};

const Flip = (t: number, zoom: number) => {
  const start = para("Most people spend first");
  const turn = c("So flip the order");
  const flip = ramp(t, turn, 0.7, Easing.inOut(Easing.cubic));
  const xs = [620, 1060, 1500];
  const y = 400;
  const lift = Math.sin(Math.PI * flip) * 110;
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={Room}
      front={
        <>
          {pip(t, 240, [[0, poses.think], [turn + 0.5, poses.pump]], flip < 0.5 ? "wonder" : "open")}
          <K.At x={xs[0]} y={y} s={pop(t, start + 0.2)}>
            <K.Box t={T} text="Salary" sub="arrives" />
          </K.At>
          <K.At x={xs[0] + 165} y={y}>
            <K.Arrow t={T} len={100} k={ramp(t, c("spend first"), 0.3)} />
          </K.At>
          <K.At x={xs[1] + 165} y={y}>
            <K.Arrow t={T} len={100} k={ramp(t, c("save whatever"), 0.3)} />
          </K.At>
          <K.At x={mix(xs[1], xs[2], flip)} y={y - lift} s={pop(t, c("spend first"))}>
            <K.Box t={T} text="Spending" fill={T.accent} sub={flip < 0.5 ? "comes first" : "what's left"} />
          </K.At>
          <K.At x={mix(xs[2], xs[1], flip)} y={y + lift} s={pop(t, c("save whatever"))}>
            <K.Box t={T} text="Savings" fill={T.accent2} sub={flip >= 0.5 ? "comes first" : t > c("usually nothing") ? "what's left: $0" : "what's left"} />
          </K.At>
          <K.At x={1060} y={150} s={pop(t, turn + 0.7)} r={-2}>
            <K.Pill t={T} text="Pay yourself first" w={540} />
          </K.At>
        </>
      }
    />
  );
};

const Auto = (t: number, zoom: number) => {
  const start = c("The day your salary arrives");
  const slice = c("a fixed slice goes");
  const fill = ramp(t, slice + 0.5, 1.5);
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={Room}
      front={
        <>
          {pip(t, 230, [[0, poses.idle], [slice, aim], [c("You'll be surprised"), poses.pump]], "open")}
          <K.At x={720} y={mix(210, 270, pop(t, start + 0.1))} s={0.78 * pop(t, start + 0.1)} r={-3}>
            <K.PayCard t={T} amount={4000} />
          </K.At>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const k = ramp(t, slice + 0.3 + i * 0.22, 0.7, Easing.inOut(Easing.quad));
            return k <= 0 || k >= 1 ? null : (
              <K.At key={i} x={mix(930, 1560, k)} y={mix(300, 250, k) - Math.sin(Math.PI * k) * 150}>
                <K.Coin t={T} />
              </K.At>
            );
          })}
          <K.At x={1560} y={mix(410, 480, pop(t, start + 0.3))} s={pop(t, start + 0.3)}>
            <K.Meter t={T} level={0.5 * fill} label="SAVINGS" value={K.money(Math.round((500 * fill) / 10) * 10)} />
          </K.At>
          <K.At x={1140} y={110} s={pop(t, c("automatically"))} r={-3}>
            <K.Pill t={T} text="Automatic" fill={T.line} w={320} />
          </K.At>
          <K.At x={720} y={540} s={pop(t, c("Then you live on the rest"))}>
            <K.Pill t={T} text="$3,500 to live on" w={480} />
          </K.At>
          <K.At x={1560} y={822} s={pop(t, c("You can't spend what you never"))}>
            <K.Pill t={T} text="Out of sight" fill={T.accent} w={340} />
          </K.At>
        </>
      }
    />
  );
};

const Steps = (t: number, zoom: number) => {
  const five = c("Even five percent");
  const easy = c("raising the number is easy");
  const bars = [five, easy, easy + 0.28, easy + 0.56];
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={Room}
      front={
        <>
          {pip(t, 380, [[0, poses.idle], [five, aim], [easy, poses.pump]], "open")}
          <path d="M800 780 H1720" stroke={T.line} strokeWidth={8} strokeLinecap="round" />
          {bars.map((at, i) => {
            const full = 90 + i * 95;
            const h = full * ramp(t, at, 0.45);
            return (
              <g key={i}>
                {h > 2 && <rect x={860 + i * 220} y={776 - h} width={130} height={h} rx={12} fill={i === 0 ? T.accent : T.accent2} stroke={T.line} strokeWidth={8} />}
                <K.At x={925 + i * 220} y={776 - full - 52} s={pop(t, at + 0.3)}>
                  <K.Txt y={18} size={56} weight={700} fill={T.line}>
                    {`${5 + i * 5}%`}
                  </K.Txt>
                </K.At>
              </g>
            );
          })}
          <K.At x={1250} y={150} s={pop(t, c("The amount matters less"))} r={-2}>
            <K.Pill t={T} text="The habit matters most" w={620} />
          </K.At>
        </>
      }
    />
  );
};

const Half = (t: number, zoom: number) => {
  const start = para("The next time you get a raise");
  const half = c("let half of it");
  const split = ramp(t, half, 0.6, Easing.inOut(Easing.cubic));
  const y = mix(320, 520, split);
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={Room}
      front={
        <>
          {pip(t, 300, [[0, poses.idle], [half, aim]], "smile")}
          <K.At x={1150} y={150} s={pop(t, start + 0.2)}>
            <K.Pill t={T} text="RAISE  +$1,000" fill={T.line} w={540} />
          </K.At>
          <K.At x={mix(950, 850, split)} y={y} s={pop(t, start + 0.4)}>
            <K.Box t={T} text="+$500" sub={split > 0.5 ? "improves your life" : undefined} fill={T.accent} w={400} />
          </K.At>
          <K.At x={mix(1350, 1450, split)} y={y} s={pop(t, start + 0.4)}>
            <K.Box t={T} text="+$500" sub={t > c("send the other half") ? "goes to savings" : undefined} fill={T.accent2} w={400} />
          </K.At>
        </>
      }
    />
  );
};

const Gap = (t: number, zoom: number) => {
  const grow = ramp(t, c("You can build wealth"), 0.7);
  const gap = c("the gap between");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={Room}
      front={
        <>
          {pip(t, 380, [[0, poses.think], [gap, aim]], "wonder")}
          <path d="M840 780 H1480" stroke={T.line} strokeWidth={8} strokeLinecap="round" />
          {grow > 0.01 && (
            <>
              <rect x={920} y={776 - 440 * grow} width={170} height={440 * grow} rx={12} fill={T.accent2} stroke={T.line} strokeWidth={8} />
              <rect x={1220} y={776 - 290 * grow} width={170} height={290 * grow} rx={12} fill={T.accent} stroke={T.line} strokeWidth={8} />
            </>
          )}
          <g opacity={ramp(t, c("You can build wealth"), 0.3)}>
            <K.Txt x={1005} y={842} size={44} fill={T.line}>
              You earn
            </K.Txt>
            <K.Txt x={1305} y={842} size={44} fill={T.line}>
              You spend
            </K.Txt>
          </g>
          <rect x={1220} y={336} width={170} height={150} rx={12} fill={T.accent2} opacity={0.3 * ramp(t, gap, 0.3)} />
          <rect x={1220} y={336} width={170} height={150} rx={12} fill="none" stroke={T.line} strokeWidth={7} strokeDasharray="14 12" opacity={ramp(t, gap, 0.3)} />
          <K.At x={1600} y={411} s={pop(t, gap + 0.2)}>
            <K.Pill t={T} text="THE GAP" w={300} />
          </K.At>
          <K.At x={1250} y={150} s={pop(t, c("you fully control"))} r={-2}>
            <K.Pill t={T} text="This part is yours" fill={T.accent} w={520} />
          </K.At>
        </>
      }
    />
  );
};

const coins = (t: number, from: [number, number], to: [number, number], since: number) =>
  t < since
    ? null
    : [0, 1, 2].map((i) => {
        const k = ((t - since) * 0.7 + i / 3) % 1;
        return (
          <K.At key={i} x={mix(from[0], to[0], k)} y={mix(from[1], to[1], k) - Math.sin(Math.PI * k) * 70} s={Math.min(1, 4 * k, 4 * (1 - k))}>
            <K.Coin t={T} />
          </K.At>
        );
      });

const InOut = (t: number, zoom: number) => {
  const asset = c("An asset puts money");
  const liability = c("A liability takes money");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={Room}
      front={
        <>
          {pip(t, 960, [[0, poses.idle], [asset, poses.pump], [liability, poses.slump]], t < liability ? "open" : "sad")}
          <K.At x={420} y={300} s={pop(t, asset)}>
            <K.Box t={T} text="ASSET" sub="money in" fill={T.accent2} w={360} />
          </K.At>
          {t < liability && coins(t, [520, 440], [900, 620], asset + 0.3)}
          <K.At x={1500} y={300} s={pop(t, liability)}>
            <K.Box t={T} text="LIABILITY" sub="money out" fill={T.accent} w={400} />
          </K.At>
          {coins(t, [1020, 620], [1400, 440], liability + 0.3)}
        </>
      }
    />
  );
};

const Order = (t: number, zoom: number) => {
  const most = c("Most people buy liabilities");
  const rich = c("The wealthy buy assets");
  const row = (y: number, label: string, labelAt: number, boxes: { text: string; sub?: string; fill?: string; at: number }[]) => (
    <>
      <K.At x={560} y={y} s={pop(t, labelAt)}>
        <K.Pill t={T} text={label} fill={T.line} w={330} size={44} />
      </K.At>
      {boxes.map((b, i) => (
        <g key={b.text}>
          {i > 0 && (
            <K.At x={900 + (i - 1) * 390 + 166} y={y}>
              <K.Arrow t={T} len={58} k={ramp(t, b.at, 0.25)} />
            </K.At>
          )}
          <K.At x={900 + i * 390} y={y} s={pop(t, b.at)}>
            <K.Box t={T} text={b.text} sub={b.sub} fill={b.fill} w={320} />
          </K.At>
        </g>
      ))}
    </>
  );
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={Room}
      front={
        <>
          {pip(t, 190, [[0, poses.think]], "wonder", { scale: 0.85 })}
          {row(290, "Most people", most, [
            { text: "Salary", at: most + 0.2 },
            { text: "Liabilities", sub: "called rewards", fill: T.accent, at: most + 0.6 },
          ])}
          {row(590, "The wealthy", rich, [
            { text: "Salary", at: rich + 0.2 },
            { text: "Assets", sub: "come first", fill: T.accent2, at: rich + 0.6 },
            { text: "Rewards", sub: "paid by assets", at: c("pay for the rewards") },
          ])}
        </>
      }
    />
  );
};

const ToysLater = (t: number, zoom: number) => {
  const start = para("So it's not that");
  const first = c("Assets first", 1);
  const toys = c("Toys later");
  const paid = c("paid for by the assets");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<Street />}
      front={
        <>
          {pip(t, 300, [[0, poses.idle], [first, aim], [paid, poses.pump]], "open")}
          <g opacity={t < toys ? 0.3 : 1}>
            <K.At x={1420} y={S.FLOOR + 36}>
              <K.Car t={T} sleek />
            </K.At>
          </g>
          <K.At x={790} y={mix(330, 400, pop(t, start + 0.2))} s={0.95 * pop(t, start + 0.2)} r={-3}>
            <K.ItemCard t={T} icon="chart" label="Assets" />
          </K.At>
          <K.At x={790} y={130} s={pop(t, first)}>
            <K.Pill t={T} text="1. Assets first" w={430} />
          </K.At>
          <K.At x={1420} y={480} s={pop(t, toys)}>
            <K.Pill t={T} text="2. Toys later" fill={T.accent} w={400} />
          </K.At>
          {coins(t, [930, 420], [1380, 660], paid)}
        </>
      }
    />
  );
};

const title = (prefix: string, n: number, lines: string[], size?: number) => ({
  at: para(prefix) - 0.3,
  render: (t: number, zoom: number) => <TitleScene theme={T} t={t} zoom={zoom} at={para(prefix) - 0.3} n={n} move lines={lines} size={size} />,
});

export const wayOutScenes = sequence(
  [
    { at: QUICK_TEST_END, render: Intro },
    title("Move one.", 1, ["Pay yourself", "first"]),
    { at: para("Most people spend first") - 0.3, render: Flip },
    { at: c("The day your salary arrives") - 0.3, render: Auto },
    { at: para("Start small") - 0.3, render: Steps },
    title("Move two.", 2, ["Grow slower", "than your pay"]),
    { at: para("The next time you get a raise") - 0.3, render: Half },
    { at: c("The logic is simple") - 0.3, render: Gap },
    title("Move three.", 3, ["Buy assets", "before liabilities"], 104),
    { at: para("This is one of the most famous") - 0.3, render: InOut },
    {
      at: para("A share in a company") - 0.3,
      render: (t, zoom) => (
        <CardRowScene
          theme={T}
          t={t}
          zoom={zoom}
          hero={pip(t, 430, [[0, aim]], "open")}
          header={{ text: "ASSETS", at: para("A share in a company"), fill: T.accent2, w: 360 }}
          cards={[
            { icon: "chart", label: "Shares", at: c("A share in a company"), check: c("Those are assets") },
            { icon: "shop", label: "A business", at: c("A small business"), check: c("Those are assets") + 0.15 },
            { icon: "cap", label: "A skill", at: c("Even a skill"), check: c("Those are assets") + 0.3 },
          ]}
        />
      ),
    },
    {
      at: para("A car payment") - 0.3,
      render: (t, zoom) => (
        <CardRowScene
          theme={T}
          t={t}
          zoom={zoom}
          hero={pip(t, 430, [[0, poses.think]], "sad")}
          header={{ text: "LIABILITIES", at: para("A car payment"), fill: T.accent, w: 440 }}
          cards={[
            { icon: "car", label: "Car payment", at: c("A car payment") },
            { icon: "phone", label: "New phone", at: c("The newest phone") },
            { icon: "house", label: "Bigger place", at: c("A bigger apartment") },
          ]}
        />
      ),
    },
    { at: para("Most people buy liabilities") - 0.3, render: Order },
    { at: para("So it's not that") - 0.3, render: ToysLater },
  ],
  WAY_OUT_END
);
