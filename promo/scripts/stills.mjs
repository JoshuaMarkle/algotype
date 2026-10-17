// Render chosen still frames without a full render: bundles once, then
// renders each requested frame to stills/<Composition>-<frame>.jpeg.
//
//   npm run stills -- KitHeadline:0,12,40 KitCharts:30
//   npm run stills -- Promo:@12.5      (frame at 12.5 s)
//
// In the cloud: REMOTION_BROWSER=/path/to/chromium REMOTION_GL=swangle
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "stills");
fs.mkdirSync(outDir, { recursive: true });

const requests = process.argv.slice(2).map((arg) => {
  const [id, frames = "0"] = arg.split(":");
  return { id, frames: frames.split(",") };
});
if (requests.length === 0) {
  console.error("Usage: npm run stills -- <Composition>:<frame|@seconds>[,...] ...");
  process.exit(1);
}

const browserExecutable = process.env.REMOTION_BROWSER || null;
const chromiumOptions = { gl: process.env.REMOTION_GL || undefined };

const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts") });

for (const { id, frames } of requests) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable, chromiumOptions });
  for (const f of frames) {
    const frame = f.startsWith("@")
      ? Math.round(parseFloat(f.slice(1)) * composition.fps)
      : parseInt(f, 10);
    const output = path.join(outDir, `${id}-${frame}.jpeg`);
    await renderStill({
      composition,
      serveUrl,
      frame: Math.min(frame, composition.durationInFrames - 1),
      output,
      imageFormat: "jpeg",
      jpegQuality: 90,
      browserExecutable,
      chromiumOptions,
    });
    console.log(output);
  }
}
