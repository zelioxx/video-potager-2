import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";

// Transition d'entrée/sortie de chaque scène : glissé rapide avec flou de mouvement
// (« whip pan ») ou zoom traversant, en alternance.
export const SceneFrame: React.FC<{ index: number; children: React.ReactNode; last?: boolean }> = ({
  index,
  children,
  last,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const IN = 9;
  const OUT = 8;
  const opts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const tIn = interpolate(frame, [0, IN], [1, 0], { ...opts, easing: Easing.out(Easing.cubic) });
  const tOut = last ? 0 : interpolate(frame, [durationInFrames - OUT, durationInFrames], [0, 1], { ...opts, easing: Easing.in(Easing.cubic) });
  const zoomStyle = index % 2 === 1;
  const blur = (tIn + tOut) * 22;
  let transform: string;
  if (zoomStyle) {
    const s = 1 + tIn * 0.35 - tOut * 0.25;
    transform = `scale(${s}) rotate(${(tIn - tOut) * 4}deg)`;
  } else {
    transform = `translateX(${tIn * 110 - tOut * 110}%)`;
  }
  const opacity = index === 0 ? 1 : 1 - tIn * 0.4 - tOut * 0.4;
  return (
    <AbsoluteFill style={{ transform, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, opacity }}>
      {children}
    </AbsoluteFill>
  );
};
