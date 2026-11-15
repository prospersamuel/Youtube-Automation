import React from "react";
import { alive, blinkAt } from "../../kit/pose";
import * as K from "../../kit/props";
import { CardRowScene, ListScene, QuoteScene, TitleScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { Stickman, poses } from "../../Stickman";
import { aim, cue, para, pip, sequence, T } from "./shared";
import { Street, Tag } from "./TrapOne";
import { TRAP_TWO_END } from "./TrapTwo";

const c = cue.at;

export const TRAP_THREE_END = cue.end("could stop working tomorrow") + 0.4;
export const QUICK_TEST_END = cue.end("I was") + 0.4;

const CarValue = (t: number, zoom: number) => (
  <Stage
    theme={T}
    zoom={zoom}
    back={<Street />}
    front={
      <>
        {pip(t, 330, [[0, poses.think]], "wonder")}
        <K.At x={980} y={S.FLOOR + 36}>
          <K.Car t={T} sleek />
        </K.At>
        <Tag t={t} at={c("hundred thousand dollar car") - 0.1} x={980} y={70} amount="$100,000" note="the car" size={78} />
        <Tag t={t} at={c("less than they used") - 0.5} x={1560} y={90} amount="−$100,000" note="in the bank" size={70} />
        <Tag t={t} at={c("more debt") - 0.5} x={1560} y={390} amount="+$100,000" note="of debt" size={70} />
      </>
    }
  />
);

const Hidden = (t: number, zoom: number) => {
  const ground = 600;
  const skipped = c("the car you didn't buy");
  const sits = c("It sits quietly");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={
        <>
          <rect x={-60} y={-60} width={S.W + 120} height={S.H + 120} fill="url(#wall)" />
          <rect x={-60} y={ground} width={S.W + 120} height={S.H} fill="#C9B48C" />
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d={`M${90 + i * 118} ${670 + ((i * 53) % 190)} h34`} stroke={T.line} strokeWidth={5} strokeLinecap="round" opacity={0.18} />
          ))}
          <path d={`M-60 ${ground} H${S.W + 60}`} stroke={T.line} strokeWidth={7} />
        </>
      }
      front={
        <>
          {pip(t, 420, [[0, poses.idle], [c("Wealth is the money"), aim]], "smile", { floorY: ground })}
          <g opacity={0.3}>
            <K.At x={1320} y={ground} s={pop(t, skipped)}>
              <K.Car t={T} sleek />
            </K.At>
          </g>
          <K.At x={1320} y={250} s={pop(t, skipped + 0.3)} r={-3}>
            <K.Pill t={T} text="Didn't buy" fill={T.line} w={330} />
          </K.At>
          <K.At x={900} y={mix(880, 800, pop(t, sits))} s={pop(t, sits)}>
            <rect x={-150} y={-120} width={300} height={220} rx={22} fill={T.accent2} stroke={T.line} strokeWidth={9} />
            <circle cx={0} cy={-10} r={54} fill="#FFFDF8" stroke={T.line} strokeWidth={8} />
            <path d="M0 -44 V-10 H30" stroke={T.line} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <rect x={-180} y={96} width={360} height={24} rx={10} fill={T.line} />
          </K.At>
          {[
            [1130, 892],
            [1194, 892],
            [1258, 892],
            [1162, 842],
            [1226, 842],
            [1194, 792],
          ].map(([x, y], i) => (
            <K.At key={i} x={x} y={y} s={pop(t, sits + 0.35 + i * 0.14)}>
              <K.Coin t={T} />
            </K.At>
          ))}
          <K.At x={1560} y={770} s={pop(t, c("where nobody can see"))} r={-2}>
            <K.Pill t={T} text="Nobody sees this" w={450} />
          </K.At>
        </>
      }
    />
  );
};

