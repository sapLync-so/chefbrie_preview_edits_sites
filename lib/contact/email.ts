import { Resend } from "resend";
import type { ContactSubmission } from "@/lib/contact/schemas";
import { parseSignatureBuffer } from "@/lib/contact/schemas";
import type { ContactRuntimeConfig } from "@/lib/contact/env";

function subjectFor(submission: ContactSubmission): string {
  switch (submission.formType) {
    case "meal-prep-booking":
      return `Meal prep booking — ${submission.clientName}`;
    case "micro-catering-quote":
      return `Micro-Catering quote request — ${submission.name}`;
    case "supper-club-artist":
      return `Supper Club artist application — ${submission.artistName}`;
    case "contact":
      return `Website contact — ${submission.name}`;
    case "general-booking":
      return `Booking request — ${submission.name}`;
  }
}

function extractReplyTo(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const trimmed = value.trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/[^\s,]+@[^\s,]+\.[^\s,]+/);
  return match?.[0];
}

function submitterReplyTo(submission: ContactSubmission): string | undefined {
  switch (submission.formType) {
    case "contact":
    case "micro-catering-quote":
      return submission.email;
    case "meal-prep-booking":
      return extractReplyTo(submission.emailPhone);
    case "general-booking":
      return extractReplyTo(submission.emailPhone);
    case "supper-club-artist":
      return extractReplyTo(submission.contact);
  }
}

function plainTextHeader(submission: ContactSubmission): string[] {
  return [`Form: ${submission.formType}`, ""];
}

function joinPlainBody(header: string[], lines: string[]): string {
  return [...header, ...lines].join("\n");
}

function plainTextBody(submission: ContactSubmission): string {
  const header = plainTextHeader(submission);

  if (submission.formType === "meal-prep-booking") {
    return joinPlainBody(header, [
      `Client: ${submission.clientName}`,
      `Email/Phone: ${submission.emailPhone}`,
      "",
      "Allergies & dietary:",
      submission.dietaryRestrictions,
      "",
      `Acknowledgment name: ${submission.acknowledgmentName}`,
      `Signature date: ${submission.signatureDate}`,
      "",
      "Weeks:",
      ...submission.selectedWeeks.map(
        (w) =>
          `- ${w.rotationLabel}: ${w.breakfast} / ${w.dinner} (subtotal items $${w.breakfastPrice + w.dinnerPrice})`
      ),
      "",
      `Estimated subtotal: $${submission.subtotal.toFixed(2)}`,
      ...(submission.paymentNote ? ["", submission.paymentNote] : []),
      "",
      "Signature PNG attached.",
    ]);
  }

  if (submission.formType === "micro-catering-quote") {
    return joinPlainBody(header, [
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      ...(submission.phone ? [`Phone: ${submission.phone}`] : []),
      "",
      submission.details,
    ]);
  }

  if (submission.formType === "contact") {
    return joinPlainBody(header, [
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      ...(submission.phone ? [`Phone: ${submission.phone}`] : []),
      ...(submission.service ? [`Service: ${submission.service}`] : []),
      "",
      submission.message,
    ]);
  }

  if (submission.formType === "general-booking") {
    return joinPlainBody(header, [
      `Name: ${submission.name}`,
      `Contact: ${submission.emailPhone}`,
      `Service: ${submission.service}`,
      `Preferred date: ${submission.preferredDate}`,
      ...(submission.message ? ["", submission.message] : []),
    ]);
  }

  return joinPlainBody(header, [
    `Artist: ${submission.artistName}`,
    `Medium: ${submission.medium}`,
    `Location: ${submission.location}`,
    `Contact: ${submission.contact}`,
    "",
    submission.whyJoin,
  ]);
}

