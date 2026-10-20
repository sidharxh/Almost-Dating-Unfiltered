-- Story detail interactions, image metadata and public upload bucket.
alter table public.confessions
  add column if not exists image_path text,
  add column if not exists image_alt text,
  add column if not exists image_metadata jsonb not null default '{}'::jsonb,
  add column if not exists tags text[] not null default '{}'::text[],
  add column if not exists story_summary text,
  add column if not exists featured_quote text,
  add column if not exists key_moments jsonb not null default '[]'::jsonb,
  add column if not exists poll_question text not null default 'What would you have done?',
  add column if not exists poll_options jsonb not null default '[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb;

alter table public.confessions
  drop constraint if exists confessions_image_metadata_check,
  add constraint confessions_image_metadata_check check (
    jsonb_typeof(image_metadata) = 'object'
    and (image_path is null or image_path ~ '^submissions/[a-z0-9-]+-[0-9a-f-]{36}\.(jpg|jpeg|png|webp|avif)$')
    and (image_alt is null or char_length(image_alt) <= 250)
  ),
  add constraint confessions_story_tags_check check (cardinality(tags) <= 12),
  add constraint confessions_poll_options_check check (jsonb_typeof(poll_options) = 'array' and jsonb_array_length(poll_options) between 2 and 6);
grant insert (title, category, author, body, status, image_path, image_alt, image_metadata, tags, story_summary, featured_quote, key_moments, poll_question, poll_options)
  on public.confessions to anon, authenticated;

alter table public.confession_reactions drop constraint if exists confession_reactions_reaction_check;
alter table public.confession_reactions add constraint confession_reactions_reaction_check
  check (reaction in ('Relatable','Plot Twist','Green Flag','Red Flag','Been There','Hot','Emotional','Surprising'));
alter table public.story_page_reactions drop constraint if exists story_page_reactions_reaction_check;
alter table public.story_page_reactions add constraint story_page_reactions_reaction_check
  check (reaction in ('Relatable','Plot Twist','Green Flag','Red Flag','Been There','Hot','Emotional','Surprising'));

create table if not exists public.story_interactions (
  id uuid primary key default gen_random_uuid(),
  story_slug text not null check (story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  story_id uuid references public.confessions(id) on delete set null,
  session_id uuid,
  event_type text not null check (event_type in ('story_view','reaction','poll_vote','comment_submit','comment_like','favorite','share','continue_reading','key_moment','related_story','guide_click','topic_click','search','image_upload','story_submit','scroll_depth','ui_click')),
  target_id text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata)='object' and pg_column_size(metadata) <= 2048),
  created_at timestamptz not null default now()
);
create index if not exists story_interactions_story_created_idx on public.story_interactions(story_slug,created_at desc);
alter table public.story_interactions enable row level security;
revoke all on public.story_interactions from anon, authenticated;
grant insert (story_slug,story_id,session_id,event_type,target_id,metadata) on public.story_interactions to anon,authenticated;
drop policy if exists "Visitors can record story interactions" on public.story_interactions;
create policy "Visitors can record story interactions" on public.story_interactions for insert to anon,authenticated
  with check (event_type in ('story_view','reaction','poll_vote','comment_submit','comment_like','favorite','share','continue_reading','key_moment','related_story','guide_click','topic_click','search','image_upload','story_submit','scroll_depth','ui_click'));

