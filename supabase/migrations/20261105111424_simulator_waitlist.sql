-- The user's email remains in Supabase Auth; this table records only a separate waitlist choice.
create table if not exists public.simulator_waitlist (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.simulator_waitlist enable row level security;
revoke all on public.simulator_waitlist from public, anon, authenticated;
grant select, insert, delete on public.simulator_waitlist to authenticated;
create policy "Users view their own simulator waitlist entry" on public.simulator_waitlist for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users join simulator waitlist for themselves" on public.simulator_waitlist for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users leave their own simulator waitlist entry" on public.simulator_waitlist for delete to authenticated using ((select auth.uid()) = user_id);
