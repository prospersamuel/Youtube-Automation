"""Turn a narration script into one audio file: python3 voice/tts.py script.md out.wav --voice am_michael"""
import argparse
import pathlib
import re

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

MODELS = pathlib.Path(__file__).parent / "models"
PARAGRAPH_GAP = 0.45
SECTION_GAP = 0.9


def blocks(text: str):
    """Yield (paragraph, gap_after) for the spoken part of a script; headings only lengthen the pause."""
    body = text.split("\n---\n", 1)[-1]
    gap = PARAGRAPH_GAP
    out = []
    for para in re.split(r"\n\s*\n", body):
        para = para.strip()
        if not para:
            continue
        if para.startswith("#"):
            if out:
                out[-1][1] = SECTION_GAP
            continue
        out.append([" ".join(para.split()), gap])
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("script")
    ap.add_argument("out")
    ap.add_argument("--voice", default="am_michael")
    ap.add_argument("--speed", type=float, default=1.0)
    ap.add_argument("--lang", default="en-us")
    ap.add_argument("--limit", type=int, default=0, help="only speak the first N paragraphs")
    a = ap.parse_args()

    kokoro = Kokoro(str(MODELS / "kokoro-v1.0.onnx"), str(MODELS / "voices-v1.0.bin"))
    parts = blocks(pathlib.Path(a.script).read_text())
    if a.limit:
        parts = parts[: a.limit]
    audio, rate = [], 24000
    for text, gap in parts:
        samples, rate = kokoro.create(text, voice=a.voice, speed=a.speed, lang=a.lang)
        audio += [samples, np.zeros(int(rate * gap), dtype=samples.dtype)]
    sf.write(a.out, np.concatenate(audio), rate)
    print(f"{a.out}: {sum(len(x) for x in audio) / rate:.1f}s, {len(parts)} paragraphs")


if __name__ == "__main__":
    main()
