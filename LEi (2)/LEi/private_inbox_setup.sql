-- Run in Supabase SQL Editor. Replace OWNER_EMAIL@example.com with YOUR Supabase admin email.
create table if not exists public.portfolio_messages (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 sender_name text not null check (char_length(sender_name) between 1 and 120),
 sender_email text not null check (char_length(sender_email) between 3 and 254),
 project text not null default '' check (char_length(project) <= 250),
 message text not null check (char_length(message) between 1 and 5000)
);
alter table public.portfolio_messages enable row level security;
revoke all on public.portfolio_messages from anon, authenticated;
grant insert on public.portfolio_messages to anon;
grant select on public.portfolio_messages to authenticated;
drop policy if exists "public can submit messages" on public.portfolio_messages;
create policy "public can submit messages" on public.portfolio_messages for insert to anon with check (true);
drop policy if exists "only owner can read messages" on public.portfolio_messages;
create policy "only owner can read messages" on public.portfolio_messages for select to authenticated using ((select auth.jwt()->>'email') = 'OWNER_EMAIL@example.com');
-- Never create public SELECT policy. Disable public sign-ups in Supabase Auth.
