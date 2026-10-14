import { Img, staticFile, useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../config";
import { getScene, wordFrame } from "../timeline";
import { Cutout, PhotoCard } from "../components/Media";
import { Header, Pill } from "../components/Text";
import { Check, Cross, Rain } from "../components/Icons";
import { Sfx } from "../components/Sfx";
import { ease, pop } from "../components/anim";

export const Argile: React.FC = () => {
  const sc = getScene("argile");
  const fEau = wordFrame(sc, "l'eau");
  const fDetrempe = wordFrame(sc, "detrempe");
  const fPourr = wordFrame(sc, "pourrissent");
  return (
    <>
      <Header badge="Piège n°1" title="Terre argileuse" at={0} />
      <PhotoCard src="img/photos/field_flood.jpg" x={540} y={720} w={820} h={560} at={5} rotate={2} />
      <Rain at={fEau} left={150} top={460} width={780} height={520} />
      <Pill text="Sol détrempé" x={330} y={1010} at={fDetrempe} color="#2E6E99" size={56} />
      <PhotoCard src="img/photos/garlic_rot.jpg" x={790} y={1030} w={330} h={330} round at={fPourr - 2} rotate={-6} />
      <Cross x={930} y={900} at={fPourr + 4} size={130} />
      <Sfx at={0} src="buzz" volume={0.35} />
      <Sfx at={fDetrempe} src="pop" />
      <Sfx at={fPourr} src="pop" />
    </>
  );
};

// Coupe de sol avec une vraie gousse d'ail qui descend trop profond puis remonte.
export const Profond: React.FC = () => {
  const sc = getScene("profond");
  const frame = useCurrentFrame();
  const fProfond = wordFrame(sc, "profond");
  const fEnfonce = wordFrame(sc, "enfonce");
  const fPourrit = wordFrame(sc, "pourrit");
  const fJuste = wordFrame(sc, "juste");
  const fPas = wordFrame(sc, "pas");
  const SURFACE = 640;
  const BOTTOM = 1230;
  const soilIn = pop(frame, 4, 14);
  const cloveY =
    frame < fJuste
      ? ease(frame, [fProfond - 10, fProfond + 12], [470, 1070])
      : ease(frame, [fJuste, fJuste + 14], [1070, SURFACE + 150]);
  const rotten = frame >= fPourrit && frame < fJuste ? ease(frame, [fPourrit, fPourrit + 10], [0, 1]) : 0;
  const shake = rotten > 0 ? Math.sin(frame * 1.3) * 6 : 0;
  return (
    <>
      <Header badge="Piège n°2" title="Trop profond" at={0} />
      {/* coupe de terre : vraie photo de sol en texture */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: SURFACE,
          height: (BOTTOM - SURFACE) * soilIn,
          borderRadius: "26px 26px 34px 34px",
          overflow: "hidden",
          boxShadow: "0 22px 40px rgba(60,40,20,0.35)",
          border: `10px solid ${COLORS.white}`,
        }}
      >
        <Img
          src={staticFile("img/photos/soil_texture.jpg")}
          style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7) saturate(1.15)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(91,61,39,0.15), rgba(40,25,12,0.6))" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: SURFACE - 6,
          height: 22 * soilIn,
          borderRadius: 12,
          background: `linear-gradient(180deg, ${COLORS.greenLight}, ${COLORS.green})`,
        }}
      />
      <SurfaceLabel y={SURFACE} at={8} />
      <Cutout
        src="img/detoures/garlic_cloves.png"
        x={540 + shake}
        y={cloveY}
        w={190}
        at={2}
        rotate={-12}
        bob={0}
        filter={rotten > 0 ? `sepia(${rotten}) brightness(${1 - rotten * 0.45}) hue-rotate(-15deg)` : undefined}
      />
      <DepthArrow from={SURFACE} to={1070} at={fProfond + 8} exitAt={fJuste} color={COLORS.red} label="Trop profond" />
      <Cross x={800} y={1080} at={fEnfonce} size={120} exitAt={fJuste} />
      <Pill text="Ça pourrit" x={540} y={1180} at={fPourrit} color={COLORS.red} size={50} exitAt={fJuste} />
      <DepthArrow from={SURFACE + 14} to={SURFACE + 60} at={fJuste + 10} color={COLORS.green} label="2 à 3 cm" />
      <Check x={800} y={SURFACE + 150} at={fPas} size={130} />
      <Sfx at={0} src="buzz" volume={0.35} />
      <Sfx at={fProfond - 8} src="whoosh" volume={0.35} />
      <Sfx at={fPourrit} src="pop" />
      <Sfx at={fJuste} src="whoosh" volume={0.35} />
      <Sfx at={fPas} src="ding" volume={0.35} />
    </>
  );
};

