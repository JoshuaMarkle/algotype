# Code and Algorithms

## 1. Challenge data model

### Token file / `challenges` row (written by `backend/scripts/generateTokens.js`)
```json
{
  "title": "...", "description": "...",
  "lines": 42,                  // number of token lines (after trailing empty line removed)
  "language": "python",         // Prism language id = folder name
  "source": "https://...",      // from .meta, "" if missing
  "slug": "<FileBaseName>-<language>",
  "mode": "algorithms",         // or "files"
  "tokens": [ [ {token}, ... ], ... ]   // one array per source line
}
```
- Supabase `challenges` columns (from `uploadTokens.js` / selects): `id`, `slug` (unique, upsert key), `title`, `description`, `lines`, `language`, `source`, `mode`, `tokens` (JSON). Exact SQL types `[UNVERIFIED]`.
- Example file: `src/data/quicksort.json` (`mode: "files"`, `slug: "quicksort"`).

### Token object
| Field | Meaning |
|---|---|
| `type` | Prism token type (`keyword`, `function`, `punctuation`, `plain`, ...), or `space`, `newline`, `comment` |
| `content` | Text to type. Newline token content is `"↵"` |
| `skip` | `true` = auto-skipped, never typed (indentation, trailing spaces, comments) |
| `wlength` | Only on typable non-space tokens: number of tokens from this one to the end of its "word" (contiguous non-space run), counted from the right. First token of a word has `wlength` = word size |

### `history` row (`src/lib/history.js` `submitTestHistory`)
`user_id`, `wpm`, `acc`, `time` (seconds), `language`, `lines`, `mode`, `slug`, `created_at`.

### `users` row
Selected with `*` in `getCurrentProfile`; at least `id`, `username`. Created by the `on_auth_user_created` trigger on `auth.users` (`public.handle_new_user`, SECURITY DEFINER): username = metadata `username` or `user_name` (GitHub), else `user`; on a unique clash appends `-` + 4 hex chars. Verified via Supabase MCP 2026-10-09. RLS: users can select/insert their own `users` row and select/insert their own `history` rows (`history.user_id` defaults to `auth.uid()`).

## 2. Tokenizer — `backend/scripts/generateTokens.js`
Per source line:
1. Empty line → `[]`.
2. C-style block comments: tracked by `inBlockComment` using `indexOf("/*")` / `indexOf("*/")`. Any line that opens or is inside a block comment becomes one `{type:"comment", skip:true}` token. Gotcha: a line with code **and** `/*` is skipped entirely; `/*` inside strings also triggers it.
3. Otherwise `Prism.tokenize(line, Prism.languages[language])` on the single line (no cross-line context, so multi-line strings/docstrings are tokenized per line).
4. `normalizeTokens`: flattens nested Prism tokens (`extractContent`), splits each token into runs of whitespace (`type:"space"`) and non-whitespace (keeps Prism type). Prism `comment` tokens get `skip:true`. Leading and trailing `space` tokens are marked `skip` (indentation is never typed).
5. `addWlengths`: right-to-left scan assigning `wlength`.
6. Comment-only line → all spaces skipped, no newline token (whole line auto-skipped).
7. Else `insertNewlineToken` inserts `{type:"newline", content:"↵"}` right after the last non-skip token (so a trailing inline comment comes after the newline and is skipped).
8. Trailing empty line removed; output written with `slug = baseName + "-" + language`.
- Only `GAMEMODES = ["algorithms"]` is processed. Unsupported Prism languages are skipped with a warning; a missing `.meta` file skips that file.

## 3. Typing engine — `src/components/typing/hooks/useTypingState.js`
State: `lineIdx`, `tokenIdx` (cursor token), `typed` (chars correct in current token), `wrong` (string of wrong chars), `started` (`performance.now()` of first key), `done`.

- `skipUntilTypable(line, token)`: resets `typed`/`wrong`, walks forward skipping `skip` tokens until a `newline`, `space`, or non-empty token; if none left → `finish()` (`done=true`). Runs once on mount to land on the first typable token.
- `handleKey(e)`:
  - Ignores input if `done`; returns on `Tab` (Tab is handled globally in `TypingTest`).
  - First key of any kind (including Shift) sets `started` → starts the timer.
  - `Backspace`: removes last wrong char, else `typed - 1`. Cannot move back into a previous token. Always increments `stats.backspace`.
  - `Enter` on a `newline` token with no wrong chars → correct, advance.
  - `" "` on a `space` token with no wrong chars → correct, advance. A multi-space token is completed by one space press.
  - Other single chars: correct if `key === expected[typed]`, no pending wrong chars, and `roomUntilBoundary() > 0`. On the last char of the token, advance; else `typed + 1`.
  - Otherwise wrong: appended to `wrong` only while `wrong.length < 10`; `stats.incorrect++` only when appended (keys past the 10-char cap are not counted).
