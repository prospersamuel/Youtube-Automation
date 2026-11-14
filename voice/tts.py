"""Turn a narration script into audio plus word timings.

python3 voice/tts.py script.md out.wav --voice af_sarah --timings timings.json
"""
import argparse
import difflib
import json
import pathlib
import re

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

MODELS = pathlib.Path(__file__).parent / "models"
PARAGRAPH_GAP = 0.45
SECTION_GAP = 2.0


def blocks(text: str):
    """Spoken paragraphs of a script as dicts; a heading names the section and lengthens the pause before it."""
    body = text.split("\n---\n", 1)[-1]
    section, out = "", []
    for para in re.split(r"\n\s*\n", body):
        para = para.strip()
        if not para:
            continue
        if para.startswith("#"):
            section = para.lstrip("# ").strip()
            if out:
                out[-1]["gap"] = SECTION_GAP
            continue
        out.append({"section": section, "text": " ".join(para.split()), "gap": PARAGRAPH_GAP})
    return out


def norm(word: str) -> str:
    return re.sub(r"[^a-z0-9]", "", word.lower())


def align(script_words, heard, duration):
    """Give every script word a start/end by matching it against the words a speech recogniser heard."""
    times = [None] * len(script_words)
    matcher = difflib.SequenceMatcher(None, [norm(w) for w in script_words], [norm(h[0]) for h in heard], autojunk=False)
    for tag, i1, i2, j1, _ in matcher.get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1):
                times[i1 + k] = (heard[j1 + k][1], heard[j1 + k][2])
    i = 0
    while i < len(times):
        if times[i] is not None:
            i += 1
            continue
        j = i
        while j < len(times) and times[j] is None:
            j += 1
        left = times[i - 1][1] if i else 0.0
        right = times[j][0] if j < len(times) else duration
        span = (right - left) / (j - i)
        for k in range(i, j):
            times[k] = (left + span * (k - i), left + span * (k - i + 1))
        i = j
    return times


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("out")
    ap.add_argument("--voice", default="af_sarah")
    ap.add_argument("--speed", type=float, default=0.95)
    ap.add_argument("--lang", default="en-us")
    ap.add_argument("--limit", type=int, default=0, help="only speak the first N paragraphs")
    ap.add_argument("--timings", help="also write word timings to this JSON file")
    a = ap.parse_args()

    kokoro = Kokoro(str(MODELS / "kokoro-v1.0.onnx"), str(MODELS / "voices-v1.0.bin"))
    parts = blocks(pathlib.Path(a.script).read_text())
    if a.limit:
        parts = parts[: a.limit]

    listen = None
    if a.timings:
        import os

        # The default large-file transfer service is often blocked on locked-down networks; plain HTTPS works.
        os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
        from faster_whisper import WhisperModel

        listen = WhisperModel("base.en", device="cpu", compute_type="int8")

    audio, rate, cursor, timeline = [], 24000, 0.0, []
    for part in parts:
        samples, rate = kokoro.create(part["text"], voice=a.voice, speed=a.speed, lang=a.lang)
        length = len(samples) / rate
        entry = {"section": part["section"], "text": part["text"], "start": round(cursor, 3), "end": round(cursor + length, 3)}
        if listen:
            mono16k = np.interp(np.arange(0, len(samples), rate / 16000), np.arange(len(samples)), samples).astype(np.float32)
            segments, _ = listen.transcribe(mono16k, word_timestamps=True, language="en")
            heard = [(w.word, w.start, w.end) for seg in segments for w in seg.words]
            words = part["text"].split()
            entry["words"] = [
                {"t": w, "s": round(cursor + s, 3), "e": round(cursor + e, 3)} for w, (s, e) in zip(words, align(words, heard, length))
            ]
        timeline.append(entry)
        audio += [samples, np.zeros(int(rate * part["gap"]), dtype=samples.dtype)]
        cursor += length + part["gap"]

    sf.write(a.out, np.concatenate(audio), rate)
    if a.timings:
        pathlib.Path(a.timings).write_text(
            json.dumps({"voice": a.voice, "speed": a.speed, "duration": round(cursor, 3), "paragraphs": timeline}, indent=1)
        )
    print(f"{a.out}: {cursor:.1f}s, {len(parts)} paragraphs")


if __name__ == "__main__":
    main()
