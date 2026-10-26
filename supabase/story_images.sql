-- Optional cover images for public dating confessions.
-- Each image is stored under submissions/<confession-id>/ and linked from the
-- matching confession row. Run once in the Supabase SQL editor, or apply as a
-- Supabase migration.

alter table public.confessions
  add column if not exists image_path text,
  add column if not exists image_alt text,
  add column if not exists image_metadata jsonb not null default '{}'::jsonb;

alter table public.confessions
  drop constraint if exists confessions_image_metadata_check;

alter table public.confessions
  add constraint confessions_image_metadata_check check (
    jsonb_typeof(image_metadata) = 'object'
    and (image_alt is null or char_length(image_alt) <= 250)
    and (
      image_path is null
      or image_path ~* '^submissions/[a-z0-9-]+-[0-9a-f-]{36}\.(jpg|jpeg|png|webp|avif)$'
      or image_path ~ (
        '^submissions/' || id::text || '/cover-' || id::text || '\.(jpg|jpeg|png|webp|avif)$'
      )
    )
  );

grant update (image_path) on public.confessions to anon, authenticated;
revoke insert (image_path) on public.confessions from anon, authenticated;
grant insert (title, category, author, body, status, image_alt, image_metadata)
  on public.confessions to anon, authenticated;

drop policy if exists "Public can attach one cover to a pending confession" on public.confessions;
create policy "Public can attach one cover to a pending confession"
  on public.confessions
  for update to anon, authenticated
  using (status = 'pending' and image_path is null)
  with check (
    status = 'pending'
    and image_path ~ (
      '^submissions/' || id::text || '/cover-' || id::text || '\.(jpg|jpeg|png|webp|avif)$'
    )
    and exists (
      select 1
      from storage.objects object
      where object.bucket_id = 'confession-images'
        and object.name = image_path
        and object.metadata ->> 'mimetype' = any(array['image/jpeg','image/png','image/webp','image/avif'])
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'confession-images',
  'confession-images',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp','image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- The public bucket serves approved images directly. These SELECT policies
-- limit Storage API listings to paths tied to a confession row.
drop policy if exists "Visitors can read linked confession covers" on storage.objects;
create policy "Visitors can read linked confession covers"
  on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'confession-images'
    and exists (
      select 1
      from public.confessions confession
      where confession.id::text = (storage.foldername(name))[2]
        and name = 'submissions/' || confession.id::text || '/cover-' || confession.id::text || '.' || storage.extension(name)
        and storage.extension(name) = any(array['jpg','jpeg','png','webp','avif'])
        and (
          confession.image_path = name
          or (confession.status = 'pending' and confession.image_path is null)
        )
    )
  );

drop policy if exists "Visitors can upload pending confession images" on storage.objects;
drop policy if exists "Visitors can upload one pending confession cover" on storage.objects;
create policy "Visitors can upload one pending confession cover"
  on storage.objects
  for insert to anon, authenticated
  with check (
    bucket_id = 'confession-images'
    and (storage.foldername(name))[1] = 'submissions'
    and storage.extension(name) = any(array['jpg','png','webp','avif'])
    and metadata ->> 'mimetype' = any(array['image/jpeg','image/png','image/webp','image/avif'])
    and exists (
      select 1
      from public.confessions confession
      where confession.id::text = (storage.foldername(name))[2]
        and name = 'submissions/' || confession.id::text || '/cover-' || confession.id::text || '.' || storage.extension(name)
        and confession.status = 'pending'
        and confession.image_path is null
    )
  );

drop policy if exists "Visitors can remove unlinked confession covers" on storage.objects;
create policy "Visitors can remove unlinked confession covers"
  on storage.objects
  for delete to anon, authenticated
  using (
    bucket_id = 'confession-images'
    and exists (
      select 1
      from public.confessions confession
      where confession.id::text = (storage.foldername(name))[2]
        and name = 'submissions/' || confession.id::text || '/cover-' || confession.id::text || '.' || storage.extension(name)
        and confession.status = 'pending'
        and confession.image_path is null
    )
  );
