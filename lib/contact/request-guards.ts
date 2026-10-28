import type { ContactRuntimeConfig } from "@/lib/contact/env";
import { verifyTurnstileToken } from "@/lib/contact/turnstile";

export const MIN_SUBMIT_MS = 3000;
export const MAX_BODY_BYTES = 750_000;

export type RequestMeta = {
  formStartedAt: number;
  turnstileToken?: string;
};

export async function validateRequestMeta(
  cfg: ContactRuntimeConfig,
  meta: RequestMeta,
  remoteIp: string
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const elapsed = Date.now() - meta.formStartedAt;
  if (elapsed < MIN_SUBMIT_MS) {
    return { ok: false, status: 400, error: "Form submitted too quickly." };
  }

  if (cfg.turnstileEnabled) {
    if (!meta.turnstileToken?.trim()) {
      return { ok: false, status: 400, error: "Captcha verification required." };
    }
    const valid = await verifyTurnstileToken(cfg.turnstileSecretKey!, meta.turnstileToken, remoteIp);
    if (!valid) {
      return { ok: false, status: 400, error: "Captcha verification failed." };
    }
  }

  return { ok: true };
}
