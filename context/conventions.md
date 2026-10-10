# Conventions

## Commands
| Task | Command | Notes |
|---|---|---|
| Install | `npm ci` | Uses `package-lock.json` (npm) |
| Dev server | `npm run dev` | `next dev --turbopack`, http://localhost:3000. Needs `.env.local` with Supabase vars (copy `.env.example`) |
| Lint | `npm run lint` | `next lint` (ESLint 9, `next/core-web-vitals`). Baseline: 0 errors, 2 warnings |
| Build | `npm run build` | `next build`, then `postbuild` runs `next-sitemap` (writes `public/sitemap*.xml`, `public/robots.txt`) |
| Start prod | `npm run start` | After build |
| Format | `npx prettier --write <files>` | No npm script. `.prettierignore` skips `*.md`, `.github` |
| Tokenize content | `npm run generate:tokens` | See `skills/add_challenges.md` |
| Upload content | `npm run upload:tokens` | Writes to Supabase. Destructive-ish: confirm first |
| Tests | `npm test` | Vitest, runs `src/**/*.test.{js,jsx}` once. `npm run test:watch` for watch mode |
| Deploy | push to GitHub | Vercel builds a Preview for every branch push. Production from `main` `[UNVERIFIED]` |

- `next build` works without real Supabase credentials if placeholder `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set (dynamic `[slug]` pages are not prerendered).

## Code style
- Prettier 3 defaults + `.prettierrc`: 2-space indent, double quotes, semicolons, trailing commas, LF.
- `.editorconfig`: 2 spaces for js/css/json; 4 spaces for C++.
- ES modules everywhere (`import`/`export`), including Node scripts in `backend/scripts/` (top-level `await` used).
- Import alias `@/` = `src/`. Always use it for cross-folder imports.
- Import order (observed): React/Next → third-party → blank line → `@/components/ui` → other `@/components` → `@/lib`.
- Client components start with `"use client";`.
- Section comments: `// --- Section name ---` and short `// Comment` lines above blocks.

## Naming
- Components: PascalCase files and default exports (`TypingTest.jsx`, `ProblemsTable.jsx`).
- shadcn primitives in `src/components/ui/` are renamed to PascalCase (`Button.jsx`, not `button.jsx`); most export both named and default (`export default Button; export { Button, buttonVariants }`).
- Hooks: `useX` in `hooks/` folders (`useTypingState.js`). Exception: `src/hooks/use-mobile.js` (shadcn default name).
- Utilities: camelCase files/functions (`calculateStats.js`, `randomTest.js`).
- Routes: `page.js` for server pages, `page.jsx` for client/JSX-heavy pages (not strictly consistent).
- Supabase RPC params are prefixed with `_` (`_min_length`, `_name`).
- localStorage keys prefixed `algotype_` (`algotype_profile`, `algotype_history`, `algotype_settings`).
- Language ids are Prism ids (`python`, `cpp`, `javascript`, `java`, `rust`); display names via `langToNatural` / `naturalToLang` in `src/lib/utils.js`.
- Slugs: `<SourceFileBaseName>-<language>` (e.g. `NQueens-java`).

## Styling
- Tailwind v4 utility classes with project tokens from `globals.css` `@theme inline`: `bg`, `bg-2..5`, `fg`, `fg-2..4`, `red`, `green`, `blue`, `blue-2/3`, `yellow`, `border`, `primary`. Prefer these over raw Tailwind palette colors.
- Merge classes with `cn()` from `@/lib/utils`.
- Color themes (all dark): each theme in `src/lib/themes.js` has a `[data-theme="<id>"]` block in `globals.css` setting `--c-*` (palette) and `--syntax-*` (code) variables; Tailwind color tokens point at those. Never hardcode hex colors; in charts and inline styles use `var(--c-blue)` etc. Adding a theme = one CSS block + one entry in `THEMES` (a unit test checks they match).
- The saved theme (`theme` in `algotype_settings`) is applied to `<html data-theme>` before first paint by an inline script in `layout.js`.
- Layout pattern for content pages: `<Navbar className="fixed top" />`, bordered container `mx-4 md:mx-8 2xl:mx-16 bg-bg border-x border-border`, `<Footer />`.

## Patterns
- Data access goes straight to Supabase from components or `src/lib/*` helpers. No API routes except `/auth/callback`.
- Errors from Supabase helpers are thrown as `Error(message)`; UI shows them in state or `alert()`.
- Client caches with TTL in localStorage (see `code_and_algorithms.md` §7).
- Server pages fetch with the Supabase client and pass plain data to client components.

## Testing
- Vitest unit tests sit next to the code as `*.test.js` (e.g. `utils/calculateStats.test.js`, `hooks/useTypingState.test.js`). Config: `vitest.config.mjs` (Node env, `@/` alias).
- Hook/DOM tests opt into jsdom with a `// @vitest-environment jsdom` first line and use `renderHook` from `@testing-library/react`.
- Tests pin current behavior. When you fix a bug they encode, update the test in the same change.
- CI: `.github/workflows/ci.yml` runs `npm ci`, lint, test, build (placeholder Supabase env) on every PR and on pushes to `main`.
- Verification = `npm run lint` + `npm test` + `npm run build` + manual check in the browser for UI changes.

## Git
- Single branch workflow on `main` so far; commit messages are short, capitalized, past or imperative ("Added settings page + navbar updates", "Update auth backend"). Joined changes with `+`.
- Issue templates: bug report, feature request (`.github/ISSUE_TEMPLATE/`).
