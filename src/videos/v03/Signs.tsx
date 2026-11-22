import React from "react";
import * as K from "../../kit/props";
import { ListScene, QuoteScene } from "../../kit/scenes";
import { Stage } from "../../kit/Stage";
import { pop } from "../../kit/time";
import * as S from "../../scenery";
import { poses } from "../../Stickman";
import { aim, cue, Hero, para, pip, sequence, T } from "./shared";

const c = cue.at;
const SIGNS = para("Here are three signs") - 0.3;
const OUT = para("So what do you do") - 0.3;

const Label = (t: number, zoom: number) => (
  <Stage
    theme={T}
    zoom={zoom}
    back={<S.RoomShell t={T} />}
    front={
      <>
        {pip(t, 560, [[0, poses.idle], [c("kind of person"), poses.pump]], "smile")}
        <K.At x={560} y={600} s={0.85 * pop(t, c("kind of person"))} r={-4}>
          <K.NameTag t={T} text="I CARE" />
        </K.At>
        <K.At x={1300} y={360} s={pop(t, c("becomes a label"))}>
          <K.Pill t={T} text="A small yes becomes a label" w={820} fill={T.accent2} />
        </K.At>
        <K.At x={1300} y={560} s={pop(t, c("being true"))}>
          <K.Pill t={T} text="Next ask = stay true to it" w={820} fill={T.accent} />
        </K.At>
      </>
    }
  />
);

const Proof = (t: number, zoom: number) => {
  const items: [string, string][] = [
    ["SIGN IT", "Signing your name"],
    ["WRITE IT", "filling in a form"],
    ["SAY IT", "saying it in front"],
  ];
  return (
    <Stage
      theme={T}
      zoom={zoom}
      back={<S.RoomShell t={T} />}
      front={
        <>
          {pip(t, 230, [[0, aim]], "smile")}
          {items.map(([label, phrase], i) => (
            <K.At key={label} x={720 + i * 420} y={400} s={pop(t, c(phrase))} r={[-2, 2, -1][i]}>
              <K.Box t={T} text={label} w={340} />
            </K.At>
          ))}
          <K.At x={1140} y={720} s={pop(t, c("feel like proof"))}>
            <K.Pill t={T} text="Feels like proof" w={560} fill={T.accent} />
          </K.At>
        </>
      }
    />
  );
};

const signs = (t: number, zoom: number, hero: React.ReactNode, check3?: number, extra?: React.ReactNode) => (
  <ListScene
    theme={T}
    t={t}
    zoom={zoom}
    at={SIGNS}
    title="3 SIGNS"
    hero={hero}
    extra={extra}
    rows={[
      { text: "The first ask is tiny", at: c("Sign one") },
      { text: "It points back to your yes", at: c("Sign two") },
      { text: "A sinking feeling inside", at: c("Sign three"), check: check3 },
    ]}
  />
);

const outs = (t: number, zoom: number, hero: React.ReactNode) => (
  <ListScene
    theme={T}
    t={t}
    zoom={zoom}
    at={OUT}
    title="GET OUT"
    hero={hero}
    rows={[
      { text: "Trust that feeling", at: c("the first move") },
      { text: "From scratch, still a yes?", at: c("The second move") },
      { text: "You can change your mind", at: c("the third move") },
    ]}
  />
);

export const signsScenes = sequence(
  [
    { at: para("Because of what") - 0.3, render: Label },
    { at: para("And the effect") - 0.3, render: Proof },
    {
      at: para("That's why salespeople") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("That's why salespeople") - 0.3}
          tag="WHY FORMS?"
          hero={pip(t, 260, [[0, poses.think]], "wonder")}
          size={66}
          lines={[
            { text: "Not collecting information.", at: c("collecting information") },
            { text: "Collecting commitments.", at: c("collecting commitments"), accent: true },
          ]}
        />
      ),
    },
    { at: SIGNS, render: (t, z) => signs(t, z, pip(t, 250, [[0, aim]], "smile")) },
    {
      at: para("Sign three") - 0.3,
      render: (t, z) =>
        signs(
          t,
          z,
          <Hero t={t} x={250} pose={poses.slump} expression="sad" />,
          c("Learn to notice"),
          <K.At x={330} y={400} s={pop(t, c("sinking feeling"))}>
            <K.SweatDrop t={T} />
          </K.At>
        ),
    },
    { at: OUT, render: (t, z) => outs(t, z, pip(t, 250, [[0, poses.think]], "wonder")) },
    { at: para("And the third move") - 0.3, render: (t, z) => outs(t, z, pip(t, 250, [[0, poses.pump]], "open")) },
    {
      at: para("You can politely") - 0.3,
      render: (t, zoom) => (
        <QuoteScene
          theme={T}
          t={t}
          zoom={zoom}
          at={para("You can politely") - 0.3}
          tag="A POLITE NO"
          hero={pip(t, 260, [[0, poses.wave]], "smile")}
          size={66}
          lines={[
            { text: "Glad to help before.", at: c("glad to help") },
            { text: "This one isn't for me.", at: c("isn't for you") },
            { text: "No essay needed.", at: c("owe anyone an essay"), accent: true },
          ]}
        />
      ),
    },
  ],
  para("Let's go back to Pip") - 0.3
);
