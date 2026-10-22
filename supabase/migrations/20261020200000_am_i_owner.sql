-- Lets the app ask "am I the owner?" without exposing the private schema.
-- Only for choosing what to show; RLS remains the real access control.
CREATE FUNCTION public.am_i_owner() RETURNS boolean
  LANGUAGE sql STABLE SECURITY INVOKER SET search_path = ''
  AS $$ SELECT private.is_owner() $$;
REVOKE ALL ON FUNCTION public.am_i_owner() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.am_i_owner() TO authenticated;
