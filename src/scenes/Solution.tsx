import { useCurrentFrame } from "remotion";
import { COLORS, FONT } from "../config";
import { getScene, wordFrame } from "../timeline";
import { Cutout, PhotoCard } from "../components/Media";
import { Header, Pill } from "../components/Text";
import { Bubble } from "../components/Icons";
import { Sfx } from "../components/Sfx";
import { ease, pop } from "../components/anim";

export const Solution: React.FC = () => {
  const sc = getScene("solution");
  const frame = useCurrentFrame();
  const fPrint = wordFrame(sc, "printemps");
  const fFev = wordFrame(sc, "fevrier");
  const fMars = wordFrame(sc, "mars");
  const fVar = wordFrame(sc, "varietes");
  // la gousse germée « pousse » depuis le bas
  const grow = pop(frame, fPrint - 4, 13);
  return (
    <>
      <Header badge="La solution" badgeColor={COLORS.green} title="Planter au printemps" at={0} color={COLORS.green} />
      <div
        style={{
          position: "absolute",
          left: 290,
          top: 490,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: COLORS.greenLight,
          opacity: 0.35 * grow,
          transform: `scale(${grow})`,
        }}
      />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "540px 1000px", transform: `scaleY(${0.6 + grow * 0.4})` }}>
        <Cutout src="img/detoures/garlic_sprout.png" x={540} y={740} w={440} at={fPrint - 4} />
      </div>
      <Month text="Février" x={300} y={1050} at={fFev} />
      <Arrow x={540} y={1050} at={fFev + 6} />
      <Month text="Mars" x={780} y={1050} at={fMars} />
      <Pill text="Variétés adaptées" x={540} y={1190} at={fVar} color={COLORS.green} size={52} />
      <Sfx at={0} src="ding" volume={0.4} />
      <Sfx at={fPrint} src="pop" />
      <Sfx at={fFev} src="pop" />
      <Sfx at={fMars} src="pop" />
      <Sfx at={fVar} src="ding" volume={0.3} />
    </>
  );
};

// Page de calendrier.
const Month: React.FC<{ text: string; x: number; y: number; at: number }> = ({ text, x, y, at }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at, 10);
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 150,
        top: y - 75,
        width: 300,
        transform: `scale(${s}) rotate(${(1 - s) * 30}deg)`,
        borderRadius: 22,
        overflow: "hidden",
        background: COLORS.white,
        boxShadow: "0 16px 30px rgba(60,40,20,0.3)",
        textAlign: "center",
      }}
    >
      <div style={{ background: COLORS.red, height: 34 }} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 60, color: COLORS.ink, padding: "8px 0 14px", textTransform: "uppercase" }}>
        {text}
      </div>
    </div>
  );
};

const Arrow: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const s = ease(frame, [at, at + 8], [0, 1]);
  return (
    <svg viewBox="0 0 100 60" style={{ position: "absolute", left: x - 50, top: y - 30, width: 100, height: 60, opacity: s }}>
      <path d="M8 30 H80 M62 12 L84 30 L62 48" fill="none" stroke={COLORS.ink} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - s} />
    </svg>
  );
};

