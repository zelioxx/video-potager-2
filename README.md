# Vidéo potager — Ail & échalotes : automne ou printemps ?

Vidéo motion design verticale (1080×1920, 30 i/s, ~46 s) pour TikTok et YouTube Shorts, réalisée avec [Remotion](https://www.remotion.dev/).

**La vidéo finale : [`rendu/ail-echalotes-automne-printemps.mp4`](rendu/ail-echalotes-automne-printemps.mp4)**

## Contenu

1. Accroche : planter ail et échalotes à l'automne, bonne idée ?
2. Oui, ça peut marcher… mais attention à 3 pièges
3. Piège n°1 : terre trop argileuse → sol détrempé → pourriture
4. Piège n°2 : bulbe trop enfoncé → pourriture (coupe de sol animée, 2 à 3 cm suffisent)
5. Piège n°3 : nuisibles (mouche de l'oignon, larves, campagnols)
6. La solution : planter début printemps (février–mars) avec des variétés adaptées
7. Ail de printemps : Printanor, Rose de Lautrec
8. Échalotes de printemps : Jermor, Longor, Mikor
9. Appel à l'action (commentaire + abonnement)

Visuels : vraies photos (détourées ou en cadres photo), fond beige, sous-titres mot à mot façon TikTok, transitions « whip pan » / zoom avec flou de mouvement, bruitages (whoosh, pop, ding). Crédits des photos : voir [`CREDITS.md`](CREDITS.md).

## Changer l'image de fond

1. Dépose ton image dans `public/` (par ex. `public/fond.jpg`, idéalement en 1080×1920).
2. Dans `src/config.ts`, remplace `BACKGROUND_IMAGE = "img/fond-beige.jpg"` par `"fond.jpg"`.
3. Relance le rendu (ci-dessous).

## Commandes

```bash
npm install
npm run dev      # Remotion Studio : prévisualiser / ajuster
npm run render   # rendu final → rendu/ail-echalotes-automne-printemps.mp4 (son normalisé à -14 LUFS)
```

Régénérer l'audio (Python 3) :

```bash
pip install kokoro-onnx soundfile numpy
# modèles : kokoro-v1.0.onnx et voices-v1.0.bin
# (https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0)
python3 scripts/voiceover.py <dossier_des_modeles>   # voix off + timings des sous-titres
python3 scripts/music.py                              # musique + bruitages
```

Le texte de la voix off se modifie dans `scripts/voiceover.py` (liste `SEGMENTS`) ; les animations de chaque scène sont dans `src/scenes/`.
