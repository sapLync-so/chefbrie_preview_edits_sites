import { Client } from "@notionhq/client";
import type { ContactSubmission } from "@/lib/contact/schemas";
import type { ContactRuntimeConfig } from "@/lib/contact/env";

export const NOTION_FORM_TYPES = {
  "meal-prep-booking": "Meal Prep Intake",
  contact: "Contact",
  "micro-catering-quote": "Quote Request",
  "supper-club-artist": "Artist Application",
  "general-booking": "Booking",
} as const;

type NotionFormType = (typeof NOTION_FORM_TYPES)[keyof typeof NOTION_FORM_TYPES];

function rt(text: string | undefined | null) {
  if (!text?.trim()) return { rich_text: [] as { text: { content: string } }[] };
  return { rich_text: [{ text: { content: text.slice(0, 2000) } }] };
}

function title(text: string) {
  return { title: [{ text: { content: text.slice(0, 2000) } }] };
}

function submissionTitle(submission: ContactSubmission): string {
  switch (submission.formType) {
    case "meal-prep-booking":
      return submission.clientName;
    case "micro-catering-quote":
    case "contact":
      return submission.name;
    case "supper-club-artist":
      return submission.artistName;
    case "general-booking":
      return submission.name;
  }
}

function pageBodyParagraphs(submission: ContactSubmission): string[] {
  switch (submission.formType) {
    case "meal-prep-booking":
      return [
        submission.dietaryRestrictions,
        ...submission.selectedWeeks.map(
          (w) =>
            `${w.rotationLabel}: Breakfast — ${w.breakfast}; Dinner — ${w.dinner} ($${w.breakfastPrice + w.dinnerPrice})`
        ),
        submission.paymentNote ?? "",
      ].filter(Boolean);
    case "micro-catering-quote":
      return [submission.details, submission.phone ? `Phone: ${submission.phone}` : ""].filter(Boolean);
    case "supper-club-artist":
      return [
        `Medium: ${submission.medium}`,
        `Location: ${submission.location}`,
        `Contact: ${submission.contact}`,
        submission.whyJoin,
      ];
    case "contact":
      return [
        submission.message,
        submission.phone ? `Phone: ${submission.phone}` : "",
        submission.service ? `Service interest: ${submission.service}` : "",
      ].filter(Boolean);
    case "general-booking":
      return [
        `Service: ${submission.service}`,
        `Preferred date: ${submission.preferredDate}`,
        submission.message ?? "",
      ].filter(Boolean);
  }
}

function notionProperties(
  submission: ContactSubmission,
  signatureReference: string,
  submittedAtIso: string
): Record<string, unknown> {
  const formTypeName: NotionFormType = NOTION_FORM_TYPES[submission.formType] ?? "Other";

  const base: Record<string, unknown> = {
    Name: title(submissionTitle(submission)),
    "Form Type": { select: { name: formTypeName } },
    "Submitted At": { date: { start: submittedAtIso } },
    "Signature Reference": rt(signatureReference),
  };

  if (submission.formType === "meal-prep-booking") {
    return {
      ...base,
      "Email or Phone": rt(submission.emailPhone),
      Allergies: rt(submission.dietaryRestrictions),
      "Acknowledgment Name": rt(submission.acknowledgmentName),
      "Signature Date": submission.signatureDate
        ? { date: { start: submission.signatureDate } }
        : { date: null },
      "Weeks Picked": rt(
        submission.selectedWeeks
          .map((w) => `${w.rotationLabel}: ${w.breakfast} / ${w.dinner}`)
          .join(" | ")
      ),
      Subtotal: { number: submission.subtotal },
      "Payment Note": rt(submission.paymentNote),
    };
  }

  if (submission.formType === "contact") {
    return {
      ...base,
      "Email or Phone": rt([submission.email, submission.phone].filter(Boolean).join(" · ")),
      Allergies: rt(""),
      "Acknowledgment Name": rt(""),
      "Signature Date": { date: null },
      "Weeks Picked": rt(""),
      Subtotal: { number: null },
      "Payment Note": rt(""),
    };
  }

  if (submission.formType === "micro-catering-quote") {
    return {
      ...base,
      "Email or Phone": rt([submission.email, submission.phone].filter(Boolean).join(" · ")),
      Allergies: rt(""),
      "Acknowledgment Name": rt(""),
      "Signature Date": { date: null },
      "Weeks Picked": rt(""),
      Subtotal: { number: null },
      "Payment Note": rt(""),
    };
  }

  if (submission.formType === "supper-club-artist") {
    return {
      ...base,
      "Email or Phone": rt(submission.contact),
      Allergies: rt(""),
      "Acknowledgment Name": rt(""),
      "Signature Date": { date: null },
      "Weeks Picked": rt(""),
      Subtotal: { number: null },
      "Payment Note": rt(""),
    };
  }

  return {
    ...base,
    "Email or Phone": rt(submission.emailPhone),
    Allergies: rt(""),
    "Acknowledgment Name": rt(""),
    "Signature Date": { date: null },
    "Weeks Picked": rt(""),
    Subtotal: { number: null },
    "Payment Note": rt(""),
  };
}

export async function logSubmissionToNotion(
  cfg: ContactRuntimeConfig,
  submission: ContactSubmission,
  signatureReference: string
): Promise<{ ok: boolean; error?: string }> {
  if (!cfg.notionEnabled || !cfg.notionToken || !cfg.notionDatabaseId) {
    return { ok: false, error: "Notion not configured" };
  }

  const submittedAtIso = new Date().toISOString();
  const notion = new Client({ auth: cfg.notionToken });

  const children = pageBodyParagraphs(submission).map((paragraph) => ({
    object: "block" as const,
    type: "paragraph" as const,
    paragraph: {
      rich_text: [{ type: "text" as const, text: { content: paragraph.slice(0, 2000) } }],
    },
  }));

  try {
    await notion.pages.create({
      parent: { database_id: cfg.notionDatabaseId },
      properties: notionProperties(submission, signatureReference, submittedAtIso) as never,
      children: children.length > 0 ? children : undefined,
    });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Notion create failed";
    console.error("[contact] Notion failed:", message);
    return { ok: false, error: message };
  }
}
