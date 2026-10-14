import { Easing, interpolate, spring } from "remotion";
import { FPS } from "../timeline";

// Ressort « pop » utilisé pour les apparitions.
export const pop = (frame: number, at: number, damping = 11) =>
  spring({ frame: frame - at, fps: FPS, config: { damping, stiffness: 170, mass: 0.7 } });

export const fadeIn = (frame: number, at: number, len = 8) =>
  interpolate(frame, [at, at + len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

export const ease = (frame: number, range: [number, number], out: [number, number], easing = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, range, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// Petit flottement continu pour donner de la vie aux éléments.
export const float = (frame: number, amp = 8, speed = 0.06, phase = 0) => Math.sin(frame * speed + phase) * amp;
