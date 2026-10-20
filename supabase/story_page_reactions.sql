-- Reactions for hand-authored static story pages. Community submissions continue to use confession_reactions.
create table if not exists public.story_page_reactions (
  id uuid primary key default gen_random_uuid(),
  story_slug text not null check (story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  reaction text not null check (reaction in ('Relatable','Plot Twist','Green Flag','Red Flag','Been There','Hot','Emotional','Surprising')),
  created_at timestamptz not null default now()
);
create index if not exists story_page_reactions_slug_idx on public.story_page_reactions (story_slug);
alter table public.story_page_reactions enable row level security;
revoke all on public.story_page_reactions from anon, authenticated;
grant select, insert on public.story_page_reactions to anon, authenticated;
drop policy if exists "Public can read static story reactions" on public.story_page_reactions;
create policy "Public can read static story reactions" on public.story_page_reactions
  for select to anon, authenticated using (true);
drop policy if exists "Public can add static story reactions" on public.story_page_reactions;
create policy "Public can add static story reactions" on public.story_page_reactions
  for insert to anon, authenticated
  with check (story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
