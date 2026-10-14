"""Synthétise une musique de fond « potager » (style ukulélé acoustique) et les bruitages.

Tout est généré ici, sans échantillon externe : aucune question de droits.
Usage : python3 scripts/music.py
"""
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio"
SR = 44100
rng = np.random.default_rng(7)


def note_freq(n):  # n = numéro MIDI
    return 440.0 * 2 ** ((n - 69) / 12)


def pluck(freq, dur, bright=0.5, decay=0.996):
    """Corde pincée (Karplus-Strong)."""
    n = int(SR * dur)
    period = max(int(SR / freq), 2)
    buf = rng.uniform(-1, 1, period)
    # adoucit l'attaque
    for _ in range(int((1 - bright) * 4)):
        buf = 0.5 * (buf + np.roll(buf, 1))
    out = np.zeros(n)
    for i in range(n):
        j = i % period
        out[i] = buf[j]
        buf[j] = decay * 0.5 * (buf[j] + buf[(j + 1) % period])
    return out


def env(n, a=0.002, r=0.05):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def kick(dur=0.35):
    t = np.arange(int(SR * dur)) / SR
    f = 110 * np.exp(-t * 18) + 45
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def snap(dur=0.18):
    t = np.arange(int(SR * dur)) / SR
    noise = rng.uniform(-1, 1, len(t))
    # passe-haut grossier
    noise = noise - np.convolve(noise, np.ones(8) / 8, mode="same")
    return noise * np.exp(-t * 35) * 0.8


def shaker(dur=0.07):
    t = np.arange(int(SR * dur)) / SR
    noise = rng.uniform(-1, 1, len(t))
    noise = noise - np.convolve(noise, np.ones(4) / 4, mode="same")
    return noise * np.sin(np.pi * t / dur) ** 2 * 0.25


def add(track, sig, at):
    i = int(at * SR)
    if i >= len(track):
        return
    end = min(len(track), i + len(sig))
    track[i:end] += sig[: end - i]


def music(seconds=48.0, bpm=104):
    beat = 60 / bpm
    total = int(SR * seconds)
    uke = np.zeros(total)
    bass = np.zeros(total)
    drums = np.zeros(total)
    glock = np.zeros(total)
    # Do – Sol – Lam – Fa, voicings ukulélé (G C E A réentrant)
    chords = [
        [67, 72, 76, 79],  # C
        [67, 71, 74, 79],  # G
        [69, 72, 76, 81],  # Am
        [69, 72, 77, 81],  # F
    ]
    roots = [48, 43, 45, 41]
    # rythme de grattage : bas, bas-haut, haut-bas-haut (en croches)
    strum = [(0, 1), (1, 1), (1.5, -1), (2.5, -1), (3, 1), (3.5, -1)]
    melody = [79, 76, 77, 79, 81, 79, 76, 74, 72, 74, 76, 79, 77, 76, 74, 72]
    bar = 0
    t0 = 0.0
    while t0 < seconds:
        ch = chords[bar % 4]
        for pos, direction in strum:
            at = t0 + pos * beat
            notes = ch if direction > 0 else ch[::-1]
            for k, n in enumerate(notes):
                s = pluck(note_freq(n), 1.2, bright=0.6) * (0.9 if direction > 0 else 0.6)
                add(uke, s * env(len(s)), at + k * 0.012)
        # basse ronde
        for pos in (0, 2, 2.5):
            s = pluck(note_freq(roots[bar % 4]), beat * 1.6, bright=0.1, decay=0.998)
            add(bass, s * env(len(s), r=0.1) * 1.4, t0 + pos * beat)
        # batterie légère (entre après l'accroche)
        if bar >= 1:
            for b in range(4):
                if b in (0, 2):
                    add(drums, kick() * 0.9, t0 + b * beat)
                else:
                    add(drums, snap() * 0.55, t0 + b * beat)
            for e in range(8):
                add(drums, shaker() * (1.0 if e % 2 else 0.6), t0 + e * beat / 2)
        # petite mélodie « glockenspiel » une mesure sur deux
        if bar % 2 == 1 and bar >= 2:
            for i in range(4):
                n = melody[(bar * 2 + i) % len(melody)]
                t = np.arange(int(SR * 0.6)) / SR
                s = (np.sin(2 * np.pi * note_freq(n + 12) * t) + 0.3 * np.sin(2 * np.pi * note_freq(n + 24) * t)) * np.exp(-t * 6)
                add(glock, s * 0.18, t0 + i * beat)
        t0 += 4 * beat
        bar += 1

    mix = 0.55 * uke + 0.6 * bass + 0.55 * drums + glock
    # léger écho
    d = int(SR * beat * 0.75)
    echo = np.zeros_like(mix)
    echo[d:] = mix[:-d] * 0.18
    mix = mix + echo
    # fondus
    fade = int(SR * 2.5)
    mix[:int(SR * 0.05)] *= np.linspace(0, 1, int(SR * 0.05))
    mix[-fade:] *= np.linspace(1, 0, fade)
    mix = np.tanh(mix / (np.abs(mix).max() + 1e-9) * 1.4)
    mix = mix / np.abs(mix).max() * 0.85
    stereo = np.stack([mix, np.roll(mix, int(SR * 0.008))], axis=1)
    sf.write(OUT / "music.wav", stereo, SR)


def sfx():
    # whoosh : bruit filtré qui monte puis redescend
    dur = 0.45
    t = np.arange(int(SR * dur)) / SR
    noise = rng.uniform(-1, 1, len(t))
    out = np.zeros_like(noise)
    y = 0.0
    for i, x in enumerate(noise):
        a = 0.03 + 0.5 * np.sin(np.pi * t[i] / dur) ** 2
        y += a * (x - y)
        out[i] = y
    out *= np.sin(np.pi * t / dur) ** 1.5
    sf.write(OUT / "whoosh.wav", out / np.abs(out).max() * 0.8, SR)
    # pop : sinus à chute de hauteur
    t = np.arange(int(SR * 0.16)) / SR
    f = 900 * np.exp(-t * 30) + 250
    pop = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 28)
    sf.write(OUT / "pop.wav", pop * 0.8, SR)
    # ding : clochette
    t = np.arange(int(SR * 1.2)) / SR
    ding = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * k)
               for f, a, k in [(1568, 1, 4), (3136, 0.4, 6), (4704, 0.15, 9), (2349, 0.25, 5)])
    sf.write(OUT / "ding.wav", ding / np.abs(ding).max() * 0.7, SR)
    # buzz « attention » : deux notes graves
    t = np.arange(int(SR * 0.22)) / SR
    tone = lambda f: np.sign(np.sin(2 * np.pi * f * t)) * 0.3 + np.sin(2 * np.pi * f * t) * 0.5
    e = np.exp(-t * 6)
    buzz = np.concatenate([tone(220) * e, np.zeros(int(SR * 0.04)), tone(185) * e])
    buzz = np.convolve(buzz, np.ones(12) / 12, mode="same")
    sf.write(OUT / "buzz.wav", buzz / np.abs(buzz).max() * 0.6, SR)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    sfx()
    music()
    print("ok")
