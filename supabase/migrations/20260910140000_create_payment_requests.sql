create table if not exists payment_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  plan_type text not null check (plan_type in ('30day', '90day', 'lifetime')),
  amount text not null,
  card_number text not null,
  proof_url text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now() not null,
  reviewed_at timestamp with time zone
);

alter table payment_requests enable row level security;

create policy "Users can view own payment requests"
  on payment_requests for select
  using (auth.uid() = user_id);

create policy "Users can insert own payment requests"
  on payment_requests for insert
  with check (auth.uid() = user_id);

create policy "Admins can view all payment requests"
  on payment_requests for select
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

create policy "Admins can update payment requests"
  on payment_requests for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );
