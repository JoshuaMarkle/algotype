# Task List

Statuses: `todo` · `in-progress` · `done` · `blocked` · `needs-decision`.
Priorities are a first pass from the 2026-10-09 audit. The owner should confirm/reorder them.
Update this file whenever a task starts, finishes, or is discovered.

## Now (bugs that break user-facing flows)
| # | Task | Status | Files |
|---|---|---|---|
| N0 | **Security / deploy blocker:** Vercel blocks deploys of Next.js 15.3.2 as vulnerable. Patch bump to `next@15.3.9` + `eslint-config-next@15.3.9` builds and lints cleanly (checked 2026-10-09) | done | `package.json`, `package-lock.json` |
| N1 | `/files/[slug]` crashes: passes `tokens/language/mode` props but `TypingTest` expects `challenge` | todo | `src/app/files/[slug]/page.js`, `src/components/typing/TypingTest.jsx` |
| N2 | `/auth/callback` always redirects to `/signup/success` ("check your email"), even after OAuth/magic-link login | todo | `src/app/auth/callback/route.js` |
| N3 | Forgot-password "Login with Email" calls `loginWithMagicLink()` with no email | todo | `src/components/auth/ForgotPasswordForm.jsx` |
| N4 | Password reset shows success even when `updateUser` returns an error | todo | `src/components/auth/PasswordResetForm.jsx` |
| N5 | Landing demo always shows 0 WPM / 100% (wrong `calculateStats` args) | todo | `src/components/effects/CodeBox.jsx` |
| N6 | Tab-to-next ignores active filters; buttons pass click event as filters | needs-decision | `TypingTest.jsx` (Tab handler), `TypingResults.jsx`, `layouts/misc/RandomButton.jsx`, `layouts/Navbar.jsx` |
| N7 | Results max/min WPM show `-Infinity`/`Infinity` for tests under 1 s (empty `wpmOverTime`) | todo | `src/components/typing/TypingResults.jsx` |

## Next (stability / production readiness)
| # | Task | Status | Files |
|---|---|---|---|
| X1 | Settings: Appearance toggles are not wired to `lib/settings.js` or the renderer; Google provider row is labeled "Created At" | todo | `src/app/settings/page.jsx`, `src/lib/settings.js`, `TypingRenderer.jsx` |
| X2 | Provider link/unlink uses non-existent supabase-js APIs (`linkWithOAuth`, `getSessionFromUrl`); `/auth/link-callback` route missing | todo | `src/lib/auth.js` |
| X3 | Middleware matcher `/protected-route` matches nothing; decide on server-side protection for `/account`, `/settings` | needs-decision | `src/middleware.js` |
| X4 | Await `params` in dynamic routes (Next 15) | todo | `src/app/algorithms/[slug]/page.js`, `src/app/files/[slug]/page.js` |
| X5 | Login "Unverified?" link points to `/login/password-reset` instead of `/login/verify-email` `[UNVERIFIED intent]` | needs-decision | `src/components/auth/LoginForm.jsx` |
| X6 | Profile cache (15 min) not cleared on login/account switch | todo | `src/lib/auth.js` |
| X7 | Add `.env.example` documenting the 4 env vars | done | `.env.example`, `.gitignore` |
| X8 | Add CI (lint + test + build on PR) | done | `.github/workflows/ci.yml` |
| X9 | Add tests for pure logic: `calculateStats` and `useTypingState` done (Vitest). Tokenizer helpers still untested: they live inside a script with top-level side effects, so they need extracting into an importable module first | in-progress | `src/components/typing/**`, `backend/scripts/generateTokens.js` |
| X10 | Fix lint warnings: missing `alt` (lucide `Image` icon) and missing `lines` dep | todo | `TypingResults.jsx:194`, `TypingTest.jsx:108` |
| X11 | Sitemap only includes `files` mode; `/algorithms/<slug>` pages missing | todo | `next-sitemap.config.js` |
| X12 | `/colors` internal design page is public and references undefined CSS vars | needs-decision | `src/app/colors/page.js` |

## Later (features from README / commented UI)
| # | Task | Status | Files |
|---|---|---|---|
| L1 | Syntax Drills mode | todo | README, `src/app/page.js` (commented card) |
| L2 | Timed mode (15/30/60 s) | todo | README |
| L3 | Save language/theme preferences to account | todo | README, `src/lib/settings.js` |
| L4 | Themes | todo | `src/app/settings/page.jsx` (`ThemeSettings`) |
| L5 | Re-enable gamemode cards + account avatar/language sections (commented out) | needs-decision | `src/app/page.js`, `src/app/account/page.jsx` |
| L6 | Move to an open-source license | needs-decision | `LICENSE.md`, README |

## Tech debt
| # | Item | Status | Files |
|---|---|---|---|
| T1 | Remove or revive unused modules: `StatPanel.jsx` (broken import), `useTokenNormalizer.js`, `NavbarTest.jsx`, `DataTable.jsx`, `useProblemsData.js`, `LetterGlitch.jsx`, `countMatchingTests`/`applyFilters`, `smoothData` | needs-decision | see `architecture.md` |
| T2 | Duplicate `getUserHistoryPaginated` (lib vs `PastTestsTable.jsx`, which also bypasses cache) | todo | `src/lib/history.js`, `src/components/tables/PastTestsTable.jsx` |
| T3 | `CodeBox` duplicates the typing traversal logic from `useTypingState` | todo | `src/components/effects/CodeBox.jsx` |
| T4 | `/algorithms` and `/files` index pages are near-identical (copy text "Practice typing features" on algorithms; heading "Files Files Files") | todo | `src/app/algorithms/page.js`, `src/app/files/page.js` |
| T5 | Circular import `lib/auth.js` ↔ `lib/history.js` | todo | `src/lib/*` |
| T6 | `backend/scripts/fix_errors.sh` has an unterminated string on the last line (`bash -n` fails) | todo | `backend/scripts/fix_errors.sh` |
| T7 | `formatAllCode.js` uses cwd-relative paths (`data/algorithms`), must run from `backend/`; inconsistent with other scripts run from root | todo | `backend/scripts/formatAllCode.js` |
| T8 | `format_errors.txt` log is committed with absolute paths from the owner's machine | needs-decision | `backend/scripts/logs/format_errors.txt` |
| T9 | Email templates all export `AlgotypeMagicLinkEmail`; `@react-email/components` not a dependency | todo | `backend/emails/*.jsx` |
| T10 | Tokenizer block-comment detection is naive (`/*` in strings, code before `/*` dropped); no handling of Python docstrings | todo | `backend/scripts/generateTokens.js` |
| T11 | Unused imports (e.g. `getRandomTest` in `algorithms/[slug]/page.js`, `Skeleton`/`Avatar` in `account/page.jsx`) | todo | various |

## Done
- 2026-10-09 — X7, X8: `.env.example`, GitHub Actions CI (lint + Vitest + build), first unit tests for `calculateStats` and `useTypingState`
- 2026-10-09 — N0: bumped `next` and `eslint-config-next` 15.3.2 → 15.3.9 (PR #27)
