#!/usr/bin/env bash
# Rendu complet : vidéo Remotion puis normalisation du son à -14 LUFS (standard TikTok / YouTube Shorts).
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out rendu
npx remotion render src/index.ts AilEchalotes out/brut.mp4 --codec=h264 --crf=18 --audio-bitrate=192k
ffmpeg -y -v error -i out/brut.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k \
  -movflags +faststart rendu/ail-echalotes-automne-printemps.mp4
echo "Vidéo prête : rendu/ail-echalotes-automne-printemps.mp4"
