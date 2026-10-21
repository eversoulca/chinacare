# Environment variables

No application secrets or environment variables are currently required by the Vite prototype.

Planned public configuration:

| Variable | Purpose | Exposure |
| --- | --- | --- |
| `VITE_SITE_URL` | Production origin for canonical URLs and sitemap generation | Public |

Planned server-only Supabase configuration (requires a server/API layer):

| Variable | Purpose | Exposure |
| --- | --- | --- |
| `SUPABASE_URL` | Supabase project URL | Server only where feasible |
| `SUPABASE_ANON_KEY` | Public client key; database policies must still enforce access | Public only if needed |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged server operations | Server only; never use in `VITE_*` variables |

Do not put credentials in source control or browser-exposed `VITE_*` variables. No credentials are present or needed to build the current prototype.
