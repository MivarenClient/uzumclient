/*
# Storage policies for avatars bucket

1. Security
- Allow authenticated users to upload their own avatar (path starts with their user id)
- Allow public read of all avatars (avatars are public profile images)
- Allow users to delete their own avatar
*/

DROP POLICY IF EXISTS "avatar_public_read" ON storage.objects;
CREATE POLICY "avatar_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "avatar_upload_own" ON storage.objects;
CREATE POLICY "avatar_upload_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = 'avatars' AND auth.uid()::text = split_part(name, '-', 1));

DROP POLICY IF EXISTS "avatar_update_own" ON storage.objects;
CREATE POLICY "avatar_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = split_part(name, '-', 1))
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = split_part(name, '-', 1));

DROP POLICY IF EXISTS "avatar_delete_own" ON storage.objects;
CREATE POLICY "avatar_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = split_part(name, '-', 1));
