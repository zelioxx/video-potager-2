import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../config";
import { ease, pop } from "./anim";

type IconProps = { x: number; y: number; at: number; size?: number; exitAt?: number };

const useScale = (at: number, exitAt?: number) => {
  const frame = useCurrentFrame();
  return { frame, s: pop(frame, at, 9) * (exitAt === undefined ? 1 : 1 - pop(frame, exitAt, 14)) };
};

const wrap = (x: number, y: number, size: number, s: number, rot = 0): React.CSSProperties => ({
  position: "absolute",
  left: x - size / 2,
  top: y - size / 2,
  width: size,
  height: size,
  transform: `scale(${s}) rotate(${rot}deg)`,
  filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.25))",
});

// Coche verte tracée au feutre.
export const Check: React.FC<IconProps> = ({ x, y, at, size = 220, exitAt }) => {
  const { frame, s } = useScale(at, exitAt);
  if (s <= 0.001) return null;
  const draw = ease(frame, [at + 2, at + 14], [1, 0]);
  return (
    <svg viewBox="0 0 100 100" style={wrap(x, y, size, s, -6)}>
      <circle cx="50" cy="50" r="46" fill={COLORS.green} />
      <path
        d="M28 52 L44 67 L73 35"
        fill="none"
        stroke={COLORS.white}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={draw}
      />
    </svg>
  );
};

// Croix rouge.
export const Cross: React.FC<IconProps> = ({ x, y, at, size = 200, exitAt }) => {
  const { frame, s } = useScale(at, exitAt);
  if (s <= 0.001) return null;
  const d1 = ease(frame, [at + 2, at + 9], [1, 0]);
  const d2 = ease(frame, [at + 7, at + 14], [1, 0]);
  return (
    <svg viewBox="0 0 100 100" style={wrap(x, y, size, s, 8)}>
      <circle cx="50" cy="50" r="46" fill={COLORS.red} />
      {[
        ["M32 32 L68 68", d1],
        ["M68 32 L32 68", d2],
      ].map(([d, off]) => (
        <path
          key={d as string}
          d={d as string}
          stroke={COLORS.white}
          strokeWidth="11"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={off as number}
        />
      ))}
    </svg>
  );
};

// Panneau « attention » qui tremble.
export const Warning: React.FC<IconProps> = ({ x, y, at, size = 300, exitAt }) => {
  const { frame, s } = useScale(at, exitAt);
  if (s <= 0.001) return null;
  const shake = interpolate(frame - at, [0, 6, 12, 18, 24], [0, -9, 8, -5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <svg viewBox="0 0 100 100" style={wrap(x, y, size, s, shake)}>
      <path d="M50 6 L96 88 Q98 94 92 94 L8 94 Q2 94 4 88 Z" fill={COLORS.mustard} stroke={COLORS.ink} strokeWidth="5" strokeLinejoin="round" />
      <rect x="45" y="32" width="10" height="34" rx="5" fill={COLORS.ink} />
      <circle cx="50" cy="78" r="6" fill={COLORS.ink} />
    </svg>
  );
};

// Bulle de commentaire.
export const Bubble: React.FC<IconProps> = ({ x, y, at, size = 170, exitAt }) => {
  const { frame, s } = useScale(at, exitAt);
  if (s <= 0.001) return null;
  return (
    <svg viewBox="0 0 100 100" style={wrap(x, y, size, s, Math.sin(frame * 0.15) * 6)}>
      <path d="M12 14 H88 Q94 14 94 20 V64 Q94 70 88 70 H40 L22 88 V70 H12 Q6 70 6 64 V20 Q6 14 12 14 Z" fill={COLORS.white} stroke={COLORS.ink} strokeWidth="5" />
      <circle cx="30" cy="42" r="6" fill={COLORS.ink} />
      <circle cx="50" cy="42" r="6" fill={COLORS.ink} />
      <circle cx="70" cy="42" r="6" fill={COLORS.ink} />
    </svg>
  );
};

// Gouttes de pluie qui tombent dans une zone donnée.
export const Rain: React.FC<{ at: number; left: number; top: number; width: number; height: number; count?: number }> = ({
  at,
  left,
  top,
  width,
  height,
  count = 22,
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const t = frame - at;
  const opacity = ease(frame, [at, at + 8], [0, 1]);
  return (
    <div style={{ position: "absolute", left, top, width, height, overflow: "hidden", opacity }}>
      {new Array(count).fill(0).map((_, i) => {
        const speed = 22 + ((i * 37) % 13);
        const x = ((i * 97) % 100) / 100 * width;
        const y = ((t * speed + i * 131) % (height + 120)) - 80;
        return (
          <svg key={i} viewBox="0 0 20 30" style={{ position: "absolute", left: x, top: y, width: 34, height: 51 }}>
            <path d="M10 1 C14 10 18 15 18 20 A8 8 0 0 1 2 20 C2 15 6 10 10 1 Z" fill="#5AA6D6" stroke="#2E6E99" strokeWidth="1.5" />
          </svg>
        );
      })}
    </div>
  );
};
