"""Turn a narration script into audio plus word timings.

python3 voice/tts.py script.md out.mp3 --timings timings.json

Each sentence is spoken on its own and joined with fixed pauses, because the voice
model rushes from one sentence into the next when given a whole paragraph.
"""
import argparse
import difflib
import json
import os
import pathlib
import re
import subprocess
import tempfile

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

MODELS = pathlib.Path(__file__).parent / "models"
SENTENCE_GAP = 0.6
PARAGRAPH_GAP = 0.95
SECTION_GAP = 2.0
SILENCE = 0.004


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


def sentences(paragraph: str):
    return [s for s in re.split(r"""(?:(?<=[.!?])|(?<=[.!?]["']))\s+""", paragraph) if s]


def trim(samples, rate):
    """Cut the model's own leading and trailing silence so every pause is one we chose."""
    loud = np.flatnonzero(np.abs(samples) > SILENCE)
    if not len(loud):
        return samples
    pad = int(rate * 0.05)
    return samples[max(0, loud[0] - pad) : loud[-1] + pad]


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
    ap.add_argument("out", help=".mp3 (loudness-normalised) or .wav")
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
        # The default large-file transfer service is often blocked on locked-down networks; plain HTTPS works.
        os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
        from faster_whisper import WhisperModel

        listen = WhisperModel("base.en", device="cpu", compute_type="int8")

    audio, rate, cursor, timeline = [], 24000, 0.0, []
    for part in parts:
        entry = {"section": part["section"], "text": part["text"], "start": round(cursor, 3), "words": []}
        spoken = sentences(part["text"])
        for n, sentence in enumerate(spoken):
            samples, rate = kokoro.create(sentence, voice=a.voice, speed=a.speed, lang=a.lang)
            samples = trim(samples, rate)
            length = len(samples) / rate
            if listen:
                mono16k = np.interp(np.arange(0, len(samples), rate / 16000), np.arange(len(samples)), samples).astype(np.float32)
                segments, _ = listen.transcribe(mono16k, word_timestamps=True, language="en")
                heard = [(w.word, w.start, w.end) for seg in segments for w in seg.words]
                words = sentence.split()
                entry["words"] += [
                    {"t": w, "s": round(cursor + s, 3), "e": round(cursor + e, 3)} for w, (s, e) in zip(words, align(words, heard, length))
                ]
            entry["end"] = round(cursor + length, 3)
            gap = part["gap"] if n == len(spoken) - 1 else SENTENCE_GAP
            audio += [samples, np.zeros(int(rate * gap), dtype=samples.dtype)]
            cursor += length + gap
        timeline.append(entry)

    out = pathlib.Path(a.out)
    if out.suffix == ".mp3":
        with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
            sf.write(tmp.name, np.concatenate(audio), rate)
            subprocess.run(
                ["ffmpeg", "-loglevel", "error", "-y", "-i", tmp.name, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "1", "-b:a", "96k", str(out)],
                check=True,
            )
    else:
        sf.write(out, np.concatenate(audio), rate)
    if a.timings:
        pathlib.Path(a.timings).write_text(
            json.dumps({"voice": a.voice, "speed": a.speed, "duration": round(cursor, 3), "paragraphs": timeline}, indent=1)
        )
    print(f"{out}: {cursor:.1f}s, {len(parts)} paragraphs")


if __name__ == "__main__":
    main()
