create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  stripe_customer_id text,
  subscription_status text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  status text,
  price_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_session_id text,
  amount_total int,
  status text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table subscriptions enable row level security;
alter table purchases enable row level security;

drop policy if exists "profiles_owner_read" on profiles;
create policy "profiles_owner_read" on profiles for select using (auth.uid() = id);
drop policy if exists "profiles_owner_write" on profiles;
create policy "profiles_owner_write" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "subscriptions_owner_read" on subscriptions;
create policy "subscriptions_owner_read" on subscriptions for select using (auth.uid() = user_id);
drop policy if exists "subscriptions_owner_write" on subscriptions;
create policy "subscriptions_owner_write" on subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "purchases_owner_read" on purchases;
create policy "purchases_owner_read" on purchases for select using (auth.uid() = user_id);
drop policy if exists "purchases_owner_write" on purchases;
create policy "purchases_owner_write" on purchases for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "child_profiles_v1_read" on child_profiles;
drop policy if exists "child_profiles_v1_write" on child_profiles;
create policy "child_profiles_owner_read" on child_profiles for select using (user_id is null or auth.uid() = user_id);
create policy "child_profiles_owner_write" on child_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "conversations_v1_read" on conversations;
drop policy if exists "conversations_v1_write" on conversations;
create policy "conversations_owner_read" on conversations for select using (user_id is null or auth.uid() = user_id);
create policy "conversations_owner_write" on conversations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "messages_v1_read" on messages;
drop policy if exists "messages_v1_write" on messages;
create policy "messages_owner_read" on messages for select using (user_id is null or auth.uid() = user_id);
create policy "messages_owner_write" on messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "feedback_v1_read" on feedback;
drop policy if exists "feedback_v1_write" on feedback;
create policy "feedback_owner_read" on feedback for select using (user_id is null or auth.uid() = user_id);
create policy "feedback_owner_write" on feedback for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
