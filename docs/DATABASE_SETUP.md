# Database and inquiry setup

The public inquiry flow now has a Vercel server endpoint (`/api/inquiries`) and a Supabase migration at `supabase/migrations/20261022000000_customer_inquiries.sql`. Customers do not need accounts: a short, no-login inquiry reduces friction and avoids collecting account credentials before a service is confirmed. Team access will use invite-only Supabase Auth when the private CRM is implemented.

## Apply the inquiry migration

In the correct Supabase project, open **SQL Editor → New query**, paste and run the full contents of `20261022000000_customer_inquiries.sql`. The migration creates `public.customer_inquiries` and enables restrictive Row Level Security:

- anonymous visitors can insert a consented inquiry only;
- anonymous and authenticated clients cannot read, update, or delete inquiry rows;
- the API validates field lengths and allowed options before inserting;
- the schema rejects unapproved status, marketing consent, and invalid option values.

The server endpoint uses the existing `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables. It never uses a service-role key. For now, an authorized project owner can review incoming records in Supabase **Table Editor → customer_inquiries**. Do not give staff database-owner access as a substitute for CRM roles.

The current `/admin` area remains a visual prototype with fictional sample records. It is not connected to Supabase and does not provide real staff authentication or authorization. Do not use it to manage real customer records. The next backend phase is invite-only staff login, role-aware CRM endpoints and tables for activity, providers, quotes, tasks, and email logs. Each table must have RLS and staff authorization before it is exposed.

The inquiry form requests only contact and planning details. Do not ask visitors to submit diagnoses, medical records, passport data, or payment details through it. Confirm retention, privacy wording, data location, and cross-border handling before promoting the form for business use.

## Free-project keepalive

The repo includes `supabase/migrations/20261021000000_keepalive.sql`, which creates a no-data `keepalive()` RPC returning `1`. Apply that migration as well if it is not already installed. A protected Vercel endpoint calls the RPC three times daily, at 02:00, 10:00, and 18:00 UTC. Each Hobby Cron entry runs once daily, which respects Vercel's Hobby schedule limit. Add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and a random `CRON_SECRET` in the Vercel project's Production environment, then redeploy. The endpoint does not use a service-role key and does not read customer records.

This is a best-effort development keepalive, not an uptime guarantee. Supabase says the exact inactivity threshold depends on database activity and recommends upgrading to a paid plan to prevent automatic pausing. Check the Vercel Cron logs and Supabase project status after deployment.
