-- Run once in the Supabase SQL Editor to record image package interest.
-- Anonymous visitors may insert button-click and email-submission events only.
-- They cannot read, update, or delete collected email addresses.

begin;

create table if not exists public.story_image_package_interest_events (
  id uuid primary key default gen_random_uuid(),
  story_slug text not null
    check (story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  story_category text not null
    check (story_category in (
      'Cheating & Betrayal','Open Relationships & Wife Swapping','Jealousy & Cuckold Dynamics',
      'Secret Affairs','Unexpected Attraction','Situationships & Mixed Signals',
      'First Dates & Dangerous Chemistry','Exes, Rebounds & Old Flames','Confessions & Regrets'
    )),
  event_type text not null
    check (event_type in ('package_button_clicked','email_submitted')),
  email text,
  created_at timestamptz not null default now(),
  constraint story_image_package_interest_email_event_check check (
    (event_type = 'package_button_clicked' and email is null)
    or
    (event_type = 'email_submitted' and email is not null
      and char_length(email) between 3 and 254
      and email ~* '^[A-Z0-9.!#$%&''*+/=?^_{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$')
  )
);

create index if not exists story_image_package_interest_story_created_idx
  on public.story_image_package_interest_events (story_slug, created_at desc);

alter table public.story_image_package_interest_events enable row level security;
revoke all on public.story_image_package_interest_events from anon, authenticated;
grant insert (story_slug, story_category, event_type, email)
  on public.story_image_package_interest_events to anon, authenticated;

drop policy if exists "Visitors can submit image package interest events"
  on public.story_image_package_interest_events;
create policy "Visitors can submit image package interest events"
  on public.story_image_package_interest_events for insert to anon, authenticated
  with check (
    story_slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    and story_category in (
      'Cheating & Betrayal','Open Relationships & Wife Swapping','Jealousy & Cuckold Dynamics',
      'Secret Affairs','Unexpected Attraction','Situationships & Mixed Signals',
      'First Dates & Dangerous Chemistry','Exes, Rebounds & Old Flames','Confessions & Regrets'
    )
    and (
      (event_type = 'package_button_clicked' and email is null)
      or
      (event_type = 'email_submitted' and email is not null
        and char_length(email) between 3 and 254
        and email ~* '^[A-Z0-9.!#$%&''*+/=?^_{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+$')
    )
  );

commit;
