-- One-click human decision and one email alert per relevant lead.
alter table public.social_discovery_leads
  add column if not exists reply_decision text not null default 'pending'
    check (reply_decision in ('pending', 'approved', 'ignored')),
  add column if not exists notified_at timestamptz;

notify pgrst, 'reload schema';
