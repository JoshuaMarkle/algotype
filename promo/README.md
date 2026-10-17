# AlgoType promo video

A 1920×1080, 30 fps promo built with Remotion 4.0.530 (pinned: 4.0.531's
Studio fails with "getRenderQueue is not a function"). Self-contained: nothing
here is imported by the site, and the site's build, lint and tests ignore it.

```bash
cd promo
npm install
npm run studio          # preview; every scene and kit piece is its own composition
npm run render          # final MP4 → out/algotype-promo.mp4
npm run stills -- KitEditor:0 KitHeadline:12,60   # single frames → stills/
npm run typecheck
```

In a headless/cloud box set `REMOTION_BROWSER` to a Chromium headless shell
and `REMOTION_GL=swangle` before `npm run stills`.

- `src/tokens.ts`: the site's colours, type, spacing, radii, hairlines and
  motion as code (from `src/app/globals.css`; there is no `docs/DESIGN.md` yet).
- `src/storyboard.ts`: every scene length, beat (seconds) and line of copy.
- `src/components/`: kinetic headline, chart panel + SVG charts, stat
  counter, segmented control, code editor, status badge, logo.
- `public/fonts/`: the site's Geist and Geist Mono variable fonts (OFL).
