import { formatMealPrepWeekParts, mealPrepWeekLineTotal } from "@/lib/meal-prep-lines";

/** Default mailto recipient — must stay chefbrie.01@gmail.com (server uses CHEF_BRIE_NOTIFY_EMAIL). */
const CHEF_BRIE_EMAIL = "chefbrie.01@gmail.com";

export type InquiryPayload = {
  subject: string;
  body: string;
  formType?: string;
};

export type ContactSubmitPayload =
  | {
      formType: "meal-prep-booking";
      company_website?: string;
      clientName: string;
      emailPhone: string;
      dietaryRestrictions: string;
      acknowledgmentName: string;
      signatureDate: string;
      signatureDataUrl: string;
      selectedWeeks: {
        rotationLabel: string;
        breakfast?: string;
        dinner?: string;
        breakfastPrice?: number;
        dinnerPrice?: number;
        breakfastQuantity?: number;
        dinnerQuantity?: number;
      }[];
      subtotal: number;
      salesTax?: number;
      estimatedTotal?: number;
      breakfastServiceSelected?: boolean;
      dinnerServiceSelected?: boolean;
      paymentNote?: string;
    }
  | {
      formType: "meal-prep-custom-menu";
      company_website?: string;
      name: string;
      email: string;
      phone: string;
      request: string;
    }
  | {
      formType: "micro-catering-quote";
      company_website?: string;
      name: string;
      email: string;
      phone?: string;
      details: string;
    }
  | {
      formType: "supper-club-artist";
      company_website?: string;
      artistName: string;
      medium: string;
      location: string;
      contact: string;
      whyJoin: string;
    }
  | {
      formType: "contact";
      company_website?: string;
      name: string;
      email: string;
      phone?: string;
      service?: string;
      message: string;
    }
  | {
      formType: "general-booking";
      company_website?: string;
      name: string;
      emailPhone: string;
      service: string;
      preferredDate: string;
      message?: string;
    };

export function buildMailtoUrl({ subject, body }: InquiryPayload): string {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${CHEF_BRIE_EMAIL}?${params.toString()}`;
}

export function buildMailtoFromContact(payload: ContactSubmitPayload): InquiryPayload {
  if (payload.formType === "meal-prep-booking") {
    const weeks = payload.selectedWeeks
      .map((w) => {
        const parts = formatMealPrepWeekParts(w);
        return `${w.rotationLabel}: ${parts.join("; ")} ($${mealPrepWeekLineTotal(w).toFixed(2)})`;
      })
      .join("\n");
    const totals =
      payload.salesTax != null && payload.estimatedTotal != null
        ? [
            `Estimated subtotal: $${payload.subtotal.toFixed(2)}`,
            `Estimated NJ sales tax (6.6%): $${payload.salesTax.toFixed(2)}`,
            `Estimated total: $${payload.estimatedTotal.toFixed(2)}`,
          ]
        : [`Estimated subtotal: $${payload.subtotal.toFixed(2)}`];
    return {
      subject: `Meal prep booking — ${payload.clientName}`,
      body: [
        `Client: ${payload.clientName}`,
        `Email/Phone: ${payload.emailPhone}`,
        "",
        payload.dietaryRestrictions,
        "",
        weeks,
        "",
        ...totals,
      ].join("\n"),
      formType: payload.formType,
    };
  }
  if (payload.formType === "meal-prep-custom-menu") {
    return {
      subject: `Meal prep — custom menu request — ${payload.name}`,
      body: [
        "Custom menu request (meal prep booking flow)",
        "",
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Phone: ${payload.phone}`,
        "",
        "What they would like:",
        payload.request,
      ].join("\n"),
      formType: payload.formType,
    };
  }
  if (payload.formType === "micro-catering-quote") {
    return {
      subject: "Micro-Catering quote request",
      body: [`Name: ${payload.name}`, `Email: ${payload.email}`, payload.phone ?? "", payload.details]
        .filter(Boolean)
        .join("\n"),
      formType: payload.formType,
    };
  }
  if (payload.formType === "contact") {
    return {
      subject: `Website contact — ${payload.name}`,
      body: [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        payload.phone ?? "",
        payload.service ? `Service: ${payload.service}` : "",
        "",
        payload.message,
      ]
        .filter(Boolean)
        .join("\n"),
      formType: payload.formType,
    };
  }
  if (payload.formType === "general-booking") {
    return {
      subject: `Booking request — ${payload.name}`,
      body: [
        `Name: ${payload.name}`,
        `Contact: ${payload.emailPhone}`,
        `Service: ${payload.service}`,
        `Date: ${payload.preferredDate}`,
        payload.message ?? "",
      ]
        .filter(Boolean)
        .join("\n"),
      formType: payload.formType,
    };
  }
  return {
    subject: "Supper Club artist application",
    body: [
      `Artist: ${payload.artistName}`,
      `Medium: ${payload.medium}`,
      `Location: ${payload.location}`,
      `Contact: ${payload.contact}`,
      payload.whyJoin,
    ].join("\n"),
    formType: payload.formType,
  };
}

export type SubmitContactMeta = {
  formStartedAt: number;
  turnstileToken?: string;
};

export async function submitContact(
  payload: ContactSubmitPayload,
  meta?: SubmitContactMeta
): Promise<{
  ok: boolean;
  preview: boolean;
  error?: string;
}> {
  try {
    const res = await fetch("/api/chef-brie-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        company_website: payload.company_website ?? "",
        formStartedAt: meta?.formStartedAt,
        turnstileToken: meta?.turnstileToken,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      preview?: boolean;
      ok?: boolean;
    };
    if (res.ok && data.ok) {
      return { ok: true, preview: false };
    }
    if (res.status === 503 || data.preview) {
      return { ok: false, preview: true, error: data.error };
    }
    return { ok: false, preview: false, error: data.error ?? res.statusText };
  } catch {
    return { ok: false, preview: true, error: "Network error" };
  }
}

export { CHEF_BRIE_EMAIL };
