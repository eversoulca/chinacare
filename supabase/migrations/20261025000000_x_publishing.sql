-- Extend the reviewed draft workflow for user-approved publishing through X.
alter table public.social_drafts drop constraint if exists social_drafts_status_check;
alter table public.social_drafts add constraint social_drafts_status_check
  check (status in ('draft', 'approved', 'rejected', 'publishing', 'published'));
alter table public.social_drafts add column if not exists published_post_id text;
alter table public.social_drafts add column if not exists published_at timestamptz;
alter table public.social_drafts add column if not exists published_by uuid references auth.users(id);

-- X OAuth tokens are encrypted in the server and accessible only through the service role.
create table if not exists public.x_account_connection (
  connection_key text primary key check (connection_key = 'primary'),
  username text not null,
  encrypted_tokens text not null,
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.x_account_connection enable row level security;
alter table public.x_account_connection force row level security;
revoke all on table public.x_account_connection from anon, authenticated;

notify pgrst, 'reload schema';
