import { z } from "zod";

const honeypotField = z
  .string()
  .optional()
  .default("")
  .refine((v) => v === "", { message: "Spam detected" });

const weekLineSchema = z.object({
  rotationLabel: z.string().min(1),
  breakfast: z.string().min(1),
  dinner: z.string().min(1),
  breakfastPrice: z.number().nonnegative(),
  dinnerPrice: z.number().nonnegative(),
});

export const mealPrepBookingSchema = z.object({
  formType: z.literal("meal-prep-booking"),
  company_website: honeypotField,
  clientName: z.string().min(1).max(200),
  emailPhone: z.string().min(3).max(320),
  dietaryRestrictions: z.string().min(1).max(8000),
  acknowledgmentName: z.string().min(1).max(200),
  signatureDate: z.string().min(1).max(32),
  signatureDataUrl: z
    .string()
    .min(1)
    .max(500_000)
    .refine((v) => v.startsWith("data:image/png;base64,"), "Invalid signature image"),
  selectedWeeks: z.array(weekLineSchema).min(1).max(52),
  subtotal: z.number().nonnegative(),
  paymentNote: z.string().max(2000).optional(),
});

export const microCateringQuoteSchema = z.object({
  formType: z.literal("micro-catering-quote"),
  company_website: honeypotField,
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(40).optional(),
  details: z.string().min(1).max(8000),
});

export const supperClubArtistSchema = z.object({
  formType: z.literal("supper-club-artist"),
  company_website: honeypotField,
  artistName: z.string().min(1).max(200),
  medium: z.string().min(1).max(200),
  location: z.string().min(1).max(200),
  contact: z.string().min(3).max(320),
  whyJoin: z.string().min(1).max(8000),
});

export const contactFormSchema = z.object({
  formType: z.literal("contact"),
  company_website: honeypotField,
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(40).optional(),
  service: z.enum(["meal-prep", "micro-catering", "tasting-popup", "other"]).optional(),
  message: z.string().min(1).max(8000),
});

export const generalBookingSchema = z.object({
  formType: z.literal("general-booking"),
  company_website: honeypotField,
  name: z.string().min(1).max(200),
  emailPhone: z.string().min(3).max(320),
  service: z.string().min(1).max(120),
  preferredDate: z.string().min(1).max(32),
  message: z.string().max(8000).optional(),
});

export const contactSubmissionSchema = z.discriminatedUnion("formType", [
  mealPrepBookingSchema,
  microCateringQuoteSchema,
  supperClubArtistSchema,
  contactFormSchema,
  generalBookingSchema,
]);

export const contactRequestSchema = contactSubmissionSchema.and(
  z.object({
    formStartedAt: z.number(),
    turnstileToken: z.string().max(4096).optional(),
  })
);

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;
export type ContactRequestBody = z.infer<typeof contactRequestSchema>;

export function parseSignatureBuffer(dataUrl: string): Buffer {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  return Buffer.from(base64, "base64");
}

export function stripRequestMeta(body: ContactRequestBody): ContactSubmission {
  const { formStartedAt: _a, turnstileToken: _b, ...submission } = body;
  return submission;
}
