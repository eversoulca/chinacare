# Database setup status

Supabase is not connected. There are no migrations, database clients, server routes, or authentication integration in this Vite-only project. Do not collect real customer information through the current form or store it in the browser admin prototype.

Before launch, add a server-side API or SSR application layer, then create migrations for staff profiles, leads, lead activity, providers, quotes/quote versions, follow-up tasks, and email logs. Enable RLS on every table. Public visitors should only be able to submit a validated inquiry through a narrowly scoped server endpoint; staff records must require authenticated and authorized access. Never expose a service-role key to the browser.

When access is needed, provide the Supabase project URL and public anon key for configuration. The service-role secret should be entered directly into the hosting environment's secret manager; do not send it in chat or commit it to the repository.
