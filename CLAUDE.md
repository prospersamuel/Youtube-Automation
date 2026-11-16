# Read It Once: YouTube video pipeline

Faceless animated channel. Each video explains one idea from books on money, habits and psychology. The character is Pip (stickman with a red scarf). Style is the "paper" theme in `src/theme.ts`.

## Making a video

1. Script: `videos/NN-slug/script.md`. Narration starts after the `---` line; `## ` headings are sections (not spoken). Do not name books or authors in the narration; credit them in the description. Add `[pause:0.75]` after a sentence to hold longer.
2. Voice: `python3 voice/tts.py videos/NN-slug/script.md public/vNN/narration.mp3 --timings videos/NN-slug/timings.json` (Kokoro voice `af_sarah`, speed 0.95; run `voice/setup.sh` once). Send the audio to the owner for approval before animating.
3. Scenes: `src/videos/vNN/`. Copy the structure of `src/videos/v01/`: one file per section exporting a scene list built with `sequence()`, timed with `cue.at("spoken phrase")` and `para("paragraph start")` so animation follows the voice. Prefer the templates in `src/kit/scenes.tsx` (title, card row, quote, list) and props in `src/kit/props.tsx`.
4. Check: `npx tsc`, then `scripts/preview.sh V01 12.5 40 ...` renders frames at those seconds into contact sheets in `out/preview/`.
5. Render: `npx remotion render src/index.ts V01 out/video.mp4` (about 70 minutes in the cloud; add `--browser-executable` pointing at the pre-installed headless shell there, as `scripts/preview.sh` does).
6. Upload kit: thumbnail as a `<Still>` (see `src/videos/v01/Thumbnail.tsx`), title/description/tags in `videos/NN-slug/upload/youtube.md`.

## Owner preferences

- Wants audio to listen to rather than text to read; approves by listening.
- Sentence pauses 0.35s, paragraph 0.65s: longer felt slow, the model's default felt rushed.
- Very limited usage budget: keep turns short, avoid re-rendering, commit and push after each step.
