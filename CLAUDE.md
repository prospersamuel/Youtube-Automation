# Read It Once: YouTube video pipeline

Faceless animated channel (@ReadItOnce, handle to be set after YouTube's 14-day wait). Each video explains ONE idea from books the owner has read, in short animated lessons. Character: Pip (stickman, red scarf). Look: "paper" theme in `src/theme.ts`. Voice: Kokoro `af_sarah`.

Books the owner has read: Psychology of Money, Atomic Habits, Rich Dad Poor Dad, Think and Grow Rich, $100M Offers, Influence, 48 Laws of Power (Psychology of Money and Rich Dad are favourites). Start with less flashy topics, not the best ones. Topic list (25; number. title (book)): HABITS (Atomic Habits): 9 Why your goals keep failing, and what to set instead; 10 The 2-minute rule that ends procrastination; 11 Why you can't break bad habits: you're skipping one step; 12 How your room controls your behaviour; 13 Stop changing your habits, change who you are; 14 Why you quit just before it works. MONEY (Psychology of Money, Rich Dad Poor Dad): 1 Why you're still broke on a good salary; 2 Looking rich is making you poor; 3 The one money skill school never taught you; 4 How much money is "enough"?; 5 Why saving matters more than your salary; 6 Why most people quit before compounding pays off; 7 Why smart people make terrible money decisions; 8 Why working harder won't make you rich. PERSUASION: 15 Why you say yes when you want to say no (Influence); 16 Six tricks salespeople use on you every day (Influence); 17 Why "free" gifts are never free (Influence); 18 Why "only 3 left" works on your brain (Influence); 19 How to make an offer people feel stupid refusing ($100M Offers); 20 Why charging more can get you more customers ($100M Offers); 21 Why nobody buys what you're selling ($100M Offers). POWER/MINDSET: 22 Why the smartest person in the room stays quiet (48 Laws of Power); 23 How manipulators gain power over you, and how to spot it (48 Laws); 24 Why most people give up three feet from gold (Think and Grow Rich); 25 Why wanting it badly isn't enough (Think and Grow Rich). Frame 48 Laws videos around SPOTTING manipulation, not teaching it. Videos done: 1 = topic 1, 2 = topic 10. Video 3 = topic 15, then 19, 22.

## Owner (read first, do not re-ask)

- Software developer, no design/editing skills, free tools only, Claude Pro only. Often on a phone; laptop sometimes dead.
- Usage budget is VERY tight. Keep replies short. Do not read big files (`src/kit/props.tsx`, `TrapOne.tsx`) or view images unless essential. Use Grep/offsets, not whole-file reads. No re-renders unless asked. Commit and push after each step.
- Wants AUDIO to approve, not text. Never name books/authors in narration (credit them in the description).
- NARRATION RULE (strict): the narrator explains from start to end in their own voice. NEVER write anything a character says or thinks, with or without quote marks: no "Why not?", "Sure", "Easy.", "Fine.", no "she said"/"he thought", no quoted questions or phrases. The free voice sounds odd when it acts a character. Describe it instead ("he signed without a second thought"). Advice to the viewer is also narrator voice ("ask yourself whether..."). If unsure whether a line breaks this, ask the owner.
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
- Video 3 "Why You Say Yes When You Want to Say No" (topic 15, Influence): audio approved (5:57, narrator-only), scenes in `src/videos/v03/`, thumbnail and `upload/youtube.md` written. Render: `scripts/render-chunks.sh V03 public/v03/narration.mp3 out/video3.mp4 10982`.
- Shorts: `scripts/make-short.sh in.mp4 out.mp4 START END "Title"` (vertical from finished render, no re-render). Video 2's are in `upload/shorts.md`.
- Video 4 "How to Make an Offer People Feel Stupid Refusing" (topic 19, $100M Offers): audio approved (5:32), scenes in `src/videos/v04/`, thumbnail and `upload/youtube.md` written. Render: `scripts/render-chunks.sh V04 public/v04/narration.mp3 out/video4.mp4 10222`. Upload 2026-12-07.
- Upload plan: video 2 up 2026-11-23, video 3 on 2026-11-30, video 4 on 2026-12-07.
- Video 5 "Why the Smartest Person in the Room Stays Quiet" (topic 22, 48 Laws): audio approved (4:24), scenes in `src/videos/v05/`, thumbnail and `upload/youtube.md` written. Render: `scripts/render-chunks.sh V05 public/v05/narration.mp3 out/video5.mp4 8199`. Upload 2026-12-14.
- THUMBNAIL RULE (owner, strict): viewers are selfish. A thumbnail must show what THEY gain or lose in their own life, not Pip's story. Make the stake visible and concrete; money is the strongest visual (cash stacks, bills, price tags), so use it when the topic allows, but not every time. Text: 2-4 huge words stating the payoff or the cost (video 5: SAY LESS. GET PAID. with a cash stack). Do not copy the owner's example words literally; take the principle. Pip always in it, acting it out. 62% of watch time is on TV. Video 2 CTR was 2.3%.
- Shorts: 3 per video in `videos/NN-slug/upload/shorts.md`, cut with `scripts/make-short.sh` (burned-in titles must avoid ' and :). Upload titles: about the viewer ("you/your" + their problem), max 2 hashtags besides #shorts. Data: the "you"-framed Short got 146 views in a day; topic/story-framed ones got about 1.
- Next: video 6 is a new topic from the list (owner to pick or take the next unused one).
