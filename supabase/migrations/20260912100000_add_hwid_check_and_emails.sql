/*
# HWID Check, hwid_users table, get_all_emails function

1. Tables
- `hwid_users`: Stores hardware ID linked to email for client auth.

2. Functions
- `check_hwid(p_email, p_hwid)`: Called by Minecraft mod to verify subscription.
- `get_all_emails()`: Returns all user emails for admin panel.
*/

-- HWID USERS TABLE
CREATE TABLE IF NOT EXISTS public.hwid_users (
  email text PRIMARY KEY,
  hwid text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.hwid_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hwid_all" ON public.hwid_users;
CREATE POLICY "hwid_all" ON public.hwid_users
  FOR ALL USING (true) WITH CHECK (true);

-- CHECK HWID FUNCTION (called by Minecraft mod)
-- Looks up user by email in auth.users, then checks profile subscription
CREATE OR REPLACE FUNCTION public.check_hwid(p_email text, p_hwid text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_user RECORD;
DECLARE v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'error', 'Akkaunt topilmadi');
  END IF;
  SELECT * INTO v_user FROM public.profiles WHERE id = v_user_id;
  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'error', 'Profil topilmadi');
  END IF;
  IF v_user.is_blocked THEN
    RETURN json_build_object('ok', false, 'error', 'Akkaunt bloklangan');
  END IF;
  IF v_user.subscription_type = 'none' THEN
    RETURN json_build_object('ok', false, 'error', 'Obuna yoq');
  END IF;
  IF v_user.subscription_expires_at IS NOT NULL AND v_user.subscription_expires_at < now() THEN
    RETURN json_build_object('ok', false, 'error', 'Obuna muddati tugagan');
  END IF;
  INSERT INTO public.hwid_users (email, hwid) VALUES (p_email, p_hwid)
    ON CONFLICT (email) DO UPDATE SET hwid = EXCLUDED.hwid;
  RETURN json_build_object('ok', true, 'subscription', v_user.subscription_type);
END;
$$;

-- GET ALL EMAILS FUNCTION (for admin panel)
CREATE OR REPLACE FUNCTION public.get_all_emails()
RETURNS TABLE(user_id uuid, email text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT au.id AS user_id, au.email
  FROM auth.users au;
$$;
