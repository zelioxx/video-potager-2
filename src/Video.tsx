import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { Background } from "./components/Background";
import { Captions } from "./components/Captions";
import { SceneFrame } from "./components/SceneFrame";
import { Sfx } from "./components/Sfx";
import { Hook, Oui } from "./scenes/Intro";
import { Argile, Nuisibles, Profond } from "./scenes/Pieges";
import { Ail, Cta, Echalote, Solution } from "./scenes/Solution";
import { SCENES, TOTAL_FRAMES } from "./timeline";

const VISUALS: Record<string, React.FC> = {
  hook: Hook,
  oui: Oui,
  argile: Argile,
  profond: Profond,
  nuisibles: Nuisibles,
  solution: Solution,
  ail: Ail,
  echalote: Echalote,
  cta: Cta,
};

// Volume de la musique : baissée pendant la voix, remonte entre les phrases et à la fin.
const musicVolume = (f: number) => {
  const last = SCENES[SCENES.length - 1];
  const voiceEnd = last.from + last.voiceFrom + Math.ceil((last.words[last.words.length - 1].end + 0.3) * 30);
  const base = interpolate(f, [0, 6], [0, 0.11], { extrapolateRight: "clamp" });
  const outro = interpolate(f, [voiceEnd, voiceEnd + 10, TOTAL_FRAMES - 20, TOTAL_FRAMES], [0, 0.12, 0.12, -0.11], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.max(0, base + outro);
};

export const Video: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <Audio src={staticFile("audio/music.mp3")} volume={musicVolume} />
      {SCENES.slice(1).map((s) => (
        <Sfx key={`w-${s.id}`} at={s.from - 6} src="whoosh" volume={0.45} />
      ))}
      {SCENES.map((s, i) => {
        const Visual = VISUALS[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.duration} name={s.id}>
            <SceneFrame index={i} last={i === SCENES.length - 1}>
              <Visual />
              <Captions scene={s} />
            </SceneFrame>
            <Sequence from={s.voiceFrom} layout="none">
              <Audio src={staticFile(s.file)} volume={1} />
            </Sequence>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