- `cursorTokenIndices`: set of token indices in the current word (`tokenIdx .. tokenIdx + wlength - 1`), used by the renderer to draw the current word char-by-char.

## 4. Rendering — `TypingRenderer.jsx`
- One `<div>` per line with line number. Past tokens use `token-<type>` colors; future tokens are plain `token` (comments get `token-disabled`).
- Current word is split into chars; cursor char gets `.cursor`; wrong chars overlay the expected chars with `.token-wrong`; overflow past the word end is shown after `lastWordIdx`.
- Newline tokens render only when they are the cursor token.
- The cursor span gets `currentLineRef`, which `useAutoScroll` uses to lerp `window.scrollTo` (factor 0.15/frame) to keep the cursor vertically centered.
- Token colors are in `src/app/globals.css` (`.token.token-*`), GitHub-dark style.

## 5. Stats — `src/components/typing/utils/calculateStats.js`
- Signature: `calculateStats(started, ended, stats)` (stats is a ref `{current:{correct, incorrect, backspace}}`).
- `wpm = round(correct / 5 / minutes)`. Correct includes space and Enter presses. Named "grossWpm" in code but it only counts correct keystrokes.
- `acc = floor(correct / (correct + incorrect) * 100)`.
- `time = round(seconds)`. `timeTillWpmDrop` is used only by the unused `StatPanel`.
- `TypingTest` samples `{wpm, acc, time}` every 1 s into `wpmOverTime` while running.
- `TypingResults`: appends a final point if WPM changed, thins to 25 points (`cleanData` in `lib/utils.js`), shows max/min WPM and `timeLost = ceil(time * (1 - acc/100))`. WPM > 999 shows "Inf".
- Gotcha: `CodeBox.jsx` calls `calculateStats(startedRef.current, stats)` (missing `ended`), so the landing demo always shows 0 WPM / 100%.

## 6. Random test and filters — `src/components/typing/utils/randomTest.js`
- `getRandomTest({minLength, maxLength, language, mode})` → Supabase RPC `get_random_challenge(_min_length, _max_length, _language, _mode)`; returns first row. Length = `lines`.
- `gotoRandomTest(filters)` navigates with `window.location.href` (full reload). Errors → `alert()`.
- `TypingTest` filter state is persisted in `sessionStorage["filters"]`. Size presets: small ≤50 lines, medium 50–100, large ≥100. Language list hardcoded: Python, C++, JavaScript, Java, Rust.
- Gotchas: the global Tab handler calls `gotoRandomTest()` **without** filters; `RandomButton`, Navbar and the results "next" button pass the click event as `filters`.

## 7. Auth and caching — `src/lib/auth.js`, `src/lib/history.js`, `src/lib/settings.js`
- Sign-up checks `is_username_available` / `is_email_available` RPCs, username length 4–20.
- `getCurrentProfile(forceRefresh)` merges `users` row + auth email/avatar/created_at/providers; caches 15 min in `localStorage.algotype_profile`; the cache is ignored if its `id` differs from the session user. Profile + history caches are cleared on logout and before every login (`clearUserCaches`). If the `users` row is missing it falls back to auth metadata for `username` and does not cache.
- `getUserHistory` caches 60 s (memory + `localStorage.algotype_history`); `submitTestHistory` prepends the new row into the cache.
- `deleteAccount` → RPC `delete_account` after `window.confirm`.
- `lib/settings.js`: `algotype_settings` in localStorage (`syntax_highlighting`, `line_numbers`); not yet wired to the UI or renderer.
- `linkProvider` / `unlinkProvider` use `linkIdentity` / `unlinkIdentity` (link redirects to `/auth/callback?next=/settings`). Not called from the UI yet.
- Password strength (`PasswordStrengthMeter.jsx` `evaluatePasswordStrength`): 0 <6 chars; 1 <8 chars or <3 char classes; 3 ≥12 chars and all 4 classes; else 2. Sign-up requires score ≥ 2.

## 8. Landing demo — `src/components/effects/CodeBox.jsx`
- Re-implements token traversal with refs + `setTimeout` to auto-type `src/data/quicksort.json`: 40–80 ms per char, 5% chance per token of a 0–5 char typo burst, 300 ms pause then backspacing at 150–200 ms/char. Reuses `TypingRenderer`.

## 9. Other gotchas
- `src/middleware.js` matcher is `/protected-route/:path*` (no such route), so it never runs on real pages. Page protection is client-side (`account/page.jsx` redirects).
- Next 15 dynamic `params` are read synchronously in `[slug]` pages (Next 15 expects `await params`) `[UNVERIFIED: runtime warning only]`.
- Server components use the browser Supabase client (`createBrowserClient`) with the anon key.
- `body.style.overflow = "hidden"` while a test runs (`TypingTest.jsx`).
