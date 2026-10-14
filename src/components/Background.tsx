import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { BACKGROUND_IMAGE, COLORS } from "../config";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = 1.04 + Math.sin(frame / 160) * 0.02;
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.beige }}>
      <Img
        src={staticFile(BACKGROUND_IMAGE)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }}
      />
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(60,40,20,0.16) 100%)" }}
      />
    </AbsoluteFill>
  );
};
