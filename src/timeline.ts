import voiceover from "./data/voiceover.json";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Marge (en images) avant et après la voix de chaque scène.
const LEAD = 9;
const TAIL = 9;
const OUTRO = 54; // images en plus à la fin pour l'écran final

export type Word = { text: string; start: number; end: number };

export type SceneInfo = {
  id: string;
  from: number; // début de la scène (images)
  duration: number; // durée de la scène (images)
  voiceFrom: number; // début de la voix, relatif à la scène
  file: string;
  words: Word[];
};

// Les signes de ponctuation isolés (« : », « ? », « ! ») sont collés au mot précédent.
const mergePunctuation = (words: Word[]): Word[] => {
  const out: Word[] = [];
  for (const w of words) {
    if (/^[:;?!…]+$/.test(w.text) && out.length > 0) {
      const prev = out[out.length - 1];
      out[out.length - 1] = { ...prev, text: `${prev.text} ${w.text}`, end: w.end };
    } else {
      out.push(w);
    }
  }
  return out;
};

const build = (): SceneInfo[] => {
  let cursor = 0;
  return voiceover.map((seg, i) => {
    const isLast = i === voiceover.length - 1;
    const duration = LEAD + Math.ceil(seg.duration * FPS) + TAIL + (isLast ? OUTRO : 0);
    const scene: SceneInfo = {
      id: seg.id,
      from: cursor,
      duration,
      voiceFrom: LEAD,
      file: seg.file,
      words: mergePunctuation(seg.words),
    };
    cursor += duration;
    return scene;
  });
};

export const SCENES = build();
export const TOTAL_FRAMES = SCENES.reduce((acc, s) => acc + s.duration, 0);

export const getScene = (id: string): SceneInfo => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) throw new Error(`Scène inconnue : ${id}`);
  return s;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9' -]/g, "");

// Image (relative à la scène) où l'on prononce le n-ième mot contenant `needle`.
export const wordFrame = (scene: SceneInfo, needle: string, nth = 0): number => {
  const n = norm(needle);
  const hits = scene.words.filter((w) => norm(w.text).includes(n));
  const w = hits[nth];
  if (!w) throw new Error(`Mot « ${needle} » absent de la scène ${scene.id}`);
  return scene.voiceFrom + Math.round(w.start * FPS);
};
