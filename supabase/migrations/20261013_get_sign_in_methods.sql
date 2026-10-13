-- Lets the login form explain why an email + password login failed: the
-- account may only have GitHub/Google. Returns null when no account uses the
-- email (is_email_available already exposes that), otherwise
-- { "providers": [...], "has_password": bool }. Applied 2026-10-13.
CREATE OR REPLACE FUNCTION public.get_sign_in_methods(_email text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
  select jsonb_build_object(
    'providers', coalesce(
      (select jsonb_agg(distinct i.provider)
       from auth.identities i
       where i.user_id = u.id),
      '[]'::jsonb),
    'has_password', coalesce(u.encrypted_password, '') <> ''
  )
  from auth.users u
  where lower(u.email) = lower(_email)
  limit 1;
$function$;

REVOKE EXECUTE ON FUNCTION public.get_sign_in_methods(text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_sign_in_methods(text) TO anon, authenticated;
