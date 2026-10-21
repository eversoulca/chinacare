# China Care Guide

React 19, Vite, TypeScript, and Tailwind CSS v4 website prototype for international customers exploring healthcare options in China.

## Local development

Use Node.js and pnpm versions configured in `.mise.toml`.

```sh
pnpm install
pnpm dev
```

Create a production build with `pnpm build`. The inquiry form stores minimal contact and planning details in Supabase after the database migrations are applied. The `/admin` inbox uses invite-only Supabase Auth and RLS; apply the staff migration and configure `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, the Auth redirect URL, and at least one staff role before using it.

## Current implementation status

- Public homepage and client-rendered service, destination, and resource content are implemented.
- Supabase inquiry persistence and the staff inquiry inbox are implemented, subject to the manual project setup documented in `docs/DATABASE_SETUP.md`. Transactional email and expanded CRM functions are not yet implemented.
- Public URLs use language prefixes (`/en/`, `/zh/`, `/ko/`, `/ja/`, `/fr/`, `/es/`). English is the available content language today; other route options display an in-page notice while reviewed translations are prepared.
- Public route content is not server-rendered yet. See [the implementation roadmap](docs/IMPLEMENTATION_PLAN.md) and [SEO checklist](docs/SEO_CHECKLIST.md).
- Vercel rewrites deep links to the Vite SPA shell so routes such as `/admin` and language paths load on direct visits.
- The site can be installed from supported mobile browsers as a home-screen PWA. iPhone/iPad users should open it in Safari and choose Share → Add to Home Screen; Android users can use the browser's Install app option.
- Deployment, database, environment, and content instructions are in `docs/`.
