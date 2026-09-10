/*
# UZBEK CLIENT - Full Schema

1. New Tables
- `profiles`: Extends auth.users with username, avatar, HWID, admin flag, block flag, subscription type and expiry.
- `news`: Changelog/updates for the client (what was added in each version).
- `media_applications`: Media partner applications submitted by users, reviewed by admins.

2. Columns
- profiles.id (uuid, FK to auth.users, PK)
- profiles.username (text, unique, not null)
- profiles.avatar_url (text, nullable)
- profiles.hwid (text, nullable) - hardware ID from the Minecraft mod
- profiles.is_admin (boolean, default false)
- profiles.is_blocked (boolean, default false)
- profiles.subscription_type (text, default 'none') - 'none' | '30day' | '90day' | 'lifetime'
- profiles.subscription_expires_at (timestamptz, nullable)
- profiles.created_at (timestamptz, default now())
- news.id (uuid, PK)
- news.title (text, not null)
- news.content (text, not null)
- news.version (text, nullable)
- news.created_at (timestamptz, default now())
- media_applications.id (uuid, PK)
- media_applications.user_id (uuid, FK to auth.users)
- media_applications.channel_name (text, not null)
- media_applications.channel_url (text, not null)
- media_applications.subscriber_count (integer, not null)
- media_applications.avg_views (integer, not null)
- media_applications.description (text, not null)
- media_applications.status (text, default 'pending') - 'pending' | 'approved' | 'rejected'
- media_applications.created_at (timestamptz, default now())
- media_applications.reviewed_at (timestamptz, nullable)

3. Security (RLS)
- profiles: users can SELECT/UPDATE their own row. Admins can SELECT/UPDATE all rows.
- news: anyone (anon + authenticated) can SELECT. Admins can INSERT/UPDATE/DELETE.
- media_applications: users can SELECT their own and INSERT new ones. Admins can SELECT/UPDATE all.

4. Triggers
- auto_create_profile: Creates a profile row when a new auth.users record is created (on signup).
*/

-- PROFILES TABLE
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

-- NEWS TABLE
CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  version text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- MEDIA APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.media_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  channel_name text NOT NULL,
  channel_url text NOT NULL,
  subscriber_count integer NOT NULL,
  avg_views integer NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

-- Helper function: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_applications ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_update_own_or_admin" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- NEWS POLICIES
DROP POLICY IF EXISTS "news_select_all" ON public.news;
CREATE POLICY "news_select_all" ON public.news
  FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "news_insert_admin" ON public.news;
CREATE POLICY "news_insert_admin" ON public.news
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "news_update_admin" ON public.news;
CREATE POLICY "news_update_admin" ON public.news
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "news_delete_admin" ON public.news;
CREATE POLICY "news_delete_admin" ON public.news
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- MEDIA APPLICATIONS POLICIES
DROP POLICY IF EXISTS "media_select_own_or_admin" ON public.media_applications;
CREATE POLICY "media_select_own_or_admin" ON public.media_applications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "media_insert_own" ON public.media_applications;
CREATE POLICY "media_insert_own" ON public.media_applications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "media_update_admin" ON public.media_applications;
CREATE POLICY "media_update_admin" ON public.media_applications
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- TRIGGER: Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- INDEXES
CREATE INDEX IF NOT EXISTS news_created_at_idx ON public.news (created_at DESC);
CREATE INDEX IF NOT EXISTS media_applications_status_idx ON public.media_applications (status);
