import { useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../config";
import { FPS, SceneInfo, Word } from "../timeline";
import { pop } from "./anim";

// Découpe en petits groupes de mots (max 3, coupure après la ponctuation).
const chunk = (words: Word[]): Word[][] => {
  const groups: Word[][] = [];
  let cur: Word[] = [];
  for (const w of words) {
    cur.push(w);
    const letters = cur.reduce((a, x) => a + x.text.length, 0);
    if (cur.length >= 3 || letters > 16 || /[,.:;!?…]$/.test(w.text)) {
      groups.push(cur);
      cur = [];
    }
  }
  if (cur.length) groups.push(cur);
  return groups;
};

const clean = (t: string) => t.replace(/[,.…]+$/, "").replace(/\s+([:;?!])/, " $1");

// Sous-titres façon TikTok : gros mots, mot prononcé surligné.
export const Captions: React.FC<{ scene: SceneInfo }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const t = (frame - scene.voiceFrom) / FPS;
  const groups = chunk(scene.words);
  const idx = groups.findIndex((g, i) => {
    const next = groups[i + 1];
    return t >= g[0].start - 0.05 && (next ? t < next[0].start - 0.05 : t < g[g.length - 1].end + 0.6);
  });
  if (idx < 0) return null;
  const group = groups[idx];
  const startFrame = scene.voiceFrom + Math.round((group[0].start - 0.05) * FPS);
  const s = pop(frame, startFrame, 12);
  return (
    <div
      style={{
        position: "absolute",
        top: 1330,
        left: 60,
        right: 60,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "6px 18px",
        transform: `scale(${0.75 + s * 0.25})`,
        opacity: Math.min(1, s * 1.5),
      }}
    >
      {group.map((w, i) => {
        const active = t >= w.start - 0.03 && (i === group.length - 1 || t < group[i + 1].start - 0.03);
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 82,
              lineHeight: 1.15,
              textTransform: "uppercase",
              color: active ? COLORS.white : COLORS.ink,
              background: active ? COLORS.green : "transparent",
              padding: "0 16px",
              borderRadius: 18,
              transform: active ? "rotate(-2deg) scale(1.06)" : "none",
              boxShadow: active ? "0 10px 20px rgba(40,60,20,0.3)" : "none",
              textShadow: active ? "none" : `0 3px 0 ${COLORS.white}, 0 -3px 0 ${COLORS.white}, 3px 0 0 ${COLORS.white}, -3px 0 0 ${COLORS.white}`,
            }}
          >
            {clean(w.text)}
          </span>
        );
      })}
    </div>
  );
};
