-- AlgoType Supabase schema (reference snapshot)
--
-- Pulled from the live project on 2026-10-09 via the Supabase MCP connector.
-- Updated 2026-10-10 after migration `harden_functions_and_rls` (grants,
-- search_path, RLS policies wrap auth.uid() in a subselect).
-- This file documents what exists in production; it is NOT a migration and
-- has not been run as-is. Change the database in Supabase, then update this.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE public.challenges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  mode text NOT NULL,
  language text NOT NULL,
  lines smallint NOT NULL,
  source text,
  tokens jsonb NOT NULL
);

CREATE TABLE public.users (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users (id), -- constraint: profiles_id_fkey
  username text NOT NULL,
  started integer NOT NULL DEFAULT 0 CHECK (started >= 0),
  completed integer NOT NULL DEFAULT 0 CHECK (completed >= 0)
);
CREATE UNIQUE INDEX unique_username_lower ON public.users USING btree (lower(username));

CREATE TABLE public.history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  wpm smallint NOT NULL,
  acc real NOT NULL,
  time smallint NOT NULL,
  language text NOT NULL,
  lines smallint NOT NULL DEFAULT '0'::smallint,
  mode text NOT NULL,
  slug text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Row level security (enabled on all three tables)
-- ---------------------------------------------------------------------------

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

CREATE POLICY read ON public.challenges
  FOR SELECT TO public USING (true);

CREATE POLICY "Users can read their own profile" ON public.users
  FOR SELECT TO public USING ((select auth.uid()) = id);
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT TO public WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Limit history to user's history" ON public.history
  FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);
CREATE POLICY "Enable insert for authenticated users only" ON public.history
  FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- New-user trigger: creates the public.users row for every sign-up
-- (email, magic link, GitHub, Google).
-- Username = metadata `username` (email sign-up) or `user_name` (GitHub),
-- else 'user'; a clash appends '-' + 4 hex chars.
-- Note: it runs AFTER INSERT, so the write-back to raw_user_meta_data at the
-- end has no effect.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
declare
  base_username text;
  candidate     text;
begin
  base_username := coalesce(
      new.raw_user_meta_data ->> 'username',
      new.raw_user_meta_data ->> 'user_name');

  if base_username is null or base_username = '' then
    base_username := 'user';
  end if;

  candidate := base_username;

  loop
    begin
      insert into public.users (id, username)
      values (new.id, candidate);
      exit;
    exception when unique_violation then
      candidate := base_username || '-' ||
                   substr(md5(random()::text), 1, 4);
    end;
  end loop;

  if new.raw_user_meta_data is null then
    new.raw_user_meta_data := '{}'::jsonb;
  end if;

  new.raw_user_meta_data :=
    jsonb_set(new.raw_user_meta_data, '{username}',
              to_jsonb(candidate), true);

  return new;
end;
$function$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Not callable over the API (triggers do not need EXECUTE)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- RPCs (executable by anon and authenticated, except delete_account:
-- authenticated only)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_username_available(_name text)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select not exists (
    select 1
    from public.users
    where lower(username) = lower(_name)
  );
$function$;

CREATE OR REPLACE FUNCTION public.is_email_available(_email text)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
  select not exists (
    select 1
    from auth.users
    where lower(email) = lower(_email)
  );
$function$;

CREATE OR REPLACE FUNCTION public.delete_account()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Must be authenticated to delete account';
  end if;

  delete from public.history where user_id = v_user_id;
  delete from public.users where id = v_user_id;
  delete from auth.users where id = v_user_id;
end;
$function$;

REVOKE EXECUTE ON FUNCTION public.delete_account() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.delete_account() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_random_challenge(
  _min_length integer DEFAULT NULL::integer,
  _max_length integer DEFAULT NULL::integer,
  _language text DEFAULT NULL::text,
  _mode text DEFAULT NULL::text)
 RETURNS SETOF challenges
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  return query
    select *
    from challenges
    where (_min_length is null or challenges.lines >= _min_length)
      and (_max_length is null or challenges.lines <= _max_length)
      and (_language is null or challenges.language = _language)
      and (_mode is null or challenges.mode = _mode)
    order by random()
    limit 1;
end;
$function$;

CREATE OR REPLACE FUNCTION public.count_matching_challenges(
  _min_length integer DEFAULT NULL::integer,
  _max_length integer DEFAULT NULL::integer,
  _language text DEFAULT NULL::text,
  _mode text DEFAULT NULL::text)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  match_count int;
begin
  select count(*) into match_count
  from challenges
  where (_min_length is null or lines >= _min_length)
    and (_max_length is null or lines <= _max_length)
    and (_language is null or language = _language)
    and (_mode is null or mode = _mode);

  return match_count;
end;
$function$;
