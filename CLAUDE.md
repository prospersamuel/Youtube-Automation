# Read It Once: YouTube video pipeline

Faceless animated channel (@ReadItOnce, handle to be set after YouTube's 14-day wait). Each video explains ONE idea from books the owner has read, in short animated lessons. Character: Pip (stickman, red scarf). Look: "paper" theme in `src/theme.ts`. Voice: Kokoro `af_sarah`.

Books the owner has read: Psychology of Money, Atomic Habits, Rich Dad Poor Dad, Think and Grow Rich, $100M Offers, Influence, 48 Laws of Power (Psychology of Money and Rich Dad are favourites). Start with less flashy topics, not the best ones. Topic list: video 2 is topic 10 "The 2-minute rule" (Atomic Habits), then 15, 19, 22.

## Owner (read first, do not re-ask)

- Software developer, no design/editing skills, free tools only, Claude Pro only. Often on a phone; laptop sometimes dead.
- Usage budget is VERY tight. Keep replies short. Do not read big files (`src/kit/props.tsx`, `TrapOne.tsx`) or view images unless essential. Use Grep/offsets, not whole-file reads. No re-renders unless asked. Commit and push after each step.
- Wants AUDIO to approve, not text. Never name books/authors in narration (credit them in the description).
- Pauses: sentence 0.35s, paragraph 0.65s; `[pause:0.75]` only after "Meet Pip." Do not change.
- Do not create PRs unless asked. Branch: `claude/optimistic-curie-ktrr49`, push with `git -c push.negotiate=true push -u origin <branch>`.
- Owner does upload, end screens, channel settings. Claude supplies title, description, tags, thumbnail, and advises country/timing. After publishing the owner sends analytics (impressions, CTR, avg view duration, retention graph, 48h/7d views).

## Making a video

1. Script: `videos/NN-slug/script.md`. Narration starts after the `---` line; `## ` headings are sections (not spoken).
2. Voice: `python3 voice/tts.py videos/NN-slug/script.md public/vNN/narration.mp3 --timings videos/NN-slug/timings.json` (run `voice/setup.sh` once; needs `HF_HUB_DISABLE_XET=1`). Send the audio to the owner for approval BEFORE animating.
3. Scenes: `src/videos/vNN/`. Copy `src/videos/v01/` structure: one file per section exporting scenes via `sequence()`, timed with `cue.at("phrase")` / `para("paragraph start")` so animation follows the voice. Use templates in `src/kit/scenes.tsx` and props in `src/kit/props.tsx` (grep for names).
4. Check: `npx tsc`, then `scripts/preview.sh V01 12.5 40 ...` (contact sheets in `out/preview/`).
5. Render (~70 min, cloud): `npx remotion render src/index.ts V01 out/video.mp4 --browser-executable <chrome-headless-shell in /opt/pw-browsers> --concurrency=4 --crf=22` (see `scripts/preview.sh` for the path).
6. Music: `scripts/add-music.sh in.mp4 out.mp4 [gain_db]` (default +9 dB over the -32 LUFS pad; narration is -16 LUFS). Regenerate pad with `voice/music.py`. Takes seconds, no re-render.
7. Upload kit: thumbnail `<Still>` (see `src/videos/v01/Thumbnail.tsx`, render to `upload/thumbnail.jpg`), title/description/tags in `videos/NN-slug/upload/youtube.md`.
8. Deliver files with SendUserFile (renders are gitignored, only in the container).

## Status

- Video 1 "Why You're Still Broke on a Good Salary": done (8:13), music mixed, thumbnail and `upload/youtube.md` written. Waiting on owner feedback.
- Video 2 "The 2-Minute Rule" (topic 10, Atomic Habits): done (5:40). Audio approved, scenes in `src/videos/v02/`, rendered and music mixed, thumbnail and `upload/youtube.md` written. Owner uploads Monday 2026-11-23 (one video a week).
- Renders: use `scripts/render-chunks.sh V02 public/v02/narration.mp3 out/video2.mp4 10470` (resumable; the container can restart mid-render). Needs `npm ci` in a fresh container.
- Next: video 3 is topic 15.
