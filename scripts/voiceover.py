"""Génère la voix off (Kokoro, voix ff_siwis) + les timings mot à mot des sous-titres.

Usage : python3 scripts/voiceover.py <dossier_modeles_kokoro>
Sorties : public/audio/vo_<id>.wav et src/data/voiceover.json
"""
import json
import re
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
MODELS = Path(sys.argv[1])
SPEED = 1.12

SEGMENTS = [
    ("hook", "Ail et échalotes : les planter à l'automne, c'est une bonne idée ?"),
    ("oui", "Oui, ça peut marcher ! Mais attention à trois pièges."),
    ("argile", "Piège numéro un : une terre trop argileuse. Elle garde l'eau tout l'hiver, le sol reste détrempé… et les bulbes pourrissent."),
    ("profond", "Piège numéro deux : planter trop profond. Un bulbe trop enfoncé pourrit, lui aussi. Juste sous la surface, pas plus !"),
    ("nuisibles", "Piège numéro trois : les nuisibles. Mouche de l'oignon, larves, campagnols… un bulbe qui pourrit, c'est un festin pour eux."),
    ("solution", "La solution ? Les planter au début du printemps, de février à mars, avec des variétés adaptées."),
    ("ail", "Côté ail : Printanor, ou le rose de Lautrec."),
    ("echalote", "Côté échalotes : Jermor, Longor ou Mikor."),
    ("cta", "Et toi, tu plantes en automne ou au printemps ? Dis-le-moi en commentaire, et abonne-toi pour d'autres astuces potager !"),
]

# Graphies phonétiques pour les noms que le phonémiseur lit mal.
SAY = {
    "Lautrec": "Lôtrèque",
    "Jermor": "Jèrmore",
    "Longor": "Longore",
    "Mikor": "Mikore",
    "Printanor": "Printanore",
}


def spoken(text: str) -> str:
    for k, v in SAY.items():
        text = text.replace(k, v)
    return text


def word_weights(words):
    # Poids ~ nombre de lettres prononcées, + pause après ponctuation.
    w = []
    for word in words:
        letters = len(re.sub(r"[^\wÀ-ÿ]", "", word)) or 1
        w.append(letters + 1.5)
    return np.array(w, dtype=float)


def speech_spans(audio, sr, thresh_db=-38, min_gap=0.12):
    """Repère les zones parlées (séparées par des silences >= min_gap)."""
    hop = int(sr * 0.01)
    frames = len(audio) // hop
    rms = np.array([np.sqrt(np.mean(audio[i * hop:(i + 1) * hop] ** 2) + 1e-12) for i in range(frames)])
    db = 20 * np.log10(rms / (rms.max() + 1e-12))
    voiced = db > thresh_db
    spans, start, silent = [], None, 0
    for i, v in enumerate(voiced):
        if v:
            if start is None:
                start = i
            silent = 0
        elif start is not None:
            silent += 1
            if silent * 0.01 >= min_gap:
                spans.append((start * 0.01, (i - silent + 1) * 0.01))
                start, silent = None, 0
    if start is not None:
        spans.append((start * 0.01, frames * 0.01))
    return spans


def align(text, audio, sr):
    """Répartit les mots dans les zones parlées, phrase par phrase."""
    chunks = [c.strip() for c in re.split(r"(?<=[,.:;!?…])\s+", text) if c.strip()]
    spans = speech_spans(audio, sr)
    # Fusionne/découpe pour avoir autant de zones que de morceaux de phrase.
    while len(spans) > len(chunks):
        gaps = [spans[i + 1][0] - spans[i][1] for i in range(len(spans) - 1)]
        i = int(np.argmin(gaps))
        spans[i:i + 2] = [(spans[i][0], spans[i + 1][1])]
    if len(spans) < len(chunks):
        start, end = spans[0][0], spans[-1][1]
        weights = np.array([word_weights(c.split()).sum() for c in chunks])
        edges = start + np.concatenate([[0], np.cumsum(weights)]) / weights.sum() * (end - start)
        spans = [(edges[i], edges[i + 1]) for i in range(len(chunks))]
    words = []
    for chunk, (s, e) in zip(chunks, spans):
        ws = chunk.split()
        wt = word_weights(ws)
        edges = s + np.concatenate([[0], np.cumsum(wt)]) / wt.sum() * (e - s)
        for i, w in enumerate(ws):
            words.append({"text": w, "start": round(float(edges[i]), 3), "end": round(float(edges[i + 1]), 3)})
    return words


def main():
    kokoro = Kokoro(str(MODELS / "kokoro-v1.0.onnx"), str(MODELS / "voices-v1.0.bin"))
    out = []
    for seg_id, text in SEGMENTS:
        samples, sr = kokoro.create(spoken(text), voice="ff_siwis", speed=SPEED, lang="fr-fr")
        samples = np.asarray(samples, dtype=np.float32)
        # Coupe les silences de début/fin.
        idx = np.where(np.abs(samples) > 0.01)[0]
        samples = samples[max(idx[0] - int(0.03 * sr), 0): idx[-1] + int(0.08 * sr)]
        samples = samples / (np.abs(samples).max() + 1e-9) * 0.9
        path = ROOT / "public" / "audio" / f"vo_{seg_id}.wav"
        sf.write(path, samples, sr)
        dur = len(samples) / sr
        out.append({"id": seg_id, "text": text, "file": f"audio/vo_{seg_id}.wav",
                    "duration": round(dur, 3), "words": align(text, samples, sr)})
        print(f"{seg_id:10s} {dur:5.2f}s  {kokoro.tokenizer.phonemize(spoken(text), 'fr-fr')}")
    (ROOT / "src" / "data").mkdir(parents=True, exist_ok=True)
    (ROOT / "src" / "data" / "voiceover.json").write_text(json.dumps(out, ensure_ascii=False, indent=1))
    print("total", round(sum(o["duration"] for o in out), 2))


if __name__ == "__main__":
    main()
