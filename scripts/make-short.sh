#!/usr/bin/env bash
# Vertical 9:16 Short from a finished 16:9 render: scripts/make-short.sh in.mp4 out.mp4 START END "Title text"
# Optional: ZOOM=1 trims 10% off each side so the picture fills more of the frame (output stays 1080x1920).
set -euo pipefail
IN=$1; OUT=$2; S=$3; E=$4; TITLE=$5
FONT=/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf
[ -f "$FONT" ] || FONT=$(fc-list : file | grep -i "bold" | head -1 | cut -d: -f1)
D=$(python3 -c "print($E-$S)")
if [ "${ZOOM:-0}" = 1 ]; then FG="crop=iw*0.8:ih:iw*0.1:0,scale=1080:-2"; else FG="scale=1080:608"; fi
# Long titles wrap onto two lines so the text stays big.
read -r L1 L2 FS < <(python3 -c "
import sys; t=sys.argv[1]; w=t.split()
if len(t) <= 24: print(t.replace(' ','_'), '-', min(84, int(1000/(0.56*len(t)))))
else:
    best=min(range(1,len(w)), key=lambda i: abs(len(' '.join(w[:i]))-len(' '.join(w[i:]))))
    a,b=' '.join(w[:best]),' '.join(w[best:]); m=max(len(a),len(b))
    print(a.replace(' ','_'), b.replace(' ','_'), min(84, int(1000/(0.56*m))))
" "$TITLE")
L1=${L1//_/ }; L2=${L2//_/ }
if [ "$L2" = "-" ]; then Y1=330; EXTRA=""; else Y1=260; EXTRA="drawtext=fontfile=$FONT:text='$L2':fontsize=$FS:fontcolor=white:borderw=6:bordercolor=black:x=(w-text_w)/2:y=$((260+FS+20)),"; fi
ffmpeg -nostdin -loglevel error -y -ss "$S" -t "$D" -i "$IN" -filter_complex "\
[0:v]split[a][b];\
[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5,eq=brightness=-0.15[bg];\
[b]$FG[fg];\
[bg][fg]overlay=0:(H-h)/2[v1];\
[v1]drawtext=fontfile=$FONT:text='$L1':fontsize=$FS:fontcolor=white:borderw=6:bordercolor=black:x=(w-text_w)/2:y=$Y1,\
${EXTRA}\
drawtext=fontfile=$FONT:text='Read It Once':fontsize=56:fontcolor=white:borderw=5:bordercolor=black:x=(w-text_w)/2:y=1520[v]" \
  -map "[v]" -map 0:a -af "afade=t=out:st=$(python3 -c "print($D-0.4)"):d=0.4" -c:v libx264 -crf 22 -pix_fmt yuv420p -c:a aac -b:a 160k "$OUT"
