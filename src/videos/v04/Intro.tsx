import React from "react";
import * as K from "../../kit/props";
import { QuoteScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, Asker, cue, para, pip, SectionTitle, sequence, T, WHITE } from "./shared";

const c = cue.at;

// A little shop-front sign above each tutor.
const Board: React.FC<{ price: string; sub: string; fill: string }> = ({ price, sub, fill }) => (
  <g>
    <rect x={-190} y={-90} width={380} height={180} rx={20} fill={fill} stroke={T.line} strokeWidth={8} />
    <K.Txt y={-8} size={76} weight={700} fill={WHITE}>
      {price}
    </K.Txt>
    <K.Txt y={58} size={38} weight={600} fill={WHITE}>
      {sub}
    </K.Txt>
  </g>
);

const TwoTutors = (t: number, zoom: number) => {
  const rival = para("Two streets away") - 0.2;
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={
        <>
          <rect x={-60} y={-60} width={S.W + 120} height={S.H + 120} fill="url(#wall)" />
          <rect x={-60} y={S.FLOOR} width={S.W + 120} height={S.H} fill={T.floor} />
          <path d={`M-60 ${S.FLOOR} H${S.W + 60}`} stroke={T.line} strokeWidth={7} />
          <path d={`M${S.W / 2} 40 V${S.FLOOR}`} stroke={T.line} strokeWidth={6} strokeDasharray="24 18" opacity={0.4 * ramp(t, rival, 0.4)} />
        </>
      }
      front={
        <>
          {pip(t, 480, [[0, poses.wave], [c("almost nobody"), poses.slump]], t < c("almost nobody") ? "smile" : "sad")}
          <K.At x={480} y={mix(-150, 170, pop(t, c("twenty dollars an hour")))}>
            <Board price="$20/hr" sub="maths tutor" fill={T.accent2} />
          </K.At>
          <K.At x={480} y={325} s={pop(t, c("almost nobody"))}>
            <K.Pill t={T} text="0 bookings" w={300} fill={T.line} />
          </K.At>
          <g opacity={ramp(t, rival, 0.4)}>
            <Asker t={t} x={1440} pose={poses.wave} />
          </g>
          <K.At x={1440} y={mix(-150, 170, pop(t, c("sixty dollars an hour")))}>
            <Board price="$60/hr" sub="maths tutor" fill={T.accent} />
          </K.At>
          <K.At x={1440} y={325} s={pop(t, c("waiting list"))}>
            <K.Pill t={T} text="Waiting list" w={340} fill={T.accent} />
          </K.At>
          <K.At x={960} y={560} s={pop(t, c("It's the offer"))}>
            <K.Pill t={T} text="The difference: the offer" w={760} fill={T.line} />
          </K.At>
        </>
      }
    />
  );
};

const Wants = (t: number, zoom: number) => {
  const nobody = c("Nobody wakes up");
  const wants: [string, string][] = [
    ["No homework tears", "stops crying"],
    ["A better grade", "A better grade"],
    ["Less worry", "A little less worry"],
  ];
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, aim], [nobody, poses.think]], t < nobody ? "smile" : "wonder")}
          <K.At x={700} y={mix(260, 330, pop(t, para("His offer was") + 0.3))} s={pop(t, para("His offer was") + 0.3)} r={-3}>
            <K.Box t={T} text="1 HOUR" sub="$20" w={330} />
            <path d="M-150 -60 L150 60" stroke={T.accent} strokeWidth={14} strokeLinecap="round" opacity={ramp(t, nobody, 0.3)} />
          </K.At>
          <K.At x={1350} y={130} s={pop(t, c("What they want"))}>
            <K.Pill t={T} text="What parents want" w={560} fill={T.accent2} />
          </K.At>
          {wants.map(([label, phrase], i) => (
            <K.At key={label} x={1350} y={290 + i * 190} s={pop(t, c(phrase))} r={[-2, 2, -1][i]}>
              <K.Box t={T} text={label} w={560} fill={i === 1 ? T.accent : undefined} />
            </K.At>
          ))}
        </>
      }
    />
  );
};

const TimeVsResult = (t: number, zoom: number) => (
  <Stage
    theme={T}
    zoom={zoom}
    back={<S.RoomShell t={T} />}
    front={
      <>
        {pip(t, 230, [[0, poses.point], [c("always pay more"), poses.pump]], "open")}
        <K.At x={800} y={380} s={pop(t, c("selling his time"))} r={-2}>
          <K.Box t={T} text="TIME" sub="what Pip sold" w={400} />
        </K.At>
        <K.At x={1060} y={380}>
          <K.Txt y={26} size={80} weight={700} fill={T.line} opacity={ramp(t, c("selling a result"), 0.3)}>
            vs
          </K.Txt>
        </K.At>
        <K.At x={1360} y={380} s={pop(t, c("selling a result"))} r={2}>
          <K.Box t={T} text="RESULT" sub="what she sold" fill={T.accent2} w={400} />
        </K.At>
        <K.At x={1080} y={720} s={pop(t, c("always pay more"))}>
          <K.Pill t={T} text="People pay more for results" w={860} fill={T.accent} />
        </K.At>
      </>
    }
  />
);

export const introScenes = sequence(
  [
    { at: 0, render: TwoTutors },
    {
      at: para("By the end") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("By the end") - 0.3}
          tag="IN THIS VIDEO"
          hero={pip(t, 260, [[0, aim]], "smile")}
          size={66}
          lines={[
            { text: "The formula behind offers", at: c("the simple formula") },
            { text: "people feel silly refusing", at: c("feel silly turning down"), accent: true },
          ]}
        />
      ),
    },
    {
      at: para("Let's start with") - 0.3,
      render: (t, zoom) => <SectionTitle t={t} zoom={zoom} at={para("Let's start with") - 0.3} n={1} lines={["People don't", "buy hours"]} />,
    },
    { at: para("His offer was") - 0.3, render: Wants },
    { at: para("Pip was selling his time") - 0.3, render: TimeVsResult },
  ],
  para("So how do you make") - 0.3
);
