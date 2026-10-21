-- Public visitors can submit a minimal inquiry without creating an account.
-- Anonymous clients can never read or update inquiry records.
create table if not exists public.customer_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null check (char_length(first_name) between 1 and 80),
  email text not null check (char_length(email) between 3 and 254),
  country text not null check (char_length(country) between 1 and 100),
  service text not null check (service in (
    'Health Screening', 'Medical Aesthetics', 'Rehabilitation & Recovery',
    'TCM & Integrative Care', 'Specialist & Surgical Care', 'Dental Care', 'Not Sure'
  )),
  destination text not null default 'Open to Options' check (destination in (
    'Shanghai', 'Beijing', 'Changchun', 'Dalian', 'Harbin', 'Open to Options'
  )),
  language text not null default 'English' check (language in ('English', '中文', 'Other')),
  timeframe text not null check (timeframe in (
    'Within 1–3 months', 'Within 3–6 months', 'Within 6–12 months', 'Just exploring'
  )),
  contact_method text not null default 'Email' check (contact_method in ('Email', 'WhatsApp', 'WeChat')),
  general_question text not null default '' check (char_length(general_question) <= 1200),
  privacy_consent boolean not null check (privacy_consent = true),
  marketing_consent boolean not null default false check (marketing_consent = false),
  status text not null default 'new' check (status = 'new')
);

alter table public.customer_inquiries enable row level security;
alter table public.customer_inquiries force row level security;

revoke all on table public.customer_inquiries from anon, authenticated;
grant insert on table public.customer_inquiries to anon, authenticated;

drop policy if exists "Visitors may submit consented inquiries" on public.customer_inquiries;
create policy "Visitors may submit consented inquiries"
  on public.customer_inquiries
  for insert
  to anon, authenticated
  with check (
    privacy_consent is true
    and marketing_consent is false
    and status = 'new'
  );

create index if not exists customer_inquiries_created_at_idx
  on public.customer_inquiries (created_at desc);

notify pgrst, 'reload schema';
