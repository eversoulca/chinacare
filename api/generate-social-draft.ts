import type { IncomingMessage, ServerResponse } from "node:http";

type ApiRequest = IncomingMessage & { method?: string; body?: unknown };
const topics = new Set([
  "What China's national inbound medical-tourism policy actually says",
  "How Shanghai's international-medical policy supports inbound care",
  "What makes Hainan's Lecheng medical-tourism pilot different",
  "National policy vs local pilot: what international patients should verify",
  "What Grade III Class A means—and what it does not tell you",
  "What to ask a hospital international department before booking",
  "How international departments handle language and coordination",
  "How to verify the right hospital department for a question",
  "Public, private, and foreign-owned hospitals: compare scope, not labels",
  "Practical differences to check when planning care in Beijing",
  "Practical differences to check when planning care in Shanghai",
  "How to compare Beijing and Shanghai without ranking their hospitals",
  "City, travel, and follow-up: plan the whole care itinerary",
  "Compare an estimate line by line before comparing prices",
  "Why medical prices across countries are rarely like-for-like",
  "How to evaluate clinical experience using relevant, dated evidence",
  "Why speed and cost alone do not establish medical quality",
  "Questions to ask about outcomes, risks, and the source of a claim",
  "What to confirm before a CT appointment",
  "What to confirm before an MRI appointment",
  "CT and MRI: ask the clinician which question each scan answers",
  "How to prepare existing images and reports for a new consultation",
  "Genetic testing: questions about consent, data, and interpretation",
  "Rare and inherited conditions: coordinate records before travel",
  "What to ask during a health-screening consultation",
  "A specialist consultation: organize the question and records",
  "Surgery planning: questions for the treating team before travel",
  "Dental care abroad: align treatment stages, estimates, and follow-up",
  "Aesthetic procedures: verify credentials, product, and aftercare",
  "Anti-aging claims: look for evidence and clear risk information",
  "Rehabilitation: agree on goals and review points with clinicians",
  "Traditional medicine and integrative care: discuss fit with a clinician",
  "Wellness and recuperation: separate lifestyle services from treatment",
  "What a patient companion can do—and cannot do",
  "Medical interpreter vs accompanying coordinator: distinct roles",
  "What the care-coordination journey may look like",
  "What to include in a first inquiry without sharing sensitive health details",
  "Planning travel, lodging, and recovery days around care",
  "What happens if an appointment or treatment plan changes",
  "Chinese food culture and dietary needs during a care trip",
  "Travel and daily-life planning around a medical appointment in China",
  "What foreign visitors may want to know about hospital payment options",
  "Culture, communication, and asking questions at a visit",
  "How to assess an online foreign-patient experience in China",
  "What a single medical-travel story can—and cannot—show",
  "How to share a patient story ethically: consent, privacy, and context",
  "Case studies: separate verified facts from typical expectations",
]);

const officialSourceNotes: Record<string, string> = {
  "What China's national inbound medical-tourism policy actually says": "Verified official source: a March 20, 2026 central-government report says nine departments issued inbound-consumption measures that call for piloting international medical-tourism hubs in eligible regions. This is a pilot direction, not a nationwide service guarantee or patient entitlement. Source URL: https://english.www.gov.cn/news/202603/20/content_WS69bd4c4ec6d00ca5f9a0a08e.html",
  "How Shanghai's international-medical policy supports inbound care": "Verified official source: Shanghai's municipal policy dated December 30, 2024 (published May 2025) encourages multilingual services, international departments, medical-tourism coordination, and other measures in Shanghai. Do not present this local policy as a nationwide guarantee or proof that a particular provider offers a service. Source URL: https://english.shanghai.gov.cn/en-Bulletin/20250530/3217070bfa514ba1b1b9dfb206680ccb.html",
  "What makes Hainan's Lecheng medical-tourism pilot different": "Verified official source: Hainan's government says the Boao Lecheng International Medical Tourism Pilot Zone was established with State Council approval in 2013 and has specific pilot policies. State clearly that these provisions are zone-specific, not general rules for all of China. Source URL: https://en.hainan.gov.cn/englishsite/Agencies/202506/ef98c0e7838f414fb630a0ed40a907a4.shtml",
  "What Grade III Class A means—and what it does not tell you": "Verified official source: China's National Health Commission published 2025 evaluation standards for tertiary hospitals. Describe the designation only as an institutional evaluation category; it does not by itself establish a particular department's fit, an individual clinician's experience, or a patient's likely outcome. Source URL: https://www.nhc.gov.cn/yzygj/c100068/202506/25229edc80d34694b7debf54ddef9f9f/files/%E3%80%8A%E4%B8%89%E7%BA%A7%E5%8C%BB%E9%99%A2%E8%AF%84%E5%AE%A1%E6%A0%87%E5%87%86%EF%BC%882025%E5%B9%B4%E7%89%88%EF%BC%89%E3%80%8B-20250610154952298.pdf",
};

