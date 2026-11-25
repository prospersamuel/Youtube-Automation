import React from "react";
import * as K from "../../kit/props";
import { ListScene, QuoteScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, cue, Hero, para, pip, SectionTitle, sequence, T, WHITE } from "./shared";

const c = cue.at;
export const NARRATION_END = cue.end("I'll see you there");
export const V04_END = NARRATION_END + 10;

const Guarantee = (t: number, zoom: number) => (
  <Stage
    theme={T}
    zoom={zoom}
    back={<S.RoomShell t={T} />}
    front={
      <>
        {pip(t, 230, [[0, poses.think], [c("takes that fear away"), aim], [c("He knows his results"), poses.pump]], "smile")}
        <K.At x={1150} y={170} s={pop(t, c("fear of paying"))} r={-2}>
          <K.Pill t={T} text="Biggest fear: paying for nothing" w={900} fill={T.line} />
        </K.At>
        <K.At x={1150} y={430} s={pop(t, c("the next month"))} r={-4}>
          <K.Panel t={T} w={900} h={260} />
          <K.Txt y={-30} size={60} weight={700} fill={T.line}>
            No better grade?
          </K.Txt>
          <K.Txt y={60} size={64} weight={700} fill={T.accent}>
            Next month free.
          </K.Txt>
        </K.At>
        <K.At x={1150} y={720} s={pop(t, c("He knows his results"))} r={3}>
          <K.Stamp t={T} text="LOW RISK" />
        </K.At>
      </>
    }
  />
);

// A balance: the price on one pan, the value piling up on the other until it tips.
const Scale = (t: number, zoom: number) => {
  const items: [string, string][] = [
    ["Happier child", "happier at school"],
    ["Weekly proof", "weekly proof"],
    ["No effort", "no effort from them"],
    ["No risk", "and no risk"],
  ];
  const shown = items.filter(([, p]) => t >= c(p)).length;
  const tilt = mix(0, -12, ramp(t, c("happier at school"), 4)) * Math.min(1, shown / 2 + 0.2);
  const rad = (tilt * Math.PI) / 180;
  const L = 380;
  const lx = 1150 - L * Math.cos(rad);
  const ly = 340 + L * Math.sin(rad);
  const rx = 1150 + L * Math.cos(rad);
  const ry = 340 - L * Math.sin(rad);
  const pan = (x: number, y: number, children: React.ReactNode) => (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 L-120 260 M0 0 L120 260" stroke={T.line} strokeWidth={5} />
      <path d="M-150 260 H150 Q140 300 0 300 Q-140 300 -150 260 Z" fill={T.surface} stroke={T.line} strokeWidth={7} />
      {children}
    </g>
  );
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, poses.idle], [c("More parents say yes"), poses.cheer]], "open")}
          <path d="M1150 340 V820 M1060 820 H1240" stroke={T.line} strokeWidth={12} strokeLinecap="round" />
          <path d={`M${lx} ${ly} L${rx} ${ry}`} stroke={T.line} strokeWidth={12} strokeLinecap="round" />
          <circle cx={1150} cy={340} r={16} fill={T.line} />
          {pan(
            lx,
            ly,
            <K.At x={0} y={215} s={pop(t, c("raises his price"))}>
              <rect x={-90} y={-45} width={180} height={90} rx={16} fill={T.accent} stroke={T.line} strokeWidth={7} />
              <K.Txt y={18} size={50} weight={700} fill={WHITE}>
                $60
              </K.Txt>
            </K.At>
          )}
          {pan(
            rx,
            ry,
            items.map(([label, p], i) => (
              <K.At key={label} x={0} y={232 - i * 52} s={pop(t, c(p))}>
                <rect x={-140} y={-23} width={280} height={46} rx={12} fill={T.accent2} stroke={T.line} strokeWidth={5} />
                <K.Txt y={14} size={34} weight={700} fill={WHITE}>
                  {label}
                </K.Txt>
              </K.At>
            ))
          )}
          <K.At x={1150} y={110} s={pop(t, c("More parents say yes"))}>
            <K.Pill t={T} text="More parents say yes" w={640} fill={T.accent} />
          </K.At>
        </>
      }
    />
  );
};

