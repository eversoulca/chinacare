import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

export type Request = IncomingMessage & { method?: string; body?: unknown };
export type Staff = { id: string; role: "admin" | "coordinator" | "read_only" };

export function json(res: ServerResponse, status: number, data: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(data));
}

export function redirect(res: ServerResponse, url: string) {
  res.statusCode = 303;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Location", url);
  res.end();
}

export function sameOrigin(req: Request) {
  try {
    if (!req.headers.host) return false;
    const source = typeof req.headers.origin === "string" ? req.headers.origin : req.headers.referer;
    return typeof source === "string" && new URL(source).host === req.headers.host;
  }
  catch { return false; }
}

export async function staffFromRequest(req: Request, editorsOnly = true): Promise<Staff | null> {
  const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const authorization = req.headers.authorization;
  if (!supabaseUrl || !supabaseKey || !authorization?.startsWith("Bearer ") || authorization.length > 4096) return null;
  const headers = { apikey: supabaseKey, Authorization: authorization };
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers, signal: AbortSignal.timeout(7000) });
  if (!userResponse.ok) return null;
  const user = await userResponse.json() as { id?: string };
  if (!user.id) return null;
  const response = await fetch(`${supabaseUrl}/rest/v1/staff_access?user_id=eq.${encodeURIComponent(user.id)}&select=role`, { headers, signal: AbortSignal.timeout(7000) });
  if (!response.ok) return null;
  const rows = await response.json() as Array<{ role?: string }>;
  const role = rows[0]?.role;
  if (!role || !["admin", "coordinator", "read_only"].includes(role)) return null;
  if (editorsOnly && !["admin", "coordinator"].includes(role)) return null;
  return { id: user.id, role: role as Staff["role"] };
}

export function encryptionKey(): Buffer {
  const value = process.env.X_TOKEN_ENCRYPTION_KEY || "";
  const key = Buffer.from(value, "base64");
  if (key.length !== 32) throw new Error("X token encryption key must be 32-byte base64");
  return key;
}

export function encryptTokens(value: unknown) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString("base64url")).join(".");
}

export function decryptTokens(value: string) {
  const [ivRaw, tagRaw, ciphertextRaw] = value.split(".");
  if (!ivRaw || !tagRaw || !ciphertextRaw) throw new Error("Invalid encrypted token payload");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivRaw, "base64url"));
  decipher.setAuthTag(Buffer.from(tagRaw, "base64url"));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(ciphertextRaw, "base64url")), decipher.final()]).toString("utf8")) as {
    access_token: string; refresh_token?: string; expires_at: number; token_type?: string;
  };
}

export function signPayload(payload: string) {
  const secret = process.env.X_OAUTH_STATE_SECRET;
  if (!secret || secret.length < 32) throw new Error("OAuth state secret is not configured");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function verifySignature(payload: string, signature: string) {
  const expected = Buffer.from(signPayload(payload));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function pkceChallenge(verifier: string) { return createHash("sha256").update(verifier).digest("base64url"); }
export function randomUrlToken(bytes = 32) { return randomBytes(bytes).toString("base64url"); }

export async function readBody(req: Request) {
  if (req.body && typeof req.body === "object") return req.body as Record<string, unknown>;
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 2000) throw new Error("Request too large");
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown>;
}

export function serviceHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Supabase service role key is not configured");
  return { apikey: key, Authorization: `Bearer ${key}` };
}

export function supabaseRestUrl(path: string) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  if (!url) throw new Error("Supabase URL is not configured");
  return `${url}/rest/v1/${path}`;
}
