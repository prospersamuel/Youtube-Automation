#!/usr/bin/env bash
# One-time setup for the narration voice: Python packages plus the Kokoro model files.
set -euo pipefail
cd "$(dirname "$0")"
pip3 install -q -r requirements.txt
base=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  [ -s "models/$f" ] || curl -fL --retry 3 -o "models/$f" "$base/$f"
done
