/*
# Strict check_hwid with HWID lock

- First successful login binds profiles.hwid to that PC.
- Any other HWID is rejected with "Boshqa qurilmadan kirish taqiqlangan".
- Admin can reset HWID from the admin panel (sets hwid = NULL),
  after which the next login binds the new PC.
*/

DROP FUNCTION IF EXISTS public.check_hwid(text, text);

CREATE OR REPLACE FUNCTION public.check_hwid(p_username text, p_hwid text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_user RECORD;
BEGIN
  SELECT * INTO v_user FROM public.profiles WHERE username = p_username;
  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'error', 'Akkaunt topilmadi');
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
  IF p_hwid IS NULL OR p_hwid = '' THEN
    RETURN json_build_object('ok', false, 'error', 'HWID topilmadi');
  END IF;
  IF v_user.hwid IS NOT NULL AND v_user.hwid <> '' AND v_user.hwid <> p_hwid THEN
    RETURN json_build_object('ok', false, 'error', 'Boshqa qurilmadan kirish taqiqlangan');
  END IF;
  UPDATE public.profiles SET hwid = p_hwid WHERE id = v_user.id;
  RETURN json_build_object('ok', true, 'subscription', v_user.subscription_type);
END;
$$;

NOTIFY pgrst, 'reload schema';
