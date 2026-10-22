-- Store each roleplay CTA click in a dedicated, clearly named table.
-- Visitors can insert only; they cannot read other visitors' interest records.

begin;

alter table public.confessions drop constraint if exists confessions_category_check;
update public.confessions
set category = 'Confessions & Regrets'
where category not in (
  'Cheating & Betrayal','Open Relationships & Wife Swapping','Jealousy & Cuckold Dynamics',
  'Secret Affairs','Unexpected Attraction','Situationships & Mixed Signals',
  'First Dates & Dangerous Chemistry','Exes, Rebounds & Old Flames','Confessions & Regrets'
);
alter table public.confessions add constraint confessions_category_check
  check (category in (
    'Cheating & Betrayal','Open Relationships & Wife Swapping','Jealousy & Cuckold Dynamics',
    'Secret Affairs','Unexpected Attraction','Situationships & Mixed Signals',
    'First Dates & Dangerous Chemistry','Exes, Rebounds & Old Flames','Confessions & Regrets'
  ));

create table if not exists public.story_roleplay_interest_clicks (
  id uuid primary key default gen_random_uuid(),
  story_slug text not null
    check (story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  story_category text not null
    check (story_category in (
      'Cheating & Betrayal','Open Relationships & Wife Swapping','Jealousy & Cuckold Dynamics',
      'Secret Affairs','Unexpected Attraction','Situationships & Mixed Signals',
      'First Dates & Dangerous Chemistry','Exes, Rebounds & Old Flames','Confessions & Regrets'
    )),
  selected_perspective text not null
    check (selected_perspective in ('woman','man')),
  clicked_at timestamptz not null default now()
);

create index if not exists story_roleplay_interest_clicks_story_time_idx
  on public.story_roleplay_interest_clicks (story_slug, clicked_at desc);

alter table public.story_roleplay_interest_clicks enable row level security;
revoke all on public.story_roleplay_interest_clicks from anon, authenticated;
grant insert(story_slug,story_category,selected_perspective)
  on public.story_roleplay_interest_clicks to anon, authenticated;
drop policy if exists "Visitors can record story roleplay interest clicks"
  on public.story_roleplay_interest_clicks;
create policy "Visitors can record story roleplay interest clicks"
  on public.story_roleplay_interest_clicks for insert to anon, authenticated
  with check (
    story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    and story_category in (
      'Cheating & Betrayal','Open Relationships & Wife Swapping','Jealousy & Cuckold Dynamics',
      'Secret Affairs','Unexpected Attraction','Situationships & Mixed Signals',
      'First Dates & Dangerous Chemistry','Exes, Rebounds & Old Flames','Confessions & Regrets'
    )
    and selected_perspective in ('woman','man')
  );

commit;
