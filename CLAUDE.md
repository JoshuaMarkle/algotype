# AlgoType — Agent Guide

> This file is the master entry point for AI agents (Claude, Codex, etc.). It is also valid as `AGENTS.md`.

## What this project is
- AlgoType (https://algotype.net) is a typing-practice website for programmers: users type real code (LeetCode-style solutions, larger "files") instead of plain words.
- Stack: Next.js 15 (App Router, JavaScript/JSX, no TypeScript) + React 19 + Tailwind CSS v4 + shadcn/ui (Radix), backed by Supabase (Postgres, Auth, RPC functions).
- Code is tokenized offline with Prism (`backend/scripts/generateTokens.js`), uploaded to the Supabase `challenges` table, and typed token-by-token in the browser (`src/components/typing/`).
- Accounts (email/password, GitHub, Google, magic link) store test history in the `history` table and show progress on `/account`.
- Current status: live, mid-polish. Goal is a stable production build. No automated tests, no CI. See `context/tasklist.md`.

## Ground rule
**Everything you should know about this project lives in `/context`. Load the relevant files before starting any task. If the answer isn't there, ask me instead of assuming.**

## Context files (`/context`)
| File | Read it when... |
|---|---|
| [`context/project_overview.md`](context/project_overview.md) | You need the product goals, users, features, and current status. |
| [`context/tech_stack.md`](context/tech_stack.md) | You touch dependencies, env vars, Supabase, analytics, or versions. |
| [`context/architecture.md`](context/architecture.md) | You need to find where something lives, routes, data flow, or module boundaries. |
| [`context/code_and_algorithms.md`](context/code_and_algorithms.md) | You change the typing engine, tokenizer, stats, random-test logic, caching, or auth helpers. |
| [`context/conventions.md`](context/conventions.md) | You write any code, or need commands to run/build/lint/deploy. |
| [`context/tasklist.md`](context/tasklist.md) | You pick up work, or finish a task (update it). |
| [`context/decisions.md`](context/decisions.md) | You wonder "why is it built this way?" before changing a design. |
| [`context/memory.md`](context/memory.md) | Always skim at the start of a session; append when I correct you. |

## Skills (`/skills`)
| File | Use it when... |
|---|---|
| [`skills/run_checks.md`](skills/run_checks.md) | Verifying any code change (lint + production build). Required before "done". |
| [`skills/add_challenges.md`](skills/add_challenges.md) | Adding or regenerating typing content (format → tokenize → upload to Supabase). |
| [`skills/add_ui_component.md`](skills/add_ui_component.md) | Adding a new shadcn/ui primitive under `src/components/ui/`. |

## Rules of engagement
- **Confirm before destructive actions**: deleting files, dropping/overwriting Supabase data, running `npm run upload:tokens`, force-pushing, changing auth settings, or anything touching production.
- **Stay in scope**: never edit files outside the task's scope. No drive-by refactors or formatting of unrelated files.
- **No guessing**: if something is not in `/context` or the code, ask. Mark anything you could not verify as `[UNVERIFIED]`.
- **Update `context/tasklist.md`** when you complete, start, or discover a task (status + relevant files).
- **Add lessons to `context/memory.md`** whenever I correct you or state a preference.
- Never commit secrets. `.env*` is gitignored; the service-role key is for local scripts only.

## Definition of done
- Before starting, write down what "done" means for this task (observable behavior + files touched).
- Verify before declaring completion: follow `skills/run_checks.md` (`npm run lint` and `npm run build` must pass with no new warnings). There is no test suite; for UI/typing changes also describe how you checked the behavior manually (or say you could not).
- State clearly what was verified and what was not.

## Tools / integrations
- **Supabase** (DB, Auth, RPC) — via `@supabase/ssr` / `@supabase/supabase-js`. Schema and RPC SQL are **not in this repo** `[UNVERIFIED]`; a Supabase MCP server would let agents inspect it.
- **GitHub** — repo `JoshuaMarkle/algotype`, default branch `main`. Issue templates in `.github/ISSUE_TEMPLATE/`.
- **Vercel** — hosting (per README badge) `[UNVERIFIED]`: no `vercel.json` in repo.
- **Umami Cloud** — analytics, proxied through `next.config.js` rewrites.
- **Resend** — SMTP for Supabase auth emails (per commit "setup resend smpt") `[UNVERIFIED]`; templates in `backend/emails/`.
- Suggested: Supabase MCP (schema/RPC inspection), Playwright (pre-installed in cloud sessions) for typing-flow checks.
