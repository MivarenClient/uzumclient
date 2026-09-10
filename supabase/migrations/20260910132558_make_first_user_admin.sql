/*
# Make first user admin

Updates the handle_new_user trigger so that the very first user to sign up
becomes an admin automatically. Subsequent users remain regular users.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_count integer;
BEGIN
  SELECT count(*) INTO user_count FROM public.profiles;

  INSERT INTO public.profiles (id, username, is_admin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    (user_count = 0)
  );
  RETURN NEW;
END;
$$;
