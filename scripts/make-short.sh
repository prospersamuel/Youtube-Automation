#!/usr/bin/env bash
# Vertical 9:16 Short from a finished 16:9 render: scripts/make-short.sh in.mp4 out.mp4 START END "Title text"
set -euo pipefail
IN=$1; OUT=$2; S=$3; E=$4; TITLE=$5
FONT=/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf
[ -f "$FONT" ] || FONT=$(fc-list : file | grep -i "bold" | head -1 | cut -d: -f1)
D=$(python3 -c "print($E-$S)")
ffmpeg -loglevel error -y -ss "$S" -t "$D" -i "$IN" -filter_complex "\
[0:v]split[a][b];\
[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5,eq=brightness=-0.15[bg];\
[b]scale=1080:608[fg];\
[bg][fg]overlay=0:(H-h)/2[v1];\
[v1]drawtext=fontfile=$FONT:text='$TITLE':fontsize=84:fontcolor=white:borderw=6:bordercolor=black:x=(w-text_w)/2:y=330,\
drawtext=fontfile=$FONT:text='Read It Once':fontsize=56:fontcolor=white:borderw=5:bordercolor=black:x=(w-text_w)/2:y=1520[v]" \
  -map "[v]" -map 0:a -af "afade=t=out:st=$(python3 -c "print($D-0.4)"):d=0.4" -c:v libx264 -crf 22 -pix_fmt yuv420p -c:a aac -b:a 160k "$OUT"
