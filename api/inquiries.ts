import type { IncomingMessage, ServerResponse } from "node:http";

type ApiRequest = IncomingMessage & { method?: string; body?: unknown };

const services = new Set([
  "Health Screening",
  "Medical Aesthetics",
  "Rehabilitation & Recovery",
  "TCM & Integrative Care",
  "Specialist & Surgical Care",
  "Dental Care",
  "Not Sure",
]);
const destinations = new Set(["Shanghai", "Beijing", "Changchun", "Dalian", "Harbin", "Open to Options"]);
const timeframes = new Set(["Within 1–3 months", "Within 3–6 months", "Within 6–12 months", "Just exploring"]);
const contactMethods = new Set(["Email", "WhatsApp", "WeChat"]);

function respond(res: ServerResponse, status: number, body: Record<string, string>) {
  res.statusCode = status;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(body));
}

async function readJson(req: ApiRequest): Promise<unknown> {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 12_000) throw new Error("Request too large");
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLength);
}

function isOneOf(value: string, values: Set<string>) {
  return values.has(value);
}

async function notifyNewInquiry() {
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL?.trim();
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.DISCOVERY_EMAIL_FROM;
  if (!recipient || !apiKey || !from) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [recipient],
        subject: "New China Care Guide inquiry",
        text: "A visitor submitted a new inquiry. Sign in to the private admin inbox to review it: https://eversoul.ca/admin",
        html: '<p>A visitor submitted a new inquiry.</p><p><a href="https://eversoul.ca/admin">Open the private admin inbox</a> to review it.</p>',
      }),
      signal: AbortSignal.timeout(7000),
    });
  } catch { /* The inquiry is saved even if the optional email notification fails. */ }
}

export default async function handler(req: ApiRequest, res: ServerResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return respond(res, 405, { message: "Method not allowed" });
  }

  if (!req.headers["content-type"]?.includes("application/json")) {
    return respond(res, 415, { message: "Please submit the form again." });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  try {
    if (typeof origin !== "string" || !host || new URL(origin).host !== host) {
      return respond(res, 403, { message: "Please submit the form from the China Care Guide website." });
    }
  } catch {
    return respond(res, 403, { message: "Please submit the form from the China Care Guide website." });
  }

  try {
    const body = await readJson(req);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return respond(res, 400, { message: "Please check the form and try again." });
    }
    const input = body as Record<string, unknown>;

    // Quietly accept honeypot submissions without storing them.
    if (cleanText(input.website, 200)) return respond(res, 200, { message: "Inquiry received" });

    const firstName = cleanText(input.firstName, 80);
    const email = cleanText(input.email, 254).toLowerCase();
    const country = cleanText(input.country, 100);
    const service = cleanText(input.service, 80);
    const destination = cleanText(input.city, 40) || "Open to Options";
    const language = cleanText(input.language, 20) || "English";
    const timeframe = cleanText(input.timeframe, 40);
    const contactMethod = cleanText(input.contact, 20) || "Email";
    const generalQuestion = cleanText(input.question, 1200);
    const privacyConsent = input.consent === true;

    if (
      !firstName || !country || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || !isOneOf(service, services) || !isOneOf(destination, destinations)
      || !["English", "中文", "Other"].includes(language)
      || !isOneOf(timeframe, timeframes) || !isOneOf(contactMethod, contactMethods)
      || !privacyConsent
    ) {
      return respond(res, 400, { message: "Some details are missing or invalid. Please review the form." });
    }

    const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return respond(res, 503, { message: "The inquiry service is temporarily unavailable. Please try again later." });
    }

    const headers: Record<string, string> = {
      apikey: supabaseKey,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    };
    if (supabaseKey.startsWith("eyJ")) headers.Authorization = `Bearer ${supabaseKey}`;

    let response: Response;
    try {
      response = await fetch(`${supabaseUrl}/rest/v1/customer_inquiries`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          first_name: firstName,
          email,
          country,
          service,
          destination,
          language,
          timeframe,
          contact_method: contactMethod,
          general_question: generalQuestion,
          privacy_consent: true,
        }),
        signal: AbortSignal.timeout(8_000),
      });
    } catch {
      return respond(res, 502, { message: "We could not send your inquiry just now. Please try again later." });
    }

    if (!response.ok) {
      return respond(res, 502, { message: "We could not send your inquiry just now. Please try again later." });
    }
    await notifyNewInquiry();
    return respond(res, 201, { message: "Inquiry received" });
  } catch {
    return respond(res, 400, { message: "Please check the form and try again." });
  }
}
