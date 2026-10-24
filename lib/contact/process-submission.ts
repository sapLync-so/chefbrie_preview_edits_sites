import { logSubmissionToNotion } from "@/lib/contact/notion-log";
import { sendContactEmail } from "@/lib/contact/email";
import { storeSubmissionInSupabase } from "@/lib/contact/supabase-store";
import type { ContactRuntimeConfig } from "@/lib/contact/env";
import type { ContactSubmission } from "@/lib/contact/schemas";

export type ProcessSubmissionResult = {
  ok: boolean;
  preview?: boolean;
  error?: string;
  details?: {
    supabase?: boolean;
    email?: boolean;
    notion?: boolean;
  };
};

export async function processContactSubmission(
  cfg: ContactRuntimeConfig,
  submission: ContactSubmission
): Promise<ProcessSubmissionResult> {
  if (!cfg.emailEnabled && !cfg.notionEnabled && !cfg.supabaseEnabled) {
    return {
      ok: false,
      preview: true,
      error: "Contact handler not configured",
    };
  }

  const supabaseResult = cfg.supabaseEnabled
    ? await storeSubmissionInSupabase(cfg, submission)
    : { ok: false as boolean, error: "Supabase not configured" };

  if (!supabaseResult.ok && supabaseResult.error && supabaseResult.error !== "Supabase not configured") {
    console.error("[contact] Supabase step:", supabaseResult.error);
  }

  const signatureReference =
    supabaseResult.signaturePath ??
    (submission.formType === "meal-prep-booking" ? "captured in email" : "");

  const emailResult = await sendContactEmail(cfg, submission);
  if (!emailResult.ok && emailResult.error !== "Email not configured") {
    console.error("[contact] Email step:", emailResult.error);
  }

  const notionResult = await logSubmissionToNotion(cfg, submission, signatureReference);
  if (!notionResult.ok && notionResult.error !== "Notion not configured") {
    console.error("[contact] Notion step:", notionResult.error);
  }

  const emailSucceeded = emailResult.ok;
  const notionSucceeded = notionResult.ok;
  const supabaseSucceeded = supabaseResult.ok;

  if (emailSucceeded || notionSucceeded || supabaseSucceeded) {
    return {
      ok: true,
      details: {
        supabase: supabaseSucceeded,
        email: emailSucceeded,
        notion: notionSucceeded,
      },
    };
  }

  return {
    ok: false,
    error: emailResult.error ?? notionResult.error ?? supabaseResult.error ?? "Submission failed",
    details: {
      supabase: supabaseSucceeded,
      email: emailSucceeded,
      notion: notionSucceeded,
    },
  };
}
