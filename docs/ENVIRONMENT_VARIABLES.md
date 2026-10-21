# Environment variables

No application secrets or environment variables are currently required by the Vite prototype.

Planned public configuration:

| Variable | Purpose | Exposure |
| --- | --- | --- |
| `VITE_SITE_URL` | Production origin for canonical URLs and sitemap generation | Public |
| `VITE_WHATSAPP_NUMBER` | WhatsApp Business phone number in international format, digits only, without `+` (for example, country code + number) | Public; used only to create a user-initiated `wa.me` link |

Planned server-only Supabase configuration (requires a server/API layer):

| Variable | Purpose | Exposure |
| --- | --- | --- |
| `SUPABASE_URL` | Supabase project URL for the inquiry API and keepalive | Server only |
| `SUPABASE_ANON_KEY` | Public anon/publishable API key used server-side under RLS for inquiry insert and keepalive | Server only in this app |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged server operations | Server only; never use in `VITE_*` variables |

Configured Vercel Cron endpoint (the keepalive uses only the public key and a no-data RPC):

| Variable | Purpose | Exposure |
| --- | --- | --- |
| `SUPABASE_URL` | Supabase project URL | Server only |
| `SUPABASE_ANON_KEY` | Supabase anon/publishable API key used for the harmless `keepalive` RPC | Server only in this endpoint |
| `CRON_SECRET` | Random bearer secret used to reject public calls to the Vercel endpoint | Server only; generate a long random value |

The staff `/admin` inbox also needs public build-time values. The anon/publishable key is designed for browser use; RLS is the authorization boundary. Never expose a service-role/secret key in a `VITE_*` variable.

| Variable | Purpose | Exposure |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL used by staff Auth and protected inbox queries | Public build configuration |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/publishable key used with staff sessions | Public build configuration |

Do not put credentials in source control. The service-role key must never use a `VITE_*` name. No credentials are present in the repository.
