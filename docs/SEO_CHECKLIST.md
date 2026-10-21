# SEO launch checklist

- [x] English document language and homepage title/description in the initial HTML.
- [x] Open Graph title and description in the initial HTML.
- [x] `robots.txt` allows Googlebot, Bingbot, and OAI-SearchBot and excludes `/admin` from crawling.
- [ ] Render public route content and unique metadata in initial HTML (current route content is client-rendered).
- [ ] Set a verified production origin and canonical URLs.
- [ ] Generate a sitemap containing only live, canonical, reviewed pages.
- [ ] Add real social sharing imagery and descriptive alt text review.
- [ ] Verify redirects, status codes, 404 behavior, and mobile rendering on the deployed domain.
- [x] Configure Vercel SPA rewrites for direct visits to `/admin` and language-prefixed routes.
- [ ] Translate public pages fully, then add localized titles/descriptions and `hreflang` alternates. Until review is complete, non-English routes identify themselves as English content in progress and canonicalize to the English route.
- [ ] Submit the sitemap in relevant search consoles after domain verification.

`robots.txt` is a crawl preference, not an access-control mechanism. The `/admin` route is not authenticated and must not be used with real records until a protected backend is implemented.
