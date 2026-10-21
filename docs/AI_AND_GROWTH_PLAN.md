# AI support and low-cost growth plan

## What is live in the current website

- The website helper answers from reviewed public FAQs using a lightweight local matching rule. It does not call a generative AI service, retain a conversation, or send messages to a third party.
- Unmatched questions are handed off to the inquiry form. The helper is not a clinical triage or emergency service.
- WhatsApp is a user-initiated click-to-chat link when `VITE_WHATSAPP_NUMBER` is configured in the Vercel `chinacare` project. The number is public by design. Do not put API tokens or private keys in any `VITE_` variable.

## FAQ topics to cover

Competitor medical-travel FAQs commonly cover total trip budgeting, what is included, provider verification, travel and recovery timing, risks, language support, and follow-up after returning home. Use these as topic prompts, not copy. See [MedicalTourism.com FAQ](https://www.medicaltourism.com/frequently-asked), [medical travel questions](https://www.magazine.medicaltourism.com/article/top-10-questions-to-ask-before-traveling-abroad-for-medical-care), and [medical travel facilitator FAQ](https://cmhdinternational.com/about-cmhd-international/medical-travel-facilitator-faq/).

For every answer, distinguish what China Care Guide can coordinate from what a provider must confirm. Never infer current provider participation, clinical eligibility, price, appointment availability, travel/visa rules, or outcomes. Medical advice, personal records, urgent symptoms, suitability, diagnosis, treatment recommendations, and genetic interpretation must be routed to a qualified clinician or emergency service.

Suggested answer pattern:

1. Give the short factual answer from an approved source.
2. Say what still needs individual/provider confirmation.
3. Give a low-pressure next step, such as asking for a general estimate.
4. Include a safety boundary where the question is clinical.

Example: “We can ask participating providers for a current estimate. It should identify the currency, what is included and excluded, possible additional charges, and how long the estimate is valid. Provider availability and clinical suitability must be confirmed individually. If you like, send a general inquiry without attaching medical records.”

## WhatsApp: recommended stages

### Stage 1 — click-to-chat (no API, lowest cost)

The current click-to-chat link works with a regular WhatsApp account. For a public business presence, back up the account and migrate the same number to the free WhatsApp Business app. Meta says account information, chat history, and media can migrate, while Messenger and Business apps cannot use the same number simultaneously. A visitor starts the conversation and WhatsApp opens on their device. An on-call human can reply in the Business app. See [WhatsApp's migration instructions](https://faq.whatsapp.com/3059780464322392/?cms_platform=android&locale=en_US). Do not create multiple accounts automatically; phone verification and account ownership must remain with the owner.

### Stage 2 — shared inbox and automation

When inquiry volume justifies it, create a Meta Business Portfolio, a WhatsApp Business Account, and a Meta app; register a business-owned number and configure the official WhatsApp Business Platform Cloud API. Add a webhook to the Vercel API layer, verify webhook signatures, deduplicate inbound events, store only necessary conversation metadata, and add a human-takeover queue in CareDesk. Keep Meta tokens, app secrets, and any model key in server-only Vercel variables. The owner must complete Meta onboarding and number verification; those steps cannot be safely automated by this repository.

For human takeover, provide visible “talk to a person” intent, mark a conversation as human-owned, pause bot replies until an agent releases it, and keep an audit log. Start with a single business number and a simple handoff. A second number adds operational complexity and is not needed to provide 24/7 coverage.

WhatsApp Platform messaging is not a zero-cost guarantee: free-form replies are limited to the 24-hour customer-service window after the person messages; business-initiated messages outside it require approved templates and may be charged. Check current Meta rates before enabling proactive messages. Never use WhatsApp for unsolicited lead outreach.

## Social publishing and listening

- Start with one useful original post on three to five days per week, then review engagement. Two every day is likely to create repetitive content before there is enough original material. Rotate practical checklists, explainers, transparent process notes, destination preparation, and answers to common non-clinical questions. Use one gentle link only where useful.
- Keep an editorial queue of drafts and require a human approval click before publishing. Drafts can be generated from approved website FAQs and a topic calendar; do not publish clinical claims or unverified provider, price, or outcome statements.
- Use native scheduling tools where available. API automation has platform-specific access, limits, and sometimes costs; do not automate browser interactions.
- Social listening should create a private review queue of relevant public posts, not auto-replies. A human checks relevance, context, platform rules, and whether a helpful reply is welcome. Do not send repeated promotional links, scrape private content, or use keyword searches to trigger unsolicited replies.
- X explicitly requires prior written approval to operate AI-powered automated reply bots. X also disallows automated unsolicited replies based on keyword searches alone. Therefore, X can be used for approved scheduled posts and human-reviewed listening; do not enable AI auto-replies unless X provides that written approval.

## Low-cost rollout

1. Publish the FAQ helper and real click-to-chat link.
2. Prepare a four-week topic calendar; draft posts in batches and approve them manually.
3. Track only simple metrics: qualified inquiries, source channel, response time, and which posts led to inquiries.
4. Add the WhatsApp Cloud API and server-side model only after there is a verified business number, a suitable privacy notice, a human coverage plan, and a clear reason to incur any usage cost.
5. Add social listening only through official APIs or platform-native tools with terms-compliant access. Keep replies human-approved.

## Proposed operating system

### WhatsApp support

The current number is on regular WhatsApp Messenger. For business use, back up and migrate it to the free WhatsApp Business app; Meta's migration flow can transfer account information and chat history, but the same number cannot be active in both apps at once. See [WhatsApp's migration instructions](https://faq.whatsapp.com/3059780464322392/?cms_platform=android&locale=en_US).

Then check the WhatsApp Business app under **Tools → AI agent**. Meta Business Agent is rolling out only to selected businesses and countries, and not every language is supported. Where available, it can answer new one-to-one customer chats and lets the business control which conversations receive AI replies and take over a chat. This uses Meta's agent, not DeepSeek. Teach it only approved service and logistics facts. Explicitly instruct it not to diagnose, assess eligibility, promise results/prices/availability, or request health records; route those questions to a human or clinician. The language available may depend on the business phone number's country.

If the native agent is unavailable and you specifically want DeepSeek, add the official Cloud API webhook and our own server-side assistant later. The regular app does not provide a supported connection to a custom model API. Meta onboarding and number setup are required; verify the currently offered number/app coexistence flow before changing registration. Do not automate WhatsApp Web or an ordinary app session. Use the account for private, user-started support; do not send unsolicited marketing messages. WhatsApp Status is a separate ephemeral update feature; the official Cloud API material covers customer messaging, so do not plan to auto-publish Status through the messaging API. Publish public education posts to X/Instagram/Facebook instead and optionally share a manually approved version to Status.

### Social content workflow

1. A daily content job selects one unused topic from an approved bank and creates one short educational post. Store the topic, draft, source FAQ(s), created time, destination platform, uniqueness key, and status in Supabase.
2. Run a strict factual and safety check: source every claim to approved site content, remove invented prices/providers/statistics/outcomes, reject personal medical recommendations, avoid urgency/discount language, and vary the format and angle. Enforce topic cooldowns and normalized-text similarity checks against the last 90 days.
3. For the initial two weeks, send every post to a private approval queue. Show the proposed post, a short rationale/source, platform preview, and buttons for Edit, Approve & publish, and Reject. An approval records the staff user and timestamp.
4. After reviewing at least two weeks of drafts, optionally auto-publish only low-risk evergreen explainers that pass all checks. Keep case-specific, medical, cost, provider, legal/visa, and time-sensitive posts in human review. Start with one post daily; increase only if quality and audience response support it.
5. Scan public posts through the official platform API four times per day, initially for a narrow set of non-clinical intent phrases such as “health check in China”, “China hospital international patient”, and “medical travel planning”. Store a link and a short excerpt only, deduplicate by platform post ID, and rank possible relevance. Do not collect private messages or sensitive health details.
6. Generate a contextual reply draft only for a human-reviewed candidate. The draft should answer the actual question first, disclose the China Care Guide connection naturally when relevant, avoid repeated links, and offer the site as optional further reading. Default action is **Open post + copy draft** so a human publishes in the native app. Do not use scripted browser posting.

### Platform rollout

- **Start with X**, because X was the platform you mentioned. X's current pay-per-use page lists $0.005 for a Post Read and $0.015 for a Post Create. A rough cap of 10 fetched posts per scan × 4 scans/day is about 1,200 reads/month or $6/month, plus around $0.45 for 30 daily posts; actual charges depend on resources returned and the current rate card. Keep an API credit limit and stop scans before the cap. X requires prior written approval to run an AI-powered automated reply bot, and keyword-only unsolicited replies are prohibited. Therefore, keep replies as human-reviewed drafts; do not auto-reply. Automated informational posts can be considered after quality review, subject to account consent and anti-spam rules.
- Use **SiliconFlow** as the OpenAI-compatible model gateway for first-pass drafts and classifying short public excerpts. Configure it server-side with `SILICONFLOW_API_KEY`, `SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1`, and `SILICONFLOW_MODEL=deepseek-ai/DeepSeek-V3`; never use a `VITE_` prefix. The API key is billed separately from Vercel/Supabase. Only send approved site content and short public post excerpts, never customers' health details. Keep R1 or Qwen3 as an owner-selected fallback only after confirming the exact model ID and availability in the SiliconFlow console; do not automatically retry every model because that can multiply cost.
- **Instagram/Facebook** can be added later if you create/convert to Professional accounts and authorize a Meta app. Meta's official Instagram API supports publishing for eligible Professional accounts and some interactions/search, but it requires app permissions and an authorized token. We should not assume it offers a broad search across all public social conversations.
- If your WhatsApp Business app exposes Meta Business Agent, use that for inbound chat support rather than building a custom bot first. This does not publish the daily social posts.

### Scheduler, hosting, and budget

- Use Supabase Cron for several daily scans, with a hard daily request cap, per-run limits, idempotency, retries with backoff, and a pause switch. Vercel Hobby cron schedules must be no more frequent than daily per job; one every-six-hours expression does not fit that limit. Several separately configured daily jobs may be possible, but confirm deployment validation before relying on them.
- Important plan mismatch: Vercel documents Hobby for personal, non-commercial use. Since China Care Guide is a business marketing site, review whether to move to Vercel Pro or move the production site/functions to a host whose current terms support your commercial use. Avoid building the growth scheduler around an assumption that a free Hobby plan permits commercial operation.
- AI model calls need a separate API key and usage billing. X reads/writes also have usage charges. Keep both secrets server-side and set a small monthly ceiling before enabling scheduled work. No background AI or API-based social scan can be promised as zero-cost.
- Human approval is the safe launch mode. Autopublish is a later opt-in for posts only, with emergency stop, duplicate detection, failed-post alerts, logs, and no auto-reply to strangers.

## Inputs required before connecting accounts

No passwords, OTPs, or tokens should be sent in chat. The owner will need to:

1. Back up and migrate the number from WhatsApp Messenger to WhatsApp Business if you want a business profile; then check **Tools → AI agent**.
2. Create/use the brand's X account. A regular X account is the public publishing identity; a separate X Developer app and OAuth authorization from the account owner are required for API scanning and in-app publishing.
3. Create/authorize an X Developer app with read/search and write scopes, then store credentials as server-only Vercel variables. If you publish manually in X, no API write token is needed. Never put tokens in `VITE_` variables or Git.
4. Create a SiliconFlow API key, set a usage budget, and add it only as a server-side Vercel environment variable. Do not send keys in chat or commit them.
5. Choose a monthly cap for X API reads. The initial estimate uses only 10 results per scan; more results increase cost.

The public account posts and social replies must always be reviewed by the account owner until the account has an established, approved workflow.

## Source policy references

- [X automation rules](https://help.x.com/en/rules-and-policies/x-automation?lang=browser)
- [X authenticity rules](https://help.x.com/en/rules-and-policies/authenticity)
- [WhatsApp Business Platform getting started](https://faq.whatsapp.com/5773272372736965/)
- [Meta WhatsApp Cloud API collection](https://www.postman.com/meta/whatsapp-business-platform/documentation/wlk6lh4/whatsapp-cloud-api)
- [Meta Business Agent for WhatsApp setup](https://faq.whatsapp.com/1153795669452207/?cms_platform=web)
- [Meta's official Instagram API](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api)
- [X Developer Platform pay-per-use pricing](https://developer.x.com/)
- [Vercel Hobby plan and usage terms](https://vercel.com/docs/plans/hobby)
- [Vercel cron usage and pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing)
- [WhatsApp Messenger to WhatsApp Business migration](https://faq.whatsapp.com/3059780464322392/?cms_platform=android&locale=en_US)
- [DeepSeek API pricing](https://api-docs.deepseek.com/quick_start/pricing/)
- [DeepSeek Chat Completions API](https://api-docs.deepseek.com/api/create-chat-completion/)
