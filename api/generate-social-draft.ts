import type { IncomingMessage, ServerResponse } from "node:http";

type ApiRequest = IncomingMessage & { method?: string; body?: unknown };
const topics = new Set([
  "Questions to ask before choosing a provider",
  "What a transparent estimate should include",
  "Planning language support for a healthcare visit",
  "Preparing for follow-up after returning home",
  "Practical medical travel planning checklist",
  "How to compare service inclusions and exclusions",
  "A question to ask about medical records",
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

    const input = await readJson(req) as { topic?: unknown };
    const topic = typeof input?.topic === "string" ? input.topic : "";
    if (!topics.has(topic)) return respond(res, 400, { message: "Choose a topic from the approved list." });

    const completion = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${siliconFlowKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: 220,
        messages: [
          { role: "system", content: "Write one useful, warm, non-promotional educational post for China Care Guide in English for X. Maximum 260 characters including spaces, leaving room under X's standard post limit. Give general travel coordination information only. Never give medical advice, diagnose, assess eligibility, promise outcomes, name providers, invent prices/statistics/availability, use urgency, or imply a partnership. Do not include hashtags or a URL. If relevant, make clear provider details must be confirmed individually. Return only the post text." },
          { role: "user", content: `Topic: ${topic}\nApproved context: China Care Guide helps international customers organize healthcare inquiries and practical coordination in China. It is not a healthcare provider and does not give clinical advice. Provider participation, services, costs, suitability, and appointments require individual confirmation.` },
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
