"""Check every cue.at/para phrase in src/videos/vNN exists in that video's timings: python3 scripts/check-cues.py 06 06-how-much-is-enough"""
import glob, json, re, sys
v, slug = sys.argv[1], sys.argv[2]
t = json.load(open(f"videos/{slug}/timings.json"))
norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())
keys = [norm(w["t"]) for p in t["paragraphs"] for w in p["words"]]
bad = []
for f in glob.glob(f"src/videos/v{v}/*.tsx"):
    s = open(f).read()
    for ph, nth in re.findall(r'\bc\("([^"]+)"(?:,\s*(\d+))?\)', s):
        want = [norm(x) for x in ph.split() if norm(x)]
        hits = sum(keys[i : i + len(want)] == want for i in range(len(keys)))
        if hits <= int(nth or 0): bad.append((f, ph, nth))
    for ph in re.findall(r'para\("([^"]+)"\)', s):
        if not any(p["text"].startswith(ph) for p in t["paragraphs"]): bad.append((f, "para:" + ph))
print(bad or "all cues found")
