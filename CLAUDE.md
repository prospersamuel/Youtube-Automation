# Read It Once: YouTube video pipeline

Faceless animated channel (@ReadItOnce, handle to be set after YouTube's 14-day wait). Each video explains ONE idea from books the owner has read, in short animated lessons. Character: Pip (stickman, red scarf). Look: "paper" theme in `src/theme.ts`. Voice: Kokoro `af_sarah`.

Books the owner has read: Psychology of Money, Atomic Habits, Rich Dad Poor Dad, Think and Grow Rich, $100M Offers, Influence, 48 Laws of Power (Psychology of Money and Rich Dad are favourites). Start with less flashy topics, not the best ones. Topic list: video 2 is topic 10 "The 2-minute rule" (Atomic Habits), then 15, 19, 22.

## Owner (read first, do not re-ask)

- Software developer, no design/editing skills, free tools only, Claude Pro only. Often on a phone; laptop sometimes dead.
- Usage budget is VERY tight. Keep replies short. Do not read big files (`src/kit/props.tsx`, `TrapOne.tsx`) or view images unless essential. Use Grep/offsets, not whole-file reads. No re-renders unless asked. Commit and push after each step.
- Wants AUDIO to approve, not text. Never name books/authors in narration (credit them in the description).
- Pauses: sentence 0.35s, paragraph 0.65s; `[pause:0.75]` only after "Meet Pip." Do not change.
- Do not create PRs unless asked. Each cloud session is told its own branch; push there with `git -c push.negotiate=true push -u origin <branch>`. Work must be merged to main so new sessions start with it.
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

## Lessons (video 2)

- Fresh container: run `npm ci` first. `voice/setup.sh` downloads the Kokoro model; `--timings` also downloads a Whisper model from huggingface.co (slow first time, run it in the background and wait).
- The container can restart and kill a render. Always use `scripts/render-chunks.sh` (resumable, 1500-frame chunks), never one long render. To fix a scene later, delete only the affected `out/chunks-V0N/NN.mp4` files and rerun it (about 8 min per chunk).
- Before any render: contact sheets (`scripts/preview.sh`) with one frame per scene, not a handful. Then ideally a quick half-size draft. Never send a full render unchecked.
- Thumbnail: render with `npx remotion still src/index.ts V0NThumb videos/NN-slug/upload/thumbnail.jpg --browser-executable <chrome-headless-shell>` right after writing it, and send the jpg. Do not leave it as code.
- Whenever the owner would otherwise wait, say how long and set a `send_later` check; the harness may not wake you otherwise.
- Owner uploads weekly on Mondays. After video N's 7-day analytics arrive, apply what they show (title, thumbnail, opening, pacing) to the next video.

## Status

- Video 1 "Why You're Still Broke on a Good Salary": done (8:13), music mixed, thumbnail and `upload/youtube.md` written. Waiting on owner feedback.
- Video 2 "The 2-Minute Rule" (topic 10, Atomic Habits): done (5:40). Audio approved, scenes in `src/videos/v02/`, rendered and music mixed, thumbnail and `upload/youtube.md` written. Owner uploads Monday 2026-11-23 (one video a week).
- Renders: use `scripts/render-chunks.sh V02 public/v02/narration.mp3 out/video2.mp4 10470` (resumable; the container can restart mid-render). Needs `npm ci` in a fresh container.
- Next: video 3 is topic 15.
