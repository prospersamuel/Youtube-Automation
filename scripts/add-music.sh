#!/usr/bin/env bash
# Mix the calm pad under a finished render. No re-render needed.
# usage: scripts/add-music.sh in.mp4 out.mp4 [music_gain_db=9]
set -e
IN="$1"; OUT="$2"; G="${3:-9}"
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
ffmpeg -y -i "$IN" -stream_loop -1 -i "$(dirname "$0")/../public/music/calm-pad.mp3" \
  -filter_complex "[1:a]volume=${G}dB,afade=t=in:d=3,afade=t=out:st=$(python3 -c "print($D-6)"):d=6[m];[0:a][m]amix=inputs=2:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -t "$D" "$OUT"
