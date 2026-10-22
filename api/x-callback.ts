import type { IncomingMessage, ServerResponse } from "node:http";
import { encryptTokens, redirect, serviceHeaders, signPayload, supabaseRestUrl, verifySignature } from "../lib/x-shared";

type CallbackRequest = IncomingMessage & { method?: string };

function cookieValue(header: string | undefined, name: string) {
  return header?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1) || "";
}

function finish(res: ServerResponse, result: "connected" | "error") {
  res.setHeader("Set-Cookie", "x_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/api/x-callback; Max-Age=0");
  const site = process.env.VITE_SITE_URL || "https://eversoul.ca";
  redirect(res, `${site.replace(/\/$/, "")}/admin?x=${result}`);
}

export default async function handler(req: CallbackRequest, res: ServerResponse) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); res.statusCode = 405; return res.end(); }
  try {
    const url = new URL(req.url || "/", `https://${req.headers.host}`);
    if (url.searchParams.get("error")) return finish(res, "error");
    const code = url.searchParams.get("code") || "";
    const returnedState = url.searchParams.get("state") || "";
    const saved = cookieValue(req.headers.cookie, "x_oauth_state");
    const dot = saved.lastIndexOf(".");
    if (!code || !returnedState || dot < 1) return finish(res, "error");
    const payload = saved.slice(0, dot);
    const signature = saved.slice(dot + 1);
    if (!verifySignature(payload, signature)) return finish(res, "error");
    const state = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { state: string; verifier: string; staffId: string; exp: number };
    if (!state.state || returnedState !== state.state || state.exp < Date.now()) return finish(res, "error");

    const headers = serviceHeaders();
    const staffResponse = await fetch(supabaseRestUrl(`staff_access?user_id=eq.${encodeURIComponent(state.staffId)}&select=role`), { headers, signal: AbortSignal.timeout(7000) });
    const staffRows = await staffResponse.json() as Array<{ role?: string }>;
    if (!staffResponse.ok || !staffRows.some(({ role }) => role === "admin" || role === "coordinator")) return finish(res, "error");

    const clientId = process.env.X_CLIENT_ID;
    const clientSecret = process.env.X_CLIENT_SECRET;
    if (!clientId || !clientSecret) return finish(res, "error");
    const tokenBody = new URLSearchParams({
      grant_type: "authorization_code", code, redirect_uri: `https://${req.headers.host}/api/x-callback`,
      code_verifier: state.verifier, client_id: clientId,
    });
    const tokenResponse = await fetch("https://api.x.com/2/oauth2/token", {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenBody,
      signal: AbortSignal.timeout(10000),
    });
    if (!tokenResponse.ok) return finish(res, "error");
    const tokens = await tokenResponse.json() as { access_token?: string; refresh_token?: string; expires_in?: number; token_type?: string };
    if (!tokens.access_token || !tokens.refresh_token) return finish(res, "error");
    const meResponse = await fetch("https://api.x.com/2/users/me", { headers: { Authorization: `Bearer ${tokens.access_token}` }, signal: AbortSignal.timeout(7000) });
    if (!meResponse.ok) return finish(res, "error");
    const me = await meResponse.json() as { data?: { username?: string } };
    const username = me.data?.username?.toLowerCase();
    const expected = (process.env.X_EXPECTED_USERNAME || "iecnvan").replace(/^@/, "").toLowerCase();
    if (!username || username !== expected) return finish(res, "error");

    const storedTokens = { ...tokens, expires_at: Date.now() + (tokens.expires_in || 7200) * 1000 };
    const saveResponse = await fetch(supabaseRestUrl("x_account_connection"), {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ connection_key: "primary", username, encrypted_tokens: encryptTokens(storedTokens), updated_at: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!saveResponse.ok) return finish(res, "error");
    return finish(res, "connected");
  } catch {
    return finish(res, "error");
  }
}
