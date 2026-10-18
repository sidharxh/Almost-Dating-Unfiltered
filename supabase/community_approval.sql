-- Open community review: any visitor may read pending stories and approve them.
-- Public clients can update only status, and only from pending to approved.
-- Story text and deletion remain unavailable to public clients.

drop policy if exists "Public can read approved confessions" on public.confessions;
drop policy if exists "Public can read all confessions for community review" on public.confessions;
create policy "Public can read all confessions for community review" on public.confessions
  for select to anon, authenticated using (true);

revoke update on public.confessions from anon, authenticated;
grant update (status) on public.confessions to anon, authenticated;
drop policy if exists "Public can approve pending confessions" on public.confessions;
create policy "Public can approve pending confessions" on public.confessions
  for update to anon, authenticated
  using (status = 'pending')
  with check (status = 'approved');
