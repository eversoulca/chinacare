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

SiliconFlow model gateway configuration for server-side draft generation:

| Variable | Purpose | Exposure |
| --- | --- | --- |
| `SILICONFLOW_API_KEY` | Authenticates requests to SiliconFlow | Server only; add to Vercel project environment variables, never Git or a `VITE_*` variable |
| `SILICONFLOW_BASE_URL` | OpenAI-compatible API origin, normally `https://api.siliconflow.cn/v1` | Server only |
| `SILICONFLOW_MODEL` | Selected model ID, initially `deepseek-ai/DeepSeek-V3` | Server only |

Public-source discovery (the daily job is optional until configured):

| Variable | Purpose | Exposure |
| --- | --- | --- |
| `DISCOVERY_RSS_FEEDS` | Newline-separated Google Alerts RSS feed URLs and other permitted public RSS feeds; maximum 8 feeds are read per scan | Server only; feed URLs may contain private feed tokens |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key for recent video search and a small number of public video comments | Server only; restrict to YouTube Data API v3 in Google Cloud |
| `SUPABASE_SERVICE_ROLE_KEY` | Saves discovered public excerpts from the server-side scan into the staff-only review queue | Server only; never expose in `VITE_*` |
| `CRON_SECRET` | Authorizes the scheduled scan endpoint | Server only |
| `RESEND_API_KEY` | Sends a daily digest of AI-ranked, pending leads to the staff admin | Server only |
| `DISCOVERY_EMAIL_FROM` | Verified sender, for example `China Care Guide <alerts@notify.eversoul.ca>` | Server only |
| `RESEND_RECEIVING_API_KEY` | Reads inbound email content after a verified Resend webhook arrives; use a separate Resend Full access key | Server only |
| `RESEND_WEBHOOK_SECRET` | Verifies Resend's signed `email.received` webhook | Server only |

Discovery runs once daily at 13:00 UTC. Each scan caps RSS at 8 feeds / 8 items per feed, YouTube at 3 search calls and up to 6 comment calls, and saves no more than 30 new items. If SiliconFlow is configured, one bounded model request ranks and drafts replies for up to 20 new items. Resend sends a digest email for pending leads when `RESEND_API_KEY` and a verified `DISCOVERY_EMAIL_FROM` are configured. No reply is sent or post published automatically. The `/api/resend-inbound` endpoint accepts signed Resend `email.received` events, retrieves message content, and only processes F5Bot-sender mail addressed to `f5bot@notify.eversoul.ca`; configure the two inbound variables above and subscribe the endpoint to that event. F5Bot free email alerts can then enter the review queue automatically.

Do not configure an automatic model fallback until the primary model is tested and a monthly spending cap is set; retries can create extra billable requests. Revoke any API key that has been pasted into a chat or otherwise exposed, then create a replacement directly in the provider console.

X OAuth and publishing configuration (only needed after creating an X Developer App and applying the social-drafts and X-publishing migrations):

| Variable | Purpose | Exposure |
| --- | --- | --- |
| `X_CLIENT_ID` | X OAuth 2.0 application client ID | Server only |
| `X_CLIENT_SECRET` | Confidential X app secret used for token exchange | Server only |
| `X_OAUTH_STATE_SECRET` | Random secret (at least 32 characters) used to sign temporary OAuth state | Server only |
| `X_TOKEN_ENCRYPTION_KEY` | Base64 encoding of 32 random bytes used to encrypt stored OAuth tokens | Server only |
| `X_EXPECTED_USERNAME` | Expected account handle, without `@` (currently `iecnvan`) | Server only |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side access for the encrypted X token row and publish queue | Server only; never expose in `VITE_*` |

The X Developer App callback URL must exactly match `https://eversoul.ca/api/x-callback`. Use OAuth 2.0 scopes `tweet.read`, `tweet.write`, `users.read`, and `offline.access`. Never paste X client secrets or tokens in chat or commit them to the repository.

Do not put credentials in source control. The service-role key must never use a `VITE_*` name. No credentials are present in the repository.
