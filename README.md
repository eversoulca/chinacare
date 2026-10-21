# China Care Guide

React 19, Vite, TypeScript, and Tailwind CSS v4 website prototype for international customers exploring healthcare options in China.

## Local development

Use Node.js and pnpm versions configured in `.mise.toml`.

```sh
pnpm install
pnpm dev
```

Create a production build with `pnpm build`. The current contact form is a demo only and does not send or save submissions. Do not enter real personal or health information. The `/admin` page is a frontend prototype and is not authenticated.

## Current implementation status

- Public homepage and client-rendered service, destination, and resource content are implemented.
- Supabase, staff authentication, secure inquiry persistence, transactional email, Vercel project linking, and a production domain are not configured in this workspace.
- Public route content is not server-rendered yet. See [the implementation roadmap](docs/IMPLEMENTATION_PLAN.md) and [SEO checklist](docs/SEO_CHECKLIST.md).
- The site can be installed from supported mobile browsers as a home-screen PWA. iPhone/iPad users should open it in Safari and choose Share → Add to Home Screen; Android users can use the browser's Install app option.
- Deployment, database, environment, and content instructions are in `docs/`.
