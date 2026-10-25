import { createClient } from "@supabase/supabase-js";
import type { ContactSubmission } from "@/lib/contact/schemas";
import { parseSignatureBuffer } from "@/lib/contact/schemas";
import type { ContactRuntimeConfig } from "@/lib/contact/env";

export type SupabaseStoreResult = {
  ok: boolean;
  submissionId?: string;
  signaturePath?: string;
  error?: string;
};

function submissionRow(submission: ContactSubmission, signaturePath: string | null) {
  const base = {
    form_type: submission.formType,
    signature_storage_path: signaturePath,
    raw_json: submission,
  };

  if (submission.formType === "meal-prep-booking") {
    return {
      ...base,
      name: submission.clientName,
      email_phone: submission.emailPhone,
      allergies_dietary: submission.dietaryRestrictions,
      acknowledgment_name: submission.acknowledgmentName,
      signature_date: submission.signatureDate,
      weeks_picked: submission.selectedWeeks,
      subtotal: submission.subtotal,
      payment_note: submission.paymentNote ?? null,
      message: null,
    };
  }

  if (submission.formType === "meal-prep-custom-menu") {
    return {
      ...base,
      name: submission.name,
      email_phone: [submission.email, submission.phone].filter(Boolean).join(" · "),
      allergies_dietary: null,
      acknowledgment_name: null,
      signature_date: null,
      weeks_picked: null,
      subtotal: null,
      payment_note: "Custom menu request",
      message: submission.request,
    };
  }

  if (submission.formType === "micro-catering-quote") {
    return {
      ...base,
      name: submission.name,
      email_phone: submission.email,
      allergies_dietary: null,
      acknowledgment_name: null,
      signature_date: null,
      weeks_picked: null,
      subtotal: null,
      payment_note: null,
      message: [submission.details, submission.phone ? `Phone: ${submission.phone}` : ""].filter(Boolean).join("\n"),
    };
  }

  if (submission.formType === "contact") {
    return {
      ...base,
      name: submission.name,
      email_phone: [submission.email, submission.phone].filter(Boolean).join(" · "),
      allergies_dietary: null,
      acknowledgment_name: null,
      signature_date: null,
      weeks_picked: null,
      subtotal: null,
      payment_note: null,
      message: [submission.message, submission.service ? `Service: ${submission.service}` : ""]
        .filter(Boolean)
        .join("\n"),
    };
  }

  if (submission.formType === "general-booking") {
    return {
      ...base,
      name: submission.name,
      email_phone: submission.emailPhone,
      allergies_dietary: null,
      acknowledgment_name: null,
      signature_date: null,
      weeks_picked: null,
      subtotal: null,
      payment_note: null,
      message: [`Service: ${submission.service}`, `Preferred date: ${submission.preferredDate}`, submission.message ?? ""]
        .filter(Boolean)
        .join("\n"),
    };
  }

  return {
    ...base,
    name: submission.artistName,
    email_phone: submission.contact,
    allergies_dietary: null,
    acknowledgment_name: null,
    signature_date: null,
    weeks_picked: null,
    subtotal: null,
    payment_note: null,
    message: [`Medium: ${submission.medium}`, `Location: ${submission.location}`, submission.whyJoin].join("\n"),
  };
}

export async function storeSubmissionInSupabase(
  cfg: ContactRuntimeConfig,
  submission: ContactSubmission
): Promise<SupabaseStoreResult> {
  if (!cfg.supabaseEnabled || !cfg.supabaseUrl || !cfg.supabaseServiceRoleKey) {
    return { ok: false, error: "Supabase not configured" };
  }

  const supabase = createClient(cfg.supabaseUrl, cfg.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let signaturePath: string | null = null;

  if (submission.formType === "meal-prep-booking") {
    const id = crypto.randomUUID();
    signaturePath = `meal-prep/${id}.png`;
    const buffer = parseSignatureBuffer(submission.signatureDataUrl);
    const { error: uploadError } = await supabase.storage.from("signatures").upload(signaturePath, buffer, {
      contentType: "image/png",
      upsert: false,
    });
    if (uploadError) {
      console.error("[contact] Supabase signature upload failed:", uploadError.message);
      signaturePath = null;
    }
  }

  const row = submissionRow(submission, signaturePath);
  const { data, error } = await supabase
    .from("submissions")
    .insert(row as Record<string, unknown>)
    .select("id")
    .single();

  if (error) {
    console.error("[contact] Supabase insert failed:", error.message);
    return {
      ok: Boolean(signaturePath),
      signaturePath: signaturePath ?? undefined,
      error: error.message,
    };
  }

  return {
    ok: true,
    submissionId: data.id as string,
    signaturePath: signaturePath ?? undefined,
  };
}
