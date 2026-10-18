-- Run this migration once in Supabase SQL Editor to enable the Hinge guide email gate.
-- Public visitors can INSERT email requests only. They cannot read or modify the email list.
create table if not exists public.guide_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(email) between 3 and 254 and email ~* '^[A-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$'),
  source_page text not null default '/',
  created_at timestamptz not null default now()
);
create index if not exists guide_leads_created_at_idx on public.guide_leads(created_at desc);
alter table public.guide_leads enable row level security;
revoke all on public.guide_leads from anon, authenticated;
grant insert (email, source_page) on public.guide_leads to anon, authenticated;
drop policy if exists "Visitors can request the Hinge guide" on public.guide_leads;
create policy "Visitors can request the Hinge guide" on public.guide_leads
  for insert to anon, authenticated
  with check (char_length(email) between 3 and 254 and char_length(source_page) between 1 and 500);
