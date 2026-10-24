export type MealPrepIntakeData = {
  clientName: string;
  emailPhone: string;
  dietaryRestrictions: string;
  acknowledgmentName: string;
  signatureDataUrl: string;
  signatureDate: string;
};

export const MEAL_PREP_INTAKE_COPY = {
  notificationResponsibility:
    "I understand that I am responsible for notifying Chef Brie LLC of any changes due allergies/dislikes/schedules before future meals are prepared.",
  pickupScheduling:
    "Meal pickup/delivery dates and times may vary from week to week and will be communicated and confirmed in advance.",
  payment:
    "Payment is due by Friday mornings to secure meal prep for the upcoming week. Clients are welcome to pay for multiple weeks in advance.",
  cancellations:
    "Cancellations must also be made by Friday morning; otherwise all payments are non-refundable. Exceptions may be considered at Chef Brie's discretion.",
  reheatingStorage:
    "Reheating and/or storage instructions will be provided with the weekly meals. The client is responsible for properly refrigerating, storing, reheating, and handling meals after pickup.",
  acknowledgmentLead:
    "By signing below, I acknowledge that I have reviewed and understood the agreement above.",
} as const;

export function isMealPrepIntakeComplete(data: MealPrepIntakeData): boolean {
  return (
    data.clientName.trim().length > 0 &&
    data.emailPhone.trim().length > 0 &&
    data.dietaryRestrictions.trim().length > 0 &&
    data.acknowledgmentName.trim().length > 0 &&
    data.signatureDataUrl.length > 0 &&
    data.signatureDate.length > 0
  );
}

export function formatIntakeForSubmission(data: MealPrepIntakeData): string {
  return [
    "Meal Prep Intake Form",
    "",
    `Client name: ${data.clientName}`,
    `Email/Phone: ${data.emailPhone}`,
    "",
    "Food Allergies & Dietary Restrictions:",
    data.dietaryRestrictions,
    "",
    "Client acknowledgment name: " + data.acknowledgmentName,
    "Signature date: " + data.signatureDate,
    "(Signature captured in booking flow)",
  ].join("\n");
}
