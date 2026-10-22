import type { ServerResponse } from "node:http";
import { json, pkceChallenge, randomUrlToken, sameOrigin, signPayload, staffFromRequest, type Request } from "../lib/x-shared";

export default async function handler(req: Request, res: ServerResponse) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return json(res, 405, { message: "Method not allowed" }); }
  if (!sameOrigin(req)) return json(res, 403, { message: "Request origin is not allowed." });
  try {
    const staff = await staffFromRequest(req);
    if (!staff) return json(res, 403, { message: "Sign in as an authorized content editor first." });
    const clientId = process.env.X_CLIENT_ID;
    const origin = `https://${req.headers.host}`;
    const redirectUri = `${origin}/api/x-callback`;
    if (!clientId) return json(res, 503, { message: "X developer app settings are not configured yet." });
    const state = randomUrlToken();
    const verifier = randomUrlToken(48);
    const payload = Buffer.from(JSON.stringify({ state, verifier, staffId: staff.id, exp: Date.now() + 10 * 60 * 1000 })).toString("base64url");
    const signature = signPayload(payload);
    res.setHeader("Set-Cookie", `x_oauth_state=${payload}.${signature}; HttpOnly; Secure; SameSite=Lax; Path=/api/x-callback; Max-Age=600`);
    const authorize = new URL("https://x.com/i/oauth2/authorize");
    authorize.search = new URLSearchParams({
      response_type: "code", client_id: clientId, redirect_uri: redirectUri,
      scope: "tweet.read tweet.write users.read offline.access", state,
      code_challenge: pkceChallenge(verifier), code_challenge_method: "S256",
    }).toString();
    return json(res, 200, { authorizeUrl: authorize.toString() });
  } catch {
    return json(res, 503, { message: "X authorization is not configured yet." });
  }
}
