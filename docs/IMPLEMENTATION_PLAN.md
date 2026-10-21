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

## Recommended delivery sequence

1. Confirm production domain, legal company identity, office/contact details, and privacy/terms text.
2. Restore/connect the project Git repository and verify its GitHub remote and Vercel project linkage.
3. Add prerendering or migrate the public content to an SSR-capable framework so each public route ships meaningful HTML, route-specific metadata, and canonical URLs.
4. Connect Supabase with server-side submission, input validation, RLS-protected staff records, and staff authentication before accepting real inquiries. Treat Free-plan auto-pause as a development constraint; do not rely on a once-daily Vercel Hobby cron as an uptime guarantee.
5. Add secure transactional email only after sender-domain verification and credentials are configured.
6. Publish only reviewed service/destination content; add sitemap, canonical domain, and search-console submission after the production URL is known.

## Design/product notes

- The current public page is comprehensive but long. Prioritize the personalized care-plan CTA and primary health-screening offer, then defer travel lifestyle details to focused pages.
- Avoid describing the form as private/confidential until data storage, access controls, retention, and applicable privacy notices are implemented. Current copy describes a private one-to-one service, not a security guarantee.
- Do not publish customer inquiries or use the current client-only admin as a real CRM.
