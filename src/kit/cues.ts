export type Word = { t: string; s: number; e: number };
export type Timings = {
  duration: number;
  paragraphs: { section: string; text: string; start: number; end: number; words: Word[] }[];
};

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");

// Looks up when a phrase is spoken, so animation follows the voice even if the audio is regenerated.
export const makeCues = (timings: Timings) => {
  const words = timings.paragraphs.flatMap((p) => p.words);
  const keys = words.map((w) => norm(w.t));
  const find = (phrase: string, nth: number) => {
    const want = phrase.split(/\s+/).map(norm).filter(Boolean);
    let seen = 0;
    for (let i = 0; i <= keys.length - want.length; i++) {
      if (want.every((w, k) => keys[i + k] === w) && seen++ === nth) return i;
    }
    throw new Error(`Cue not found in narration: "${phrase}" (#${nth})`);
  };
  return {
    at: (phrase: string, nth = 0) => words[find(phrase, nth)].s,
    end: (phrase: string, nth = 0) => words[find(phrase, nth) + phrase.split(/\s+/).length - 1].e,
  };
};
