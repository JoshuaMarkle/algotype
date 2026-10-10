# Architecture

## Top-level layout
```
/                      Next.js app root (package.json, configs)
├─ src/
│  ├─ app/             App Router routes (pages, route handlers, globals.css, layout.js)
│  ├─ components/
│  │  ├─ typing/       Typing engine: TypingTest, TypingRenderer, TypingResults, hooks/, utils/
│  │  ├─ tables/       ProblemsTable (browse challenges), PastTestsTable (history), utils/getColumns.js
│  │  ├─ graphs/       ProgressGraph (account WPM history)
│  │  ├─ layouts/      Navbar, NavbarAccount, Footer, SettingsSidebar, misc/RandomButton
│  │  ├─ auth/         Login/SignUp/ForgotPassword/PasswordReset/ReverifyEmail forms, PasswordStrengthMeter
│  │  ├─ effects/      CodeBox (landing auto-typer), KeyboardBackground, HashPatternSvg, LetterGlitch
│  │  ├─ seo/          StructuredData (JSON-LD)
│  │  └─ ui/           shadcn/ui primitives (PascalCase filenames)
│  ├─ lib/             supabaseClient, supabaseServerClient, auth, history, settings, utils, useDebounce
│  ├─ hooks/           use-mobile.js (useIsMobile, used by ui/Sidebar)
│  ├─ data/            quicksort.json (tokenized demo for CodeBox)
│  └─ middleware.js    Supabase session refresh + signed-out redirect for /account
├─ backend/
│  ├─ scripts/         generateTokens.js, uploadTokens.js, formatAllCode.js, fix_errors.sh, logs/
│  └─ emails/          React Email templates for Supabase auth emails
├─ public/             icons, logo, robots.txt, site.webmanifest, generated sitemap (gitignored)
└─ .github/            issue templates, README images
```
Gitignored, local-only content dirs: `backend/data`, `backend/leetcode`, `backend/tokens`.

## Routes (`src/app/`)
| Route | File | Type | Notes |
|---|---|---|---|
| `/` | `page.js` | server | Landing: hero, `RandomButton`, `CodeBox` demo, FAQ |
| `/algorithms` | `algorithms/page.js` | server shell | `<ProblemsTable mode="algorithms" />` |
| `/algorithms/[slug]` | `algorithms/[slug]/page.js` | dynamic server | Fetches `challenges` by `slug` (no mode filter), renders `<TypingTest challenge slug />` |
| `/files` | `files/page.js` | server shell | `<ProblemsTable mode="files" />` |
| `/files/[slug]` | `files/[slug]/page.js` | dynamic server | Fetches by `slug` + `mode='files'`; **passes wrong props to TypingTest (bug)** |
| `/drills` | `drills/page.js` | server shell | Syntax drills picker (`components/drills/DrillPicker.jsx`): drill types, language, length; last choice in `localStorage` `algotype_drills` |
| `/drills/[slug]` | `drills/[slug]/page.js` | dynamic server | Slug `<language>-<type>[-<type>...]` (+ `?length=short\|medium\|long`), invalid → 404. `DrillTest` generates the drill in the browser; no Supabase read |
| `/account` | `account/page.jsx` | client | Redirects to `/login` if no profile; stats, `ProgressGraph`, `PastTestsTable` |
| `/settings` | `settings/page.jsx` | client | Tabs: account / appearance / theme |
| `/login` (+ `/password-reset`, `/password-reset/callback`, `/verify-email`) | `login/**` | mixed | Auth forms |
| `/signup` (+ `/success`) | `signup/**` | mixed | Sign-up form, "check your email" page |
| `/auth/callback` | `auth/callback/route.js` | route handler | `exchangeCodeForSession(code)` then redirect to `?next=` (relative paths only, default `/account`); errors go to `?next=` when given (provider linking from `/settings`), else `/login?error=` |
| `/auth/confirm` | `auth/confirm/route.js` | route handler | Email links: `verifyOtp({ type, token_hash })` on the server, then redirect via `confirmRedirectPath` (`src/lib/authRedirects.js`); bad links go to `/login?error=` (`/login/password-reset?error=` for recovery) |
| `/privacy`, `/terms` | `privacy/page.js`, `terms/page.js` | static | Legal text |
| `/colors` | `colors/page.js` | static | Internal design-token preview page (publicly reachable) |
| 404 | `not-found.jsx` | static | |

