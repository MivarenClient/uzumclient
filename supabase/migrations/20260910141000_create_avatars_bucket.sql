insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Avatar upload own"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');

create policy "Avatar update own"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars');

create policy "Avatar delete own"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars');
