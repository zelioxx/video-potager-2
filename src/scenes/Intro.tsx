import { useCurrentFrame } from "remotion";
import { COLORS } from "../config";
import { getScene, wordFrame } from "../timeline";
import { Cutout, PhotoCard } from "../components/Media";
import { Header, Pill } from "../components/Text";
import { Check, Warning } from "../components/Icons";
import { Sfx } from "../components/Sfx";
import { ease } from "../components/anim";

export const Hook: React.FC = () => {
  const sc = getScene("hook");
  const fAil = wordFrame(sc, "ail") - 3;
  const fEch = wordFrame(sc, "echalotes") - 3;
  const fAut = wordFrame(sc, "automne");
  const fIdee = wordFrame(sc, "idee");
  return (
    <>
      <Header title="Ail & échalotes" at={0} />
      <PhotoCard src="img/photos/shallot_pile.jpg" x={750} y={760} w={470} h={470} round at={fEch} rotate={4} />
      <Cutout src="img/detoures/garlic_bulb.png" x={350} y={720} w={470} at={fAil} rotate={-8} />
      <Pill text="à l'automne ?" x={540} y={1130} at={fAut} color={COLORS.terracotta} size={66} />
      <BigQuestion at={fIdee} />
      <Sfx at={fAil} src="pop" />
      <Sfx at={fEch} src="pop" />
      <Sfx at={fAut} src="whoosh" volume={0.3} />
    </>
  );
};

const BigQuestion: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const s = ease(frame, [at, at + 8], [0, 1]);
  if (s <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 880,
        top: 470,
        fontFamily: "Poppins",
        fontWeight: 900,
        fontSize: 190,
        color: COLORS.mustard,
        transform: `scale(${s}) rotate(${12 + Math.sin(frame * 0.3) * 6}deg)`,
        textShadow: `6px 6px 0 ${COLORS.ink}`,
      }}
    >
      ?
    </div>
  );
};

export const Oui: React.FC = () => {
  const sc = getScene("oui");
  const fMarcher = wordFrame(sc, "marcher");
  const fMais = wordFrame(sc, "mais");
  const fTrois = wordFrame(sc, "trois");
  return (
    <>
      <Header title="Ça peut marcher" at={0} color={COLORS.green} />
      <PhotoCard src="img/photos/garlic_harvest.jpg" x={540} y={760} w={600} h={680} at={2} rotate={-3} exitAt={fMais + 2} />
      <Check x={800} y={500} at={fMarcher} size={210} exitAt={fMais + 2} />
      <Warning x={540} y={760} at={fMais + 6} size={360} />
      <Pill text="3 pièges" x={540} y={1060} at={fTrois} color={COLORS.red} size={80} rotate={3} />
      <Sfx at={fMarcher} src="ding" volume={0.35} />
      <Sfx at={fMais + 6} src="buzz" volume={0.4} />
      <Sfx at={fTrois} src="pop" />
    </>
  );
};