const Neighbours = (t: number, zoom: number) => {
  const L = 500;
  const R = 1420;
  const debt = c("owes money");
  const looks = c("looks rich");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={
        <>
          <rect x={-60} y={-60} width={S.W + 120} height={S.H + 120} fill="url(#wall)" />
          <rect x={-60} y={S.FLOOR} width={S.W + 120} height={S.H} fill={T.floor} />
          <path d={`M-60 ${S.FLOOR} H${S.W + 60}`} stroke={T.line} strokeWidth={7} />
          <g transform={`translate(${L} ${S.FLOOR}) scale(1.15)`}>
            <K.House t={T} roof={T.accent} />
          </g>
          <g transform={`translate(${R} ${S.FLOOR}) scale(1.15)`}>
            <K.House t={T} roof={T.accent2} />
          </g>
        </>
      }
      front={
        <>
          <K.At x={L - 260} y={S.FLOOR + 40} s={0.62 * pop(t, c("brand new car"))}>
            <K.Car t={T} sleek />
          </K.At>
          <Stickman
            theme={T}
            outfit="hoodie"
            x={L + 310}
            floorY={S.FLOOR}
            scale={0.8}
            pose={alive(poses.phone, t, 2)}
            expression="open"
            blink={blinkAt(t, 2)}
            inHand={<K.HandPhone t={T} />}
          />
          <K.At x={L + 250} y={390} s={0.44 * pop(t, c("a different outfit"))} r={-5}>
            <K.ItemCard t={T} icon="shirt" label="Outfits" />
          </K.At>
          <K.At x={L + 400} y={410} s={0.44 * pop(t, c("posts every holiday"))} r={5}>
            <K.ItemCard t={T} icon="photo" label="Holidays" />
          </K.At>
          <K.At x={R - 260} y={S.FLOOR + 40} s={0.62 * pop(t, c("ten year old car"))}>
            <K.Car t={T} />
          </K.At>
          <Stickman theme={T} outfit="plain" x={R + 310} floorY={S.FLOOR} scale={0.8} facing={-1} pose={alive(poses.idle, t, 5)} expression="smile" blink={blinkAt(t, 5)} />
          <K.At x={L} y={150} s={pop(t, c("they'll point")) * (1 - ramp(t, debt - 0.3, 0.2))} r={-2}>
            <K.Pill t={T} text="Doing better?" fill={T.line} w={420} />
          </K.At>
          <K.At x={L} y={110} s={pop(t, debt) * (1 - ramp(t, looks - 0.2, 0.2))}>
            <K.Pill t={T} text="Owes for all of it" fill={T.accent} w={470} />
          </K.At>
          <K.At x={R} y={110} s={pop(t, c("owns everything"))}>
            <K.Pill t={T} text="Owns it all" w={360} />
          </K.At>
          <K.At x={R} y={215} s={pop(t, c("quietly investing"))}>
            <K.Pill t={T} text="Investing for 10 years" w={540} size={42} />
          </K.At>
          <K.At x={L} y={150} s={pop(t, looks)} r={-4}>
            <K.Stamp t={T} text="LOOKS RICH" />
          </K.At>
          <K.At x={R} y={330} s={pop(t, c("The other one is"))} r={3}>
            <K.Pill t={T} text="IS WEALTHY" w={400} size={54} />
          </K.At>
        </>
      }
    />
  );
};