const Waitlist = (t: number, zoom: number) => {
  const start = para("Three months later");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 400, [[0, poses.cheer], [c("He didn't become"), poses.idle]], "open")}
          <K.At x={1200} y={430} s={pop(t, start + 0.2)} r={-2}>
            <K.Panel t={T} w={640} h={560} />
            <K.Txt y={-200} size={56} weight={700} fill={T.accent}>
              WAITING LIST
            </K.Txt>
            {Array.from({ length: 5 }, (_, i) => (
              <g key={i} opacity={ramp(t, start + 0.6 + i * 0.35, 0.3)}>
                <circle cx={-220} cy={-110 + i * 80} r={18} fill={T.accent2} />
                <rect x={-180} y={-124 + i * 80} width={[340, 280, 380, 300, 250][i]} height={28} rx={14} fill={T.line} opacity={0.2} />
              </g>
            ))}
          </K.At>
          <K.At x={400} y={260}>
            <K.Confetti t={T} age={t - start - 0.3} />
          </K.At>
        </>
      }
    />
  );
};

const EndScreen = (t: number, zoom: number) => {
  const start = para("If this helped");
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
    {
      at: para("There's one more piece") - 0.3,
      render: (t, zoom) => <SectionTitle t={t} zoom={zoom} at={para("There's one more piece") - 0.3} n={3} lines={["Remove", "the risk"]} />,
    },
    { at: para("The biggest fear") - 0.3, render: Guarantee },
    {
      at: para("When a buyer") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("When a buyer") - 0.3}
          tag="FLIPPED"
          hero={pip(t, 260, [[0, aim]], "smile")}
          lines={[
            { text: "No risk to say yes,", at: c("takes no risk") },
            { text: "so no feels risky.", at: c("the risky choice"), accent: true },
          ]}
        />
      ),
    },
    { at: para("Now Pip raises") - 0.3, render: Scale },
    {
      at: para("That's what an offer") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("That's what an offer") - 0.3}
          tag="THE SECRET"
          hero={pip(t, 260, [[0, poses.point]], "smile")}
          size={64}
          lines={[
            { text: "Not a trick. Not a lower price.", at: c("It isn't a trick") },
            { text: "Value far bigger than cost.", at: c("clearly bigger than the cost"), accent: true },
          ]}
        />
      ),
    },
    {
      at: para("You can use this") - 0.3,
      render: (t, zoom) => (
        <ListScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("You can use this") - 0.3}
          title="BEFORE YOU SELL"
          hero={pip(t, 250, [[0, aim]], "smile")}
          rows={[
            { text: "A clear, big result", at: c("Check that the result") },
            { text: "Proof it's likely", at: c("proof it's likely") },
            { text: "Short wait, little effort", at: c("the wait feels short") },
            { text: "Remove their risk", at: c("take away their risk") },
          ]}
        />
      ),
    },
    {
      at: para("And the same formula") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("And the same formula") - 0.3}
          tag="AS A BUYER"
          hero={pip(t, 260, [[0, poses.think]], "wonder")}
          size={64}
          lines={[
            { text: "Check the proof is real.", at: c("the proof is real") },
            { text: "Get the guarantee in writing.", at: c("written down"), accent: true },
          ]}
        />
      ),
    },
    { at: para("Three months later") - 0.3, render: Waitlist },
    {
      at: para("So here's what") - 0.3,
      render: (t, zoom) => (
        <ListScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("So here's what") - 0.3}
          title="REMEMBER"
          hero={pip(t, 250, [[0, aim]], "smile")}
          rows={[
            { text: "Sell results, not time", at: c("People pay for results") },
            { text: "Big, believable, fast, easy", at: c("Make the result big") },
            { text: "Remove the risk", at: c("And remove the risk") },
          ]}
        />
      ),
    },
    { at: para("If this helped") - 0.3, render: EndScreen },
  ],
  V04_END
);
