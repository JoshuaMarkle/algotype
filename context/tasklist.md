# Task List

Statuses: `todo` · `in-progress` · `done` · `blocked` · `needs-decision`.
Priorities are a first pass from the 2026-10-09 audit. The owner should confirm/reorder them.
Update this file whenever a task starts, finishes, or is discovered.

## Now (bugs that break user-facing flows)
| # | Task | Status | Files |
|---|---|---|---|
| N0 | **Security / deploy blocker:** Vercel blocks deploys of Next.js 15.3.2 as vulnerable. Patch bump to `next@15.3.9` + `eslint-config-next@15.3.9` builds and lints cleanly (checked 2026-10-09) | done | `package.json`, `package-lock.json` |
| N1 | `/files/[slug]` crashes: passes `tokens/language/mode` props but `TypingTest` expects `challenge` | done | `src/app/files/[slug]/page.js`, `src/components/typing/TypingTest.jsx` |
| N2 | `/auth/callback` always redirects to `/signup/success` ("check your email"), even after OAuth/magic-link login | done | `src/app/auth/callback/route.js` |
| N3 | Forgot-password "Login with Email" calls `loginWithMagicLink()` with no email | done | `src/components/auth/ForgotPasswordForm.jsx` |
| N4 | Password reset shows success even when `updateUser` returns an error | done | `src/components/auth/PasswordResetForm.jsx` |
| N5 | Landing demo always shows 0 WPM / 100% (wrong `calculateStats` args) | done | `src/components/effects/CodeBox.jsx` |
| N6 | Tab-to-next ignores active filters; buttons pass click event as filters. Decided: Tab, results "next", Apply and the mode breadcrumb keep the session filters + current mode; global Play buttons stay unfiltered | done | `TypingTest.jsx` (Tab handler), `TypingResults.jsx`, `layouts/misc/RandomButton.jsx`, `layouts/Navbar.jsx` |
| N8 | Results graph got an extra sample on every keystroke (hidden `TypingResults` mutated the samples during render); screenshot left buttons hidden on failure | done | `TypingResults.jsx`, `utils/resultsSeries.js` |
| N7 | Results max/min WPM show `-Infinity`/`Infinity` for tests under 1 s (empty `wpmOverTime`) | done | `src/components/typing/TypingResults.jsx` |

