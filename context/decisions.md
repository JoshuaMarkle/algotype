# Decisions

Only decisions evidenced in code, commits, or docs, or stated by the owner. Inferred reasoning is marked `[UNVERIFIED]`. Add new decisions with date and source.

| # | Decision | Evidence | Why (as far as known) |
|---|---|---|---|
| D1 | Next.js App Router + Supabase, hosted on Vercel | README badges; `package.json`; `src/lib/supabase*.js` | Not stated `[UNVERIFIED]` |
| D2 | Plain JavaScript/JSX, no TypeScript | `components.json` `"tsx": false`; `jsconfig.json` | Not stated `[UNVERIFIED]` |
| D3 | Code is pre-tokenized offline with Prism and stored as JSON in the DB, not tokenized in the browser | `backend/scripts/generateTokens.js`, `uploadTokens.js`; `challenges.tokens` | Keeps the client simple and fast; lets the pipeline mark skip/word lengths ahead of time `[UNVERIFIED]` |
| D4 | Indentation, trailing spaces and comments are auto-skipped (never typed) | `normalizeTokens`, comment handling in `generateTokens.js`; commit `c1e38d2` "Patched tokenization erros (skippable lines + objects)" | Users practice code symbols, not whitespace or prose |
| D5 | Typing is word-scoped: wrong chars must be backspaced, buffer capped at 10, no backspacing into finished tokens | `useTypingState.js` | Not stated `[UNVERIFIED]` |
| D6 | WPM counts only correct keystrokes (incl. space/Enter) / 5 per minute | `calculateStats.js` | Standard "5 chars = 1 word" convention |
| D7 | Random test selection runs in Postgres via RPC (`get_random_challenge`) | `randomTest.js` | Avoids fetching the full challenge list (7000+) to the client `[UNVERIFIED]` |
| D8 | Navigation to the next test is a full page load (`window.location.href`) | `randomTest.js` | Resets all typing state cleanly `[UNVERIFIED]` |
| D9 | Profile and history cached in localStorage with TTLs (15 min / 60 s) | `src/lib/auth.js`, `src/lib/history.js`; commit `6e49c4c` "user data caching" | Reduce Supabase calls on every navbar/account render |
| D10 | Analytics via Umami Cloud proxied through own domain | `next.config.js` rewrites; commit `c73aaa2` | Proxying avoids ad-blockers `[UNVERIFIED]` |
| D11 | shadcn/ui (new-york) with files renamed to PascalCase | `components.json`; `src/components/ui/*.jsx` | Not stated `[UNVERIFIED]` |
| D12 | Dark theme only, GitHub-dark-like token colors | `globals.css`; settings "only the default dark theme" | Brand: bold, minimal (`BRAND.md`) |
| D13 | Software-available license (PolyForm Shield) for now, open source later | `LICENSE.md`, README note | Stated in README |
| D14 | Name "AlgoType" chosen from a brainstorm list | `BRAND.md` | Brand exploration doc |
| D15 | Auth emails are custom React Email templates; SMTP via Resend | `backend/emails/`; commit `650c8da` "setup resend smpt" | Branded emails `[UNVERIFIED]` |

## Owner-stated decisions
- (none recorded yet)