create table if not exists public.story_page_polls (
  story_slug text primary key check (story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  question text not null check (char_length(question) between 3 and 140),
  options jsonb not null check (jsonb_typeof(options)='array' and jsonb_array_length(options) between 2 and 6),
  updated_at timestamptz not null default now()
);
alter table public.story_page_polls enable row level security;
revoke all on public.story_page_polls from anon,authenticated;
grant select(story_slug,question,options) on public.story_page_polls to anon,authenticated;
drop policy if exists "Public can read static story polls" on public.story_page_polls;
create policy "Public can read static story polls" on public.story_page_polls for select to anon,authenticated using(true);
insert into public.story_page_polls(story_slug,question,options) values
  ('600-bowling-date','What would you have done?','[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb),
  ('better-at-flirting-in-person','What would you have done?','[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb),
  ('chemistry-and-consent','What would you have done?','[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb),
  ('cooked-dinner-chemistry','What would you have done?','[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb),
  ('ex-texted-that-night','What would you have done?','[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb),
  ('fake-hinge-profile','What would you have done?','[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb),
  ('forty-second-lift','What would you have done?','[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb),
  ('just-physical','What would you have done?','[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb),
  ('last-metro','What would you have done?','[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb),
  ('parents-asleep-next-room','What would you have done?','[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb),
  ('rain-ruined-our-plans','What would you have done?','[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb),
  ('she-was-my-rebound','What would you have done?','[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb),
  ('situationship-has-a-girlfriend','What would you have done?','[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb),
  ('split-the-bill','What would you have done?','[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb),
  ('stayed-until-morning','What would you have done?','[{"key":"friends","label":"Keep it just a friendship"},{"key":"explore","label":"Explore the connection"},{"key":"end","label":"End things with partner"},{"key":"wait","label":"Not meet in person"}]'::jsonb)
on conflict(story_slug) do nothing;

create table if not exists public.story_poll_votes (
  id uuid primary key default gen_random_uuid(),
  story_id uuid references public.confessions(id) on delete cascade,
  story_slug text not null check (story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  option_key text not null check (option_key ~ '^[a-z0-9_-]{1,40}$'),
  visitor_id uuid not null,
  created_at timestamptz not null default now()
);
create unique index if not exists story_poll_votes_slug_visitor_idx on public.story_poll_votes(story_slug,visitor_id);
create index if not exists story_poll_votes_story_idx on public.story_poll_votes(story_slug);
alter table public.story_poll_votes enable row level security;
revoke all on public.story_poll_votes from anon,authenticated;
grant select (story_slug,option_key), insert (story_id,story_slug,option_key,visitor_id) on public.story_poll_votes to anon,authenticated;
drop policy if exists "Public can read approved story poll votes" on public.story_poll_votes;
create policy "Public can read approved story poll votes" on public.story_poll_votes for select to anon,authenticated using (
  (story_id is null and story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$') or
  (story_id is not null and exists(select 1 from public.confessions c where c.id=story_id and c.status='approved'))
);
drop policy if exists "Visitors can vote on approved stories" on public.story_poll_votes;
create policy "Visitors can vote on approved stories" on public.story_poll_votes for insert to anon,authenticated with check (
  (story_id is null and exists(select 1 from public.story_page_polls p where p.story_slug=story_poll_votes.story_slug and p.options @> jsonb_build_array(jsonb_build_object('key',option_key)))) or
  (story_id is not null and exists(select 1 from public.confessions c where c.id=story_id and c.status='approved' and c.poll_options @> jsonb_build_array(jsonb_build_object('key',option_key))))
);



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
grant select (id,story_id,story_slug,author_label,body,status,created_at), insert (story_id,story_slug,author_label,body,status), update(status) on public.story_comments to anon,authenticated;
drop policy if exists "Public can read approved story comments" on public.story_comments;
create policy "Public can read approved story comments" on public.story_comments for select to anon,authenticated using (true);
drop policy if exists "Visitors can submit comments for review" on public.story_comments;
create policy "Visitors can submit comments for review" on public.story_comments for insert to anon,authenticated with check (
  status='pending' and ((story_id is null and story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$') or (story_id is not null and exists(select 1 from public.confessions c where c.id=story_id and c.status='approved')))
);
drop policy if exists "Public can approve pending story comments" on public.story_comments;
create policy "Public can approve pending story comments" on public.story_comments for update to anon,authenticated using(status='pending') with check(status='approved');

create table if not exists public.story_comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.story_comments(id) on delete cascade,
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  unique(comment_id,visitor_id)
);
create index if not exists story_comment_likes_comment_idx on public.story_comment_likes(comment_id);
alter table public.story_comment_likes enable row level security;
revoke all on public.story_comment_likes from anon,authenticated;
grant select (comment_id), insert(comment_id,visitor_id) on public.story_comment_likes to anon,authenticated;
drop policy if exists "Public can read likes on approved comments" on public.story_comment_likes;
create policy "Public can read likes on approved comments" on public.story_comment_likes for select to anon,authenticated using (exists(select 1 from public.story_comments c where c.id=comment_id and c.status='approved'));
drop policy if exists "Visitors can like approved comments" on public.story_comment_likes;
create policy "Visitors can like approved comments" on public.story_comment_likes for insert to anon,authenticated with check (exists(select 1 from public.story_comments c where c.id=comment_id and c.status='approved'));

create table if not exists public.story_page_favorites (
  id uuid primary key default gen_random_uuid(),
  story_slug text not null check(story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  visitor_id uuid not null,
  created_at timestamptz not null default now(),
  unique(story_slug,visitor_id)
);
create index if not exists story_page_favorites_slug_idx on public.story_page_favorites(story_slug);
alter table public.story_page_favorites enable row level security;
revoke all on public.story_page_favorites from anon,authenticated;
grant select(story_slug), insert(story_slug,visitor_id) on public.story_page_favorites to anon,authenticated;
drop policy if exists "Public can read story saves" on public.story_page_favorites;
create policy "Public can read story saves" on public.story_page_favorites for select to anon,authenticated using(true);
drop policy if exists "Visitors can save stories" on public.story_page_favorites;
create policy "Visitors can save stories" on public.story_page_favorites for insert to anon,authenticated with check(story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('confession-images','confession-images',true,5242880,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists "Visitors can upload pending confession images" on storage.objects;
create policy "Visitors can upload pending confession images" on storage.objects for insert to anon,authenticated with check (
  bucket_id='confession-images' and (storage.foldername(name))[1]='submissions'
  and name ~* '^submissions/[a-z0-9-]+-[0-9a-f-]{36}\.(jpg|jpeg|png|webp|avif)$'
  and metadata->>'mimetype' in ('image/jpeg','image/png','image/webp','image/avif')
);