function respond(res: ServerResponse, status: number, data: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(data));
}

async function readJson(req: ApiRequest): Promise<unknown> {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 2_000) throw new Error("Request too large");
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export default async function handler(req: ApiRequest, res: ServerResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return respond(res, 405, { message: "Method not allowed" });
  }
  if (!req.headers["content-type"]?.includes("application/json")) return respond(res, 415, { message: "Expected JSON." });

  const origin = req.headers.origin;
  const host = req.headers.host;
  try {
    if (typeof origin !== "string" || !host || new URL(origin).host !== host) return respond(res, 403, { message: "Request origin is not allowed." });
  } catch {
    return respond(res, 403, { message: "Request origin is not allowed." });
  }

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const siliconFlowKey = process.env.SILICONFLOW_API_KEY;
  const model = process.env.SILICONFLOW_MODEL || "deepseek-ai/DeepSeek-V3";
  const baseUrl = (process.env.SILICONFLOW_BASE_URL || "https://api.siliconflow.cn/v1").replace(/\/$/, "");
  if (!supabaseUrl || !supabaseKey || !siliconFlowKey) return respond(res, 503, { message: "Draft generation is not configured yet." });

  const authorization = req.headers.authorization;
  if (!authorization?.startsWith("Bearer ") || authorization.length > 4096) return respond(res, 401, { message: "Please sign in again." });
  const authHeaders = { apikey: supabaseKey, Authorization: authorization };
  try {
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: authHeaders, signal: AbortSignal.timeout(7000) });
    if (!userResponse.ok) return respond(res, 401, { message: "Your staff session has expired." });
    const user = await userResponse.json() as { id?: string };
    if (!user.id) return respond(res, 401, { message: "Please sign in again." });

    const roleResponse = await fetch(`${supabaseUrl}/rest/v1/staff_access?user_id=eq.${encodeURIComponent(user.id)}&select=role`, { headers: authHeaders, signal: AbortSignal.timeout(7000) });
    if (!roleResponse.ok) return respond(res, 403, { message: "Staff permissions could not be verified." });
    const roles = await roleResponse.json() as Array<{ role?: string }>;
    if (!roles.some(({ role }) => role === "admin" || role === "coordinator")) return respond(res, 403, { message: "Content editors only." });

    const dayStart = new Date();
    dayStart.setUTCHours(0, 0, 0, 0);
    const usageResponse = await fetch(`${supabaseUrl}/rest/v1/social_drafts?created_by=eq.${encodeURIComponent(user.id)}&created_at=gte.${encodeURIComponent(dayStart.toISOString())}&select=id`, { headers: authHeaders, signal: AbortSignal.timeout(7000) });
    if (!usageResponse.ok) return respond(res, 503, { message: "Draft usage could not be checked. Apply the social drafts migration and try again." });
    const usage = await usageResponse.json() as Array<{ id: string }>;
    if (usage.length >= 5) return respond(res, 429, { message: "Daily draft limit reached (5 per editor). Try again tomorrow." });

    const historySince = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const historyResponse = await fetch(`${supabaseUrl}/rest/v1/social_drafts?created_at=gte.${encodeURIComponent(historySince)}&select=content&order=created_at.desc&limit=30`, { headers: authHeaders, signal: AbortSignal.timeout(7000) });
    const history = historyResponse.ok ? await historyResponse.json() as Array<{ content?: string }> : [];
    const recentPosts = history.map(({ content }) => content?.trim()).filter((content): content is string => Boolean(content)).slice(0, 30);

    const input = await readJson(req) as { topic?: unknown };
    const topic = typeof input?.topic === "string" ? input.topic : "";
    if (!topics.has(topic)) return respond(res, 400, { message: "Choose a topic from the approved list." });

    const completion = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${siliconFlowKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0.75,
        max_tokens: 1900,
        messages: [
          { role: "system", content: 'You are the English-language editorial writer for China Care Guide, a small coordination guide for international people exploring planned healthcare in China. Create four meaningfully adapted, platform-native posts from the same selected topic and return ONLY valid JSON with exactly these string fields: "x", "facebook", "instagram", and "linkedin". X must be at most 260 characters and concise; Facebook should be conversational, explain one useful planning point, and invite a genuine question (normally 2-4 short sentences); Instagram should have a clear opening, readable short lines, one practical takeaway and a gentle question (normally 80-160 words); LinkedIn should be a professional, evidence-conscious insight for international patients, healthcare professionals, and cross-border partners—not a job ad—using a clear context, one planning implication, and a thoughtful discussion question (normally 100-180 words). Do not simply copy-paste one text with different lengths. All are educational, never generic healthcare slogans or advertisements. Do not claim China care is universally cheaper, faster, better, safer, or more experienced. Do not give medical advice, assess suitability, diagnose, recommend tests or treatment, name providers, or invent prices, statistics, availability, partnerships, patient stories, or outcomes. Frame clinical and preparation details as questions for the treating provider. Never imply a pilot or city policy applies across China. When an official source note is supplied, use only its narrow facts, preserve date and location, and include its official URL if making a policy or classification claim. Never invent a foreign patient experience or special-procedure case; explain how to assess a verified story instead. Avoid repeating recent posts and vary each platform’s hook, structure, and wording. Mention China Care Guide only occasionally and naturally. No hashtags; no markdown fences.' },
          { role: "user", content: `Topic: ${topic}\nBusiness context: China Care Guide helps international customers organize general healthcare inquiries and practical coordination for planned care in China. Areas include health screening, specialist and surgical care, dental care, medical aesthetics, rehabilitation and recovery, traditional/integrative care, and practical travel coordination. We are not a healthcare provider and do not give clinical advice. Actual providers, services, costs, suitability, timing, interpretation, and follow-up must be confirmed individually.\nOfficial source note for this topic: ${officialSourceNotes[topic] || "No specific source note is supplied. Avoid current policy claims, statistics, rankings, price or outcome comparisons, and claims about a specific hospital. Make posts a useful checklist or question for the reader to verify with the hospital or clinician."}\nRecent posts to avoid repeating (create a new angle and wording): ${JSON.stringify(recentPosts)}` },
        ],
      }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!completion.ok) return respond(res, 502, { message: "The model provider could not generate a draft. Try again later." });
    const result = await completion.json() as { choices?: Array<{ message?: { content?: unknown } }> };
    const rawContent = typeof result.choices?.[0]?.message?.content === "string" ? result.choices[0].message.content.trim().replace(/^```(?:json)?\s*|\s*```$/g, "") : "";
    let content: { x?: unknown; facebook?: unknown; instagram?: unknown };
    try { content = JSON.parse(rawContent) as typeof content; }
    catch { return respond(res, 502, { message: "The model returned an invalid multi-platform draft. Generate another draft." }); }
    const posts = [
      { platform: "X", content: content.x, maxLength: 260 },
      { platform: "Facebook", content: content.facebook, maxLength: 1200 },
      { platform: "Instagram", content: content.instagram, maxLength: 1800 },
      { platform: "LinkedIn", content: content.linkedin, maxLength: 2200 },
    ];
    if (posts.some((post) => typeof post.content !== "string" || !post.content.trim() || post.content.length > post.maxLength)) return respond(res, 502, { message: "One of the platform drafts did not meet its format limits. Generate the set again." });

    const save = await fetch(`${supabaseUrl}/rest/v1/social_drafts`, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(posts.map((post) => ({ topic: `${post.platform}: ${topic}`, content: (post.content as string).trim(), status: "draft", model, created_by: user.id }))),
      signal: AbortSignal.timeout(8000),
    });
    if (!save.ok) return respond(res, 502, { message: "Draft generated, but it could not be saved. Apply the social drafts database migration and try again." });
    const rows = await save.json() as Array<{ id: string; created_at: string; topic: string; content: string; status: string; model: string }>;
    return respond(res, 201, { drafts: rows });
  } catch {
    return respond(res, 502, { message: "Draft generation is temporarily unavailable." });
  }
}
