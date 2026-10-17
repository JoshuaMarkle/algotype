// The site's own Geist and Geist Mono variable fonts (from the `geist`
// package the site uses), bundled in public/fonts. loadFont holds the render
// until each face is ready, so no frame is drawn with a fallback font.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { font } from "./tokens";

export const fontsReady = Promise.all([
  loadFont({
    family: font.sans,
    url: staticFile("fonts/Geist-Variable.woff2"),
    weight: "100 900",
    format: "woff2",
  }),
  loadFont({
    family: font.mono,
    url: staticFile("fonts/GeistMono-Variable.woff2"),
    weight: "100 900",
    format: "woff2",
  }),
]);
