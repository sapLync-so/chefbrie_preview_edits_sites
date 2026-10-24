export const MEAL_PREP_MIN_ORDER_PER_SERVICE = 75;
export const NJ_SALES_TAX_RATE = 0.066;

export function mealPrepSalesTax(subtotal: number): number {
  return Math.round(subtotal * NJ_SALES_TAX_RATE * 100) / 100;
}

export function mealPrepEstimatedTotal(subtotal: number): number {
  return Math.round((subtotal + mealPrepSalesTax(subtotal)) * 100) / 100;
}

export type MealPrepServiceKey = "breakfast" | "dinner";

export function serviceSubtotal(
  weekIds: string[],
  weeks: { id: string; breakfast: { price: number }; dinner: { price: number } }[],
  service: MealPrepServiceKey
): number {
  return weeks
    .filter((w) => weekIds.includes(w.id))
    .reduce((sum, w) => sum + (service === "breakfast" ? w.breakfast.price : w.dinner.price), 0);
}

export function meetsServiceMinimum(enabled: boolean, subtotal: number): boolean {
  if (!enabled) return true;
  return subtotal >= MEAL_PREP_MIN_ORDER_PER_SERVICE;
}

export function minimumOrderMessage(serviceLabel: string, subtotal: number): string {
  const remaining = MEAL_PREP_MIN_ORDER_PER_SERVICE - subtotal;
  return `${serviceLabel} orders require a $${MEAL_PREP_MIN_ORDER_PER_SERVICE} minimum. Add ${formatUsd(remaining)} more in ${serviceLabel.toLowerCase()} selections, or tap “Deselect ${serviceLabel}” to continue without it.`;
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}
