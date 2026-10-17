# AlgoType promo video

A 47.3 s, 1920×1080, 30 fps promo built with Remotion 4.0.530 (pinned:
4.0.531's Studio fails with "getRenderQueue is not a function"). It lives on
its own here: nothing in it is imported by the site, and the site's build,
lint and tests ignore it.

```bash
cd promo
npm install
npm run studio          # preview; "Promo" is the film, Scenes/* each scene alone
npm run render          # final MP4 → out/algotype-promo.mp4
npm run stills -- Promo:@12.5,@30 Scene-Typing:240   # single frames → stills/
npm run typecheck
```

`@12.5` means the frame at 12.5 s; a bare number is a frame. In a headless
or cloud box set `REMOTION_BROWSER` to a Chromium headless shell and
`REMOTION_GL=swangle` before `npm run stills`.

## Where things are
- `src/storyboard.ts`: every scene length, timing beat (seconds) and line of
  copy. Re-time or re-word here; scenes only read it.
- `src/tokens.ts`: the site's colours, type scale, spacing, radii, hairlines,
  ring and motion, from `src/app/globals.css` (there is no `docs/DESIGN.md`).
- `src/scenes/`: one file per scene; `Promo.tsx` plays them back to back.
- `src/components/`: kinetic headline and wordmark, chart panel and SVG
  charts, the CodeBox editor window, the site's keyboard, toggle
  group, status badge, page backdrop and hero grid, glitch.
- `src/data/`: the site's real `quicksort.json`, the typist, and invented
  account data for the montage.
- `public/fonts/`: the site's Geist and Geist Mono variable fonts (OFL).

## Scenes
1. **Title** (4.5 s): opens on white (the loop point), dips to black over
   the homepage's hero grid while the wordmark rises.
2. **Typing** (13.6 s): the homepage's CodeBox demo types the site's
   quicksort with live wpm / acc, one typo that flashes red and is
   backspaced, and the site's keyboard lighting each key.
3. **Results** (9.2 s): the TypingResults screen (chart, light mono numbers
   with dot details) plus raw, consistency, a "Personal best" badge, and
   the typing scene's keyboard again with the typo's keys in red.
4. **Control switch** (2.8 s): the settings page's toggle group zooms in,
   switches "Last test" → "All tests", and flies to the top of the next scene.
5. **Account** (13.2 s): accelerating montage of 10 charts (opening on the
   account page's own stat blocks and past-tests table), burst into a 4×4
   grid of 16, zoom into WPM history: "Watch yourself get faster."
6. **End** (4.0 s): wordmark on white, a glitch built on the site's
   LetterGlitch characters, then blank white so the video loops.
