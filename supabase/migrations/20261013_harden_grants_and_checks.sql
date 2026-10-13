-- Security audit 2026-10-13. Grants become least-privilege so RLS is no
-- longer the only layer, the unused profiles view (joins auth.users emails)
-- goes away, and history/username get server-side sanity checks.
-- Pending: not yet applied.

-- ---------------------------------------------------------------------------
-- Least-privilege grants (RLS still applies on top)
-- ---------------------------------------------------------------------------

REVOKE ALL ON public.challenges, public.history, public.users
  FROM anon, authenticated;

-- Browse/typing pages and get_random_challenge (SECURITY INVOKER)
GRANT SELECT ON public.challenges TO anon, authenticated;

-- Own history only (policies: SELECT/INSERT where auth.uid() = user_id)
GRANT SELECT, INSERT ON public.history TO authenticated;

-- Own profile row only. Rows are created by handle_new_user (definer), so the
-- API needs no INSERT/UPDATE
GRANT SELECT ON public.users TO authenticated;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- ---------------------------------------------------------------------------
-- Unused view over auth.users (emails). Safe today only because it is
-- security_invoker; nothing in the app reads it
-- ---------------------------------------------------------------------------

DROP VIEW IF EXISTS public.profiles;

-- ---------------------------------------------------------------------------
-- Sanity checks on client-written history (existing rows all pass)
-- ---------------------------------------------------------------------------

ALTER TABLE public.history
  ADD CONSTRAINT history_wpm_range CHECK (wpm BETWEEN 0 AND 500),
  ADD CONSTRAINT history_acc_range CHECK (acc BETWEEN 0 AND 100),
  ADD CONSTRAINT history_time_range CHECK (time >= 0),
  ADD CONSTRAINT history_lines_range CHECK (lines >= 0),
  ADD CONSTRAINT history_mode_known
    CHECK (mode IN ('algorithms', 'files', 'drills', 'timed')),
  ADD CONSTRAINT history_language_len CHECK (char_length(language) <= 32),
  ADD CONSTRAINT history_slug_len CHECK (char_length(slug) <= 200);

-- Usernames come from sign-up metadata (client-controlled). NOT VALID: checks
-- new/changed rows only; 4 existing names use other characters
ALTER TABLE public.users
  ADD CONSTRAINT users_username_format CHECK (
    char_length(username) BETWEEN 1 AND 50
    AND username !~ '[[:cntrl:]]'
  ) NOT VALID;
