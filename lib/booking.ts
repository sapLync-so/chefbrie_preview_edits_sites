export const SERVICE_OPTIONS = [
  { value: "meal-prep", label: "Meal Prep" },
  { value: "micro-catering", label: "Micro-Catering" },
  { value: "tasting-popup", label: "Brie's Supper Club" },
  { value: "other", label: "Other" },
] as const;

export type ServiceValue = (typeof SERVICE_OPTIONS)[number]["value"];
