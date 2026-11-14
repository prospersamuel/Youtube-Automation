import React from "react";
import type { Theme } from "../theme";
import type { Timings, Word } from "./cues";
import { ramp, useT } from "./time";

type Chunk = { words: Word[]; start: number; end: number };

const MAX_WORDS = 7;

// Splits each paragraph at sentence ends and commas, then cuts long clauses into even pieces so no caption is a stray word.
const chunkWords = (timings: Timings): Chunk[] => {
  const chunks: Chunk[] = [];
  const push = (words: Word[]) => chunks.push({ words, start: words[0].s, end: words[words.length - 1].e });
  for (const p of timings.paragraphs) {
    let clause: Word[] = [];
    const flush = () => {
      const pieces = Math.ceil(clause.length / MAX_WORDS);
      const size = Math.ceil(clause.length / Math.max(1, pieces));
      for (let i = 0; i < clause.length; i += size) push(clause.slice(i, i + size));
      clause = [];
    };
    p.words.forEach((w, i) => {
      clause.push(w);
      const sentenceEnd = /[.?!]["']?$/.test(w.t);
      const softBreak = /[,;:]$/.test(w.t) && clause.length >= 3 && p.words.length - i - 1 >= 3;
      if (sentenceEnd || softBreak) flush();
    });
    if (clause.length) flush();
  }
  chunks.forEach((c, i) => {
    const next = chunks[i + 1];
    c.end = next && next.start - c.end < 1.2 ? next.start : c.end + 0.5;
  });
  return chunks;
};

export const Captions: React.FC<{ timings: Timings; theme: Theme }> = ({ timings, theme }) => {
  const t = useT();
  const chunks = React.useMemo(() => chunkWords(timings), [timings]);
  const chunk = chunks.find((c) => t >= c.start - 0.06 && t < c.end);
  if (!chunk) return null;
  const k = ramp(t, chunk.start - 0.06, 0.16);
  let active = 0;
  chunk.words.forEach((w, i) => {
    if (t >= w.s) active = i;
  });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 600,
          fontSize: 54,
          lineHeight: 1,
          color: theme.captionText,
          background: theme.captionBg,
          padding: "22px 44px 26px",
          borderRadius: 28,
          whiteSpace: "nowrap",
          opacity: k,
          transform: `translateY(${(1 - k) * 14}px) scale(${0.97 + 0.03 * k})`,
        }}
      >
        {chunk.words.map((w, i) => (
          <span key={i} style={{ color: i === active ? "#FFB13D" : theme.captionText }}>
            {w.t}
            {i < chunk.words.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </div>
  );
};
