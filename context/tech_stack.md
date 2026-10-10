# Tech Stack

Versions are from `package.json` / installed `package-lock.json` (checked 2026-10-09).

## Languages
- JavaScript (ES modules, `"type": "module"`), JSX. No TypeScript (`components.json` `"tsx": false`).
- CSS via Tailwind v4 (`src/app/globals.css`).
- Node.js required. Exact version not pinned (no `.nvmrc` / `engines`) `[UNVERIFIED]`. Build verified on Node 22.

## Framework / runtime
- Next.js `15.3.9` (App Router, `src/app/`), dev uses Turbopack (`next dev --turbopack`).
- React `^19.0.0` (lockfile: 19.1.0).

## UI
- Tailwind CSS `^4` (4.1.8) via `@tailwindcss/postcss` (`postcss.config.js`). No `tailwind.config.js`; theme tokens are in `@theme inline` in `globals.css` and point at per-theme `--c-*` / `--syntax-*` variables (see `conventions.md` → Styling).
- `tw-animate-css`, `tailwind-animate`, `tailwind-merge`, `clsx`, `class-variance-authority`.
- shadcn/ui, style `new-york`, base color `neutral` (`components.json`). Radix primitives: accordion, avatar, dialog, dropdown-menu, hover-card, label, navigation-menu, separator, slot, tabs, toggle, toggle-group, tooltip.
- `cmdk` (Command), `lucide-react` icons.
- Fonts: `geist` (GeistSans / GeistMono) in `src/app/layout.js`.
- Charts: `recharts` 2.15.3 (`TypingResults.jsx`, `ProgressGraph.jsx`).
- Tables: `@tanstack/react-table` 8.21.3.
- Screenshots: `html2canvas` (`TypingResults.jsx`).

## Backend / services
- Supabase:
  - `@supabase/supabase-js` 2.49.9, `@supabase/ssr` 0.6.1.
  - Project URL: `https://pderwdsiwqwpnujzmvlw.supabase.co` (public, from owner 2026-10-09).
  - Browser client: `src/lib/supabaseClient.js` (`createBrowserClient`). Also used in server components `src/app/*/[slug]/page.js`.
  - Server client: `src/lib/supabaseServerClient.js` (cookie-based), used by `src/middleware.js`.
  - Auth providers in code: email/password, GitHub, Google, magic link (OTP).
  - Tables used: `challenges`, `history`, `users`. RPCs: `get_random_challenge`, `count_matching_challenges`, `is_username_available`, `is_email_available`, `delete_account`. Reference SQL: `supabase/schema.sql` (snapshot of production, 2026-10-09).
- Umami Cloud analytics: script tag in `src/app/layout.js` (website id `439c2381-...`), proxied via rewrites in `next.config.js` (`/analytics/script.js`, `/analytics/api/send`).
- Email: React Email templates in `backend/emails/*.jsx` sharing `backend/emails/components/EmailLayout.jsx` (import `@react-email/components`, a dev dependency). `npm run render:emails` bundles them with esbuild and writes static HTML to `backend/emails/out/<template>.html`, keeping Supabase's Go template variables (`{{ .TokenHash }}`, `{{ .RedirectTo }}`, `{{ .Token }}`, `{{ .Email }}`, `{{ .NewEmail }}`). Each file is pasted by hand into Supabase → Authentication → Emails → Templates (confirm → "Confirm signup", magic-link → "Magic Link", reset-password → "Reset Password", change-email → "Change Email Address", invite → "Invite user", reauthentication → "Reauthentication"). Links point at `{{ .SiteURL }}/auth/confirm?token_hash=...&type=...&next={{ .RedirectTo }}`, so the Supabase Site URL must be `https://algotype.net`. Resend is the SMTP sender (Joshua, issue #22) `[UNVERIFIED sender address]`.
- Hosting: Vercel, project `joshuamarkles-projects/algotype`. Pushes build Preview deployments (confirmed 2026-10-09). No `vercel.json`; `.vercel` gitignored.
- Vercel refuses to deploy Next.js versions with known vulnerabilities ("Vulnerable version of Next.js detected"). 15.3.2 was blocked; bumped to 15.3.9 (tasklist N0).
- SEO: `next-sitemap` (postbuild), JSON-LD in `src/components/seo/StructuredData.jsx`, OpenGraph/Twitter metadata in `layout.js`.

## Offline content tooling (`backend/scripts/`)
- `prismjs` 1.30.0 (tokenizer), `chalk`, `dotenv`, `p-limit`.
- `formatAllCode.js` shells out to external formatters: `black` (Python), `prettier` (JS), `clang-format` (C++), `google-java-format.jar` (Java, expected at `backend/scripts/google-java-format.jar`), `rustfmt` (Rust).
- `fix_errors.sh` opens failed files in `nvim`.

## Environment variables
| Var | Used by | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `supabaseClient.js`, `supabaseServerClient.js`, `auth/callback/route.js` | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same | public |
| `SUPABASE_URL` | `backend/scripts/uploadTokens.js` | read from `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | `backend/scripts/uploadTokens.js` | secret, local only |
- `.env.example` lists all four vars. All other `.env*` files are gitignored.

## Tooling
- ESLint 9 flat config extending `next/core-web-vitals` (`eslint.config.mjs`).
- Prettier 3 (`.prettierrc`: 2 spaces, LF, uses `.editorconfig`). No npm script for it.
- Path alias `@/*` → `src/*` (`jsconfig.json`).
- Tests: Vitest 3 + `@testing-library/react` + jsdom (dev deps). CI: `.github/workflows/ci.yml` (Node 22, lint → test → build).
