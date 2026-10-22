import type { ServerResponse } from "node:http";
import { decryptTokens, encryptTokens, json, readBody, sameOrigin, serviceHeaders, staffFromRequest, supabaseRestUrl, type Request } from "../lib/x-shared";

type DraftRow = { id: string; content: string; status: string; published_post_id?: string | null };
type ConnectionRow = { username: string; encrypted_tokens: string };

export default async function handler(req: Request, res: ServerResponse) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return json(res, 405, { message: "Method not allowed" }); }
  if (!req.headers["content-type"]?.includes("application/json") || !sameOrigin(req)) return json(res, 403, { message: "Request origin is not allowed." });
  try {
    const staff = await staffFromRequest(req);
    if (!staff) return json(res, 403, { message: "Sign in as an authorized content editor first." });
    const body = await readBody(req);
    const id = typeof body.id === "string" ? body.id : "";
    if (!/^[0-9a-f-]{36}$/i.test(id)) return json(res, 400, { message: "Select a valid approved draft." });
    const headers = serviceHeaders();
    const draftUrl = supabaseRestUrl(`social_drafts?id=eq.${encodeURIComponent(id)}&select=id,content,status,published_post_id`);
    const draftResponse = await fetch(draftUrl, { headers, signal: AbortSignal.timeout(7000) });
    const drafts = await draftResponse.json() as DraftRow[];
    const draft = drafts[0];
    if (!draftResponse.ok || !draft) return json(res, 404, { message: "Draft not found." });
    if (draft.status !== "approved") return json(res, 409, { message: "Only an approved draft can be published, and each draft can only be published once." });

    // Claim before the external request so a double click cannot create duplicate posts.
    const claim = await fetch(supabaseRestUrl(`social_drafts?id=eq.${encodeURIComponent(id)}&status=eq.approved`), {
      method: "PATCH", headers: { ...headers, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ status: "publishing", published_by: staff.id }), signal: AbortSignal.timeout(7000),
    });
    const claimed = await claim.json() as DraftRow[];
    if (!claim.ok || claimed.length !== 1) return json(res, 409, { message: "This draft is already being published or was already used." });

    const connectionResponse = await fetch(supabaseRestUrl("x_account_connection?connection_key=eq.primary&select=username,encrypted_tokens"), { headers, signal: AbortSignal.timeout(7000) });
    const connections = await connectionResponse.json() as ConnectionRow[];
    const connection = connections[0];
    if (!connectionResponse.ok || !connection) {
      await fetch(supabaseRestUrl(`social_drafts?id=eq.${encodeURIComponent(id)}`), { method: "PATCH", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ status: "approved", published_by: null }) });
      return json(res, 503, { message: "Connect the approved X account before publishing." });
    }

    let tokens = decryptTokens(connection.encrypted_tokens);
    if (tokens.expires_at < Date.now() + 60_000) {
      const clientId = process.env.X_CLIENT_ID;
      const clientSecret = process.env.X_CLIENT_SECRET;
      if (!clientId || !clientSecret || !tokens.refresh_token) throw new Error("X token refresh is unavailable");
      const refresh = await fetch("https://api.x.com/2/oauth2/token", {
        method: "POST", headers: { Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: tokens.refresh_token, client_id: clientId }), signal: AbortSignal.timeout(10000),
      });
      if (!refresh.ok) throw new Error("X authorization expired");
      const next = await refresh.json() as { access_token?: string; refresh_token?: string; expires_in?: number; token_type?: string };
      if (!next.access_token) throw new Error("X token refresh failed");
      tokens = { ...tokens, ...next, expires_at: Date.now() + (next.expires_in || 7200) * 1000 };
      await fetch(supabaseRestUrl("x_account_connection?connection_key=eq.primary"), {
        method: "PATCH", headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ encrypted_tokens: encryptTokens(tokens), updated_at: new Date().toISOString() }), signal: AbortSignal.timeout(7000),
      });
    }

    let postResponse: Response;
    try {
      postResponse = await fetch("https://api.x.com/2/tweets", {
        method: "POST", headers: { Authorization: `Bearer ${tokens.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text: draft.content }), signal: AbortSignal.timeout(20_000),
      });
    } catch {
      // Keep the claim in publishing state: a timed-out request may have reached X.
      return json(res, 502, { message: "X did not confirm the result. This draft is locked to prevent duplicate posting; check the X account before retrying." });
    }
    if (!postResponse.ok) {
      await fetch(supabaseRestUrl(`social_drafts?id=eq.${encodeURIComponent(id)}`), { method: "PATCH", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ status: "approved", published_by: null }) });
      return json(res, 502, { message: "X rejected the post. The approved draft is available to retry after checking the connection." });
    }
    const posted = await postResponse.json() as { data?: { id?: string } };
    if (!posted.data?.id) return json(res, 502, { message: "X returned an incomplete result. Check the account before retrying this locked draft." });
    const saved = await fetch(supabaseRestUrl(`social_drafts?id=eq.${encodeURIComponent(id)}`), {
      method: "PATCH", headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published", published_post_id: posted.data.id, published_at: new Date().toISOString(), published_by: staff.id }), signal: AbortSignal.timeout(7000),
    });
    if (!saved.ok) return json(res, 502, { message: `Post was created on X as ${connection.username}, but its status could not be saved. Check the account before taking further action.` });
    return json(res, 200, { username: connection.username, postId: posted.data.id });
  } catch {
    return json(res, 503, { message: "X publishing is not configured or temporarily unavailable." });
  }
}
