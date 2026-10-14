import "@fontsource/poppins/600.css";
import "@fontsource/poppins/800.css";
import "@fontsource/poppins/900.css";
import "@fontsource/caveat/700.css";
import { continueRender, delayRender } from "remotion";

// Attend que les polices soient chargées avant de rendre la première image.
const handle = delayRender("Chargement des polices");
Promise.all([
  document.fonts.load('600 40px "Poppins"'),
  document.fonts.load('800 40px "Poppins"'),
  document.fonts.load('900 40px "Poppins"'),
  document.fonts.load('700 40px "Caveat"'),
])
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));