// Étiquette de variété façon étiquette de jardin.
const Variety: React.FC<{ name: string; x: number; y: number; at: number; color: string; rotate?: number }> = ({
  name,
  x,
  y,
  at,
  color,
  rotate = -2,
}) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at, 9);
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s}) rotate(${rotate}deg)`,
        background: COLORS.white,
        border: `6px solid ${color}`,
        borderRadius: 22,
        padding: "10px 34px 12px",
        boxShadow: "0 14px 26px rgba(60,40,20,0.3)",
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ fontFamily: "Caveat", fontWeight: 700, fontSize: 40, color, lineHeight: 1 }}>variété</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 62, color: COLORS.ink, lineHeight: 1.1 }}>{name}</div>
    </div>
  );
};

export const Ail: React.FC = () => {
  const sc = getScene("ail");
  const fPrint = wordFrame(sc, "printanor");
  const fRose = wordFrame(sc, "rose");
  return (
    <>
      <Header badge="Côté ail" badgeColor={COLORS.green} title="Ail de printemps" at={0} />
      <Cutout src="img/detoures/garlic_trio.png" x={540} y={680} w={760} at={2} />
      <Variety name="Printanor" x={540} y={990} at={fPrint} color={COLORS.green} />
      <Variety name="Rose de Lautrec" x={540} y={1170} at={fRose} color="#C2507A" rotate={2} />
      <Sfx at={fPrint} src="ding" volume={0.35} />
      <Sfx at={fRose} src="ding" volume={0.35} />
    </>
  );
};

export const Echalote: React.FC = () => {
  const sc = getScene("echalote");
  const fJ = wordFrame(sc, "jermor");
  const fL = wordFrame(sc, "longor");
  const fM = wordFrame(sc, "mikor");
  return (
    <>
      <Header badge="Côté échalotes" badgeColor={COLORS.terracotta} title="Échalotes de printemps" at={0} />
      <PhotoCard src="img/photos/shallot_pile2.jpg" x={540} y={720} w={660} h={430} at={2} rotate={-2} />
      <Variety name="Jermor" x={290} y={1060} at={fJ} color={COLORS.terracotta} rotate={-4} />
      <Variety name="Longor" x={780} y={1060} at={fL} color={COLORS.terracotta} rotate={3} />
      <Variety name="Mikor" x={540} y={1200} at={fM} color={COLORS.terracotta} rotate={-1} />
      <Sfx at={fJ} src="ding" volume={0.3} />
      <Sfx at={fL} src="ding" volume={0.3} />
      <Sfx at={fM} src="ding" volume={0.3} />
    </>
  );
};

export const Cta: React.FC = () => {
  const sc = getScene("cta");
  const frame = useCurrentFrame();
  const fAut = wordFrame(sc, "automne");
  const fPrint = wordFrame(sc, "printemps");
  const fCom = wordFrame(sc, "commentaire");
  const fAbo = wordFrame(sc, "abonne");
  const pulse = frame > fAbo + 8 ? 1 + Math.sin((frame - fAbo) * 0.35) * 0.05 : 1;
  const credits = ease(frame, [sc.duration - 60, sc.duration - 50], [0, 1]);
  return (
    <>
      <Header title="Et toi ?" at={0} />
      <PhotoCard src="img/photos/field_soil.jpg" x={290} y={650} w={400} h={400} round at={fAut - 4} rotate={-4} caption="Automne" />
      <PhotoCard src="img/photos/garlic_sprout.jpg" x={790} y={650} w={400} h={400} round at={fPrint - 4} rotate={4} caption="Printemps" />
      <Vs at={fPrint + 4} />
      <Bubble x={300} y={1040} at={fCom - 2} size={190} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0 }}>
        <div style={{ position: "absolute", left: 640, top: 1040, transform: `translate(-50%, -50%) scale(${pulse})` }}>
          <Pill text="Abonne-toi" x={0} y={0} at={fAbo} color={COLORS.red} size={64} rotate={-3} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 330,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 24,
          color: COLORS.ink,
          opacity: credits * 0.7,
        }}
      >
        Photos : Flickr, licence CC BY 2.0 — crédits dans la description
      </div>
      <Sfx at={fAut} src="pop" />
      <Sfx at={fPrint} src="pop" />
      <Sfx at={fCom} src="pop" />
      <Sfx at={fAbo} src="ding" volume={0.4} />
    </>
  );
};

const Vs: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const s = pop(frame, at, 8);
  if (s <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - 70,
        top: 650 - 70,
        width: 140,
        height: 140,
        borderRadius: "50%",
        background: COLORS.mustard,
        border: `8px solid ${COLORS.white}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 58,
        color: COLORS.ink,
        transform: `scale(${s}) rotate(-8deg)`,
        boxShadow: "0 12px 24px rgba(0,0,0,0.25)",
      }}
    >
      OU
    </div>
  );
};
