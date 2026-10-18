-- Almost public confession workflow. Run in Supabase SQL Editor.
-- Anonymous visitors can submit pending items and react. Only approved stories
-- are publicly readable; publishing requires an authenticated owner action.

create extension if not exists pgcrypto;

create table if not exists public.confessions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 110),
  category text not null check (category in ('First dates','Ghosting','Situationships','Dating disasters','Green flags','Breakups & exes','Secret crushes','LGBTQ+ dating','Intimacy & 18+')),
  author text not null default 'Anonymous' check (char_length(author) between 1 and 40),
  body text not null check (char_length(body) between 80 and 8000),
  status text not null default 'pending' check (status in ('pending','approved')),
  created_at timestamptz not null default now()
);

create table if not exists public.confession_reactions (
  id uuid primary key default gen_random_uuid(),
  confession_id uuid not null references public.confessions(id) on delete restrict,
  reaction text not null check (reaction in ('Relatable','Plot Twist','Green Flag','Red Flag','Been There')),
  created_at timestamptz not null default now()
);
create index if not exists confessions_status_created_idx on public.confessions(status, created_at desc);
create index if not exists reactions_confession_idx on public.confession_reactions(confession_id);

alter table public.confessions enable row level security;
alter table public.confession_reactions enable row level security;
revoke all on public.confessions from anon, authenticated;
revoke all on public.confession_reactions from anon, authenticated;
grant select on public.confessions to anon, authenticated;
grant insert (title, category, author, body, status) on public.confessions to anon, authenticated;
grant select, insert on public.confession_reactions to anon, authenticated;

-- The public archive only reads approved stories. Pending submissions are private.
drop policy if exists "Public can read confession queue" on public.confessions;
drop policy if exists "Public can read approved confessions" on public.confessions;
create policy "Public can read approved confessions" on public.confessions
  for select to anon, authenticated using (status = 'approved');

drop policy if exists "Public can submit pending confessions" on public.confessions;
create policy "Public can submit pending confessions" on public.confessions
  for insert to anon, authenticated with check (status = 'pending');

drop policy if exists "Anyone can approve pending confessions" on public.confessions;

-- Public reaction totals are read by the archive. Reactions cannot be deleted or edited by clients.
drop policy if exists "Public can read reactions" on public.confession_reactions;
create policy "Public can read reactions" on public.confession_reactions
  for select to anon, authenticated using (true);
drop policy if exists "Public can add reactions to approved stories" on public.confession_reactions;
create policy "Public can add reactions to approved stories" on public.confession_reactions
  for insert to anon, authenticated with check (
    exists (select 1 from public.confessions c where c.id = confession_id and c.status = 'approved')
  );

-- Keep no DELETE grant/policy. Avoid adding delete policies later unless product requirements change.


-- Email gate for the free Hinge guide
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