## Next (stability / production readiness)
| # | Task | Status | Files |
|---|---|---|---|
| X1 | Settings: Appearance toggles are not wired to `lib/settings.js` or the renderer; Google provider row is labeled "Created At". Now on/off toggles for line numbers and syntax highlighting, read by `TypingRenderer` | done | `src/app/settings/page.jsx`, `src/lib/settings.js`, `TypingRenderer.jsx` |
| X2 | Provider link/unlink uses non-existent supabase-js APIs (`linkWithOAuth`, `getSessionFromUrl`); `/auth/link-callback` route missing | done | `src/lib/auth.js` |
| X3 | Middleware matcher `/protected-route` matched nothing and the server Supabase helper used sync `cookies()` + the deprecated cookie API. Now: helper awaits `cookies()` with `getAll/setAll` (also used by `/auth/callback`); middleware refreshes the session and redirects signed-out `/account` requests to `/login` (`/settings` stays public) | done | `src/middleware.js` |
| X4 | Await `params` in dynamic routes (Next 15) | done | `src/app/algorithms/[slug]/page.js`, `src/app/files/[slug]/page.js` |
| X5 | Login "Unverified?" link points to `/login/password-reset` instead of `/login/verify-email` `[UNVERIFIED intent]` | done | `src/components/auth/LoginForm.jsx` |
| X6 | Profile cache (15 min) not cleared on login/account switch | done | `src/lib/auth.js` |
| X7 | Add `.env.example` documenting the 4 env vars | done | `.env.example`, `.gitignore` |
| X8 | Add CI (lint + test + build on PR) | done | `.github/workflows/ci.yml` |
| X9 | Add tests for pure logic: `calculateStats`, `useTypingState` and the tokenizer (now importable from `backend/scripts/tokenizer.js`) | done | `src/components/typing/**`, `backend/scripts/tokenizer*.js` |
| X10 | Fix lint warnings: missing `alt` (lucide `Image` icon) and missing `lines` dep | done | `TypingResults.jsx:194`, `TypingTest.jsx:108` |
| X11 | Sitemap had no challenge pages on Vercel (read gitignored `backend/tokens`). Now lists every challenge from Supabase at build time; private/auth pages and `/colors` excluded | done | `next-sitemap.config.js` |
| X12 | `/colors` internal design page is public and references undefined CSS vars. Decided: keep it (branding) but `noindex` and out of the sitemap | done | `src/app/colors/page.js` |
| X13 | Auth DB check (2026-10-09, via Supabase MCP): trigger `on_auth_user_created` → `handle_new_user()` creates the `users` row (username from `username`/`user_name` metadata, else `user`, de-duplicated with a `-xxxx` suffix); all 57 auth users have rows; RLS on `users` (select/insert own) and `history` (select/insert own) is correct. Google sign-ups get `user-xxxx` names (no `full_name` fallback) | done | Supabase `public.handle_new_user` |
| X15 | New test results never reached the history cache (`insert` used the v1 `returning` option), so `/account` was stale for up to 60 s | done | `src/lib/history.js` |
| X16 | Challenge pages: unknown slug returned 200, `/algorithms/<files slug>` loaded, every page had the same title. Now `notFound()`, mode-filtered, `generateMetadata` | done | `src/lib/challenges.js`, `src/app/*/[slug]/page.js` |
| X17 | Problems table: language list capped at 1000 rows, stale responses could win, Next enabled on a full last page, sort only sorted one page, paging had no stable order | done | `src/components/tables/ProblemsTable.jsx` |
| X18 | Typing: Cmd/Ctrl shortcuts (Cmd+R, Ctrl+L) were swallowed and counted as typos; Shift alone started the timer; every test waited for an Enter on the trailing newline. Now shortcuts pass through (AltGr still types), only typing keys start the timer, and the last character ends the test | done | `src/components/typing/hooks/useTypingState.js` |
| X19 | No error boundary: a render error showed a blank page. Added `error.jsx` (retry + home) and `global-error.jsx` | done | `src/app/error.jsx`, `src/app/global-error.jsx` |
| X20 | Polish: "achive" typo in site description, missing-challenge 404s titled "Algorithms/Files | AlgoType", footer year hardcoded to 2025 | done | `src/app/layout.js`, `src/app/*/[slug]/page.js`, `Footer.jsx` |
| X21 | Supabase advisors (2026-10-10): applied migration `harden_functions_and_rls` with Joshua's OK. `handle_new_user` no longer callable over the API (trigger verified to still fire), `delete_account` signed-in only, `search_path` pinned on 3 functions, RLS policies use `(select auth.uid())`. Performance advisors now clean. Still open, dashboard only (Joshua): leaked-password protection, email OTP expiry under 1 h, Postgres patch upgrade. `is_username_available`/`is_email_available` stay anon-callable on purpose (sign-up form) | done | Supabase, `supabase/schema.sql` |
| X22 | Indented comment-only lines (stored as `[indent, newline, comment]` in 13 live challenges) made the user press Space + Enter; Python docstrings had to be typed; `lines` counted blank/comment lines. Engine now skips lines with nothing to type; tokenizer skips docstrings, fully skips comment-only lines, and `lines` = typable lines | done | `useTypingState.js`, `backend/scripts/tokenizer.js`, `generateTokens.js` |
| X23 | Re-tokenize live challenges so docstrings are skipped and `lines` is the typable count (source files are gone; rebuild source from stored tokens). Production write: needs Joshua's OK | needs-decision | Supabase `challenges` |
| X24 | New challenge content from walkccc/LeetCode: `importWalkccc.js` converts a clone into `backend/data` (8,856 C++/Java/Python challenges). Output in project files `challenge-sources/walkccc/`. Database reset/upload waits on Joshua | in-progress | `backend/scripts/importWalkccc.js` |
| X14 | Settings → Account → Login Methods: link/unlink GitHub and Google, add or change a password (with reauthentication code when Supabase asks). Login with a wrong/missing password explains the GitHub/Google case and offers an emailed login link. Email links now verify a `token_hash` on the server (`/auth/confirm`), so reset/confirm links work in any browser. Needs Supabase "Manual linking" on and the new email templates pasted (see `tech_stack.md`). "Unlink password" not built: Supabase has no API to remove a password | done | `src/components/settings/LoginMethods.jsx`, `src/lib/auth.js`, `src/lib/authRedirects.js`, `src/app/auth/confirm/route.js`, `src/components/auth/*` |
| X20 | Email polish (#22): templates share one layout, use table layout + inline styles (no flex/CSS filters), show a copyable fallback link, and link to `/auth/confirm`. `npm run render:emails` writes paste-ready HTML to `backend/emails/out/`. Logo loading from algotype.net not checked from the cloud sandbox `[UNVERIFIED]` | done | `backend/emails/`, `backend/scripts/renderEmails.js` |

## Later (features from README / commented UI)
| # | Task | Status | Files |
|---|---|---|---|
| L1 | Syntax Drills mode (#10): `/drills` picker (for/while loops, conditionals, functions, classes, idioms × Python/C++/Java × 3/6/10 snippets) and `/drills/<lang>-<types>` typing page. Drills are generated in the browser from local templates, never from `challenges`; history rows use `mode: "drills"`. Navbar link added; the landing gamemode cards stay commented (L5) but the drills card now links to `/drills` | done | `src/lib/drills/*`, `src/lib/tokenizer.js`, `src/app/drills/**`, `src/components/drills/*`, `TypingTest.jsx`, `TypingResults.jsx`, `Navbar.jsx` |
| L2 | Timed mode (15/30/60 s) | todo | README |
| L3 | Cache user data + sync preferences (#20): history is kept in localStorage and re-downloaded only when `users.data_version` (bumped by a `history` trigger) changes; settings (incl. theme) sync to `users.preferences` via RPC `save_preferences`, newest `updated_at` wins, read once per browser session and on sign-in. Code works without the migration (falls back to a 60 s cache, settings stay local). Migration `user_data_sync` (project files `features/user_data_sync.sql`) waits on Joshua's OK | in-progress | `src/lib/history.js`, `src/lib/settings.js`, `src/lib/preferences.js`, `src/components/providers/PreferenceSync.jsx`, `src/app/account/page.jsx`, `PastTestsTable.jsx` |
| L4 | Themes | done (#16) | `src/lib/themes.js`, `src/app/globals.css` (Themes block), `src/app/layout.js`, `src/components/settings/ThemeSettings.jsx` |
| L5 | Re-enable gamemode cards + account avatar/language sections (commented out) | needs-decision | `src/app/page.js`, `src/app/account/page.jsx` |
| L6 | Move to an open-source license | needs-decision | `LICENSE.md`, README |
| L7 | Feedback page (#23): `/feedback` form + footer link + GitHub issue links. Form needs the `feedback` table (draft in project files `features/feedback_table.sql`), not created yet | in-progress | `src/app/feedback/page.js`, `src/components/feedback/FeedbackForm.jsx`, `src/lib/feedback.js`, `Footer.jsx` |

## Tech debt
| # | Item | Status | Files |
|---|---|---|---|
| T1 | Remove or revive unused modules: `StatPanel.jsx` (broken import), `useTokenNormalizer.js`, `NavbarTest.jsx`, `DataTable.jsx`, `useProblemsData.js`, `LetterGlitch.jsx`, `countMatchingTests`/`applyFilters`, `smoothData` | needs-decision | see `architecture.md` |
| T2 | Duplicate `getUserHistoryPaginated` (lib vs `PastTestsTable.jsx`, which also bypasses cache) | done | `src/lib/history.js`, `src/components/tables/PastTestsTable.jsx` |
| T3 | `CodeBox` duplicates the typing traversal logic from `useTypingState` | todo | `src/components/effects/CodeBox.jsx` |
| T4 | `/algorithms` and `/files` index pages are near-identical (copy text and "Files Files Files" heading fixed 2026-10-09; the duplicated page code remains) | in-progress | `src/app/algorithms/page.js`, `src/app/files/page.js` |
| T5 | Circular import `lib/auth.js` ↔ `lib/history.js` | done | `src/lib/*` |
| T6 | `backend/scripts/fix_errors.sh` has an unterminated string on the last line (`bash -n` fails) | done | `backend/scripts/fix_errors.sh` |
| T7 | `formatAllCode.js` uses cwd-relative paths (`data/algorithms`), must run from `backend/`; inconsistent with other scripts run from root | done | `backend/scripts/formatAllCode.js` |
| T8 | `format_errors.txt` log is committed with absolute paths from the owner's machine | needs-decision | `backend/scripts/logs/format_errors.txt` |
| T9 | Email templates all export `AlgotypeMagicLinkEmail`; `@react-email/components` not a dependency | done | `backend/emails/*.jsx` |
| T10 | Tokenizer block comments: inline `/* */` and Python fixed 2026-10-10; code before an unclosed `/*` and `/*` inside C/Java strings still dropped | in-progress | `backend/scripts/generateTokens.js` |
| T11 | Unused imports (`getRandomTest` in `algorithms/[slug]/page.js` removed 2026-10-09; still `Skeleton`/`Avatar` in `account/page.jsx`) | done | various |

## Done
- 2026-10-10 — L1: syntax drills mode. Checked in a production build with Chromium: picker, start, Tab for a new drill, full typing run to results, invalid slug 404s.
- 2026-10-10 — X18, X19, X20: shortcut keys, trailing-newline finish, error pages, metadata/footer polish. Smoke-tested a production build in Chromium against a mock Supabase (all pages, full typing run, Tab/next, language breadcrumb, settings toggles, 404 and error pages).
- 2026-10-09 — T5, T7, T9, T11: removed `auth`↔`history` circular import, `formatAllCode.js` runs from any directory, email templates have their own export names + `@react-email/components` dev dependency, unused imports in `account/page.jsx`
- 2026-10-09 — X3: server Supabase helper + `/account` middleware
- 2026-10-09 — X11, X12, X15, X16, X17, T2: history cache, challenge pages, problems table, sitemap, `/colors` noindex
- 2026-10-09 — N6, N8, X1: typing flow fixes (next-test filters, results graph, screenshot, settings toggles)
- 2026-10-09 — N2, N3, N4, X2, X5, X6: sign-in flow fixes (PR #30)
- 2026-10-09 — X7, X8: `.env.example`, GitHub Actions CI (lint + Vitest + build), first unit tests for `calculateStats` and `useTypingState`
- 2026-10-09 — N0: bumped `next` and `eslint-config-next` 15.3.2 → 15.3.9 (PR #27)
- 2026-10-09 — N1, N5, N7, X4, X10, T6 fixed; T4 copy and part of T11 done. Lint now has 0 warnings.
