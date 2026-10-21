# Database setup status

Supabase is not connected. There are no migrations, database clients, server routes, or authentication integration in this Vite-only project. Do not collect real customer information through the current form or store it in the browser admin prototype.

Before launch, add a server-side API or SSR application layer, then create migrations for staff profiles, leads, lead activity, providers, quotes/quote versions, follow-up tasks, and email logs. Enable RLS on every table. Public visitors should only be able to submit a validated inquiry through a narrowly scoped server endpoint; staff records must require authenticated and authorized access. Never expose a service-role key to the browser.

When access is needed, provide the Supabase project URL and public anon key for configuration. The service-role secret should be entered directly into the hosting environment's secret manager; do not send it in chat or commit it to the repository.

## Free-project keepalive

The repo includes `supabase/migrations/20261021000000_keepalive.sql`, which creates a no-data `keepalive()` RPC returning `1`. Apply this migration in the Supabase SQL Editor. A protected Vercel endpoint calls the RPC three times daily, at 02:00, 10:00, and 18:00 UTC. Each Hobby Cron entry runs once daily, which respects Vercel's Hobby schedule limit. Add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and a random `CRON_SECRET` in the Vercel project's Production environment, then redeploy. The endpoint does not use a service-role key and does not read customer records.

This is a best-effort development keepalive, not an uptime guarantee. Supabase says the exact inactivity threshold depends on database activity and recommends upgrading to a paid plan to prevent automatic pausing. Check the Vercel Cron logs and Supabase project status after deployment.
