# Database and inquiry setup

The public inquiry flow now has a Vercel server endpoint (`/api/inquiries`) and a Supabase migration at `supabase/migrations/20261022000000_customer_inquiries.sql`. Customers do not need accounts: a short, no-login inquiry reduces friction and avoids collecting account credentials before a service is confirmed. Staff use password-based Supabase Auth with explicit roles in `staff_access`.

## Apply the inquiry migration

In the correct Supabase project, open **SQL Editor → New query**, paste and run the full contents of `20261022000000_customer_inquiries.sql`. The migration creates `public.customer_inquiries` and enables restrictive Row Level Security:

- anonymous visitors can insert a consented inquiry only;
- anonymous and authenticated clients cannot read, update, or delete inquiry rows;
- the API validates field lengths and allowed options before inserting;
- the schema rejects unapproved status, marketing consent, and invalid option values.

The server endpoint uses the existing `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables. It never uses a service-role key. For now, an authorized project owner can review incoming records in Supabase **Table Editor → customer_inquiries**. Do not give staff database-owner access as a substitute for CRM roles.

The `/admin` area is a private inquiry inbox, not a full CRM. It reads real inquiries and allows status updates for authorized staff. It does not yet send acknowledgments, provide in-app user management, store an audit trail, or support provider records, quotes, and tasks.

## Social content review queue

The `/admin` workspace includes a private X content queue. Run `supabase/migrations/20261024000000_social_drafts.sql` and then `supabase/migrations/20261025000000_x_publishing.sql` in the project's SQL Editor. The first creates the RLS-protected `social_drafts` table; the second adds publishing metadata and a private X connection table. Admins and coordinators can request a model draft, review it, and publish an approved draft with a separate confirmation; read-only staff can view drafts. An uncertain X response locks that draft to prevent a duplicate post.

In the Vercel `chinacare` project, add `SILICONFLOW_API_KEY` (the replacement key created after rotating any exposed key), `SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1`, and `SILICONFLOW_MODEL=deepseek-ai/DeepSeek-V3` as server-only environment variables. Never use `VITE_` for these variables. The generation endpoint verifies the Supabase staff session and editor role before making one model request and saving the result. Each generation can incur SiliconFlow usage charges.

## Public AI assistant

The public chat uses `/api/assistant-chat` and the same server-only SiliconFlow variables as social drafting; no extra database migration is required. It uses approved service and coordination facts, answers in the visitor's language, and can answer beyond a fixed FAQ list. Common medical-travel FAQ themes include how estimates are broken down, which travel and interpretation costs are excluded, provider/appointment confirmation, and follow-up after returning home. Those themes reflect questions surfaced by [Helios International](https://www.helios-international.com/faq) and [Astramedica](https://astramedica.com/faq); their business claims are not copied as China Care Guide facts.

The assistant must not diagnose, assess suitability, interpret test results, prescribe, guarantee outcomes, invent prices/providers/availability, or give personal medical, immigration, legal, or financial advice. Emergency and likely personal-clinical questions are answered with a fixed safety message and are not sent to the model. The application does not write chat messages to Supabase; ordinary questions are sent to SiliconFlow to generate an answer, so visitors are told not to share sensitive information. The API limits each function instance to 12 requests per 10 minutes and caps answer length. This per-instance throttle is a basic abuse guard, not a global spend cap; set provider-side usage limits and check usage before public promotion.

For X OAuth and one-click publishing, add server-only `X_CLIENT_ID`, `X_CLIENT_SECRET`, `X_OAUTH_STATE_SECRET` (random, at least 32 characters), `X_TOKEN_ENCRYPTION_KEY` (base64 encoding of 32 random bytes), `X_EXPECTED_USERNAME=iecnvan`, and `SUPABASE_SERVICE_ROLE_KEY`. Do not put any of these under `VITE_` names or send secrets through chat. In the X Developer Console, create a confidential Web App, enable OAuth 2.0, set the callback URL exactly to `https://eversoul.ca/api/x-callback`, and request only `tweet.read`, `tweet.write`, `users.read`, and `offline.access`. The website URL is `https://eversoul.ca`. Add the Client ID and Client Secret directly to Vercel, not this repository. X tokens are encrypted before storage and the connection table is inaccessible to browser roles. The account must match `@iecnvan`.

Publishing is never scheduled automatically: an editor approves the draft, clicks **Publish to X**, and confirms the action. X currently lists Post Create at $0.015 per request; confirm current rates and API credit balance in the X Developer Console before publishing.

## Enable staff access

Apply `supabase/migrations/20261023000000_staff_access.sql` after the inquiry migration. This adds staff roles (`admin`, `coordinator`, `read_only`) and grants the inbox only to authenticated accounts with a matching row in `staff_access`. Admins and coordinators may update inquiry status; read-only staff may view records. An invitation is not required: the project owner can create the Auth user and set its password directly.

1. In Supabase **Authentication → Users**, choose **Add user**, enter the staff email and password, and mark the email confirmed if Supabase offers that option. Do not create the user by inserting directly into `auth.users` with SQL.
2. In SQL Editor, replace the example email with the exact Auth user's email and run this to grant admin access:

   ```sql
   insert into public.staff_access (user_id, email, role)
   select id, email, 'admin' from auth.users where lower(email) = lower('owner@example.com')
   on conflict (user_id) do update set email = excluded.email, role = excluded.role
   returning user_id, email, role;
   ```

3. In Supabase **Authentication → URL Configuration**, add `https://eversoul.ca/admin` and `https://eversoul.ca/admin/reset-password` to the allowed redirect URLs.
4. In the Vercel `chinacare` project, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` using the same values as `SUPABASE_URL` and `SUPABASE_ANON_KEY`. These are public URL/key values; RLS provides the authorization boundary. Never add a service-role/secret key under a `VITE_` name.
5. Redeployment is not needed when only adding a user or role. Open `https://eversoul.ca/admin` and sign in with the created user's email and password. The Auth account must also have a matching `staff_access` row; a Supabase account without that row is denied access. Never update `auth.users` with SQL or expose a service-role key in the browser. Grant access only to people who should see inquiry contact details.

The UI does not create users or provide public sign-up. Supabase Auth accounts and staff role grants are managed in the Supabase project. Normal customer registrations, if added later, should use a separate customer profile/role model and must never be granted a `staff_access` role by default. Supabase's default email service may only deliver to team-authorized addresses and is intended for low-volume testing; configure custom SMTP if password reset email cannot be delivered.

The inquiry form requests only contact and planning details. Do not ask visitors to submit diagnoses, medical records, passport data, or payment details through it. Confirm retention, privacy wording, data location, and cross-border handling before promoting the form for business use.

## Free-project keepalive

The repo includes `supabase/migrations/20261021000000_keepalive.sql`, which creates a no-data `keepalive()` RPC returning `1`. Apply that migration as well if it is not already installed. A protected Vercel endpoint calls the RPC three times daily, at 02:00, 10:00, and 18:00 UTC. Each Hobby Cron entry runs once daily, which respects Vercel's Hobby schedule limit. Add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and a random `CRON_SECRET` in the Vercel project's Production environment, then redeploy. The endpoint does not use a service-role key and does not read customer records.

This is a best-effort development keepalive, not an uptime guarantee. Supabase says the exact inactivity threshold depends on database activity and recommends upgrading to a paid plan to prevent automatic pausing. Check the Vercel Cron logs and Supabase project status after deployment.
