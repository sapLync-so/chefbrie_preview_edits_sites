import { NextResponse } from "next/server";
import { getContactRuntimeConfig, isContactHandlerConfigured } from "@/lib/contact/env";
import { processContactSubmission } from "@/lib/contact/process-submission";
import { checkRateLimit, clientIpFromRequest } from "@/lib/contact/rate-limit";
import { MAX_BODY_BYTES, validateRequestMeta } from "@/lib/contact/request-guards";
import { contactRequestSchema, stripRequestMeta } from "@/lib/contact/schemas";

export async function GET() {
  const configured = isContactHandlerConfigured();
  return NextResponse.json({
    enabled: configured,
    preview: !configured,
    turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? null,
  });
}

export async function POST(request: Request) {
  const cfg = getContactRuntimeConfig();

  if (!isContactHandlerConfigured()) {
    return NextResponse.json(
      {
        error: "Contact form is disabled in this client preview.",
        preview: true,
      },
      { status: 503 }
    );
  }

  const ip = clientIpFromRequest(request);
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: rate.retryAfterMs ? { "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000)) } : {},
      }
    );
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contactRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const metaGuard = await validateRequestMeta(
    cfg,
    {
      formStartedAt: parsed.data.formStartedAt,
      turnstileToken: parsed.data.turnstileToken,
    },
    ip
  );
  if (!metaGuard.ok) {
    return NextResponse.json({ error: metaGuard.error }, { status: metaGuard.status });
  }

  const submission = stripRequestMeta(parsed.data);
  const result = await processContactSubmission(cfg, submission);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error ?? "Submission failed", details: result.details },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, details: result.details });
}
