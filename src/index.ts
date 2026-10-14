// Point d'entrée Remotion : npx remotion render src/index.ts AilEchalotes out/ail-echalotes.mp4
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
