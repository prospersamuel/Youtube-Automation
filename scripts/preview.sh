#!/usr/bin/env bash
# Render single frames at the given times (seconds) into contact sheets: scripts/preview.sh V01Hook 0.8 3 6.3 ...
set -euo pipefail
cd "$(dirname "$0")/.."
BIN=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/*/chrome-headless-shell | head -1)
comp=$1; shift
rm -rf out/preview && mkdir -p out/preview
npx remotion bundle src/index.ts --out-dir out/bundle --log=error >/dev/null
i=0
for t in "$@"; do
  frame=$(python3 -c "print(round($t*30))")
  npx remotion still out/bundle "$comp" "out/preview/$(printf %02d $i).png" --frame="$frame" --browser-executable="$BIN" --log=error
  i=$((i+1))
done
ffmpeg -loglevel error -y -i out/preview/%02d.png -vf "scale=960:540,tile=2x3" out/preview/sheet-%d.png
ls out/preview/sheet-*.png
