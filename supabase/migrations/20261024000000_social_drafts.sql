-- Private queue for AI-assisted social content. Publishing remains manual.
create table if not exists public.social_drafts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id),
  topic text not null check (char_length(topic) between 1 and 120),
  content text not null check (char_length(content) between 1 and 280),
  status text not null default 'draft' check (status in ('draft', 'approved', 'rejected')),
  model text not null,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz
);

alter table public.social_drafts enable row level security;
alter table public.social_drafts force row level security;
revoke all on table public.social_drafts from anon, authenticated;
grant select, insert, update on table public.social_drafts to authenticated;

drop policy if exists "Authorized staff may read social drafts" on public.social_drafts;
create policy "Authorized staff may read social drafts"
  on public.social_drafts for select to authenticated
  using (public.current_staff_role() in ('admin', 'coordinator', 'read_only'));

drop policy if exists "Editors may create social drafts" on public.social_drafts;
create policy "Editors may create social drafts"
  on public.social_drafts for insert to authenticated
  with check (
    public.current_staff_role() in ('admin', 'coordinator')
    and created_by = (select auth.uid())
    and status = 'draft'
    and reviewed_by is null
    and reviewed_at is null
  );

drop policy if exists "Editors may update social drafts" on public.social_drafts;
create policy "Editors may update social drafts"
  on public.social_drafts for update to authenticated
  using (public.current_staff_role() in ('admin', 'coordinator'))
  with check (
    public.current_staff_role() in ('admin', 'coordinator')
    and reviewed_by = (select auth.uid())
    and reviewed_at is not null
  );

create index if not exists social_drafts_created_at_idx
  on public.social_drafts (created_at desc);

notify pgrst, 'reload schema';
