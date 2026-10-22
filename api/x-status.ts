import type { ServerResponse } from "node:http";
import { json, sameOrigin, serviceHeaders, staffFromRequest, supabaseRestUrl, type Request } from "../lib/x-shared";

export default async function handler(req: Request, res: ServerResponse) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return json(res, 405, { message: "Method not allowed" }); }
  if (!sameOrigin(req)) return json(res, 403, { message: "Request origin is not allowed." });
  try {
    if (!await staffFromRequest(req)) return json(res, 403, { message: "Authorized staff only." });
    const response = await fetch(supabaseRestUrl("x_account_connection?connection_key=eq.primary&select=username,connected_at"), { headers: serviceHeaders(), signal: AbortSignal.timeout(7000) });
    if (!response.ok) return json(res, 503, { message: "Connection status is unavailable." });
    const rows = await response.json() as Array<{ username: string; connected_at: string }>;
    return json(res, 200, { connected: Boolean(rows[0]), username: rows[0]?.username, connectedAt: rows[0]?.connected_at });
  } catch { return json(res, 503, { message: "X connection is not configured yet." }); }
}