function htmlBody(submission: ContactSubmission): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");

  const gold = "#c9a96e";
  const wrap = (title: string, body: string) =>
    `<div style="font-family:Georgia,serif;background:#0d0d0d;color:#f5f0e8;padding:24px;max-width:640px"><p style="color:${gold};letter-spacing:0.2em;text-transform:uppercase;font-size:11px">Chef Brie</p><h1 style="font-weight:300;font-size:22px">${esc(title)}</h1><div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#f5f0e8cc">${body}</div></div>`;

  if (submission.formType === "meal-prep-booking") {
    const weeks = submission.selectedWeeks
      .map(
        (w) =>
          `<li><strong>${esc(w.rotationLabel)}</strong><br/>Breakfast: ${esc(w.breakfast)}<br/>Dinner: ${esc(w.dinner)}</li>`
      )
      .join("");
    return wrap(
      subjectFor(submission),
      `<p><strong>Client:</strong> ${esc(submission.clientName)}<br/><strong>Contact:</strong> ${esc(submission.emailPhone)}</p><p><strong>Dietary:</strong><br/>${esc(submission.dietaryRestrictions)}</p><p><strong>Acknowledgment:</strong> ${esc(submission.acknowledgmentName)} · ${esc(submission.signatureDate)}</p><ul>${weeks}</ul><p><strong>Estimated subtotal:</strong> $${submission.subtotal.toFixed(2)}</p><p>Signature PNG attached.</p>`
    );
  }

  if (submission.formType === "micro-catering-quote") {
    return wrap(
      subjectFor(submission),
      `<p><strong>${esc(submission.name)}</strong><br/>${esc(submission.email)}${submission.phone ? `<br/>${esc(submission.phone)}` : ""}</p><p>${esc(submission.details)}</p>`
    );
  }

  if (submission.formType === "contact") {
    return wrap(
      subjectFor(submission),
      `<p><strong>${esc(submission.name)}</strong><br/>${esc(submission.email)}${submission.phone ? `<br/>${esc(submission.phone)}` : ""}${submission.service ? `<br/>Service: ${esc(submission.service)}` : ""}</p><p>${esc(submission.message)}</p>`
    );
  }

  if (submission.formType === "general-booking") {
    return wrap(
      subjectFor(submission),
      `<p><strong>${esc(submission.name)}</strong><br/>${esc(submission.emailPhone)}</p><p><strong>Service:</strong> ${esc(submission.service)}<br/><strong>Date:</strong> ${esc(submission.preferredDate)}</p><p>${esc(submission.message ?? "")}</p>`
    );
  }

  return wrap(
    subjectFor(submission),
    `<p><strong>${esc(submission.artistName)}</strong> · ${esc(submission.medium)} · ${esc(submission.location)}</p><p>${esc(submission.contact)}</p><p>${esc(submission.whyJoin)}</p>`
  );
}

export async function sendContactEmail(
  cfg: ContactRuntimeConfig,
  submission: ContactSubmission
): Promise<{ ok: boolean; error?: string; resendEmailId?: string }> {
  if (!cfg.emailEnabled || !cfg.resendApiKey || !cfg.resendFromEmail) {
    return { ok: false, error: "Email not configured" };
  }

  const resend = new Resend(cfg.resendApiKey);
  const attachments =
    submission.formType === "meal-prep-booking"
      ? [
          {
            filename: `signature-${submission.clientName.replace(/[^a-z0-9-_]/gi, "_")}.png`,
            content: parseSignatureBuffer(submission.signatureDataUrl),
          },
        ]
      : undefined;

  const replyTo = submitterReplyTo(submission);

  const { data, error } = await resend.emails.send({
    from: cfg.resendFromEmail,
    to: cfg.notifyEmail,
    ...(replyTo ? { replyTo } : {}),
    subject: subjectFor(submission),
    text: plainTextBody(submission),
    html: htmlBody(submission),
    attachments,
  });

  if (error) {
    console.error("[contact] Resend failed:", error.message);
    return { ok: false, error: error.message };
  }

  if (data?.id) {
    console.info("[contact] Resend sent", { formType: submission.formType, resendEmailId: data.id });
  }

  return { ok: true, resendEmailId: data?.id };
}
