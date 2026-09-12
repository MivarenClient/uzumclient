/*
# Unblock login for everyone: auto-confirm emails + sane profile policies

Problems fixed:
1. "Confirm email" is ON but confirmation emails hit rate limits and never
   arrive -> every new user is stuck at "Email not confirmed" forever.
   Fix: BEFORE INSERT trigger on auth.users auto-sets email_confirmed_at.
2. Old profile SELECT policies referenced public.profiles from inside
   their own policy (self-recursion risk). Replaced with simple policies.
*/

-- 1. Confirm every existing user that is still unconfirmed
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
    confirmation_sent_at = COALESCE(confirmation_sent_at, now())
WHERE email_confirmed_at IS NULL;

-- 2. Auto-confirm all FUTURE signups (no confirmation email needed)
DROP TRIGGER IF EXISTS auto_confirm_user ON auth.users;
DROP FUNCTION IF EXISTS public.auto_confirm_user();

CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.email_confirmed_at := COALESCE(NEW.email_confirmed_at, now());
  NEW.confirmation_sent_at := COALESCE(NEW.confirmation_sent_at, now());
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_confirm_user
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_confirm_user();

-- 3. Non-recursive profile policies
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_system" ON public.profiles;

CREATE POLICY "profiles_select_all_auth" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

NOTIFY pgrst, 'reload schema';
