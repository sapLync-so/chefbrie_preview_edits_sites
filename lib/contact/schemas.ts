import { z } from "zod";
import { MEAL_PREP_MIN_ORDER } from "@/lib/meal-prep-order";

const honeypotField = z
  .string()
  .optional()
  .default("")
  .refine((v) => v === "", { message: "Spam detected" });

const weekLineSchema = z
  .object({
    rotationLabel: z.string().min(1),
    breakfast: z.string().min(1).optional(),
    dinner: z.string().min(1).optional(),
    breakfastPrice: z.number().nonnegative().optional(),
    dinnerPrice: z.number().nonnegative().optional(),
    breakfastQuantity: z.number().int().min(1).max(99).optional(),
    dinnerQuantity: z.number().int().min(1).max(99).optional(),
  })
  .refine(
    (w) =>
      (w.breakfast != null && w.breakfastPrice != null && (w.breakfastQuantity ?? 1) >= 1) ||
      (w.dinner != null && w.dinnerPrice != null && (w.dinnerQuantity ?? 1) >= 1),
    { message: "Each week must include at least one meal" }
  );

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
  subtotal: z.number().min(MEAL_PREP_MIN_ORDER, {
    message: `Orders require a $${MEAL_PREP_MIN_ORDER} minimum (pre-tax subtotal).`,
  }),
  salesTax: z.number().nonnegative().optional(),
  estimatedTotal: z.number().nonnegative().optional(),
  breakfastServiceSelected: z.boolean().optional(),
  dinnerServiceSelected: z.boolean().optional(),
  paymentNote: z.string().max(2000).optional(),
});

export const mealPrepCustomMenuSchema = z.object({
  formType: z.literal("meal-prep-custom-menu"),
  company_website: honeypotField,
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().min(1).max(40),
  request: z.string().min(1).max(8000),
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
  mealPrepCustomMenuSchema,
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
