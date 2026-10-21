# Implementation roadmap

## Repository audit

- The project is a React 19 + Vite + TypeScript Figma Make application with a substantial existing public landing page, service/destination copy, and a locally rendered admin prototype.
- Existing content avoids invented providers, prices, credentials, and outcome claims. `robots.txt` allows Googlebot, Bingbot, and OAI-SearchBot.
- Public route content is selected in the browser and metadata is changed after React mounts. Initial HTML is an empty root shell, so this is not yet an SEO-ready server-rendered site.
- The inquiry form currently has no persistence or delivery integration. The admin area has no server authentication or database boundary and must not hold real lead data.
- No Git metadata, Supabase configuration, Vercel configuration, environment example, or supplied Figma export was present in the workspace at audit time.

## Completed in this increment

- Added homepage copy describing a private, individually coordinated China Care Plan.
- Added baseline English page title, description, and Open Graph metadata to the HTML shell.
- Changed the demo inquiry success state so it clearly says that details were not sent or saved.
- Replaced the public site's green palette with slate blue, warm ivory, and muted terracotta accents.
- Added installable PWA metadata, app icons, a small offline shell cache, and mobile home-screen instructions.
- Added the customer inquiry table with restrictive RLS, a validated same-origin Vercel submission API, basic honeypot filtering, and real submission/error states in the public form. Visitors do not need accounts.
- Replaced the demonstration `/admin` login and fictional lead records with invite-only Supabase magic-link access, role-gated inquiry viewing, and status updates.
- Added Vercel SPA fallback rewrites, locale-prefixed routes, persistent language switching across the current route, and PWA English start URL. Current non-English routes are marked clearly as awaiting reviewed translation.

## Recommended delivery sequence

1. Confirm production domain, legal company identity, office/contact details, and privacy/terms text.
2. Restore/connect the project Git repository and verify its GitHub remote and Vercel project linkage.
3. Translate and review the public content for Chinese, Korean, Japanese, French, and Spanish; then publish language-specific titles/descriptions, `lang`, `hreflang`, and canonicals. Evaluate prerendering or SSR so each public route ships meaningful HTML.
4. Apply the inquiry and staff-access migrations; invite the owner, grant the initial `admin` role, configure the Vercel public Supabase values and Auth redirect allowlist, then verify staff login and RLS behavior.
5. Add staff invitation/role management, assignment, status audit history, and exports with explicit authorization before broadening CRM use. Treat Free-plan auto-pause as a development constraint; keepalive is not an uptime guarantee.
6. Add secure transactional email only after sender-domain verification and credentials are configured. Do not claim an acknowledgment email is sent until delivery is integrated.
7. Publish only reviewed service/destination content; add sitemap, canonical domain, and search-console submission after the production URL is known.

## Design/product notes

- The current public page is comprehensive but long. Prioritize the personalized care-plan CTA and primary health-screening offer, then defer travel lifestyle details to focused pages.
- Avoid describing the form as private/confidential until data storage, access controls, retention, and applicable privacy notices are implemented. Current copy describes a private one-to-one service, not a security guarantee.
- Do not publish customer inquiries or use the current client-only admin as a real CRM.
