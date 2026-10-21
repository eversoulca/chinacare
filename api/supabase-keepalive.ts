import { timingSafeEqual } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

type ApiRequest = IncomingMessage & { method?: string };

function respond(res: ServerResponse, status: number, message: string) {
  res.statusCode = status;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ message }));
}

function isAuthorized(header: string | string[] | undefined, secret: string) {
  if (typeof header !== "string" || !header.startsWith("Bearer ")) return false;
  const provided = Buffer.from(header.slice(7));
  const expected = Buffer.from(secret);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export default async function handler(req: ApiRequest, res: ServerResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return respond(res, 405, "Method not allowed");
  }

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || !isAuthorized(req.headers.authorization, cronSecret)) {
    return respond(res, 401, "Unauthorized");
  }

  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return respond(res, 503, "Supabase is not configured");
  }

  try {
    const headers: Record<string, string> = { apikey: supabaseAnonKey };
    // Legacy anon keys are JWTs; publishable keys are not JWTs and should only be sent as apikey.
    if (supabaseAnonKey.startsWith("eyJ")) headers.Authorization = `Bearer ${supabaseAnonKey}`;
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/keepalive`, {
      headers,
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) return respond(res, 502, "Supabase activity check failed");
    return respond(res, 200, "Supabase activity check completed");
  } catch {
    return respond(res, 502, "Supabase activity check failed");
  }
}
