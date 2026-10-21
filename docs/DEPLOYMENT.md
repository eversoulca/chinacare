# Deployment readiness

The workspace is a Vite app and has no Vercel project configuration or linked Git repository visible here. Before production deployment:

1. Restore/connect the intended GitHub repository and confirm the Vercel project imports that repository and its correct production branch.
2. Use the existing `pnpm-lock.yaml`; build command is `pnpm build`, output directory is `dist`.
3. Configure the final production domain after confirming ownership in GoDaddy and adding the DNS records Vercel displays for that project. Do not guess DNS values.
4. Configure `VITE_SITE_URL` to the final HTTPS origin once set; rebuild and verify canonical URLs and sitemap output.
5. Do not accept real inquiries until server persistence, privacy notice, and access controls are ready.
6. Verify the deployed public pages, form states, crawler access, and admin protection before launch.

The existing app is client-rendered. Vercel hosting alone will not make the public routes server-rendered or fully address their crawlability.

The site includes a PWA manifest, app icons, and a service worker for the app shell. Verify installation on an HTTPS preview: Android Chrome should offer Install app; on iPhone/iPad, use Safari's Share menu and Add to Home Screen. A service worker caches the basic shell and visited build assets; it does not cache customer records.
