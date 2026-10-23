import type { IncomingMessage, ServerResponse } from "node:http";

type ApiRequest = IncomingMessage & { method?: string; body?: unknown };
const topics = new Set([
  "How to ask for an itemized estimate for care in China",
  "Questions about language support before booking",
  "What to confirm about medical records and translations",
  "Planning follow-up after returning home",
  "How to compare what different care options include",
  "Separating clinical decisions from travel coordination",
  "Questions about timing, appointment length, and travel days",
  "What to confirm with a hospital before health screening",
  "Practical planning for a specialist consultation",
  "Recovery logistics to discuss with the clinical team",
  "How to ask about privacy and handling records",
  "Starting an inquiry without sharing sensitive health details",
  "Planning for a change in appointment or itinerary",
  "What an independent coordinator can and cannot do",
  "Questions to compare dental care options abroad",
  "Planning a medical aesthetics inquiry responsibly",
  "Questions about rehabilitation and recovery support",
  "How to prepare questions for a traditional medicine consultation",
]);

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
        max_tokens: 260,
        messages: [
          { role: "system", content: "You are the English-language editorial writer for China Care Guide, a small coordination guide for international people exploring planned healthcare in China. Write one short, specific, genuinely useful X post (maximum 260 characters including spaces). Speak to real cross-border planning questions: itemized estimates, language support, appointment logistics, records and translations, recovery planning, and follow-up across borders. Give the reader one concrete question to ask or one practical planning distinction they can use immediately. Avoid generic healthcare slogans, ad copy, fear, urgency, unsupported comparisons, and claims that China Care Guide can arrange a provider or outcome. Do not give medical advice, assess suitability, diagnose, recommend a treatment, name providers, invent prices, statistics, availability, or partnerships. Frame clinical and preparation details as questions to confirm with the treating provider. Vary the opening and structure; do not copy recent posts. Mention China Care Guide only occasionally and only when it naturally adds context. No hashtags or URL. Return only the post text." },
          { role: "user", content: `Topic: ${topic}\nBusiness context: China Care Guide helps international customers organize general healthcare inquiries and practical coordination for planned care in China. Areas of interest include health screening, medical aesthetics, specialist and surgical care, dental care, rehabilitation, and traditional/integrative care. We are not a healthcare provider; we do not give clinical advice. Actual providers, services, costs, suitability, timing, interpretation, and follow-up must be confirmed individually.\nRecent posts to avoid repeating (use new wording, angle, and opening): ${JSON.stringify(recentPosts)}` },
        ],
      }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!completion.ok) return respond(res, 502, { message: "The model provider could not generate a draft. Try again later." });
    const result = await completion.json() as { choices?: Array<{ message?: { content?: unknown } }> };
    const content = typeof result.choices?.[0]?.message?.content === "string" ? result.choices[0].message.content.trim().replace(/^\s*["“]|["”]\s*$/g, "") : "";
    if (!content || content.length > 280) return respond(res, 502, { message: "The generated draft did not meet the length limit. Generate another draft." });

    const save = await fetch(`${supabaseUrl}/rest/v1/social_drafts`, {
      method: "POST",
      headers: { ...authHeaders, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ topic, content, status: "draft", model, created_by: user.id }),
      signal: AbortSignal.timeout(8000),
    });
    if (!save.ok) return respond(res, 502, { message: "Draft generated, but it could not be saved. Apply the social drafts database migration and try again." });
    const rows = await save.json() as Array<{ id: string; created_at: string; topic: string; content: string; status: string; model: string }>;
    return respond(res, 201, { draft: rows[0] });
  } catch {
    return respond(res, 502, { message: "Draft generation is temporarily unavailable." });
  }
}
