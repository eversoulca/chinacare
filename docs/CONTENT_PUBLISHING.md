# Content publishing

Public service and destination copy currently lives in `src/PublicContent.tsx`; homepage content and navigation live in `src/App.tsx`. Verify every provider, service availability, fee, credential, office address, clinical statement, and testimonial before publishing it. Unverified items should remain explicitly pending or be omitted.

For each new public page, provide a distinct audience/search question, useful original information, a unique title and description, one clear H1, relevant internal links, and a clear inquiry next step. Do not publish thin service/city combinations. Clinical content requires appropriate qualified review and sources before publication. The current application updates metadata in client JavaScript; ensure route HTML is prerendered or server-rendered before relying on these pages for organic search.
