# Skill: Add or regenerate typing challenges

Pipeline: source code files → (format) → tokenize → upload to Supabase `challenges`.
Scripts: `backend/scripts/formatAllCode.js`, `backend/scripts/generateTokens.js`, `backend/scripts/uploadTokens.js`.

**Step 5 writes to the production database. Always get explicit owner confirmation before running it.**

## Preconditions
- `npm ci` done.
- Source data lives in gitignored `backend/data/` (owner's machine only). If it is missing, stop and ask the owner.
- For upload: `.env.local` at repo root with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- Only mode `algorithms` is supported by `generateTokens.js` (`GAMEMODES = ["algorithms"]`). How `files` mode content was produced is `[UNVERIFIED]`: ask before adding files-mode content.

## Importing from walkccc/LeetCode
`backend/scripts/importWalkccc.js` fills `backend/data/algorithms/{cpp,java,python}/` from a local clone (main solution per problem, files under 5 typable lines skipped, slug and LeetCode URL derived from the title):
```bash
git clone --depth 1 https://github.com/walkccc/LeetCode backend/sources/walkccc   # gitignored
npm run import:walkccc
```
Then continue at step 3. walkccc is MIT licensed: keep its copyright notice when redistributing.

## Steps
1. Add source files:
   - Path: `backend/data/algorithms/<prism-language>/<Name>.<ext>`
   - Folder name must be a Prism language id: `python`, `javascript`, `cpp`, `java`, `rust` (others are skipped with a warning).
   - Add a sidecar `backend/data/algorithms/<prism-language>/<Name>.meta` (JSON):
     ```json
     { "title": "N-Queens", "description": "...", "source": "https://..." }
     ```
     Files without `.meta` are skipped. Filenames containing `tokens` or starting with `.` are ignored.
2. (Optional) Format sources. Needs `black`, `prettier`, `clang-format`, `rustfmt`, and `backend/scripts/google-java-format.jar` on the machine. Run from any directory:
   ```bash
   node backend/scripts/formatAllCode.js
   ```
   Failures are written to `backend/scripts/logs/format_errors.txt`. Fix them by hand (`fix_errors.sh` is currently broken, see tasklist T6).
3. Tokenize (from repo root):
   ```bash
   npm run generate:tokens
   ```
   - Output: `backend/tokens/algorithms/<lang>/<Name>.json`, slug `<Name>-<lang>`.
   - Check the log: `[SUCCESS]` per file; `[WARNING]` = skipped (missing meta / unsupported language); `[ERROR]` = investigate.
4. Spot-check one output file:
   - Indentation tokens have `skip: true`, each code line ends with a `newline` token, comments are `skip: true`.
   - Multi-line `/* */` comments are fully skipped; inline `/*arg=*/` comments are skipped tokens. Code before an unclosed `/*` is dropped (known limitation).
5. Upload (confirm with owner first):
   ```bash
   npm run upload:tokens
   ```
   - Upserts every JSON under `backend/tokens/` into `challenges` on `slug` (existing rows with the same slug are overwritten).
6. Verify: open `/algorithms`, search the new title, open it, type a few lines.
7. Update `context/tasklist.md` if this was a tracked task.

## Notes
- Changing tokenizer logic means regenerating and re-uploading **all** content for consistency. Confirm scope with the owner.
- `next-sitemap` only reads `backend/tokens/files/**` (files mode).