const SeeCant = (t: number, zoom: number) => {
  const see = c("copying what we see");
  const cant = c("We can't see anyone's");
  const copy = c("So we copy the spending");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, poses.think], [copy, poses.pump]], t < copy ? "wonder" : "open")}
          <K.At x={800} y={110} s={pop(t, see)}>
            <K.Pill t={T} text="WE SEE" fill={T.accent} w={300} />
          </K.At>
          {["car", "watch", "photo"].map((icon, i) => {
            const k = pop(t, see + 0.15 + i * 0.15);
            return (
              <K.At key={icon} x={590 + i * 210} y={mix(300, 360, k) - 26 * Math.sin(Math.PI * ramp(t, copy + i * 0.12, 0.4))} s={0.64 * k} r={[-3, 2, -2][i]}>
                <K.ItemCard t={T} icon={icon} label={["Cars", "Watches", "Holidays"][i]} />
              </K.At>
            );
          })}
          <K.At x={1520} y={110} s={pop(t, cant)}>
            <K.Pill t={T} text="WE CAN'T SEE" fill={T.line} w={430} />
          </K.At>
          <K.At x={1520} y={mix(570, 510, pop(t, cant + 0.15))} s={0.56 * pop(t, cant + 0.15)} r={3}>
            <K.BigPhone t={T} time={t} />
          </K.At>
        </>
      }
    />
  );
};

export const trapThreeScenes = sequence(
  [
    { at: TRAP_TWO_END, render: (t, zoom) => <TitleScene theme={T} t={t} zoom={zoom} at={TRAP_TWO_END} n={3} lines={["Rich is not", "wealthy"]} /> },
    {
      at: para("Wealth is what you don't see") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("Wealth is what you don't see") - 0.3}
          size={112}
          hero={pip(t, 280, [[0, aim]], "open")}
          lines={[
            { text: "Wealth is what", at: c("Wealth is what you don't see") },
            { text: "you don't see.", at: c("Wealth is what you don't see") + 0.6, accent: true },
          ]}
        />
      ),
    },
    { at: para("Think about it") - 0.3, render: CarValue },
    {
      at: para("Being rich is about") - 0.3,
      render: (t, zoom) => (
        <CardRowScene
          theme={T}
          t={t}
          zoom={zoom}
          hero={pip(t, 430, [[0, poses.idle], [c("It's visible"), aim]], "smile")}
          header={{ text: "RICH = WHAT YOU SEE", at: c("It's visible"), fill: T.accent, w: 660 }}
          cards={[
            { icon: "car", label: "The car", at: c("The car. The watch") },
            { icon: "watch", label: "The watch", at: c("The watch") },
            { icon: "photo", label: "The photos", at: c("The holiday photos") },
          ]}
        />
      ),
    },
    { at: para("Being wealthy is the opposite") - 0.3, render: Hidden },
    { at: para("Picture two neighbours") - 0.3, render: Neighbours },
    { at: para("And that creates a problem") - 0.3, render: SeeCant },
    {
      at: para("It doesn't. Plenty") - 0.3,
      render: (t, zoom) => (
        <CardRowScene
          theme={T}
          t={t}
          zoom={zoom}
          hero={pip(t, 430, [[0, poses.think]], "wonder")}
          cards={[
            { icon: "car", label: "Looks rich", at: c("Plenty of people who look"), pill: { text: "One paycheck away", at: c("one missed paycheck"), fill: T.accent } },
            { icon: "oldcar", label: "Ordinary car", at: c("plenty of people in ordinary"), pill: { text: "Could stop working", at: c("could stop working") } },
          ]}
        />
      ),
    },
  ],
  TRAP_THREE_END
);

export const quickTestScenes = sequence(
  [
    {
      at: TRAP_THREE_END,
      render: (t, zoom) => (
        <ListScene
          theme={T}
          t={t}
          zoom={zoom}
          at={TRAP_THREE_END}
          title="QUICK TEST"
          hero={pip(t, 260, [[0, poses.idle], [c("I was") - 0.2, poses.wave]], t < c("Most of us") ? "smile" : "open")}
          rows={[
            { text: "Income up, but savings flat?", at: c("If your income has gone up"), check: c("you're in trap one") },
            { text: "Bought it so others would see?", at: c("If you've ever bought"), check: c("that's trap two") },
            { text: "Judge people by what they drive?", at: c("And if you judge"), check: c("that's trap three") },
          ]}
        />
      ),
    },
  ],
  QUICK_TEST_END
);
