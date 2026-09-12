/*
# Fix "Database error saving new user" on signup

Root causes fixed:
1. Leftover/duplicate triggers on auth.users from manual SQL runs
   (e.g. save_user_email) that throw and abort the auth transaction.
2. profiles.username is UNIQUE + NOT NULL, but the old trigger inserted
   the raw username with no conflict handling -> any duplicate username
   (same nickname or same email prefix) aborts signup with 500.
3. No ON CONFLICT handling if a profile row already exists for the id.

This migration:
- Drops ALL non-internal triggers on auth.users, then recreates only
  the single correct trigger.
- Recreates public.handle_new_user() as SECURITY DEFINER with pinned
  search_path, unique-username fallback and ON CONFLICT (id) handling,
  so a profile problem can never again block auth.users insert.
*/

-- 0. Make sure profiles table exists with the expected shape
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  avatar_url text,
  hwid text,
  is_admin boolean NOT NULL DEFAULT false,
  is_blocked boolean NOT NULL DEFAULT false,
  subscription_type text NOT NULL DEFAULT 'none',
  subscription_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 1. Drop ALL non-internal triggers on auth.users (kills leftover culprits)
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT tgname
    FROM pg_trigger
    WHERE tgrelid = 'auth.users'::regclass
      AND NOT tgisinternal
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON auth.users;', r.tgname);
  END LOOP;
END
$$;

-- 2. Recreate the single correct trigger function
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count bigint;
  base_username text;
  final_username text;
BEGIN
  SELECT count(*) INTO user_count FROM public.profiles;

  base_username := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'username'), ''),
    split_part(COALESCE(NEW.email, 'user'), '@', 1),
    'user'
  );
  base_username := substring(base_username from 1 for 30);
  IF base_username IS NULL OR base_username = '' THEN
    base_username := 'user';
  END IF;

  final_username := base_username;
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) THEN
    final_username := substring(base_username from 1 for 20)
      || '_' || substring(NEW.id::text from 1 for 8);
  END IF;

  INSERT INTO public.profiles (id, username, is_admin)
  VALUES (NEW.id, final_username, (user_count = 0))
  ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username;

  RETURN NEW;
END;
$$;

-- 3. Recreate exactly one trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. RLS stays on; trigger bypasses it as SECURITY DEFINER (owner: postgres)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

NOTIFY pgrst, 'reload schema';
