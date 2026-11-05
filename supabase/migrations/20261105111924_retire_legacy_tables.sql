-- Remove policies for the retired confession image upload flow.
drop policy if exists "Visitors can read linked confession covers" on storage.objects;
drop policy if exists "Visitors can upload one pending confession cover" on storage.objects;
drop policy if exists "Visitors can remove unlinked confession covers" on storage.objects;
-- Do not use CASCADE: unrelated dependencies should stop this migration.
drop table if exists public.confession_reactions, public.guide_leads, public.story_page_reactions, public.story_interactions, public.story_poll_votes, public.story_comment_likes, public.story_comments, public.story_page_favorites, public.story_page_polls, public.story_roleplay_interest_clicks, public.story_image_package_interest_events, public.confessions;