const SurfaceLabel: React.FC<{ y: number; at: number }> = ({ y, at }) => {
  const frame = useCurrentFrame();
  const o = ease(frame, [at, at + 8], [0, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        top: y - 62,
        opacity: o,
        fontFamily: "Caveat",
        fontWeight: 700,
        fontSize: 58,
        color: COLORS.ink,
        transform: "rotate(-3deg)",
      }}
    >
      surface ↓
    </div>
  );
};

const DepthArrow: React.FC<{ from: number; to: number; at: number; exitAt?: number; color: string; label: string }> = ({
  from,
  to,
  at,
  exitAt,
  color,
  label,
}) => {
  const frame = useCurrentFrame();
  const grow = ease(frame, [at, at + 10], [0, 1]);
  const out = exitAt === undefined ? 1 : 1 - ease(frame, [exitAt, exitAt + 5], [0, 1]);
  if (grow <= 0 || out <= 0) return null;
  const h = (to - from) * grow;
  return (
    <div style={{ position: "absolute", left: 300, top: from, opacity: out }}>
      <div style={{ width: 0, height: h, borderLeft: `8px dashed ${color}` }} />
      <div
        style={{
          position: "absolute",
          top: Math.max(h / 2 - 34, -10),
          left: 26,
          whiteSpace: "nowrap",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 44,
          color: COLORS.white,
          background: color,
          padding: "4px 20px",
          borderRadius: 14,
          transform: `scale(${grow})`,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Nuisibles: React.FC = () => {
  const sc = getScene("nuisibles");
  const frame = useCurrentFrame();
  const fMouche = wordFrame(sc, "mouche");
  const fLarves = wordFrame(sc, "larves");
  const fCampa = wordFrame(sc, "campagnols");
  const fFestin = wordFrame(sc, "festin");
  const huddle = ease(frame, [fFestin - 4, fFestin + 8], [0, 1]);
  return (
    <>
      <Header badge="Piège n°3" title="Les nuisibles" at={0} />
      <Cutout src="img/detoures/fly_white.png" x={300 + huddle * 60} y={560} w={380} at={fMouche - 2} buzz caption="Mouche de l'oignon" />
      <Cutout src="img/detoures/larves.png" x={790 - huddle * 60} y={720} w={330} at={fLarves - 2} rotate={6} caption="Larves" />
      <PhotoCard src="img/photos/vole.jpg" x={330 + huddle * 50} y={1020} w={380} h={380} round at={fCampa - 2} rotate={-4} caption="Campagnols" />
      <Cutout src="img/detoures/garlic_bulb.png" x={790} y={1060} w={260} at={fFestin - 6} rotate={10} filter="sepia(0.5) brightness(0.85)" />
      <Pill text="Festin !" x={790} y={1210} at={fFestin} color={COLORS.terracotta} size={56} rotate={4} />
      <Sfx at={0} src="buzz" volume={0.35} />
      <Sfx at={fMouche} src="pop" />
      <Sfx at={fLarves} src="pop" />
      <Sfx at={fCampa} src="pop" />
      <Sfx at={fFestin} src="pop" />
    </>
  );
};
