import { Img, staticFile, useCurrentFrame } from "remotion";
import { COLORS } from "../config";
import { float, pop } from "./anim";

type Common = {
  src: string;
  x: number; // centre horizontal (px)
  y: number; // centre vertical (px)
  at: number; // image d'apparition (relative à la scène)
  rotate?: number;
  exitAt?: number;
  style?: React.CSSProperties;
};

// Disparition rapide en « pop » inversé.
const exitScale = (frame: number, exitAt?: number) =>
  exitAt === undefined ? 1 : 1 - pop(frame, exitAt, 14);

// Photo réelle dans un cadre blanc arrondi (style polaroïd), avec léger Ken Burns.
export const PhotoCard: React.FC<
  Common & { w: number; h: number; round?: boolean; zoomFrom?: number; caption?: string }
> = ({ src, x, y, w, h, at, rotate = 0, exitAt, round, style, caption }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at) * exitScale(frame, exitAt);
  if (s <= 0.001) return null;
  const kb = 1.06 + (frame - at) * 0.0012;
  const radius = round ? "50%" : 30;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2 + float(frame, 5, 0.05, x),
        width: w,
        height: h,
        transform: `scale(${s}) rotate(${rotate + (1 - s) * -12}deg)`,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: radius,
          border: `14px solid ${COLORS.white}`,
          boxShadow: "0 22px 45px rgba(60,40,20,0.35)",
          overflow: "hidden",
          backgroundColor: COLORS.white,
        }}
      >
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${kb})` }}
        />
      </div>
      {caption ? <CardCaption text={caption} /> : null}
    </div>
  );
};

const CardCaption: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      bottom: -34,
      transform: "translateX(-50%) rotate(-2deg)",
      background: COLORS.ink,
      color: COLORS.white,
      fontFamily: "Poppins",
      fontWeight: 800,
      fontSize: 38,
      padding: "8px 26px",
      borderRadius: 18,
      whiteSpace: "nowrap",
      boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
    }}
  >
    {text}
  </div>
);

// Photo détourée (vraie photo, fond supprimé) avec ombre portée.
export const Cutout: React.FC<
  Common & { w: number; bob?: number; buzz?: boolean; filter?: string; caption?: string }
> = ({ src, x, y, w, at, rotate = 0, exitAt, bob = 8, buzz, filter, style, caption }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at, 9) * exitScale(frame, exitAt);
  if (s <= 0.001) return null;
  const jitter = buzz ? Math.sin(frame * 2.1) * 6 : 0;
  const jitterY = buzz ? Math.cos(frame * 1.7) * 5 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2 + jitter,
        top: y + float(frame, bob, 0.07, x / 100) + jitterY,
        width: w,
        transform: `translateY(-50%) scale(${s}) rotate(${rotate + (buzz ? Math.sin(frame * 0.9) * 5 : 0)}deg)`,
        ...style,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          display: "block",
          filter: `drop-shadow(0 18px 22px rgba(60,40,20,0.38))${filter ? ` ${filter}` : ""}`,
        }}
      />
      {caption ? <CardCaption text={caption} /> : null}
    </div>
  );
};
