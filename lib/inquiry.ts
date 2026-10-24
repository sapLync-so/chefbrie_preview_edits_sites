const CHEF_BRIE_EMAIL = "chefbrie.01@gmail.com";

export type InquiryPayload = {
  subject: string;
  body: string;
  /** When set, included in the POST JSON for a live handler. */
  formType?: string;
};

export function buildMailtoUrl({ subject, body }: InquiryPayload): string {
  const params = new URLSearchParams({
    subject,
    body,
  });
  return `mailto:${CHEF_BRIE_EMAIL}?${params.toString()}`;
}

/**
 * Sends via `/api/chef-brie-contact` when enabled on the live site.
 * In this public preview the route returns 503; callers should fall back to mailto.
 */
export async function submitInquiry(payload: InquiryPayload): Promise<{
  ok: boolean;
  preview: boolean;
  error?: string;
}> {
  try {
    const res = await fetch("/api/chef-brie-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      preview?: boolean;
    };
    if (res.ok) {
      return { ok: true, preview: Boolean(data.preview) };
    }
    return {
      ok: false,
      preview: Boolean(data.preview) || res.status === 503,
      error: data.error ?? res.statusText,
    };
  } catch {
    return { ok: false, preview: true, error: "Network error" };
  }
}

export { CHEF_BRIE_EMAIL };
