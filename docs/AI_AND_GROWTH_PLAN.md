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

Create or use one real WhatsApp Business number yourself, then add the international-format number to the Vercel `chinacare` project as `VITE_WHATSAPP_NUMBER` and redeploy. A visitor starts the conversation and WhatsApp opens on their device. An on-call human can reply using the WhatsApp Business app. Do not create multiple accounts automatically; phone verification and account ownership must remain with the business owner.

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

## Source policy references

- [X automation rules](https://help.x.com/en/rules-and-policies/x-automation?lang=browser)
- [X authenticity rules](https://help.x.com/en/rules-and-policies/authenticity)
- [WhatsApp Business Platform getting started](https://faq.whatsapp.com/5773272372736965/)
- [Meta WhatsApp Cloud API collection](https://www.postman.com/meta/whatsapp-business-platform/documentation/wlk6lh4/whatsapp-cloud-api)
