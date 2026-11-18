#!/usr/bin/env bash
# Resumable render: scripts/render-chunks.sh V02 narration.mp3 out/video2.mp4 TOTAL_FRAMES
# Renders muted 1500-frame chunks (skipping finished ones), joins them, then muxes narration + pad.
set -euo pipefail
cd "$(dirname "$0")/.."
comp=$1; narr=$2; out=$3
BIN=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/*/chrome-headless-shell | head -1)
dir=out/chunks-$comp; mkdir -p "$dir"
npx remotion bundle src/index.ts --out-dir out/bundle --log=error >/dev/null
total=$4
step=1500; i=0
for ((s=0; s<total; s+=step)); do
  e=$((s+step-1)); [ $e -ge $total ] && e=$((total-1))
  f=$dir/$(printf %02d $i).mp4
  [ -s "$f" ] || { npx remotion render out/bundle "$comp" "$f.part.mp4" --frames=$s-$e --muted --browser-executable="$BIN" --concurrency=4 --crf=22 --log=error && mv "$f.part.mp4" "$f"; }
  echo "chunk $i done"; i=$((i+1))
done
ls $dir/??.mp4 | sed "s#.*#file '$PWD/&'#" > $dir/list.txt
ffmpeg -loglevel error -y -f concat -safe 0 -i $dir/list.txt -c copy $dir/video-muted.mp4
ffmpeg -loglevel error -y -i $dir/video-muted.mp4 -i "$narr" -stream_loop -1 -i public/music/calm-pad.mp3 \
  -filter_complex "[1:a][2:a]amix=inputs=2:duration=first:normalize=0[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -shortest "$out"
echo finished
