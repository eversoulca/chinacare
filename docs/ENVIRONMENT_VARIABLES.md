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

Configured Vercel Cron endpoint (the keepalive uses only the public key and a no-data RPC):

| Variable | Purpose | Exposure |
| --- | --- | --- |
| `SUPABASE_URL` | Supabase project URL | Server only |
| `SUPABASE_ANON_KEY` | Supabase anon/publishable API key used for the harmless `keepalive` RPC | Server only in this endpoint |
| `CRON_SECRET` | Random bearer secret used to reject public calls to the Vercel endpoint | Server only; generate a long random value |

Do not put credentials in source control or browser-exposed `VITE_*` variables. No credentials are present or needed to build the current prototype.
