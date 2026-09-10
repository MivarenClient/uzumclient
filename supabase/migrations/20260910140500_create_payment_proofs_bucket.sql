insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', true)
on conflict (id) do nothing;

create policy "Authenticated users can upload proofs"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'payment-proofs');

create policy "Anyone can view proofs"
  on storage.objects for select
  using (bucket_id = 'payment-proofs');
