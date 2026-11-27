"""Cut hook-first Shorts from several pieces of a finished video.
Each Short is a list of (from_phrase, to_phrase) pieces; times come from the word timings, so cuts land on word edges.
Usage: python3 scripts/recut-shorts.py   (edit SHORTS below)"""
import json, re, subprocess, os, tempfile

norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())

def words(slug):
    t = json.load(open(f"videos/{slug}/timings.json"))
    return [w for p in t["paragraphs"] for w in p["words"]]

def find(ws, phrase, after=0.0):
    want = [norm(x) for x in phrase.split() if norm(x)]
    keys = [norm(w["t"]) for w in ws]
    for i in range(len(keys) - len(want) + 1):
        if keys[i : i + len(want)] == want and ws[i]["s"] >= after:
            return ws[i]["s"], ws[i + len(want) - 1]["e"]
    raise SystemExit(f"not found: {phrase}")

def cut(video, slug, out, title, pieces):
    ws = words(slug)
    ranges = []
    for a, b in pieces:
        s, _ = find(ws, a)
        _, e = find(ws, b, after=s)
        ranges.append((max(0, s - 0.15), e + 0.35))
    tmp = tempfile.mktemp(suffix=".mp4")
    parts = "".join(f"[0:v]trim={s}:{e},setpts=PTS-STARTPTS[v{i}];[0:a]atrim={s}:{e},asetpts=PTS-STARTPTS[a{i}];" for i, (s, e) in enumerate(ranges))
    cat = "".join(f"[v{i}][a{i}]" for i in range(len(ranges))) + f"concat=n={len(ranges)}:v=1:a=1[v][a]"
    subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-i", video, "-filter_complex", parts + cat, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "18", "-c:a", "aac", tmp], check=True)
    dur = sum(e - s for s, e in ranges)
    subprocess.run(["scripts/make-short.sh", tmp, out, "0", f"{dur:.2f}", title], check=True, stdin=subprocess.DEVNULL)
    os.remove(tmp)
    print(f"{out} {dur:.1f}s")

V2, V3, V4, V5 = "02-two-minute-rule", "03-why-you-say-yes", "04-offer-too-good", "05-smartest-stays-quiet"
SHORTS = [
    ("out/video2-music.mp4", V2, "out/shorts/short3-start-small.mp4", "Your habits fail because you start too big",
     [("The two-minute rule is not the finish line", "It's the front door."), ("Think of it as a staircase", "Only this time, it lasts.")]),
    ("out/video3-music.mp4", V3, "out/shorts3/short1-every-saturday.mp4", "You said yes once. Now you can't stop.",
     [("How did a ten second signature", "into every Saturday?"), ("A week later, she asked him", "never wanted to join.")]),
    ("out/video3-music.mp4", V3, "out/shorts3/short2-sign-experiment.mp4", "Why you can't say no",
     [("There's a famous experiment", "how strong this is."), ("Researchers went door to door", "on their front lawn."), ("About one person in six", "in six agreed."), ("Then they tried it differently", "Almost everyone said yes."), ("Two weeks later", "three out of four said yes.")]),
    ("out/video3-music.mp4", V3, "out/shorts3/short3-three-signs.mp4", "3 signs someone is getting you to say yes",
     [("Here are three signs", "being used on you."), ("Sign one. The first request", "strangely small."), ("Sign two. The next request", "the first one's clothes."), ("Sign three. You feel", "when the request arrives."), ("That feeling is the most important", "Learn to notice it.")]),
    ("out/video4-music.mp4", V4, "out/shorts4/short1-twenty-vs-sixty.mp4", "You're charging too little",
     [("Pip tutors maths.", "It's the offer.")]),
    ("out/video4-music.mp4", V4, "out/shorts4/short2-value-formula.mp4", "Make your offer impossible to refuse",
     [("So how do you make a result feel valuable?", "with four parts."), ("Two parts make an offer feel bigger", "effort and sacrifice it takes from them.")]),
    ("out/video4-music.mp4", V4, "out/shorts4/short3-charge-more.mp4", "Raise your price and sell more",
     [("Now Pip raises his price", "no effort from them, and no risk.")]),
    ("out/video5-music.mp4", V5, "out/shorts5/short1-talking-cost-500.mp4", "You lose money when you over-talk",
     [("Pip is selling his old car.", "talk himself down.")]),
    ("out/video5-music.mp4", V5, "out/shorts5/short2-why-silence-works.mp4", "Why silence makes you say too much",
     [("Most people find silence", "our job to fix it."), ("So we fill the gap.", "never planned to make."), ("The quiet person doesn't have to push.", "does the work for them.")]),
    ("out/video5-music.mp4", V5, "out/shorts5/short3-four-moves.mp4", "4 ways to stop losing money in silences",
     [("So how do you stay steady", "the room goes quiet?"), ("The first move is to say your piece", "and then stop."), ("The second move is to count.", "before you add anything."), ("The third move is to decide", "the conversation starts."), ("And the fourth move is simply", "get comfortable with quiet.")]),
]

if __name__ == "__main__":
    for spec in SHORTS:
        if os.path.exists(spec[0]):
            cut(*spec)
        else:
            print("missing", spec[0])
