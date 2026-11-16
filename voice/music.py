"""Generate a calm, quiet background pad: python3 voice/music.py public/music/calm-pad.mp3 --seconds 520"""
import argparse
import subprocess
import tempfile

import numpy as np
import soundfile as sf

RATE = 44100
CHORDS = [  # Cmaj7, Am7, Fmaj7, G6
    [130.81, 164.81, 196.00, 246.94],
    [110.00, 130.81, 164.81, 196.00],
    [87.31, 110.00, 130.81, 164.81],
    [98.00, 123.47, 146.83, 164.81],
]
BAR = 8.0
OVERLAP = 2.5


def tone(freq, t, detune):
    f = freq * (1 + detune)
    return np.sin(2 * np.pi * f * t) + 0.28 * np.sin(2 * np.pi * 2 * f * t) + 0.08 * np.sin(2 * np.pi * 3 * f * t)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out")
    ap.add_argument("--seconds", type=float, default=520)
    ap.add_argument("--loudness", type=float, default=-32, help="target loudness in LUFS; the narration sits at -16")
    a = ap.parse_args()

    n = int(a.seconds * RATE)
    mix = np.zeros((n, 2))
    rng = np.random.default_rng(7)
    seg = int((BAR + OVERLAP) * RATE)
    t = np.arange(seg) / RATE
    env = np.ones(seg)
    edge = int(OVERLAP * RATE)
    env[:edge] = np.sin(np.linspace(0, np.pi / 2, edge)) ** 2
    env[-edge:] = np.cos(np.linspace(0, np.pi / 2, edge)) ** 2

    for k in range(int(a.seconds / BAR) + 1):
        start = int(k * BAR * RATE)
        if start >= n:
            break
        chord = CHORDS[k % len(CHORDS)]
        left = sum(tone(f, t, -0.0015) for f in chord) * env
        right = sum(tone(f, t, 0.0015) for f in chord) * env
        end = min(n, start + seg)
        mix[start:end, 0] += left[: end - start]
        mix[start:end, 1] += right[: end - start]
        # Two soft bell notes per bar, picked from the chord two octaves up.
        for beat in (1.0, 5.0):
            at = start + int(beat * RATE)
            if at >= n:
                continue
            length = min(n - at, int(5 * RATE))
            bt = np.arange(length) / RATE
            note = rng.choice(chord) * 4
            bell = np.sin(2 * np.pi * note * bt) * np.exp(-bt / 1.6) * np.minimum(1, bt / 0.02) * 0.9
            pan = rng.uniform(0.3, 0.7)
            mix[at : at + length, 0] += bell * (1 - pan)
            mix[at : at + length, 1] += bell * pan

    mix *= 1 + 0.08 * np.sin(2 * np.pi * 0.07 * np.arange(n) / RATE)[:, None]
    mix /= np.abs(mix).max() * 1.2
    with tempfile.NamedTemporaryFile(suffix=".wav") as tmp:
        sf.write(tmp.name, mix, RATE)
        subprocess.run(
            ["ffmpeg", "-loglevel", "error", "-y", "-i", tmp.name, "-af", f"loudnorm=I={a.loudness}:TP=-6:LRA=7", "-ar", "48000", "-b:a", "128k", a.out],
            check=True,
        )
    print(a.out)


if __name__ == "__main__":
    main()