Root layout: `src/app/layout.js` (fonts, metadata, Umami script, `StructuredData`).

## Data flow

### Content pipeline (offline, run by hand)
1. Source files: `backend/data/algorithms/<prism-lang>/<Name>.<ext>` + sidecar `<Name>.meta` (JSON: `title`, `description`, `source`).
2. Optional formatting: `backend/scripts/formatAllCode.js` (paths resolve from the script, runs from any directory), failures → `backend/scripts/logs/format_errors.txt`.
3. `npm run generate:tokens` → `backend/scripts/generateTokens.js` → `backend/tokens/<mode>/<lang>/<Name>.json`.
4. `npm run upload:tokens` → `backend/scripts/uploadTokens.js` → upsert into Supabase `challenges` on `slug`.
5. `next-sitemap` (postbuild) reads `backend/tokens/files/**` to add `/files/<slug>` URLs.

### Typing a test (browser)
1. `/algorithms/[slug]` server component selects `*` from `challenges` → `challenge` object.
2. `TypingTest` (`src/components/typing/TypingTest.jsx`) holds stats refs and filter state; uses `useTypingState(tokens, stats)` for cursor state and `useAutoScroll`.
3. Hidden `<textarea>` receives keydown → `handleKey` in `useTypingState.js`.
4. `TypingRenderer` renders lines/tokens with cursor and wrong-char overlay.
5. On finish: `calculateStats` → `submitTestHistory` (`src/lib/history.js`) inserts into `history` if signed in → `TypingResults` shows chart + stats.
6. Next test: `gotoRandomTest(filters)` → RPC `get_random_challenge` → `window.location.href = /<mode>/<slug>` (full page load).

### Syntax drills (browser only)
1. `src/lib/drills/templates.js` holds snippet templates per language (`python`, `cpp`, `java`) and drill type (`for`, `while`, `if`, `func`, `class`, `idiom`) with random names.
2. `buildDrillChallenge` (`src/lib/drills/index.js`) joins `count` snippets with blank lines, tokenizes them with `src/lib/tokenizer.js` (Prism language components imported statically) and returns a challenge-shaped object (`mode: "drills"`, `slug` = drill slug, `source: ""`).
3. `DrillTest` renders `TypingTest` with `onNext` (new drill, also Tab), `onRestart` (same drill) and `nav` (replaces breadcrumb + filters). Results go to `history` with `mode: "drills"`, so past-test links open `/drills/<slug>`.
4. Drills never read or write the `challenges` table.

### Accounts
- `src/lib/auth.js` wraps Supabase Auth; OAuth/magic-link/signup redirect to `/auth/callback`; password reset → `/login/password-reset/callback`.
- Profile = `users` row + auth user fields, cached in `localStorage` (`algotype_profile`, 15 min) by `getCurrentProfile`.
- History cached in memory + `localStorage` (`algotype_history`, 60 s) by `getUserHistory`.
- `Navbar` calls `getCurrentProfile()` on mount to switch login link vs `NavbarAccount` menu.

## Module boundaries / dependencies
- `components/typing/*` depends on `lib/history`, `lib/utils`, `lib/supabaseClient` (via `utils/randomTest.js`), and `components/ui`.
- `lib/auth.js` ↔ `lib/history.js` import each other (`clearHistoryCache`, `getCurrentUser`): circular import, works because only functions are used at call time.
- `components/ui/*` are leaf primitives; only depend on `lib/utils` (`cn`) and `hooks/use-mobile`.
- `backend/` is not imported by the app. It runs under Node only. The tokenizer core lives in `src/lib/tokenizer.js` (no Node APIs, languages must be loaded first); `backend/scripts/tokenizer.js` wraps it and loads Prism languages on demand.

## Unused / orphaned modules (verified by grep, not imported anywhere)
- `src/components/typing/StatPanel.jsx` (also imports non-existent `@/components/typingtest/...`).
- `src/components/typing/hooks/useTokenNormalizer.js` (expects an older token shape).
- `src/components/layouts/NavbarTest.jsx`.
- `src/components/tables/DataTable.jsx`, `src/components/tables/utils/useProblemsData.js`.
- `src/components/effects/LetterGlitch.jsx`.
- `countMatchingTests` and `applyFilters` in `randomTest.js`; `getUserHistoryPaginated` in `lib/history.js` (duplicated privately in `PastTestsTable.jsx`); `smoothData` in `lib/utils.js`; `lib/settings.js` values are not applied anywhere.
