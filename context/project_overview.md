# Project Overview

## What it is
- AlgoType (algotype.net): a minimal typing test for programmers. Users type real source code to build fluency with symbols and syntax.
- Free to use. An account is optional and only adds progress tracking (`README.md`).
- Tagline candidates live in `BRAND.md` ("Typing practice for programmers", "Turn syntax into second nature").

## Users
- Programmers who want faster, more accurate typing of code symbols.
- Anonymous visitors can take tests; signed-in users get saved history and charts.

## Goals
- Stated by owner (project topic): polish and complete features to reach a stable production build.
- Brand intent (`BRAND.md`): bold, frictionless, "a universe of code to train on".
- License: PolyForm Shield 1.0.0 (`LICENSE.md`), with a stated plan to move to open source later (`README.md`).

## Features (current)
- Typing engine with syntax-aware tokens, live cursor, error buffer, auto-scroll (`src/components/typing/`).
- Results screen: WPM, accuracy, time, WPM-over-time chart, screenshot-to-clipboard (`TypingResults.jsx`).
- Game modes:
  - `algorithms`: LeetCode-style solutions, README claims "over 7000" (`/algorithms`, `/algorithms/[slug]`).
  - `files`: larger real-world files (`/files`, `/files/[slug]`).
  - `drills`: syntax drills generated in the browser (`/drills`, `/drills/[slug]`).
  - `timed`: 15/30/60 s sprints on drill-generated code (`/timed/[slug]`).
- Random test with filters (language, size) and Tab-to-skip (`randomTest.js`, `TypingTest.jsx`).
- Browse/search tables for each mode (`src/components/tables/ProblemsTable.jsx`).
- Accounts: email/password, GitHub OAuth, Google OAuth, magic link, password reset, email re-verify (`src/lib/auth.js`).
- Account page: average WPM/accuracy, total time, progress chart, paginated history (`src/app/account/page.jsx`).
- Settings page: account info, login methods, delete account, appearance toggles, themes (`src/app/settings/page.jsx`).
- Landing page with animated auto-typing demo (`src/components/effects/CodeBox.jsx`), gamemode cards and FAQ.
- Privacy and Terms pages (effective June 1, 2025).

## Planned
- Syntax Drills (`/drills`), Timed (`/timed`), themes, preference sync and the landing gamemode cards shipped 2026-10-10; see `context/tasklist.md` for what is still open.

## Current status
- Last commit on GitHub `main`: 2025-07-09 ("Added settings page + navbar updates + user data caching"). 53 commits since 2025-06-01.
- Owner's local checkout matched GitHub `main` at audit time (2026-10-09): no unpushed work.
- `npm run lint` passes (2 warnings); `next build` succeeds.
- Unit tests (Vitest) and GitHub Actions CI (lint + test + build) as of 2026-10-09; test coverage is still small. No TypeScript.
- Single developer (Joshua Markle).
