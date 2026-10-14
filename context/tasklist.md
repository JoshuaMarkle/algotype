# Task List

Statuses: `todo` · `in-progress` · `blocked` · `needs-decision`.
Update this file when a task starts, finishes, or is discovered. Remove tasks once done (git history keeps the record).

## Open
| # | Task | Status | Files |
|---|---|---|---|
| X23 | Re-tokenize live challenges so docstrings are skipped and `lines` counts only typable lines. Source files are gone, so rebuild source from the stored tokens. Production write: needs Joshua's OK | needs-decision | Supabase `challenges` |
| X24 | Import walkccc/LeetCode content: `importWalkccc.js` converts a clone into `backend/data` (8,856 C++/Java/Python challenges, output in project files `challenge-sources/walkccc/`). Database reset/upload waits on Joshua | in-progress | `backend/scripts/importWalkccc.js` |
| L3 | Cache user data + sync preferences (#20). Code is in and falls back to a 60 s cache without the migration. Remaining: apply migration `user_data_sync` (project files `features/user_data_sync.sql`), needs Joshua's OK | blocked | `src/lib/history.js`, `src/lib/settings.js`, `src/lib/preferences.js`, `PreferenceSync.jsx` |
| L5 | Account page: avatar and language sections are still commented out | todo | `src/app/account/page.jsx` |
| U6 | `/` has no Navbar since U5, so check that signed-out users can still reach login and the other modes (the account icon goes to `/account`, which middleware should redirect to `/login`). Not checked in a browser | todo | `src/app/page.js`, `TypingTest.jsx`, `src/middleware.js` |
| E1 | Auth emails are off (`AUTH_EMAILS_ENABLED = false` in `src/lib/features.js`): email + password sign-ups are not verified and log in right away; login links, "Unverified?", password reset and reauth codes are hidden. Re-enable once an email service (e.g. Resend SMTP) works, and add email verification | blocked | `src/lib/features.js`, `LoginForm.jsx`, `SignUpForm.jsx`, `LoginMethods.jsx`, `src/app/login/verify-email/layout.js` |
| S4 | Least-privilege grants (anon/authenticated have full DML on all tables; only RLS protects them), drop the unused `profiles` view over `auth.users`, CHECKs on `history` + username. Migration written, not applied: needs Joshua's OK | needs-decision | `supabase/migrations/20261013_harden_grants_and_checks.sql` |
| S7 | Full Content-Security-Policy (nonces for Next, Umami and the theme script). Other security headers are in | todo | `next.config.js` |
| T10 | Tokenizer block comments: code before an unclosed `/*` and `/*` inside C/Java strings are still dropped | todo | `backend/scripts/generateTokens.js` |
| G1 | SEO: challenge pages were only linked from the sitemap (Ahrefs: ~2,100 orphan pages) and slugs with `?`/`%` 404'd. Added server-rendered `/algorithms/language/[language]` and `/files/language/[language]` hubs linked from the index pages, encoded challenge links (`challengePath`) and safe slug decoding. Still open: "same problem in other languages" links on each challenge | done (partly) | `src/app/*/language/`, `LanguageIndexPage.jsx`, `src/lib/seo.js`, `next-sitemap.config.js` |
| G2 | SEO: per-language landing pages ("Python typing practice", "C++ typing test") with a short intro, the timed test and links to that language's challenges | todo | new routes |
| G3 | SEO: per-page Open Graph images (`opengraph-image.jsx`) so shared challenge links show the problem and language | todo | `src/app/**/opengraph-image.jsx` |

## Needs a decision
| # | Task | Files |
|---|---|---|
| S5 | Email enumeration: `is_email_available` and `get_sign_in_methods` are anon-callable and reveal whether an email has an account (and its providers / password) | `src/lib/auth.js`, `SignUpForm.jsx`, `LoginForm.jsx` |
| L6 | Move to an open-source license | `LICENSE.md`, README |
| T1 | Remove or revive unused modules: `StatPanel.jsx` (broken import), `useTokenNormalizer.js`, `NavbarTest.jsx`, `DataTable.jsx`, `useProblemsData.js`, `LetterGlitch.jsx`, `countMatchingTests`/`applyFilters`, `smoothData` | see `architecture.md` |
| T8 | `format_errors.txt` log is committed with absolute paths from the owner's machine | `backend/scripts/logs/format_errors.txt` |

## Owner actions (Supabase dashboard, Joshua)
- For E1: turn **off** "Confirm email" (Authentication → Sign In / Providers → Email) and "Secure password change". Until then email sign-ups still wait on a confirmation email. 11 existing users have unconfirmed emails.
- Turn on leaked-password protection, set email OTP expiry under 1 h, upgrade Postgres 15.8.1.094, add CAPTCHA for anon `feedback` inserts (from the X21 advisors check and security audit S6).
- Confirm "Manual linking" is on (needed by A1 and Settings → Login Methods) and the new email templates are pasted in (`npm run render:emails`, see `tech_stack.md`).
- Email logo loading from algotype.net was never checked `[UNVERIFIED]`.
- SEO: verify algotype.net in Google Search Console (DNS TXT record) and Bing Webmaster Tools, then submit `https://algotype.net/sitemap.xml` in both.
