import React from "react";
import * as K from "../../kit/props";
import { ListScene, QuoteScene, TitleScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { mix, pop, ramp } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, cue, Hero, para, pip, sequence, T } from "./shared";

const c = cue.at;
const START = para("The first reason") - 0.3;

const why = (t: number, zoom: number, hero: React.ReactNode, at: number, checks: [number?, number?, number?], extra?: React.ReactNode) => (
  <ListScene
    theme={T}
    t={t}
    zoom={zoom}
    at={START}
    title="WHY IT WORKS"
    hero={hero}
    extra={extra}
    rows={[
      { text: "No fight to win", at: START + 0.6, check: checks[0] },
      { text: "Starting is done", at: c("The second reason") - 0.2, check: checks[1] },
      { text: "A vote for who you are", at: c("the third reason") - 0.2, check: checks[2] },
    ]}
  />
);

const Steps = (t: number, zoom: number) => {
  const labels = ["Shoes on", "One lap", "Short run", "5 km"];
  const ats = [c("Step one is"), c("one lap around"), c("a short run"), c("five kilometres he tried")];
  const tops = [800, 690, 580, 470];
  const xs = [560, 840, 1120, 1400];
  const pos = (i: number) => ({ x: xs[i], y: tops[i] });
  // Pip hops from step to step as each is mentioned.
  let idx = 0;
  ats.forEach((a, i) => {
    if (t >= a) idx = i;
  });
  const from = pos(Math.max(0, idx - 1));
  const to = pos(idx);
  const k = idx === 0 ? 1 : ramp(t, ats[idx], 0.9);
  const px = mix(from.x, to.x, k);
  const py = mix(from.y, to.y, k) - Math.sin(Math.PI * k) * 50;
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {xs.map((x, i) => {
            const s = pop(t, ats[i] - 0.4);
            return (
              <K.At key={i} x={x} y={tops[i]} s={s}>
                <rect x={-140} y={0} width={280} height={1100} fill={i === 3 ? T.accent : T.surface} stroke={T.line} strokeWidth={8} />
                <K.Txt y={64} size={46} weight={700} fill={i === 3 ? WHITE : T.line}>
                  {labels[i]}
                </K.Txt>
              </K.At>
            );
          })}
          <Hero t={t} x={px} floorY={py} pose={poses.pump} expression="open" scale={0.8} />
          <K.At x={1400} y={300}>
            <K.Confetti t={T} age={t - ats[3]} />
          </K.At>
        </>
      }
    />
  );
};
const WHITE = "#FFFDF8";

const FrontDoor = (t: number, zoom: number) => {
  const notAt = c("not the finish line");
  const doorAt = c("front door");
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 260, [[0, aim]], "smile")}
          <K.At x={860} y={440} s={pop(t, notAt - 0.3)} r={-2}>
            <K.Box t={T} text="FINISH LINE" w={440} />
            <path d="M-190 -20 L190 20" stroke={T.accent} strokeWidth={14} strokeLinecap="round" opacity={ramp(t, notAt + 0.6, 0.3)} />
          </K.At>
          <K.At x={1360} y={440} s={pop(t, doorAt)} r={2}>
            <K.Box t={T} text="FRONT DOOR" fill={T.accent2} w={460} />
          </K.At>
          <K.At x={1110} y={800} s={pop(t, c("master the habit"))}>
            <K.Pill t={T} text="Master showing up" w={640} fill={T.accent} />
          </K.At>
        </>
      }
    />
  );
};

export const worksScenes = sequence(
  [
    {
      at: para("There are three reasons") - 0.3,
      render: (t, zoom) => <TitleScene theme={T} t={t} zoom={zoom} at={para("There are three reasons") - 0.3} n={3} lines={["Three reasons", "it works"]} size={100} />,
    },
    { at: START, render: (t, z) => why(t, z, pip(t, 250, [[0, aim]], "smile"), START, [c("deep enough")]) },
    { at: para("The second reason") - 0.3, render: (t, z) => why(t, z, pip(t, 250, [[0, poses.pump]], "open"), START, [c("deep enough"), c("Well, I'm here")]) },
    {
      at: para("And that's the third") - 0.3,
      render: (t, z) =>
        why(
          t,
          z,
          pip(t, 250, [[0, poses.cheer]], "open"),
          START,
          [c("deep enough"), c("Well, I'm here"), c("who he is")],
          <K.At x={1170} y={mix(900, 840, pop(t, c("a hundred votes")))} s={pop(t, c("a hundred votes"))}>
            <K.Pill t={T} text="100 votes = identity" w={640} fill={T.accent} />
          </K.At>
        ),
    },
    {
      at: para("Now, you might") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("Now, you might") - 0.3}
          tag="BUT..."
          hero={pip(t, 260, [[0, poses.think]], "wonder")}
          size={66}
          lines={[
            { text: "Two minutes won't", at: c("But two minutes") },
            { text: "change my life?", at: c("change my life") },
            { text: "True. That's not the point.", at: c("And you're right"), accent: true },
          ]}
        />
      ),
    },
    { at: para("The two-minute rule is not") - 0.3, render: FrontDoor },
    { at: para("Think of it as") - 0.3, render: Steps },
  ],
  para("Here's how to use this") - 0.3
);
