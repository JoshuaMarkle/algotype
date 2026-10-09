# Skill: Run checks (lint + tests + build)

Use before declaring any code change done. CI (`.github/workflows/ci.yml`) runs the same lint, test and build steps on every PR, so a clean local run means a green PR.

## Preconditions
- Node.js 22 (what CI uses).
- Working directory: repo root.

## Steps
1. Install dependencies if `node_modules/` is missing or `package-lock.json` changed:
   ```bash
   npm ci
   ```
2. Lint:
   ```bash
   npm run lint
   ```
   - Expected baseline (2026-10-09): 0 errors, 2 warnings:
     - `src/components/typing/TypingResults.jsx` `jsx-a11y/alt-text`
     - `src/components/typing/TypingTest.jsx` `react-hooks/exhaustive-deps`
   - Pass = no errors and no **new** warnings in files you touched.
3. Unit tests:
   ```bash
   npm test
   ```
   - Pass = all tests pass. Tests pin current behavior: if your change intentionally alters `calculateStats` or `useTypingState`, update the affected test in the same change and say so.
   - New pure logic should get a `*.test.js` next to it (see `context/conventions.md` → Testing).
4. Build:
   ```bash
   NEXT_TELEMETRY_DISABLED=1 npm run build
   ```
   - Needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (template: `.env.example`). If `.env.local` is absent, placeholders work for a compile check (CI does this):
     ```bash
     NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder npm run build
     ```
   - `npm run build` also runs `postbuild` (`next-sitemap`), which rewrites `public/sitemap*.xml` and `public/robots.txt`. Do not commit those unless the task is about SEO (`public/sitemap*` is gitignored; `robots.txt` is tracked).
   - Pass = "Compiled successfully" and all routes listed.
5. Manual check for UI/typing changes (unit tests do not cover rendering or Supabase):
   - `npm run dev`, open the affected route (needs real Supabase env to load challenges).
   - For typing changes: type a full test, try a wrong key + backspace, Enter on a line end, Tab to next test.
   - If you cannot run it (no credentials), say so explicitly.
6. Clean up: `rm -rf .next` if you built in a shared checkout; revert any regenerated `public/robots.txt` you did not intend to change.

## Report
State which steps ran, their result, and anything not verified.
