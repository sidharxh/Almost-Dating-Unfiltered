-- Discussion comments and interaction records for story pages.
alter table public.story_page_reactions drop constraint if exists story_page_reactions_reaction_check;
alter table public.story_page_reactions add constraint story_page_reactions_reaction_check
  check (reaction in ('Relatable','Plot Twist','Green Flag','Red Flag','Been There','Hot','Emotional','Surprising'));
alter table public.confession_reactions drop constraint if exists confession_reactions_reaction_check;
alter table public.confession_reactions add constraint confession_reactions_reaction_check
  check (reaction in ('Relatable','Plot Twist','Green Flag','Red Flag','Been There','Hot','Emotional','Surprising'));

create table if not exists public.story_comments (
  id uuid primary key default gen_random_uuid(),
  story_id uuid references public.confessions(id) on delete cascade,
  story_slug text not null check (story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  author_label text not null default 'Anonymous' check (char_length(author_label) between 1 and 40),
  body text not null check (char_length(body) between 3 and 1000),
  status text not null default 'pending' check (status in ('pending','approved')),
  created_at timestamptz not null default now()
);
create index if not exists story_comments_story_idx on public.story_comments(story_slug,status,created_at desc);
alter table public.story_comments enable row level security;
revoke all on public.story_comments from anon,authenticated;
grant select(id,story_id,story_slug,author_label,body,status,created_at), insert(story_id,story_slug,author_label,body,status), update(status) on public.story_comments to anon,authenticated;
drop policy if exists "Public can read story comments for review" on public.story_comments;
create policy "Public can read story comments for review" on public.story_comments for select to anon,authenticated using(true);
drop policy if exists "Visitors can submit comments for review" on public.story_comments;
create policy "Visitors can submit comments for review" on public.story_comments for insert to anon,authenticated with check (
  status='pending' and ((story_id is null and story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$') or (story_id is not null and exists(select 1 from public.confessions c where c.id=story_id and c.status='approved')))
);
drop policy if exists "Public can approve pending story comments" on public.story_comments;
create policy "Public can approve pending story comments" on public.story_comments for update to anon,authenticated using(status='pending') with check(status='approved');

create table if not exists public.story_interactions (
  id uuid primary key default gen_random_uuid(),
  story_slug text not null check (story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  story_id uuid references public.confessions(id) on delete set null,
  session_id uuid,
  event_type text not null check (event_type in ('story_view','reaction','comment_submit')),
  target_id text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata)='object' and pg_column_size(metadata)<=2048),
  created_at timestamptz not null default now()
);
create index if not exists story_interactions_story_created_idx on public.story_interactions(story_slug,created_at desc);
alter table public.story_interactions enable row level security;
revoke all on public.story_interactions from anon,authenticated;
grant insert(story_slug,story_id,session_id,event_type,target_id,metadata) on public.story_interactions to anon,authenticated;
drop policy if exists "Visitors can record story interactions" on public.story_interactions;
create policy "Visitors can record story interactions" on public.story_interactions for insert to anon,authenticated with check(event_type in ('story_view','reaction','comment_submit'));
