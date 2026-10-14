import { useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../config";
import { ease, pop } from "./anim";

// Pastille de texte (étiquette) qui apparaît en pop.
export const Pill: React.FC<{
  text: string;
  x: number;
  y: number;
  at: number;
  color?: string;
  textColor?: string;
  size?: number;
  rotate?: number;
  exitAt?: number;
}> = ({ text, x, y, at, color = COLORS.green, textColor = COLORS.white, size = 54, rotate = -2, exitAt }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at, 10) * (exitAt === undefined ? 1 : 1 - pop(frame, exitAt, 14));
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s}) rotate(${rotate}deg)`,
        background: color,
        color: textColor,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 1,
        padding: `${size * 0.2}px ${size * 0.55}px`,
        borderRadius: size * 0.5,
        whiteSpace: "nowrap",
        boxShadow: "0 12px 26px rgba(60,40,20,0.3)",
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};

// Titre de scène en haut de l'écran, avec badge optionnel (« PIÈGE N°1 »).
export const Header: React.FC<{ title: string; badge?: string; badgeColor?: string; at?: number; color?: string }> = ({
  title,
  badge,
  badgeColor = COLORS.terracotta,
  at = 2,
  color = COLORS.ink,
}) => {
  const frame = useCurrentFrame();
  const sBadge = pop(frame, at, 10);
  const sTitle = pop(frame, at + 4, 12);
  const underline = ease(frame, [at + 8, at + 20], [0, 1]);
  return (
    <div style={{ position: "absolute", top: 205, left: 0, right: 0, textAlign: "center" }}>
      {badge ? (
        <div
          style={{
            display: "inline-block",
            transform: `scale(${sBadge}) rotate(-3deg)`,
            background: badgeColor,
            color: COLORS.white,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 46,
            padding: "6px 30px",
            borderRadius: 14,
            marginBottom: 12,
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
          }}
        >
          {badge}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: title.length > 16 ? 78 : 92,
          lineHeight: 1.02,
          color,
          transform: `scale(${sTitle})`,
          textTransform: "uppercase",
          padding: "0 70px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          margin: "14px auto 0",
          height: 12,
          width: 300 * underline,
          borderRadius: 6,
          background: COLORS.mustard,
        }}
      />
    </div>
  );
};
