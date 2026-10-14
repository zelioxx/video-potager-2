import { Audio, Sequence, staticFile } from "remotion";

export const Sfx: React.FC<{ at: number; src: "whoosh" | "pop" | "ding" | "buzz"; volume?: number }> = ({
  at,
  src,
  volume = 0.5,
}) => (
  <Sequence from={Math.max(0, at)} durationInFrames={45} layout="none">
    <Audio src={staticFile(`audio/${src}.wav`)} volume={volume} />
  </Sequence>
);
