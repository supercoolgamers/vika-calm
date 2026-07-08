create table if not exists child_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  name text not null,
  date_of_birth date,
  age_years int,
  notes text,
  flags text[]
);

alter table child_profiles enable row level security;
drop policy if exists "child_profiles_v1_read" on child_profiles;
create policy "child_profiles_v1_read" on child_profiles for select using (true);
drop policy if exists "child_profiles_v1_write" on child_profiles;
create policy "child_profiles_v1_write" on child_profiles for all using (true) with check (true);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  child_profile_id uuid references child_profiles(id) on delete set null,
  title text,
  title_source text default 'ai',
  title_confidence numeric default 0.85,
  title_review_status text default 'unreviewed',
  behavior_tags text[],
  is_saved boolean not null default false,
  message_count int not null default 0
);

alter table conversations enable row level security;
drop policy if exists "conversations_v1_read" on conversations;
create policy "conversations_v1_read" on conversations for select using (true);
drop policy if exists "conversations_v1_write" on conversations;
create policy "conversations_v1_write" on conversations for all using (true) with check (true);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('parent', 'coach')),
  content text not null,
  vika_validate text,
  vika_investigate text,
  vika_know text,
  vika_act text,
  vika_source text default 'openai',
  vika_confidence numeric,
  vika_review_status text default 'unreviewed',
  suggested_followups text[]
);

alter table messages enable row level security;
drop policy if exists "messages_v1_read" on messages;
create policy "messages_v1_read" on messages for select using (true);
drop policy if exists "messages_v1_write" on messages;
create policy "messages_v1_write" on messages for all using (true) with check (true);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  conversation_id uuid references conversations(id) on delete set null,
  rating int check (rating between 1 and 5),
  comment text
);

alter table feedback enable row level security;
drop policy if exists "feedback_v1_read" on feedback;
create policy "feedback_v1_read" on feedback for select using (true);
drop policy if exists "feedback_v1_write" on feedback;
create policy "feedback_v1_write" on feedback for all using (true) with check (true);

insert into child_profiles (id, name, age_years, notes, flags) values
  ('a1000000-0000-0000-0000-000000000001', 'Liam', 5, 'Recently diagnosed ADHD. Struggles with transitions.', array['adhd']),
  ('a1000000-0000-0000-0000-000000000002', 'Sofia', 8, 'Sensitive to sensory input, especially noise.', array['sensory']),
  ('a1000000-0000-0000-0000-000000000003', 'Noah', 3, 'Frequent meltdowns around bedtime and food refusal.', array[]);

insert into conversations (id, child_profile_id, title, title_source, title_confidence, title_review_status, behavior_tags, is_saved, message_count) values
  ('b2000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Morning routine meltdown', 'ai', 0.9, 'unreviewed', array['meltdown','transition'], true, 4),
  ('b2000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 'Bedtime refusal and screaming', 'ai', 0.88, 'unreviewed', array['refusal','meltdown'], false, 2);

insert into messages (conversation_id, role, content, vika_validate, vika_investigate, vika_know, vika_act, vika_source, vika_confidence, vika_review_status, suggested_followups) values
  ('b2000000-0000-0000-0000-000000000001', 'parent', 'Liam completely fell apart this morning when I told him it was time to get dressed. He threw his shoes and screamed for 20 minutes.', null, null, null, null, null, null, null, null),
  ('b2000000-0000-0000-0000-000000000001', 'coach', 'Here is your VIKA coaching response for this situation.', 'Liam is feeling overwhelmed by the sudden shift from play to task. His reaction is real distress, not defiance.', 'What was he doing right before you asked him to get dressed? Was the transition announced or sudden? Has he slept and eaten?', 'Children with ADHD have difficulty shifting attention. The demand to stop a preferred activity and start an unpreferred one spikes cortisol quickly. The shoe-throwing is a stress release, not a choice.', 'Give a 5-minute warning before transitions. Use a visual timer. Offer two small choices — which shoes first, or which shirt. Stay calm and close, avoid commands from across the room.', 'openai', 0.91, 'unreviewed', array['What can I do tomorrow morning to prevent this?','How do I stay calm when he throws things?','Should I give consequences after a meltdown?']),
  ('b2000000-0000-0000-0000-000000000002', 'parent', 'Noah refuses to stay in bed every single night. Tonight he screamed for an hour.', null, null, null, null, null, null, null, null),
  ('b2000000-0000-0000-0000-000000000002', 'coach', 'Here is your VIKA coaching response for this situation.', 'Noah is communicating that something about bedtime feels unsafe or unsatisfying to him — the screaming is the only tool he has right now.', 'What does the bedtime routine currently look like? How long does it take? Is there a consistent sequence each night? Does he settle eventually or escalate?', 'At age 3, separation anxiety peaks again. A predictable, calm routine signals safety to the nervous system. Inconsistency — even with the best intentions — prolongs the protest.', 'Introduce a 3-step visual bedtime chart (bath, book, bed). Stay in the room for 5 minutes after lights out. Use the same words each night as you leave. Gradually shorten your presence over a week.', 'openai', 0.89, 'unreviewed', array['What if he gets out of bed repeatedly?','How do I handle it without getting angry?','Is this normal for his age?']);