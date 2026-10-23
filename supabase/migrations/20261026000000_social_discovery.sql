-- Private, human-reviewed queue for public web and YouTube discovery.
create table if not exists public.social_discovery_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source in ('rss', 'youtube_video', 'youtube_comment', 'f5bot')),
  source_name text not null default '',
  external_id text not null,
  url text not null,
  title text not null default '',
  excerpt text not null default '',
  author text not null default '',
  published_at timestamptz,
  relevance_score smallint check (relevance_score between 0 and 100),
  relevance_reason text not null default '',
  reply_draft text not null default '',
  status text not null default 'new' check (status in ('new', 'reviewed', 'dismissed')),
  unique (source, external_id)
);

alter table public.social_discovery_leads enable row level security;
alter table public.social_discovery_leads force row level security;
revoke all on table public.social_discovery_leads from anon, authenticated;
grant select, update on table public.social_discovery_leads to authenticated;

drop policy if exists "Authorized staff may read discovery leads" on public.social_discovery_leads;
create policy "Authorized staff may read discovery leads"
  on public.social_discovery_leads for select to authenticated
  using (public.current_staff_role() in ('admin', 'coordinator', 'read_only'));

drop policy if exists "Editors may update discovery leads" on public.social_discovery_leads;
create policy "Editors may update discovery leads"
  on public.social_discovery_leads for update to authenticated
  using (public.current_staff_role() in ('admin', 'coordinator'))
  with check (public.current_staff_role() in ('admin', 'coordinator'));

create index if not exists social_discovery_leads_created_idx
  on public.social_discovery_leads (created_at desc);
create index if not exists social_discovery_leads_relevance_idx
  on public.social_discovery_leads (relevance_score desc nulls last, published_at desc nulls last);

notify pgrst, 'reload schema';
